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

import { TProtypoElement } from 'gachain/protypo';
import Tag from './Tag';
import getParamName, { getLogicTagName } from 'lib/constructor/tags/params';

class Logic extends Tag {
    constructor(element: TProtypoElement) {
        super(element);
        this.tagName = getLogicTagName(element.tag);
        this.canHaveChildren = false;
        this.logic = true;
        this.attr = {
        };
        this.editProps = [];
        for (let attr in element.attr) {
            if (element.attr.hasOwnProperty(attr)) {
                this.attr[attr] = getParamName(attr);
                this.editProps.push(attr);
            }
        }
    }
}

export default Logic;