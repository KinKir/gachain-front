/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action } from 'redux';
import { Epic } from 'modules';
import { Observable } from 'rxjs/Observable';
import { ecosystemInit, fetchNotifications } from 'modules/content/actions';
import { sectionsInit } from 'modules/sections/actions';
import { logout, selectWallet } from 'modules/auth/actions';

const ecosystemInitEpic: Epic = (action$, store, { api }) => action$.ofAction(ecosystemInit.started)
    .flatMap(action => {
        const state = store.getState();
        const client = api({
            apiHost: state.auth.session.network.apiHost,
            sessionToken: state.auth.session.sessionToken
        });

        return Observable.zip(
            Observable.from(client.getParam({ name: 'stylesheet' }))
                .map(l => l.value)
                .catch(e => Observable.of('')),
            Observable.from(client.getParam({ name: 'stylesheet_print' }))
                .map(l => l.value)
                .catch(e => Observable.of(''))
        ).flatMap(([stylesheet, printStylesheet]) =>
            Observable.of<Action>(
                fetchNotifications.started(null),
                ecosystemInit.done({
                    params: action.payload,
                    result: {
                        stylesheet,
                        printStylesheet
                    }
                }),
                sectionsInit.started(action.payload.section)
            )
        ).catch(e => {
            if ('E_OFFLINE' === e.error || 'E_SERVER' === e.error || 'E_TOKENEXPIRED' === e.error) {
                const wallet = store.getState().auth.wallet;

                return Observable.of<Action>(
                    logout.started(null),
                    selectWallet(wallet),
                    ecosystemInit.failed({
                        params: action.payload,
                        error: e.error
                    })
                );
            }
            return Observable.of<Action>(
                ecosystemInit.failed({
                    params: action.payload,
                    error: e.error
                })
            );
        });
    });

export default ecosystemInitEpic;