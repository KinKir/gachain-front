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

import { Epic } from 'modules';
import { Observable } from 'rxjs/Observable';
import { reloadPage } from 'modules/content/actions';

const reloadPageEpic: Epic = (action$, store, { api }) => action$.ofAction(reloadPage.started)
    .flatMap(action => {
        const state = store.getState();
        const section = state.content.sections[state.content.section];
        const client = api(state.auth.session);

        return Observable.fromPromise(client.content({
            type: 'page',
            name: section.page.name,
            params: section.page.params,
            locale: state.storage.locale,

        })).map(payload =>
            reloadPage.done({
                params: action.payload,
                result: {
                    params: section.page.params,
                    menu: {
                        name: payload.menu,
                        content: payload.menutree
                    },
                    page: {
                        params: section.page.params,
                        name: section.page.name,
                        content: payload.tree
                    }
                }
            })

        ).catch(e =>
            Observable.of(reloadPage.failed({
                params: action.payload,
                error: e.error
            }))
        );
    });

export default reloadPageEpic;