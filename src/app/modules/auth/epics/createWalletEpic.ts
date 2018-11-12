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

import { Action } from 'redux';
import { Epic } from 'modules';
import { Observable } from 'rxjs/Observable';
import { createWallet } from '../actions';
import { navigate } from 'modules/engine/actions';
import keyring from 'lib/keyring';
import { address, addressString } from 'lib/crypto';

const createWalletEpic: Epic = (action$, store, { api }) => action$.ofAction(createWallet.started)
    .flatMap(action => {
        const keys = keyring.generateKeyPair(action.payload.seed);
        const publicKey = keyring.generatePublicKey(keys.private);
        const encKey = keyring.encryptAES(keys.private, action.payload.password);
        const keyID = address(keys.public);

        return Observable.of<Action>(
            createWallet.done({
                params: action.payload,
                result: {
                    id: keyID,
                    encKey,
                    publicKey,
                    address: addressString(keyID)
                }
            }),
            navigate('/')
        );

    }).catch(e => Observable.of(createWallet.failed({
        params: null,
        error: 'E_IMPORT_FAILED'
    })));

export default createWalletEpic;