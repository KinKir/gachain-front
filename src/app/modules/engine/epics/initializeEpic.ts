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
import { Observable } from 'rxjs';
import { connect } from 'modules/socket/actions';
import { initialize, setLocale } from '../actions';
import urlJoin from 'url-join';
import platform from 'lib/platform';
import NodeObservable from '../util/NodeObservable';
import keyring from 'lib/keyring';

const fullNodesFallback = ['http://127.0.0.1:7079'];

const initializeEpic: Epic = (action$, store, { api, defaultKey }) => action$.ofAction(initialize.started)
    .flatMap(action => {
        const requestUrl = platform.select({
            web: urlJoin(location.origin, 'settings.json'),
            desktop: './settings.json'
        });

        return Observable.ajax.getJSON<{ fullNodes?: string[] }>(requestUrl)
            .map(l => l.fullNodes)
            .defaultIfEmpty(fullNodesFallback)
            .catch(e => Observable.of(fullNodesFallback))
            .flatMap(fullNodes =>
                NodeObservable({
                    nodes: fullNodes,
                    count: 1,
                    timeout: 5000,
                    concurrency: 10,
                    api
                }).flatMap(node => {
                    const state = store.getState();
                    const client = api({ apiHost: node });

                    return Observable.concat(
                        Observable.of(initialize.done({
                            params: action.payload,
                            result: {
                                fullNodes,
                                nodeHost: node
                            }
                        })),
                        Observable.of(setLocale.started(state.storage.locale)),
                        Observable.from(client.getUid())
                            .flatMap(uid => Observable.from(
                                Promise.all([
                                    client.getConfig({ name: 'centrifugo' }),
                                    client.authorize(uid.token).login({
                                        publicKey: keyring.generatePublicKey(defaultKey),
                                        signature: keyring.sign(uid.uid, defaultKey)
                                    })
                                ])

                            )).map(result =>
                                connect.started({
                                    wsHost: result[0],
                                    session: result[1].token,
                                    socketToken: result[1].notify_key,
                                    timestamp: result[1].timestamp,
                                    userID: result[1].key_id
                                })
                            ).catch(e => Observable.of(connect.failed({
                                params: null,
                                error: 'E_SOCKET_OFFLINE'
                            })))
                    );

                }).defaultIfEmpty(initialize.failed({
                    params: action.payload,
                    error: 'E_OFFLINE'
                }))
            );
    });

export default initializeEpic;