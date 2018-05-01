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

import { reducerWithInitialState } from 'typescript-fsa-reducers';
import * as actions from './actions';
import { IAccount } from 'gachain/auth';
import saveLocaleHandler from './reducers/saveLocaleHandler';
import saveAccountHandler from './reducers/saveAccountHandler';
import removeAccountHandler from './reducers/removeAccountHandler';
import saveNavigationSizeHandler from './reducers/saveNavigationSizeHandler';
import mergeFullNodesHandler from './reducers/mergeFullNodesHandler';

export type State = {
    readonly locale: string;
    readonly accounts: IAccount[];
    readonly navigationSize: number;
    readonly fullNodes: string[];
};

export const initialState: State = {
    locale: 'en-US',
    accounts: [],
    navigationSize: 230,
    fullNodes: []
};

export default reducerWithInitialState<State>(initialState)
    .case(actions.saveLocale, saveLocaleHandler)
    .case(actions.saveAccount, saveAccountHandler)
    .case(actions.removeAccount, removeAccountHandler)
    .case(actions.saveNavigationSize, saveNavigationSizeHandler)
    .case(actions.mergeFullNodes, mergeFullNodesHandler);