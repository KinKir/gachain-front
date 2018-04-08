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

import actionCreatorFactory from 'typescript-fsa';
import { IAccount, ILoginCall, IRole } from 'gachain/auth';
import { ICreateAccountCall, IImportAccountCall } from 'gachain/auth';

const actionCreator = actionCreatorFactory('auth');
export const login = actionCreator.async<ILoginCall, { account: IAccount, roles: IRole[], privateKey: string, publicKey: string }, string>('LOGIN');
export const logout = actionCreator.async('LOGOUT');
export const createEcosystem = actionCreator<{ name: string, id: string }>('CREATE_ECOSYSTEM');
export const generateSeed = actionCreator.async<void, string>('GENERATE_SEED');
export const importSeed = actionCreator.async<Blob, string, undefined>('IMPORT_SEED');
export const createAccount = actionCreator.async<ICreateAccountCall, IAccount, string>('CREATE_ACCOUNT');
export const importAccount = actionCreator.async<IImportAccountCall, IAccount[], string>('IMPORT_ACCOUNT');
export const removeAccount = actionCreator<IAccount>('REMOVE_ACCOUNT');
export const selectAccount = actionCreator.async<IAccount, { sessionToken: string, refreshToken: string }, string>('SELECT_ACCOUNT');
export const selectRole = actionCreator.async<number, IAccount>('SELECT_ROLE');
export const authorize = actionCreator<string>('AUTHORIZE');
export const deauthorize = actionCreator('DEAUTHORIZE');