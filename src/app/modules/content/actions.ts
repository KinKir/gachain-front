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

import actionCreatorFactory from 'typescript-fsa';
import { TMenu, TPage, TSection } from 'gachain/content';
import { TProtypoElement } from 'gachain/protypo';
import { ITransactionConfirm } from 'gachain/tx';

const actionCreator = actionCreatorFactory('content');

// Navigation
export const setResizing = actionCreator<boolean>('SET_RESIZING');
export const navigationToggle = actionCreator('NAVIGATION_TOGGLE');
export const menuPop = actionCreator('MENU_POP');
export const menuPush = actionCreator<TMenu>('MENU_PUSH');
export const ecosystemInit = actionCreator.async<{ section: string }, { name: string, stylesheet: string }, string>('ECOSYSTEM_INIT');
export const navigatePage = actionCreator.async<{ name?: string, section?: string, force?: boolean, params: { [key: string]: any }, confirm?: ITransactionConfirm }, { section: string }, undefined>('NAVIGATE_PAGE');
export const renderPage = actionCreator.async<{ section: string, name: string, params?: { [key: string]: any } }, { menu: TMenu, page: TPage }, string>('RENDER_PAGE');
export const renderLegacyPage = actionCreator.async<{ section: string, name: string, menu: string, params?: { [key: string]: any } }, { menu: TMenu }>('RENDER_LEGACY_PAGE');
export const reloadPage = actionCreator.async<{}, { params: { [key: string]: any }, menu: TMenu, page: TPage }, string>('RELOAD_PAGE');
export const renderSection = actionCreator<string>('RENDER_SECTION');
export const updateSection = actionCreator<TSection>('UPDATE_SECTION');
export const closeSection = actionCreator<string>('CLOSE_SECTION');
export const switchSection = actionCreator<string>('SWITCH_SECTION');
export const reset = actionCreator.async<void, { menu: TMenu, page: TPage }, string>('RESET');

// Protypo-specific
export const displayData = actionCreator.async<string, string, string>('DISPLAY_DATA');

// Notifications
export const fetchNotifications = actionCreator.async<void, TProtypoElement[], void>('FETCH_NOTIFICATIONS');