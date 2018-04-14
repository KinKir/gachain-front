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

import { Action } from 'redux';
import { Epic } from 'redux-observable';
import * as actions from '../actions';
import { IRootState } from 'modules';

const saveConstructorHistoryEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(actions.saveConstructorHistory.started)
        .map(action => {
            const state = store.getState().editor;
            const tab = state.tabs[state.tabIndex].designer;
            const tabData = tab && tab.data || null;
            const tabHistory = tab && tab.history || null;

            let historyData = tabHistory && tabHistory.data || [];
            const jsonData = tabData && tabData.jsonData || [];

            const position = tabHistory && tabHistory.position || 0;

            if (position < historyData.length) {
                historyData = [...historyData.slice(0, position)];
            }

            const canUndo = position > 0;
            const canRedo = false;

            return actions.saveConstructorHistory.done({
                params: action.payload,
                result: {
                    data: historyData.concat([jsonData]),
                    position: position + 1,
                    canUndo,
                    canRedo
                }
            });
        });

export default saveConstructorHistoryEpic;