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
import { createAccount } from '../actions';
import { navigate } from 'modules/engine/actions';
import api, { IAPIError } from 'lib/api';
import keyring from 'lib/keyring';

const createAccountEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(createAccount.started)
        .flatMap(action => {
            const keys = keyring.generateKeyPair(action.payload.seed);

            return Observable.from(api.getUid().then(uid => {
                const signature = keyring.sign(uid.uid, keys.private);
                return api.login(uid.token, keys.public, signature);

            })).flatMap(payload =>
                Observable.of<Action>(
                    createAccount.done({
                        params: action.payload,
                        result: {
                            id: payload.key_id,
                            encKey: keyring.encryptAES(keys.private, action.payload.password),
                            address: payload.address,
                            ecosystem: '1',
                            ecosystemName: null,
                            username: payload.key_id,
                            avatar: null,
                            sessionToken: payload.token,
                            refreshToken: payload.refresh,
                            socketToken: payload.notify_key,
                            timestamp: payload.timestamp
                        }
                    }),
                    navigate('/')
                ));
        })
        .catch((e: IAPIError) =>
            Observable.of(createAccount.failed({
                params: null,
                error: e.error
            }))
        );

export default createAccountEpic;