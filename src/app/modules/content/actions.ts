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
import { IProtypoElement } from 'components/Protypo/Protypo';

const actionCreator = actionCreatorFactory('content');

// Navigation
export const setResizing = actionCreator<boolean>('SET_RESIZING');
export const navigationToggle = actionCreator('NAVIGATION_TOGGLE');
export const menuPop = actionCreator('MENU_POP');
export const menuPush = actionCreator<{ name: string, vde: boolean, content: IProtypoElement[] }>('MENU_PUSH');
export const alertShow = actionCreator<{ id: string, type: string, title: string, text: string, confirmButton?: string, cancelButton?: string }>('ALERT_SHOW');
export const alertClose = actionCreator<{ id: string, success: string, error: string }>('ALERT_CLOSE');
export const ecosystemInit = actionCreator.async<undefined, { defaultMenu: { name: string, vde: boolean, content: IProtypoElement[] }, stylesheet: string }, string>('ECOSYSTEM_INIT');
export const navigatePage = actionCreator.async<{ name: string, params: { [key: string]: any }, vde?: boolean }, undefined, undefined>('NAVIGATE_PAGE');
export const renderPage = actionCreator.async<{ name: string, params?: { [key: string]: any }, vde?: boolean }, { menu: { name: string, vde: boolean, content: IProtypoElement[] }, page: { name: string, content: IProtypoElement[], error?: string } }, string>('RENDER_PAGE');
export const reloadPage = actionCreator.async<{}, { vde: boolean, params: { [key: string]: any }, menu: { name: string, vde: boolean, content: IProtypoElement[] }, page: { name: string, content: IProtypoElement[], error?: string } }, string>('RELOAD_PAGE');
export const reset = actionCreator.async<undefined, { menu: { name: string, vde: boolean, content: IProtypoElement[] }, page: { name: string, content: IProtypoElement[], error?: string } }, string>('RESET');

// Protypo-specific
export const displayData = actionCreator.async<string, string, string>('DISPLAY_DATA');

// Image editor modal window
export const imageEditorOpen = actionCreator<{ mime: string, data: string, width?: number, aspectRatio?: number }>('IMAGE_EDITOR_OPEN');
export const imageEditorClose = actionCreator<string>('IMAGE_EDITOR_CLOSE');

// Notifications
export const fetchNotifications = actionCreator.async<undefined, IProtypoElement[], undefined>('FETCH_NOTIFICATIONS');