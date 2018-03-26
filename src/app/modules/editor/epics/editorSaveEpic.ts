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

import * as actions from '../actions';
import { Action } from 'redux';
import { Observable } from 'rxjs';
import { Epic } from 'redux-observable';
import { IRootState } from 'modules';
import { txCall } from 'modules/tx/actions';

const editorSaveEpic: Epic<Action, IRootState> =
    (action$, store) => action$.ofAction(actions.editorSave)
        .filter(l => !l.payload.new)
        .flatMap(action => {
            switch (action.payload.type) {
                case 'contract':
                    return Observable.of(txCall({
                        uuid: 'EDITOR_SAVE',
                        name: '@1EditContract',
                        params: {
                            Id: action.payload.id,
                            Value: action.payload.value
                        }
                    }));

                case 'page':
                    return Observable.of(txCall({
                        uuid: 'EDITOR_SAVE',
                        name: '@1EditPage',
                        params: {
                            Id: action.payload.id,
                            Value: action.payload.value
                        }
                    }));

                case 'menu':
                    return Observable.of(txCall({
                        uuid: 'EDITOR_SAVE',
                        name: '@1EditMenu',
                        params: {
                            Id: action.payload.id,
                            Value: action.payload.value
                        }
                    }));

                case 'block':
                    return Observable.of(txCall({
                        uuid: 'EDITOR_SAVE',
                        name: '@1EditBlock',
                        params: {
                            Id: action.payload.id,
                            Value: action.payload.value
                        }
                    }));

                default:
                    return Observable.empty<never>();
            }
        });

export default editorSaveEpic;