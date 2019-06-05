/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as actions from './actions';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { TWindowType } from 'gachain/gui';
import switchWindowDoneHandler from './reducers/switchWindowDoneHandler';

export type State = {
    readonly window: TWindowType;
};

export const initialState: State = {
    window: 'general'
};

export default reducerWithInitialState(initialState)
    .case(actions.switchWindow.done, switchWindowDoneHandler);