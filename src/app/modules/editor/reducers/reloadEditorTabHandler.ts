// MIT License
// 
// Copyright (c) 2016-2019 GACHAIN
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { State } from '../reducer';
import { reloadEditorTab } from '../actions';
import { Reducer } from 'modules';
import findTabIndex from './findTabIndex';

const reloadEditorTabHandler: Reducer<typeof reloadEditorTab, State> = (state, payload) => {
    const index = findTabIndex(state, payload);
    const value = state.tabs[index];

    if (-1 === index) {
        return state;
    }
    else {
        return {
            ...state,
            tabs: [
                ...state.tabs.slice(0, index),
                {
                    ...value,
                    ...payload.data,
                    dirty: 'boolean' === typeof payload.data.dirty ?
                        payload.data.dirty :
                        (value.value !== (payload.data.initialValue || value.initialValue))
                },
                ...state.tabs.slice(index + 1)
            ]
        };
    }
};

export default reloadEditorTabHandler;