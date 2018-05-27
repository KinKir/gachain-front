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

import * as actions from './actions';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { TProtypoElement } from 'gachain/protypo';
import { TSection } from 'gachain/content';
import closeSectionHandler from './reducers/closeSectionHandler';
import ecosystemInitDoneHandler from './reducers/ecosystemInitDoneHandler';
import ecosystemInitFailedHandler from './reducers/ecosystemInitFailedHandler';
import fetchNotificationsDoneHandler from './reducers/fetchNotificationsDoneHandler';
import menuPopHandler from './reducers/menuPopHandler';
import menuPushHandler from './reducers/menuPushHandler';
import navigatePageDoneHandler from './reducers/navigatePageDoneHandler';
import navigationToggleHandler from './reducers/navigationToggleHandler';
import reloadPageDoneHandler from './reducers/reloadPageDoneHandler';
import reloadPageHandler from './reducers/reloadPageHandler';
import renderLegacyPageDoneHandler from './reducers/renderLegacyPageDoneHandler';
import renderLegacyPageHandler from './reducers/renderLegacyPageHandler';
import renderPageDoneHandler from './reducers/renderPageDoneHandler';
import renderPageFailedHandler from './reducers/renderPageFailedHandler';
import renderPageHandler from './reducers/renderPageHandler';
import renderSectionHandler from './reducers/renderSectionHandler';
import resetDoneHandler from './reducers/resetDoneHandler';
import resetFailedHandler from './reducers/resetFailedHandler';
import setResizingHandler from './reducers/setResizingHandler';
import switchSectionHandler from './reducers/switchSectionHandler';
import updateSectionHandler from './reducers/updateSectionHandler';
import ecosystemInitHandler from './reducers/ecosystemInitHandler';
import setDefaultPageHandler from './reducers/setDefaultPageHandler';

export type State = {
    readonly preloading: boolean;
    readonly preloadingError: string;
    readonly stylesheet: string;
    readonly navigationResizing: boolean;
    readonly inited: boolean;
    readonly section: string;
    readonly sections: {
        readonly [name: string]: TSection;
    };
    readonly notifications: TProtypoElement[];
};

export const initialState: State = {
    preloading: false,
    preloadingError: null,
    stylesheet: null,
    navigationResizing: false,
    inited: false,
    section: 'home',
    sections: {
        home: {
            name: 'home',
            title: 'Home',
            visible: true,
            pending: false,
            force: false,
            defaultPage: 'default_page',
            menus: [],
            menuVisible: true,
            page: null
        },
        admin: {
            name: 'admin',
            title: 'Admin',
            visible: true,
            defaultPage: 'admin_index',
            pending: false,
            force: false,
            menus: [],
            menuVisible: true,
            page: null
        },
        editor: {
            name: 'editor',
            title: 'Editor',
            visible: false,
            closeable: true,
            defaultPage: 'editor',
            pending: false,
            force: false,
            menus: [],
            menuDisabled: true,
            menuVisible: true,
            page: null
        }
    },
    notifications: null
};

export default reducerWithInitialState(initialState)
    .case(actions.closeSection, closeSectionHandler)
    .case(actions.ecosystemInit.done, ecosystemInitDoneHandler)
    .case(actions.ecosystemInit.failed, ecosystemInitFailedHandler)
    .case(actions.ecosystemInit.started, ecosystemInitHandler)
    .case(actions.fetchNotifications.done, fetchNotificationsDoneHandler)
    .case(actions.menuPop, menuPopHandler)
    .case(actions.menuPush, menuPushHandler)
    .case(actions.navigatePage.done, navigatePageDoneHandler)
    .case(actions.navigationToggle, navigationToggleHandler)
    .case(actions.reloadPage.done, reloadPageDoneHandler)
    .case(actions.reloadPage.started, reloadPageHandler)
    .case(actions.renderLegacyPage.done, renderLegacyPageDoneHandler)
    .case(actions.renderLegacyPage.started, renderLegacyPageHandler)
    .case(actions.renderPage.done, renderPageDoneHandler)
    .case(actions.renderPage.failed, renderPageFailedHandler)
    .case(actions.renderPage.started, renderPageHandler)
    .case(actions.renderSection, renderSectionHandler)
    .case(actions.reset.done, resetDoneHandler)
    .case(actions.reset.failed, resetFailedHandler)
    .case(actions.setResizing, setResizingHandler)
    .case(actions.switchSection, switchSectionHandler)
    .case(actions.updateSection, updateSectionHandler)
    .case(actions.setDefaultPage, setDefaultPageHandler);