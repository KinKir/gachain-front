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
import { Observable } from 'rxjs';
import { modalShow, modalClose } from 'modules/modal/actions';
import { txAuthorize } from '../actions';

const txAuthorizeEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(txAuthorize.started)
        .flatMap(action =>
            Observable.merge(
                Observable.of(modalShow({
                    id: 'TX_AUTHORIZE',
                    type: 'AUTHORIZE',
                    params: {
                        contract: action.payload.contract
                    }
                })),
                action$.ofAction(modalClose).map(result => {
                    if (result.payload.data) {
                        return txAuthorize.done({
                            params: action.payload,
                            result: result.payload.data
                        });
                    }
                    else {
                        return txAuthorize.failed({
                            params: action.payload,
                            error: null
                        });
                    }
                })
            )
        );

export default txAuthorizeEpic;