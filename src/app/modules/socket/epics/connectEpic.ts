// Copyright 2017 The gachain-front Authors
// This file is part of the gachain-front library.
// 
// The gachain-front library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// The gachain-front library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
// 
// You should have received a copy of the GNU Lesser General Public License
// along with the gachain-front library. If not, see <http://www.gnu.org/licenses/>.

import { Action } from 'redux';
import { Observable } from 'rxjs/Observable';
import { Epic } from 'redux-observable';
import { IRootState } from 'modules';
import { connect, disconnect, subscribe, setConnected } from '../actions';
import * as _ from 'lodash';
import * as Centrifuge from 'centrifuge';
import * as SockJS from 'sockjs-client';
import { Observer } from 'rxjs';

const connectEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(connect.started)
        .flatMap(action => {
            if (action.payload.wsHost && action.payload.userID && action.payload.timestamp && action.payload.socketToken) {
                return Observable.create((observer: Observer<Action>) => {
                    observer.next(disconnect.started(null));

                    const centrifuge = new Centrifuge({
                        url: action.payload.wsHost,
                        user: action.payload.userID,
                        timestamp: action.payload.timestamp,
                        token: action.payload.socketToken,
                        sockJS: SockJS
                    });

                    centrifuge.on('connect', context => {
                        observer.next(connect.done({
                            params: action.payload,
                            result: {
                                session: action.payload.session,
                                instance: centrifuge
                            }
                        }));

                        _.uniqBy(store.getState().storage.accounts, 'id').forEach(account =>
                            observer.next(subscribe.started(account))
                        );
                    });

                    centrifuge.on('disconnect', context => {
                        observer.next(setConnected(false));
                    });

                    centrifuge.on('error', error => {
                        observer.next(connect.failed({
                            params: action.payload,
                            error: error.message.error
                        }));
                    });

                    centrifuge.connect();

                }).takeUntil(action$.ofAction(connect.started));
            }
            else {
                return Observable.of(connect.failed({
                    params: action.payload,
                    error: null
                }));
            }

        });

export default connectEpic;