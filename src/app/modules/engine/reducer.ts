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

import * as actions from './actions';
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import defaultLocale from 'lib/en-US.json';

export type State = {
    readonly localeMessages: { [key: string]: string };
    readonly isInstalled: boolean;
    readonly isInstalling: boolean;
    readonly isLoading: boolean;
    readonly isConnected: boolean;
    readonly isConnecting: boolean;
    readonly isCollapsed: boolean;
    readonly isCreatingVDE: boolean;
    readonly createVDEResult: boolean;
};

export const initialState: State = {
    localeMessages: defaultLocale,
    isInstalled: null,
    isInstalling: false,
    isLoading: true,
    isConnected: null,
    isConnecting: false,
    isCreatingVDE: false,
    createVDEResult: null,
    isCollapsed: true
};

export default (state: State = initialState, action: Action): State => {
    if (isType(action, actions.checkOnline.started)) {
        return {
            ...state,
            isConnecting: true
        };
    }

    if (isType(action, actions.checkOnline.failed)) {
        switch (action.payload.error) {
            case 'E_NOTINSTALLED':
                return {
                    ...state,
                    isInstalled: false,
                    isConnected: true,
                    isConnecting: false
                };

            default:
                return {
                    ...state,
                    isConnected: false,
                    isConnecting: false
                };
        }
    }

    if (isType(action, actions.checkOnline.done)) {
        return {
            ...state,
            isInstalled: true,
            isConnected: action.payload.result,
            isConnecting: false
        };
    }

    if (isType(action, actions.checkOnline.failed)) {
        switch (action.payload.error) {
            case 'E_NOTINSTALLED':
                return {
                    ...state,
                    isInstalled: false,
                    isConnected: true,
                    isConnecting: false
                };

            default:
                return {
                    ...state,
                    isConnected: false,
                    isConnecting: false
                };
        }
    }

    if (isType(action, actions.setLoading)) {
        return {
            ...state,
            isLoading: action.payload
        };
    }

    if (isType(action, actions.install.started)) {
        return {
            ...state,
            isInstalling: true
        };
    }

    if (isType(action, actions.install.done)) {
        return {
            ...state,
            isInstalled: true,
            isInstalling: false
        };
    }

    if (isType(action, actions.install.failed)) {
        return {
            ...state,
            isInstalling: false
        };
    }

    if (isType(action, actions.setCollapsed)) {
        return {
            ...state,
            isCollapsed: action.payload
        };
    }

    if (isType(action, actions.createVDE.started)) {
        return {
            ...state,
            isCreatingVDE: true
        };
    }
    else if (isType(action, actions.createVDE.done)) {
        return {
            ...state,
            isCreatingVDE: false,
            createVDEResult: action.payload.result
        };
    }
    else if (isType(action, actions.createVDE.failed)) {
        return {
            ...state,
            isCreatingVDE: false,
            createVDEResult: action.payload.error
        };
    }

    if (isType(action, actions.setLocale.done)) {
        return {
            ...state,
            localeMessages: action.payload.result
        };
    }

    return state;
};