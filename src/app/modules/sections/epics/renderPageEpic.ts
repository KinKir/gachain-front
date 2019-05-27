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

import { Epic } from 'modules';
import { Observable } from 'rxjs/Observable';
import { renderPage } from '../actions';

const renderPageEpic: Epic = (action$, store, { api }) => action$.ofAction(renderPage.started)
    .flatMap(action => {
        const state = store.getState();
        const client = api(state.auth.session);
        const section = state.sections.sections[action.payload.section || state.sections.section];

        return Observable.from(Promise.all([
            client.content({
                type: 'page',
                name: action.payload.name,
                params: action.payload.params,
                locale: state.storage.locale

            }),
            (!section.menus.length && section.defaultPage !== action.payload.name) ? client.content({
                type: 'page',
                name: section.defaultPage,
                params: {},
                locale: state.storage.locale
            }) : Promise.resolve(null)

        ])).map(payload => {
            const page = payload[0];
            const defaultPage = payload[1];

            return renderPage.done({
                params: action.payload,
                result: {
                    defaultMenu: defaultPage && defaultPage.menu !== page.menu && {
                        name: defaultPage.menu,
                        content: defaultPage.menutree
                    },
                    menu: {
                        name: page.menu,
                        content: page.menutree
                    },
                    page: {
                        params: action.payload.params,
                        name: action.payload.name,
                        content: page.tree
                    }
                }
            });

        }).catch(e =>
            Observable.of(renderPage.failed({
                params: action.payload,
                error: e.error
            }))
        );
    });

export default renderPageEpic;