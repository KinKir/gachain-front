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

import { IRootState } from 'modules';
import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { txCallBatch, txCall, txExec, txAuthorize } from '../actions';
import { Observable } from 'rxjs/Observable';
import * as uuid from 'uuid';
import { isType } from 'typescript-fsa';
import { ITransactionCollection } from 'gachain/tx';
import { modalShow, modalClose } from 'modules/modal/actions';

const txCallBatchEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(txCallBatch.started)
        .flatMap(action => {
            const exec = () => {
                const totalCount = action.payload.contracts.map(l => l.data.length).reduce((a, b) => a + b);
                return Observable.from(action.payload.contracts)
                    .flatMap(contract => {
                        return Observable.from(contract.data)
                            .map(params => {
                                const id = uuid.v4();
                                return Observable.merge(
                                    Observable.of(txCall({
                                        uuid: id,
                                        name: contract.name,
                                        parent: action.payload.uuid,
                                        silent: true,
                                        params
                                    })),
                                    action$.filter(l => (txExec.done.match(l) || txExec.failed.match(l)) && id === l.payload.params.tx.uuid)
                                        .take(1)
                                        .flatMap(tx => {
                                            if (isType(tx, txExec.done)) {
                                                const parent = store.getState().tx.transactions.get(tx.payload.params.tx.parent) as ITransactionCollection;
                                                if (totalCount === parent.transactions.length && !parent.transactions.find(l => !!l.error)) {
                                                    return Observable.of(txCallBatch.done({
                                                        params: action.payload,
                                                        result: true
                                                    }));
                                                }
                                                else {
                                                    return Observable.empty<never>();
                                                }
                                            }
                                            else if (isType(tx, txExec.failed)) {
                                                throw {
                                                    type: 'E_FAILED',
                                                    error: {
                                                        tx: tx.payload.params.tx,
                                                        error: tx.payload.error
                                                    }
                                                };
                                            }
                                            else {
                                                return Observable.empty<never>();
                                            }
                                        })
                                );
                            })
                            .flatMap(l => l, 1);
                    }, 5).catch(e => {
                        if ('E_FAILED' === e.type) {
                            return Observable.of(txCallBatch.failed({
                                params: action.payload,
                                error: e.error
                            }));
                        }
                        else {
                            return Observable.empty<never>();
                        }
                    });
            };

            const authorize = () =>
                Observable.merge(
                    action$.filter(l => (txAuthorize.done.match(l) || txAuthorize.failed.match(l)))
                        .take(1)
                        .flatMap(result => {
                            if (isType(result, txAuthorize.done)) {
                                return exec();
                            }
                            else {
                                return Observable.of(txCallBatch.failed({
                                    params: action.payload,
                                    error: null
                                }));
                            }
                        }),
                    Observable.of(txAuthorize.started({ contract: null }))
                );

            if (action.payload.confirm) {
                return Observable.merge(
                    Observable.of(modalShow({
                        id: action.payload.uuid,
                        type: 'TX_CONFIRM',
                        params: action.payload.confirm
                    })),
                    action$.ofAction(modalClose)
                        .take(1)
                        .flatMap(modalPayload => {
                            if ('RESULT' === modalPayload.payload.reason) {
                                return authorize();
                            }
                            else {
                                return Observable.of(txCallBatch.failed({
                                    params: action.payload,
                                    error: null
                                }));
                            }
                        })
                );
            }
            else {
                return authorize();
            }
        });

export default txCallBatchEpic;