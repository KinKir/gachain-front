/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import actionCreatorFactory from 'typescript-fsa';
import { TWindowType } from 'gachain/gui';

const actionCreator = actionCreatorFactory('gui');
export const switchWindow = actionCreator.async<TWindowType, TWindowType, void>('SWITCH_WINDOW');
export const setBadgeCount = actionCreator<number>('SET_BADGE_COUNT');