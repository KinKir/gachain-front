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

import { State } from '../reducer';
import { TTransactionStatus } from 'gachain/tx';

export default function (state: State, uuid: string): TTransactionStatus {
    const parent = state.transactions.get(uuid);

    switch (parent.type) {
        case 'single':
            return parent;

        case 'collection':
            const txIndex = parent.transactions.findIndex(l => uuid === l.uuid);
            return parent.transactions[txIndex];

        default:
            return null;
    }
}