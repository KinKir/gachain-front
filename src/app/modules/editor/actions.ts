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
import { TProtypoElement } from 'gachain/protypo';
import { IEditorTabCreateCall, ICreateEditorTabCall, ILoadEditorTabCall, IReloadEditorTabCall, TEditorTab } from 'gachain/editor';

const actionCreator = actionCreatorFactory('editor');

export const editorSave = actionCreator<TEditorTab>('EDITOR_SAVE');
export const createEditorTab = actionCreator.async<ICreateEditorTabCall, IEditorTabCreateCall>('CREATE_EDITOR_TAB');
export const loadEditorTab = actionCreator.async<ILoadEditorTabCall, TEditorTab>('LOAD_EDITOR_TAB');
export const changeEditorTab = actionCreator<number>('CHANGE_EDITOR_TAB');
export const closeEditorTab = actionCreator<number>('CLOSE_EDITOR_TAB');
export const updateEditorTab = actionCreator<string>('UPDATE_EDITOR_TAB');
export const revertEditorTab = actionCreator<number>('REVERT_EDITOR_TAB');
export const reloadEditorTab = actionCreator<IReloadEditorTabCall>('RELOAD_EDITOR_TAB');
export const changeEditorTool = actionCreator.async<string, TProtypoElement[]>('CHANGE_EDITOR_TOOL');

// TODO: Pending refactoring
export const generatePageTemplate = actionCreator<string>('GENERATE_PAGE_TEMPLATE');