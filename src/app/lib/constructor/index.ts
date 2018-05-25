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

import { findDOMNode } from 'react-dom';
import { TProtypoElement } from 'gachain/protypo';
import { IFindTagResult } from 'gachain/editor';
import * as _ from 'lodash';
import { html2json } from 'html2json';
import resolveTagHandler from 'lib/constructor/tags';

declare const window: Window & { clipboardData: any };

let findTagByIdResult: IFindTagResult = {
        el: null,
        parent: null,
        parentPosition: 0,
        tail: false
    };

const findNextTagById = (el: any, id: string, parent: any, tail: boolean): any => {
    if (el.id === id) {
        findTagByIdResult.el = el;
        return;
    }
    if (el instanceof Array) {
        for (var i = 0; i < el.length; i++) {
            if (findTagByIdResult.el) {
                break;
            }
            findTagByIdResult.parent = parent;
            findTagByIdResult.parentPosition = i;
            findTagByIdResult.tail = tail;
            findNextTagById(el[i], id, parent, false);
        }
    }
    if (findTagByIdResult.el) {
        return;
    }
    if (el.children) {
        findNextTagById(el.children, id, el, false);
    }
    if (el.tail) {
        findNextTagById(el.tail, id, el, true);
    }
};

export const findTagById = (el: any, id: string): any => {
    findTagByIdResult.el = null;
    findNextTagById(el, id, null, false);
    return findTagByIdResult;
};

// todo: copyArray, copyObject

export function copyObject(item: any) {
    let result: any = null;
    if (!item) {
        return result;
    }
    if (Array.isArray(item)) {
        result = item.map(copyObject);
    }
    else {
        if (item instanceof Object && !(item instanceof Function)) {
            result = {};
            for (let key in item) {
                if (key) {
                    result[key] = copyObject(item[key]);
                }
            }
        }
    }
    return result || item;
}

export class IdGenerator {
    private counter: number = 0;
    setCounter(counter: number) {
        this.counter = counter;
    }
    generateId() {
        return 'tag_' + this.counter++;
    }
    generateRandId() {
        return 'tag_' + (10000000 + Math.floor(Math.random() * 89999999));
    }
}

export const idGenerator = new IdGenerator();

export function setIds(children: any[], force: boolean = false) {
    for (let tag of children) {
        if (!tag) {
            continue;
        }
        if (!tag.id || force) {
            tag.id = idGenerator.generateId();
        }
        if (tag.children) {
            setIds(tag.children, force);
        }
        if (tag.tail) {
            setIds(tag.tail, force);
        }
    }
}

let onPasteStripFormattingIEPaste: boolean = false;

export function OnPasteStripFormatting(elem: any, e: any) {
    let text: string;
    if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
        e.preventDefault();
        text = e.originalEvent.clipboardData.getData('text/plain');
        window.document.execCommand('insertText', false, text);
    }
    else if (e.clipboardData && e.clipboardData.getData) {
        e.preventDefault();
        text = e.clipboardData.getData('text/plain');
        window.document.execCommand('insertText', false, text);
    }
    else if (window.clipboardData && window.clipboardData.getData) {
        // Stop stack overflow
        if (!onPasteStripFormattingIEPaste) {
            onPasteStripFormattingIEPaste = true;
            e.preventDefault();
            window.document.execCommand('ms-pasteTextOnly', false);
        }
        onPasteStripFormattingIEPaste = false;
    }
}

