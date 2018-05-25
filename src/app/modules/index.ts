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

import { Action } from 'redux';
import { Epic as NativeEpic } from 'redux-observable';
import { IStoreDependencies } from './dependencies';
import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { routerReducer as router, RouterState } from 'react-router-redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import * as auth from './auth';
import * as content from './content';
import * as modal from './modal';
import * as engine from './engine';
import * as editor from './editor';
import * as tx from './tx';
import * as gui from './gui';
import * as io from './io';
import * as notifications from './notifications';
import * as storage from './storage';
import * as socket from './socket';
import { ActionCreator, Failure, Success } from 'typescript-fsa';

export type Epic = NativeEpic<Action, IRootState, IStoreDependencies>;
export type Reducer<T, S> =
    T extends ActionCreator<Failure<infer P, infer E>> ? (state: S, payload: Failure<P, E>) => S :
    T extends ActionCreator<Success<infer P, infer R>> ? (state: S, payload: Success<P, R>) => S :
    T extends ActionCreator<infer R> ? (state: S, payload: R) => S :
    (state: S, payload: T) => S;

export interface IRootState {
    auth: auth.State;
    content: content.State;
    modal: modal.State;
    engine: engine.State;
    editor: editor.State;
    tx: tx.State;
    gui: gui.State;
    io: io.State;
    notifications: notifications.State;
    storage: storage.State;
    socket: socket.State;
    loadingBar: number;
    router: RouterState;
}

export const rootEpic = combineEpics(
    auth.epic,
    content.epic,
    engine.epic,
    editor.epic,
    tx.epic,
    gui.epic,
    io.epic,
    notifications.epic,
    storage.epic,
    socket.epic
);

export default combineReducers<IRootState>({
    auth: auth.reducer,
    content: content.reducer,
    modal: modal.reducer,
    engine: engine.reducer,
    editor: editor.reducer,
    tx: tx.reducer,
    gui: gui.reducer,
    notifications: notifications.reducer,
    storage: storage.reducer,
    socket: socket.reducer,
    loadingBar: loadingBarReducer,
    router
});