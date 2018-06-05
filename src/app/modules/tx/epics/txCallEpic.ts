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
import { txCall, txAuthorize, txPrepare, txPrepareBatch } from '../actions';
import { modalShow, modalClose } from 'modules/modal/actions';
import { isType } from 'typescript-fsa';
import keyring from 'lib/keyring';
import { ITransactionBatchCall } from 'gachain/tx';

const txCallEpic: Epic = (action$, store) => action$.ofAction(txCall)
    // Show confirmation window if there is any
    .flatMap(action => Observable.if(
        () => !!action.payload.confirm,
        Observable.merge(
            Observable.of(modalShow({
                id: action.payload.uuid,
                type: 'TX_CONFIRM',
                params: action.payload.confirm
            })),
            action$.ofAction(modalClose).take(1).flatMap(modalPayload => Observable.if(
                () => 'RESULT' === modalPayload.payload.reason,
                Observable.of(action),
                Observable.empty<never>()
            ))
        ),
        Observable.of(action)

    ))
    // Ask for password if there are no privateKey
    .flatMap(action => {
        if (isType(action, txCall)) {
            const privateKey = store.getState().auth.privateKey;
            const contractName = 'contracts' in action.payload ? null : action.payload.name;

            return Observable.if(
                () => keyring.validatePrivateKey(privateKey),
                Observable.of(action),
                Observable.merge(
                    Observable.of(txAuthorize.started({ contract: contractName })),
                    action$.filter(l => txAuthorize.done.match(l) || txAuthorize.failed.match(l))
                        .take(1)
                        .flatMap(result => Observable.if(
                            () => isType(result, txAuthorize.done),
                            Observable.of(action),
                            Observable.empty<never>()
                        ))
                )
            );
        }
        else {
            return Observable.of(action);
        }

    })
    .map(action => {
        if (isType(action, txCall)) {
            const privateKey = store.getState().auth.privateKey;

            if ('contracts' in action.payload) {
                const call = action.payload as ITransactionBatchCall;
                return txPrepareBatch({
                    tx: call,
                    privateKey
                });
            }
            else {
                return txPrepare({
                    tx: action.payload,
                    privateKey
                });
            }
        }
        else {
            return action;
        }
    });

export default txCallEpic;