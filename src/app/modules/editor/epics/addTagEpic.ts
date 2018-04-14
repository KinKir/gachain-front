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

import { Action } from 'redux';
import { Epic } from 'redux-observable';
import * as actions from '../actions';
import { IRootState } from 'modules';

const addTagEpic: Epic<Action, IRootState> =
    (action$, store, { constructorModule }) => action$.ofAction(actions.addTag.started)
        .map(action => {
            const state = store.getState().editor;
            const tab = state.tabs[state.tabIndex].designer;
            const tabData = tab && tab.data || null;
            let jsonData = tabData.jsonData && constructorModule.copyObject(tabData.jsonData) || null;

            let Tag: any = null;
            let treeJSON: any = null;

            if (action.payload.tag.element) {
                const Handler = constructorModule.resolveTagHandler(action.payload.tag.element);
                if (Handler) {
                    Tag = new Handler();
                    treeJSON = Tag.generateTreeJSON(action.payload.tag.text);
                }
            }
            else {
                if (action.payload.tag.template) {
                    treeJSON = constructorModule.getConstructorTemplate(action.payload.tag.template);
                }
            }

            if ('string' === typeof action.payload.destinationTagID &&
                'string' === typeof action.payload.position) {
                let tag = constructorModule.findTagById(jsonData, action.payload.destinationTagID);
                if (tag.el) {
                    switch (action.payload.position) {
                        case 'inside':
                            if (!tag.el.children) {
                                tag.el.children = [];
                            }
                            tag.el.children.push(treeJSON);
                            break;
                        case 'before':
                            if (tag.parent && tag.parent.id && tag.parent.children) {
                                tag.parent.children.splice(tag.parentPosition, 0, treeJSON);
                            }
                            else {
                                jsonData.splice(tag.parentPosition, 0, treeJSON);
                            }
                            break;
                        case 'after':
                            if (tag.parent && tag.parent.id && tag.parent.children) {
                                tag.parent.children.splice(tag.parentPosition + 1, 0, treeJSON);
                            }
                            else {
                                jsonData.splice(tag.parentPosition + 1, 0, treeJSON);
                            }
                            break;
                        default:
                            break;
                    }

                }
            }
            else {
                jsonData = jsonData.concat(
                    treeJSON
                );
            }

            jsonData = constructorModule.updateChildrenText(jsonData);

            return actions.addTag.done({
                params: action.payload,
                result: {
                    jsonData,
                    treeData: constructorModule.convertToTreeData(jsonData)
                }
            });
        });

export default addTagEpic;