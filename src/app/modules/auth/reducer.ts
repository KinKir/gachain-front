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

import * as actions from './actions';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { IAccount, IRole, ISession } from 'gachain/auth';
import loginHandler from './reducers/loginHandler';
import loginDoneHandler from './reducers/loginDoneHandler';
import loginFailedHandler from './reducers/loginFailedHandler';
import logoutDoneHandler from './reducers/logoutDoneHandler';
import createAccountHandler from './reducers/createAccountHandler';
import createAccountDoneHandler from './reducers/createAccountDoneHandler';
import createAccountFailedHandler from './reducers/createAccountFailedHandler';
import importAccountHandler from './reducers/importAccountHandler';
import importAccountDoneHandler from './reducers/importAccountDoneHandler';
import importAccountFailedHandler from './reducers/importAccountFailedHandler';
import importSeedDoneHandler from './reducers/importSeedDoneHandler';
import selectAccountHandler from './reducers/selectAccountHandler';
import authorizeHandler from './reducers/authorizeHandler';
import deauthorizeHandler from './reducers/deauthorizeHandler';
import generateSeedDoneHandler from './reducers/generateSeedDoneHandler';
import selectRoleDoneHandler from './reducers/selectRoleDoneHandler';

export type State = {
    readonly loadedSeed: string;
    readonly isAuthenticated: boolean;
    readonly isLoggingIn: boolean;
    readonly isCreatingAccount: boolean;
    readonly createAccountError: string;
    readonly isImportingAccount: boolean;
    readonly importAccountError: string;
    readonly id: string;
    readonly session: ISession;
    readonly defaultAccount: string;
    readonly account: IAccount;
    readonly role: IRole;
    readonly roles: IRole[];
    readonly privateKey: string;
    readonly ecosystem: string;
};

export const initialState: State = {
    loadedSeed: null,
    isAuthenticated: false,
    isLoggingIn: false,
    isCreatingAccount: false,
    createAccountError: null,
    isImportingAccount: false,
    importAccountError: null,
    id: null,
    session: null,
    defaultAccount: null,
    account: null,
    role: null,
    roles: null,
    privateKey: null,
    ecosystem: null
};

export default reducerWithInitialState<State>(initialState)
    .case(actions.login.started, loginHandler)
    .case(actions.login.done, loginDoneHandler)
    .case(actions.login.failed, loginFailedHandler)
    .case(actions.logout.done, logoutDoneHandler)
    .case(actions.createAccount.started, createAccountHandler)
    .case(actions.createAccount.done, createAccountDoneHandler)
    .case(actions.createAccount.failed, createAccountFailedHandler)
    .case(actions.importAccount.started, importAccountHandler)
    .case(actions.importAccount.done, importAccountDoneHandler)
    .case(actions.importAccount.failed, importAccountFailedHandler)
    .case(actions.importSeed.done, importSeedDoneHandler)
    .case(actions.selectAccount, selectAccountHandler)
    .case(actions.selectRole.done, selectRoleDoneHandler)
    .case(actions.authorize, authorizeHandler)
    .case(actions.deauthorize, deauthorizeHandler)
    .case(actions.generateSeed.done, generateSeedDoneHandler);