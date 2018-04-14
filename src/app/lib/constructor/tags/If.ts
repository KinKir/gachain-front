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
import constructorModule from 'lib/constructor';
import resolveTagHandler from 'lib/constructor/tags';
import Tag from './Tag';

class If extends Tag {
    constructor(element: TProtypoElement) {
        super(element);
        this.tagName = 'If';
        this.canHaveChildren = true;
        this.logic = true;
        this.attr = {
            'condition': 'Condition'
        };
        this.editProps = ['condition'];
    }

    renderCode(): string {
        let result: string = this.tagName + '(';

        if (this.element && this.element.attr && this.element.attr.condition) {
            result += this.element.attr.condition;
        }
        result += ')';

        let body = this.renderChildren();
        result += '{\n';
        if (this.element.children && this.element.children.length) {
            result += body + '\n' + this.renderOffset();
        }
        result += '}';

        if (this.element.tail && this.element.tail.length) {
            result += this.element.tail.map((element, index) => {
                const TailHandler = resolveTagHandler(element.tag);
                if (TailHandler) {
                    let tag = new TailHandler(element);
                    // tag.setOffset(this.offset + 1);
                    return tag.renderCode();
                }
                return '';
            }).join('');
        }

        return this.renderOffset() + result;
    }

    generateTreeJSON(text: string): any {
        return {
            tag: this.tagName.toLowerCase(),
            id: constructorModule.generateId(),
            attr: {
                condition: '#value#'
            },
            children: [],
            tail: [
                {
                    tag: 'else',
                    id: constructorModule.generateId(),
                    children: []
                }
            ]
        };
    }
}

export default If;