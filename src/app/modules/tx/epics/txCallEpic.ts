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
import { isType } from 'typescript-fsa';
import keyring from 'lib/keyring';

const txCallEpic: Epic = (action$, store) => action$.ofAction(txCall)
    // Ask for password if there is no privateKey
    .flatMap(action => {
        const privateKey = store.getState().auth.privateKey;
        const contractName = action.payload.contract ? action.payload.contract.name : null;
        const batch = action.payload.contracts && 0 < action.payload.contracts.length;

        return Observable.if(
            () => keyring.validatePrivateKey(privateKey),
            Observable.of(action),
            Observable.merge(
                Observable.of(txAuthorize.started({
                    contract: contractName,
                    batch
                })),
                action$.filter(l => txAuthorize.done.match(l) || txAuthorize.failed.match(l))
                    .take(1)
                    .flatMap(result => Observable.if(
                        () => isType(result, txAuthorize.done),
                        Observable.of(action),
                        Observable.empty<never>()
                    ))
            )
        );

    })
    .flatMap(action => {
        if (isType(action, txCall)) {
            const privateKey = store.getState().auth.privateKey;

            if (action.payload.contracts && action.payload.contracts.length) {
                return Observable.of(txPrepareBatch({
                    tx: action.payload,
                    privateKey
                }));
            }
            else if (action.payload.contract) {
                return Observable.of(txPrepare({
                    tx: action.payload,
                    privateKey
                }));
            }
            else {
                return Observable.empty<never>();
            }
        }
        else {
            return Observable.of(action);
        }
    });

export default txCallEpic;