export function convertToTreeData(data: TProtypoElement[], selectedTag?: TProtypoElement): any {
    let result = [];
    if (data instanceof Array) {
        for (const item of data) {
            let children = null;
            let subtitle = item.text;
            if (item.children) {
                if (item.children.length && item.children[0] && item.children[0].tag === 'text') {
                    subtitle = _.truncate(item.children[0].text, {
                        'length': 24,
                        'separator': /,? +/
                    });
                    if (item.children.length > 1) {
                        children = convertToTreeData([...item.children.slice(1)], selectedTag);
                    }
                }
                else {
                    children = convertToTreeData(item.children, selectedTag);
                }
            }

            if (item.tail) {
                if (!children) {
                    children = [];
                }

                const tail = convertToTreeData(item.tail, selectedTag);

                let tailTreeItem = {
                    title: '...',
                    children: tail,
                    expanded: true,
                    id: '',
                    selected: false,
                    logic: true,
                    tag: '',
                    canMove: false,
                    canDrop: false
                };

                children.push(tailTreeItem);
            }

            let selected = false;
            if (selectedTag && selectedTag.id === item.id) {
                selected = true;
            }

            const Handler = resolveTagHandler(item.tag);
            if (Handler) {
                const tagObj = new Handler(item);
                let treeItem = {
                    title: item.tag + (subtitle ? (': ' + subtitle) : ''),
                    children: children,
                    expanded: true,
                    id: item.id,
                    selected: selected,
                    logic: tagObj.isLogic(),
                    canMove: tagObj.canMove,
                    canDrop: tagObj.canHaveChildren,
                    tag: item
                };
                result.push(treeItem);
            }
        }
    }
    return result;
}

export default class CodeGenerator {
    private elements: TProtypoElement[];
    constructor(elements: TProtypoElement[]) {
        this.elements = elements;
    }
    render(): string {
        if (!this.elements) {
            return '';
        }
        return this.elements.map((element, index) => {
            switch (element.tag) {
                case 'text':
                    return element.text;
                default:
                    const Handler = resolveTagHandler(element.tag);
                    if (Handler) {
                        let tag = new Handler(element);
                        return tag.renderCode();
                    }
                    return '';
            }
        }).join('\n');
    }
}

export class Properties {
    private propertiesClasses = {
        'align': {
            'left': 'text-left',
            'center': 'text-center',
            'right': 'text-right'
        },
        'transform': {
            'lowercase': 'text-lowercase',
            'uppercase': 'text-uppercase'
        },
        'wrap': {
            'nowrap': 'text-nowrap'
        },
        'color': {
            'muted': 'text-muted',
            'primary': 'text-primary',
            'success': 'text-success',
            'info': 'text-info',
            'warning': 'text-warning',
            'danger': 'text-danger'
        },
        'btn': {
            'default': 'btn btn-default',
            'primary': 'btn btn-primary',
            'success': 'btn btn-success',
            'info': 'btn btn-info',
            'warning': 'btn btn-warning',
            'danger': 'btn btn-danger',
            'link': 'btn btn-link',
            'basic': 'btn'
        }
    };

    public getInitial(property: string, tag: any) {
        if (tag && tag.attr && tag.attr.class) {
            const classes = ' ' + tag.attr.class + ' ';
            if (this.propertiesClasses[property]) {
                for (let value in this.propertiesClasses[property]) {
                    if (this.propertiesClasses[property].hasOwnProperty(value)) {
                        if (classes.indexOf(' ' + this.propertiesClasses[property][value] + ' ') >= 0) {
                            return value;
                        }
                    }
                }
            }
        }
        return '';
    }

    public updateClassList(classes: string, property: string, value: string) {
        classes = classes ? classes.concat() : '';

        switch (property) {
            case 'align':
            case 'transform':
            case 'wrap':
            case 'color':
            case 'btn':
                for (let prop in this.propertiesClasses[property]) {
                    if (this.propertiesClasses[property].hasOwnProperty(prop)) {
                        classes = classes.replace(this.propertiesClasses[property][prop], '');
                    }
                }
                if (this.propertiesClasses[property][value]) {
                    classes += ' ' + this.propertiesClasses[property][value];
                }
                break;
            default:
                break;
        }

        return classes.replace(/\s+/g, ' ').trim();
    }
}

export const getInitialTagValue = (prop: string, tag: any): string => {
    let properties = new Properties();
    return properties.getInitial(prop, tag);
};

// export const resolveTagHandler = (name: string) => {
//     return tagHandlers[name] || Logic;
// };

