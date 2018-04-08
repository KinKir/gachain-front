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
import { Epic } from 'redux-observable';
import { IRootState } from 'modules';
import { Observable } from 'rxjs/Observable';
import { removeAccount } from '../actions';
import { removeAccount as removeStoredAccount } from 'modules/storage/actions';
import { modalClose, modalShow } from 'modules/modal/actions';

const removeAccountEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(removeAccount)
        .flatMap(action => {
            return Observable.merge(
                Observable.of(modalShow({
                    id: 'AUTH_REMOVE_ACCOUNT',
                    type: 'AUTH_REMOVE_ACCOUNT',
                    params: {
                        account: action.payload
                    }
                })),
                action$.ofAction(modalClose)
                    .take(1)
                    .flatMap(result => {
                        if ('RESULT' === result.payload.reason) {
                            return Observable.of(removeStoredAccount(action.payload));
                        }
                        else {
                            return Observable.empty<never>();
                        }
                    })
            );
        });

export default removeAccountEpic;