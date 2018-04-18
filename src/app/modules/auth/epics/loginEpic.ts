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

import { Epic } from 'modules';
import { login } from '../actions';
import { Observable } from 'rxjs/Observable';
import NodeObservable from '../util/NodeObservable';
import keyring from 'lib/keyring';

const loginEpic: Epic = (action$, store, { api }) => action$.ofAction(login.started)
    .flatMap(action => {
        const privateKey = keyring.decryptAES(action.payload.account.encKey, action.payload.password);

        if (!keyring.validatePrivateKey(privateKey)) {
            return Observable.of(login.failed({
                params: action.payload,
                error: 'E_INVALID_PASSWORD'
            }));
        }

        const publicKey = keyring.generatePublicKey(privateKey);

        return NodeObservable({
            nodes: store.getState().engine.fullNodes,
            count: 1,
            concurrency: 10,
            timeout: 5000,
            api

        }).flatMap(l => {
            const client = api({ apiHost: l });
            return Observable.from(client.getUid())
                .flatMap(uid =>
                    client.authorize(uid.token).login({
                        publicKey,
                        signature: keyring.sign(uid.uid, privateKey),
                        ecosystem: action.payload.account.ecosystem

                    }).then(loginResult =>
                        client.authorize(loginResult.token)
                            .getRow({
                                id: loginResult.key_id,
                                table: 'members',
                                columns: ['avatar', 'member_name']
                            })
                            .then(memberResult => ({
                                ...loginResult,
                                avatar: memberResult.value.avatar,
                                username: memberResult.value.member_name
                            }))
                            .catch(e => ({
                                ...loginResult,
                                avatar: null,
                                username: null
                            }))
                    )
                )

                // Successful authentication. Yield the result
                .map(payload => login.done({
                    params: action.payload,
                    result: {
                        account: {
                            id: payload.key_id,
                            encKey: action.payload.account.encKey,
                            address: payload.address,
                            ecosystem: action.payload.account.ecosystem,
                            ecosystemName: null,
                            avatar: payload.avatar,
                            username: payload.username
                        },
                        roles: payload.roles && payload.roles.map(role => ({
                            id: role.role_id,
                            name: role.role_name
                        })),
                        session: {
                            sessionToken: payload.token,
                            refreshToken: payload.refresh,
                            wsToken: payload.notify_key,
                            timestamp: payload.timestamp,
                            apiHost: l,
                            wsHost: 'ws://127.0.0.1:8000'
                        },
                        privateKey,
                        publicKey
                    }
                }))

                // Catch actual login error, yield result
                .catch(e => Observable.of(
                    login.failed({
                        params: action.payload,
                        error: e.error
                    })
                ));

        }).defaultIfEmpty(login.failed({
            params: action.payload,
            error: 'E_OFFLINE'
        }));
    });

export default loginEpic;