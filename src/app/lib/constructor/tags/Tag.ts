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

import { TProtypoElement } from 'gachain/protypo';
import { idGenerator } from 'lib/constructor';
import resolveTagHandler from 'lib/constructor/tags';
import getParamName, { getTailTagName } from 'lib/constructor/tags/params';
import { isSimpleBody, quoteValueIfNeeded, getParamsStr } from 'lib/constructor/helpers';

class Tag {
    protected element: TProtypoElement;
    protected tagName: string = 'Tag';
    protected HTMLTag: string = null;
    public canHaveChildren: boolean = true;
    public canMove: boolean = true;
    public canCopy: boolean = true;
    public canChangePosition: boolean = true;
    protected offset: number = 0;
    protected generateTextElement = true;
    protected logic = false;

    protected attr: any = {
        'class': 'Class'
    };

    protected editProps = ['class', 'align', 'transform', 'wrap', 'color'];

    protected bodyInline = true;
    protected dataAttr = false;

    constructor(element: TProtypoElement) {
        this.element = element;
    }
    setOffset(offset: number): void {
        this.offset = offset;
    }
    renderOffset(): string {
        return Array(this.offset + 1).join(' ');
    }

    getParam(value: any, attr: string): string {
        let param = '';
        if (value) {
            if (typeof value === 'string') {
                param = getParamName(attr) + ': ' + quoteValueIfNeeded(value);
            }
            if (typeof value === 'object') {
                param = getParamsStr(getParamName(attr), value);
            }
        }
        return param;
    }
    getBasicParamsArr(element: TProtypoElement) {
        let params: string[] = [];

        if (element.attr) {
            Object.keys(element.attr).forEach(attr => {
                if (!(this.dataAttr && attr === 'data')) {
                    let param = this.getParam(element.attr[attr], attr);
                    if (param) {
                        params.push(param);
                    }
                }
            });
        }
        return params;
    }
    renderParams(element: TProtypoElement, body: string): string {
        let params: string[] = this.getBasicParamsArr(element);

        if (body && this.bodyInline && isSimpleBody(body)) {
            params.push('Body: ' + body);
        }

        return params.join(', ');
    }
    renderData(): string {
        let result = '';
        if (this.dataAttr && this.element && this.element.attr && this.element.attr.data) {
             result += '{\n'
                + this.renderOffset() + '   '
                + this.element.attr.data
                + '\n'
                + this.renderOffset()
                + '}';
        }
        return result;
    }
    renderTailTag(element: TProtypoElement): string {
        const tagName = getTailTagName(element.tag);
        if (tagName) {
            const children = this.renderChildren(element.children, this.offset);
            return '.' + tagName
                + '('
                + this.renderParams(element, children)
                + ')'
                + (children ?
                    ('{\n' + children + '\n' + this.renderOffset() + '}')
                    :
                    '');
        }
        return '';
    }
    renderTail(): string {
        let result = '';
        if (this.element.tail && this.element.tail.length) {
            result = this.element.tail.map((element) => {
                return this.renderTailTag(element);
            }).join('');
        }
        return result;
    }
    renderBody(body: string): string {
        let result = '';
        if (body && (!this.bodyInline || !isSimpleBody(body))) {
            result = ' {\n' + body + '\n' + this.renderOffset() + '}';
        }
        return result;
    }
    renderCode(): string {
        const body = this.renderChildren(this.element.children, this.offset);

        let result: string = this.renderOffset();
        result += this.tagName + '(';
        result += this.renderParams(this.element, body) + ')';
        result += this.renderData();
        result += this.renderTail();
        result += this.renderBody(body);

        return result;
    }

    renderChildren(children: TProtypoElement[], offset: number): string {
        if (!children) {
            return '';
        }
        let result = children.map((element, index) => {
            switch (element.tag) {
                case 'text':
                    return quoteValueIfNeeded(element.text);
                default:
                    const Handler = resolveTagHandler(element.tag);
                    if (Handler) {
                        let tag = new Handler(element);
                        tag.setOffset(offset + 1);
                        return tag.renderCode();
                    }
                    return '';
            }
        }).join('\n');

        if (result.length > 0) {
            return result;
        }

        return '';
    }
    renderHTML(): string {
        if (this.HTMLTag) {
            let result: string = '<' + this.HTMLTag;
            if (this.element.attr && (this.element.attr.class || this.element.attr.className)) {
                result += ' class="' + (this.element.attr.class ? this.element.attr.class : '') + ' ' + (this.element.attr.className ? this.element.attr.className : '') + '"';
            }
            result += '>';
            const children = this.renderHTMLChildren();
            if (children === null) {
                return null;
            }
            result += children;
            result += '</' + this.HTMLTag + '>';
            return result;
        }
        else {
            return null;
        }
    }
    renderHTMLChildren(): string {
        if (!this.element.children) {
            return '';
        }
        let resultArr = this.element.children.map((element, index) => {
            switch (element.tag) {
                case 'text':
                    return element.text;
                default:
                    const Handler = resolveTagHandler(element.tag);
                    if (Handler) {
                        let tag = new Handler(element);
                        return tag.renderHTML();
                    }
                    return '';
            }
        });

        // if any of subtags has null -> result is null
        if (resultArr.indexOf(null) !== -1) {
            return null;
        }

        const result = resultArr.join('');

        if (result.length > 0) {
            return result;
        }

        return '';
    }
    generateTreeJSON(text: string): any {
        return {
            tag: this.tagName.toLowerCase(),
            id: idGenerator.generateId(),
            children: this.generateTextElement ? [{
                tag: 'text',
                text: text,
                id: idGenerator.generateId()
            }] : []
        };
    }

    getValidationParams(obj: Object) {
        const params = {
            'minlength': 'minLength',
            'maxlength': 'maxLength'
        };
        let paramsArr = [];
        for (let param in obj) {
            if (obj.hasOwnProperty(param)) {
                paramsArr.push((params[param] || param) + ': ' + obj[param]);
            }
        }
        if (paramsArr.length) {
            return '.Validate(' + paramsArr.join(',') + ')';
        }
        return '';
    }

    getParams(obj: Object) {
        let paramsArr = [];
        for (let param in obj) {
            if (obj.hasOwnProperty(param)) {
                paramsArr.push(param + ': ' + (obj[param] || ''));
            }
        }
        return paramsArr.join(',');
    }

    getCanHaveChildren() {
        return this.canHaveChildren;
    }

    hasEditProp(prop: string): boolean {
        return this.editProps.indexOf(prop) !== -1;
    }

    isLogic(): boolean {
        return this.logic;
    }
}

export default Tag;