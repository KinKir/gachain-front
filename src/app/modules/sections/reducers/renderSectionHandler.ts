/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { State } from '../reducer';
import { renderSection } from '../actions';
import { Reducer } from 'modules';

const renderSectionHandler: Reducer<typeof renderSection, State> = (state, payload) => {
    return state.sections[payload] ? {
        ...state,
        section: payload
    } : state;
};

export default renderSectionHandler;