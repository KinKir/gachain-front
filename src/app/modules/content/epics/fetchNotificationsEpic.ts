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
import { fetchNotifications } from 'modules/content/actions';

const fetchNotificationsEpic: Epic = (action$, store, { api }) => action$.ofAction(fetchNotifications.started)
    .flatMap(action => {
        const state = store.getState();
        const client = api(state.engine.apiHost, state.auth.sessionToken);

        return Observable.fromPromise(client.content({
            type: 'page',
            name: 'notifications',
            params: {},
            locale: state.storage.locale

        })).map(payload =>
            fetchNotifications.done({
                params: action.payload,
                result: payload.tree
            })
        ).catch(e =>
            Observable.of(fetchNotifications.failed({
                params: action.payload,
                error: null
            }))
        );
    });

export default fetchNotificationsEpic;