export function getDropPosition(monitor: any, component: any, tag: any) {

    // Determine rectangle on screen
    if (!findDOMNode(component)) {
        return 'after';
    }
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    const maxGap: number = 15;
    let gapX: number = hoverBoundingRect.width / 4;
    let gapY: number = hoverBoundingRect.height / 4;
    if (gapX > maxGap) {
        gapX = maxGap;
    }
    if (gapY > maxGap) {
        gapY = maxGap;
    }

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    let tagObj: any = null;
    const Handler = resolveTagHandler(tag.tag);
    if (Handler) {
        tagObj = new Handler(tag);
    }

    if (!tagObj.canChangePosition && tagObj.canHaveChildren) {
        return 'inside';
    }

    if (hoverClientY < gapY || hoverClientX < gapX) {
        return 'before';
    }

    if (hoverClientY > hoverBoundingRect.height - gapY || hoverClientX > hoverBoundingRect.width - gapX) {
        return 'after';
    }

    if (tagObj && tagObj.getCanHaveChildren()) {
        return 'inside';
    }
    return 'after';
}

function updateElementChildrenText(el: TProtypoElement) {

    if (el.children) {
        let childrenText = null;
        const Handler = resolveTagHandler(el.tag);
        if (Handler) {
            let tag = new Handler(el);
            childrenText = tag.renderHTMLChildren();
        }
        let children: TProtypoElement[] = [];
        for (let child of el.children) {
            children.push(updateElementChildrenText(child));
        }
        return {
            ...el,
            childrenText,
            children
        };
    }
    else {
        return el;
    }
}

export function updateChildrenText(tree: TProtypoElement[]): TProtypoElement[] {
    let updatedElements = [];
    if (tree && tree.length) {
        for (let el of tree) {
            updatedElements.push(updateElementChildrenText(el));
        }
        return updatedElements;
    }
    else {
        return tree;
    }
}

export function html2childrenTags(html: string): TProtypoElement[] {
    const htmlJson = html2json(html);
    return htmlJsonChild2childrenTags(htmlJson.child);
}

function htmlJsonChild2childrenTags(nodes: IHtmlJsonNode[]): TProtypoElement[] {
    let children = [];
    let i = 0;
    if (nodes) {
        for (const node of nodes) {
            const el = htmlJson2ProtypoElement(node, i);
            if (el) {
                children.push(el);
            }
            i++;
        }
    }
    return children;
}

interface IHtmlJsonNode {
    node: string;
    tag?: string;
    text?: string;
    attr?: { [key: string]: any };
    child?: IHtmlJsonNode[];
}

function clearHtml(text: string): string {
    return text.replace(/&nbsp;/g, '');
}

function htmlJson2ProtypoElement(node: IHtmlJsonNode, index: number) {
    switch (node.node) {
        case 'text':
            if (index === 0) {
                return {
                    tag: 'text',
                    text: clearHtml(node.text),
                    id: idGenerator.generateId()
                };
            }
            else {
                return {
                    tag: 'span',
                    id: idGenerator.generateId(),
                    children: [{
                        tag: 'text',
                        text: clearHtml(node.text),
                        id: idGenerator.generateId()
                    }]
                };
            }
        case 'element':
            const className = node.attr && node.attr.class && node.attr.class.join(' ') || '';
            switch (node.tag) {
                case 'p':
                    return {
                        tag: 'p',
                        id: idGenerator.generateId(),
                        attr: {
                            className: className
                        },
                        children: htmlJsonChild2childrenTags(node.child)
                    };
                case 'i':
                    return {
                        tag: 'em',
                        id: idGenerator.generateId(),
                        attr: {
                            className: className
                        },
                        children: htmlJsonChild2childrenTags(node.child)
                    };
                case 'b':
                case 'strong':
                    return {
                        tag: 'strong',
                        id: idGenerator.generateId(),
                        attr: {
                            className: className
                        },
                        children: htmlJsonChild2childrenTags(node.child)
                    };
                case 'span':
                    return {
                        tag: 'span',
                        id: idGenerator.generateId(),
                        attr: {
                            className: className
                        },
                        children: htmlJsonChild2childrenTags(node.child)
                    };
                case 'div':
                    return {
                        tag: 'div',
                        id: idGenerator.generateId(),
                        attr: {
                            className: className
                        },
                        children: htmlJsonChild2childrenTags(node.child)
                    };
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return null;
}

let hoverTimer: any = null;

export function startHoverTimer() {
    if (hoverTimer) {
        return false;
    }
    hoverTimer = setTimeout(() => { hoverTimer = null; }, 200);
    return true;
}
