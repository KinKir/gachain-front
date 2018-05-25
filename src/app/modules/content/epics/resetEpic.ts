// MIT License
//
// Copyright (c) 2016-2018 GACHAIN
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

import { Epic } from 'modules';
import { Observable } from 'rxjs/Observable';
import { reset } from 'modules/content/actions';

const resetEpic: Epic = (action$, store, { api }) => action$.ofAction(reset.started)
    .flatMap(action => {
        const state = store.getState();
        const section = state.content.sections[state.content.section];
        const client = api(state.auth.session);

        return Observable.fromPromise(client.content({
            type: 'page',
            name: section.defaultPage,
            params: {},
            locale: state.storage.locale

        })).map(payload => reset.done({
            params: action.payload,
            result: {
                menu: {
                    name: payload.menu,
                    content: payload.menutree
                },
                page: {
                    params: {},
                    name: section.defaultPage,
                    content: payload.tree
                }
            }
        })).catch(e =>
            Observable.of(reset.failed({
                params: action.payload,
                error: e.error
            }))
        );
    });

export default resetEpic;