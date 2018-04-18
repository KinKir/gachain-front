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
import { login, importAccount, selectRole, createAccount } from '../actions';
import { modalShow } from 'modules/modal/actions';

const authErrorEpic: Epic = (action$, store) => action$.ofType(login.failed.type, importAccount.failed.type, createAccount.failed.type, selectRole.failed.type)
    .map(action =>
        modalShow({
            id: 'AUTH_ERROR',
            type: 'AUTH_ERROR',
            params: {
                error: (action as any).payload.error
            }
        })
    );

export default authErrorEpic;