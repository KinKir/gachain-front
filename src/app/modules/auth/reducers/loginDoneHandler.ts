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
import { Success } from 'typescript-fsa';
import { ILoginCall } from 'gachain/auth';
import { ILoginResponse } from 'lib/api';
import { IAccount } from 'gachain/auth';

export default function (state: State, payload: Success<ILoginCall, ILoginResponse & { account: IAccount, privateKey: string, publicKey: string }>): State {
    return {
        ...state,
        isAuthenticated: true,
        isLoggingIn: false,
        account: payload.result.account,
        ecosystem: payload.result.ecosystem_id,
        sessionToken: payload.result.token,
        refreshToken: payload.result.refresh,
        privateKey: payload.result.privateKey,
        socketToken: payload.result.notify_key,
        timestamp: payload.result.timestamp,
        authenticationError: null,
        id: payload.result.account.id
    };
}