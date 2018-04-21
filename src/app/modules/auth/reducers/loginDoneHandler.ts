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
import { login } from '../actions';
import { Reducer } from 'modules';

const loginDoneHandler: Reducer<typeof login.done, State> = (state, payload) => {
    const hasRoles = !!(payload.result.roles && payload.result.roles.length);
    return {
        ...state,
        isAuthenticated: !hasRoles,
        isLoggingIn: hasRoles,
        account: payload.result.account,
        roles: payload.result.roles,
        ecosystem: payload.result.account.ecosystem,
        session: payload.result.session,
        privateKey: payload.result.privateKey,
        id: payload.result.account.id
    };
};

export default loginDoneHandler;