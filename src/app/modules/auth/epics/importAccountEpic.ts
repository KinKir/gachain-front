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
import { Epic } from 'modules';
import { importAccount } from '../actions';
import { Observable } from 'rxjs/Observable';
import { IAccount } from 'gachain/auth';
import { navigate } from 'modules/engine/actions';
import keyring from 'lib/keyring';
import NodeObservable from '../util/NodeObservable';

const importAccountEpic: Epic = (action$, store, { api }) => action$.ofAction(importAccount.started)
    .flatMap(action => {
        const backup = keyring.restore(action.payload.backup);
        if (!backup || backup.privateKey.length !== keyring.KEY_LENGTH) {
            return Observable.of(importAccount.failed({
                params: action.payload,
                error: 'E_INVALID_KEY'
            }));
        }

        const ecosystems = ['1', ...backup.ecosystems];
        const publicKey = keyring.generatePublicKey(backup.privateKey);

        return NodeObservable({
            nodes: store.getState().engine.fullNodes,
            count: 1,
            timeout: 5000,
            concurrency: 10,
            api

        }).flatMap(apiHost => Observable.from(ecosystems)
            .distinct()
            .flatMap(ecosystem => {
                const client = api({ apiHost });
                return Observable.from(client.getUid().then(uid =>
                    client.authorize(uid.token).login({
                        publicKey,
                        signature: keyring.sign(uid.uid, backup.privateKey),
                        ecosystem
                    })

                )).catch(e => Observable.empty<never>());
            })

        ).toArray().flatMap(results => {
            const encKey = keyring.encryptAES(backup.privateKey, action.payload.password);
            const accounts: IAccount[] = results.map(account => ({
                id: account.key_id,
                encKey,
                address: account.address,
                ecosystem: account.ecosystem_id,
                ecosystemName: null,
                username: account.key_id,
                avatar: null
            }));

            if (accounts.length) {
                return Observable.of<Action>(
                    importAccount.done({
                        params: action.payload,
                        result: accounts
                    }),
                    navigate('/')
                );
            }
            else {
                return Observable.of(importAccount.failed({
                    params: null,
                    error: 'E_OFFLINE'
                }));
            }

        }).catch(e => Observable.of(importAccount.failed({
            params: null,
            error: 'E_IMPORT_FAILED'
        })));
    });

export default importAccountEpic;