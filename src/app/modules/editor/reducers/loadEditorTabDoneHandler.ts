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
import { loadEditorTab } from '../actions';
import { Reducer } from 'modules';
import findTabIndex from './findTabIndex';

const loadEditorTabDoneHandler: Reducer<typeof loadEditorTab.done, State> = (state, payload) => {
    const tabIndex = findTabIndex(state, payload.result);

    const tabs = -1 === tabIndex ?
        [
            ...state.tabs,
            {
                ...payload.result
            }
        ] : [
            ...state.tabs.slice(0, tabIndex),
            {
                ...state.tabs[tabIndex],
                initialValue: payload.result.initialValue,
                dirty: payload.result.initialValue !== state.tabs[tabIndex].value
            },
            ...state.tabs.slice(tabIndex + 1)
        ];

    return {
        ...state,
        tabIndex: -1 === tabIndex ? tabs.length - 1 : tabIndex,
        tabs
    };
};

export default loadEditorTabDoneHandler;