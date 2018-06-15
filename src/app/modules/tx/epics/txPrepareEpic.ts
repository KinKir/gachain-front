// MIT License
// 
// Copyright (c) 2016-2018 GACHAIN
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Epic } from 'modules';
import { Observable } from 'rxjs';
import keyring from 'lib/keyring';
import { txExec, txPrepare } from '../actions';
import ModalObservable from 'modules/modal/util/ModalObservable';
import NodeObservable from 'modules/engine/util/NodeObservable';
import TxDissect from '../util/TxDissect';

// 10 seconds max jitter between tx header validation
const MAX_FAULT_TIME = 3;

const txPrepareEpic: Epic = (action$, store, { api }) => action$.ofAction(txPrepare)
    .flatMap(action => {
        const state = store.getState();
        const client = api(state.auth.session);

        const txCall = {
            name: action.payload.tx.contract.name,
            params: {
                ...action.payload.tx.contract.params,
                Lang: state.storage.locale
            }
        };

        return Observable.fromPromise(client.txPrepare(txCall)).flatMap(prepare => {
            let forSign = prepare.forsign;
            const validatingNodesCount = Math.min(state.storage.fullNodes.length, 3);
            const validatingHeader = TxDissect(forSign);
            const signParams = {};

            return NodeObservable({
                nodes: state.storage.fullNodes,
                count: validatingNodesCount,
                concurrency: 3,
                timeout: MAX_FAULT_TIME * 1000,
                api

            }).toArray().flatMap(nodes =>
                Observable.from(nodes).map(apiHost => {
                    const node = api({ apiHost });
                    return node.getUid()
                        .then(uid => node.authorize(uid.token).login({
                            publicKey: keyring.generatePublicKey(action.payload.privateKey),
                            signature: keyring.sign(uid.uid, action.payload.privateKey),
                            ecosystem: state.auth.wallet.ecosystem,
                            role: state.auth.role && state.auth.role.id
                        }))
                        .then(session =>
                            api({ apiHost, sessionToken: session.token }).txPrepare(txCall)
                        );

                }).flatMap(r =>
                    Observable.from(r)

                ).toArray().flatMap(headers => {
                    for (let i = 0; i < headers.length; i++) {
                        const header = TxDissect(headers[i].forsign);
                        if (header.body !== validatingHeader.body || MAX_FAULT_TIME < Math.abs(header.timestamp - validatingHeader.timestamp)) {
                            return Observable.throw({
                                error: 'E_INVALIDATED'
                            });
                        }
                    }

                    return Observable.of(headers.length);

                }).flatMap(count => {
                    if (validatingNodesCount !== count) {
                        return Observable.throw({
                            error: 'E_INVALIDATED'
                        });
                    }

                    if (prepare.signs) {
                        return ModalObservable(action$, {
                            modal: {
                                id: 'SIGNATURE',
                                type: 'TX_SIGNATURE',
                                params: {
                                    txParams: txCall.params,
                                    signs: prepare.signs,
                                    contract: txCall.name
                                }
                            },
                            success: result => {
                                prepare.signs.forEach(sign => {
                                    const childSign = keyring.sign(sign.forsign, action.payload.privateKey);
                                    signParams[sign.field] = childSign;
                                    forSign += `,${childSign}`;
                                });

                                return Observable.of(txExec.started({
                                    tx: action.payload.tx,
                                    requestID: prepare.request_id,
                                    time: prepare.time,
                                    privateKey: action.payload.privateKey,
                                    signature: keyring.sign(forSign, action.payload.privateKey)
                                }));
                            },
                            failure: reason => Observable.throw({
                                error: 'E_CANCELLED'
                            })
                        });
                    }
                    else {
                        return Observable.of(txExec.started({
                            tx: action.payload.tx,
                            requestID: prepare.request_id,
                            time: prepare.time,
                            privateKey: action.payload.privateKey,
                            signature: keyring.sign(forSign, action.payload.privateKey)
                        }));
                    }
                })
            );

        }).catch(e => Observable.of(txExec.failed({
            params: action.payload,
            error: {
                type: e.error,
                error: e.msg,
                params: e.params
            }
        })));
    });

export default txPrepareEpic;