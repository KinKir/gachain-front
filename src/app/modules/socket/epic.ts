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
import { combineEpics, Epic } from 'redux-observable';
import { IRootState } from 'modules';
import api, { socketUrl } from 'lib/api';
import * as _ from 'lodash';
import * as actions from './actions';
import * as Centrifuge from 'centrifuge';
import * as SockJS from 'sockjs-client';
import { Observer } from 'rxjs';
import { setBadgeCount } from 'modules/gui/actions';

export const connectEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(actions.connect.started)
        .flatMap(action => {
            if (action.payload.userID && action.payload.timestamp && action.payload.socketToken) {
                return Observable.create((observer: Observer<Action>) => {
                    observer.next(actions.disconnect.started(null));

                    const centrifuge = new Centrifuge({
                        url: socketUrl,
                        user: action.payload.userID,
                        timestamp: action.payload.timestamp,
                        token: action.payload.socketToken,
                        sockJS: SockJS
                    });

                    centrifuge.on('connect', context => {
                        observer.next(actions.connect.done({
                            params: action.payload,
                            result: centrifuge
                        }));

                        _.uniqBy(store.getState().storage.accounts, 'id').forEach(account =>
                            observer.next(actions.subscribe.started({ account }))
                        );

                        observer.complete();
                    });

                    centrifuge.on('error', error => {
                        observer.next(actions.connect.failed({
                            params: action.payload,
                            error: error.message.error
                        }));
                        observer.complete();
                    });

                    centrifuge.connect();
                });
            }
            else {
                return Observable.of(actions.connect.failed({
                    params: action.payload,
                    error: null
                }));
            }
        });

export const disconnectEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(actions.disconnect.started)
        .map(action => {
            const socket = store.getState().socket.socket;

            if (socket) {
                socket.disconnect();
                return actions.disconnect.done({
                    params: null,
                    result: null
                });
            }
            else {
                return actions.disconnect.failed({
                    params: null,
                    error: null
                });
            }
        });

export const subscribeEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(actions.subscribe.started)
        .flatMap(action => {
            const state = store.getState();
            if (state.socket.subscriptions.find(l => l.account.id === action.payload.account.id)) {
                return Observable.of(actions.subscribe.failed({
                    params: action.payload,
                    error: 'E_ALREADY_SUBSCRIBED'
                }));
            }
            else if (!state.socket.socket) {
                return Observable.of(actions.subscribe.failed({
                    params: action.payload,
                    error: 'E_SOCKET_OFFLINE'
                }));
            }
            else {
                return Observable.create((observer: Observer<Action>) => {
                    const sub = state.socket.socket.subscribe<{ role_id: number, ecosystem: number, count: number }[]>('client' + action.payload.account.id, message => {
                        let count = 0;

                        message.data.forEach(n => {
                            const subState = store.getState();
                            if (subState.auth.isAuthenticated &&
                                subState.auth.account &&
                                subState.auth.account.id === action.payload.account.id &&
                                subState.auth.account.ecosystem === action.payload.account.ecosystem
                            ) {
                                count += n.count;
                            }

                            observer.next(actions.setNotificationsCount({
                                id: action.payload.account.id,
                                ecosystem: n.ecosystem.toString(),
                                role: n.role_id,
                                count: n.count
                            }));
                        });

                        observer.next(setBadgeCount(count));
                    });

                    sub.on('subscribe', () => {
                        observer.next(
                            actions.getNotificationsCount({
                                ids: [{
                                    id: action.payload.account.id,
                                    ecosystem: action.payload.account.ecosystem
                                }]
                            })
                        );
                    });

                    observer.next(actions.subscribe.done({
                        params: action.payload,
                        result: sub
                    }));
                });
            }
        });

export const unsubscribeEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(actions.unsubscribe.started)
        .map(action => {
            const sub = store.getState().socket.subscriptions.find(l => l.account.id === action.payload.account.id);
            if (sub) {
                sub.instance.unsubscribe();
                return actions.unsubscribe.done({
                    params: action.payload,
                    result: null
                });
            }
            else {
                return actions.unsubscribe.failed({
                    params: action.payload,
                    error: null
                });
            }
        });

export const getNotificationsCountEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(actions.getNotificationsCount)
        .flatMap(action => {
            api.updNotificator(store.getState().auth.sessionToken, action.payload.ids);
            return Observable.empty();
        });

export default combineEpics(
    connectEpic,
    disconnectEpic,
    subscribeEpic,
    unsubscribeEpic,
    getNotificationsCountEpic
);