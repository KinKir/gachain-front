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
import { IStoredAccount } from 'gachain/storage';
import * as actions from './actions';
import * as _ from 'lodash';

export type State = {
    accounts: IStoredAccount[];
    navigationSize: number;
    tabList: {
        id: string,
        name: string,
        type: string,
        vde: boolean
    }[]
};

export const initialState: State = {
    accounts: [],
    navigationSize: 230,
    tabList: []
};

export default reducerWithInitialState<State>(initialState)
    .case(actions.saveAccount, (state, account) => ({
        ...state,
        accounts: [
            ...state.accounts.filter(l => l.id !== account.id || l.ecosystem !== account.ecosystem),
            account
        ]
    }))
    .case(actions.removeAccount, (state, account) => ({
        ...state,
        accounts: state.accounts.filter(l => l.id !== account.id || l.ecosystem !== account.ecosystem)
    }))

    .case(actions.saveNavigationSize, (state, navigationSize) => ({
        ...state,
        navigationSize: Math.max(
            navigationSize,
            200
        )
    }))

    .case(actions.addTabList, (state, data) => {
        let tabList = _.cloneDeep(state.tabList || []);
        if (typeof data.addID === 'string') {
            let index = tabList.findIndex(l => l.id === data.addID && l.type === data.addType && !!l.vde === !!data.addVDE);
            // delete existing tab and add to the end. update name
            if (index >= 0 && index < tabList.length) {
                tabList = [
                    ...tabList.slice(0, index),
                    ...tabList.slice(index + 1)
                ];
            }
            let newItem = {
                id: data.addID,
                name: data.addName,
                type: data.addType,
                vde: data.addVDE
            };
            tabList = tabList.concat(newItem);
        }

        return {
            ...state,
            tabList: tabList
        };
    })
    .case(actions.removeTabList, (state, data) => {
        let tabList = _.cloneDeep(state.tabList || []);
        let tabListStorage = tabList;

        let index = tabList.findIndex((item: any) => item.id === data.id && item.type === data.type && !!item.vde === !!data.vde);
        if (index >= 0 && index < tabList.length) {
            tabListStorage = [
                ...tabList.slice(0, index),
                ...tabList.slice(index + 1)
            ];
        }

        return {
            ...state,
            tabList: tabListStorage
        };
    });