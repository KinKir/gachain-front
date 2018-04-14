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

import { findDOMNode } from 'react-dom';
import { TProtypoElement } from 'gachain/protypo';
import { IFindTagResult } from 'gachain/editor';
import * as _ from 'lodash';
import { html2json } from 'html2json';
import resolveTagHandler from 'lib/constructor/tags';
import getConstructorTemplate from 'lib/constructor/templates';

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

export function generateId() {
    return 'tag_' + (10000000 + Math.floor(Math.random() * 89999999));
}

export function setIds(children: any[], force: boolean = false) {
    for (let tag of children) {
        if (!tag) {
            continue;
        }
        if (!tag.id || force) {
            tag.id = generateId();
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

export class CodeGenerator {
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

function html2childrenTags(html: string): TProtypoElement[] {
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
                    id: generateId()
                };
            }
            else {
                return {
                    tag: 'span',
                    id: generateId(),
                    children: [{
                        tag: 'text',
                        text: clearHtml(node.text),
                        id: generateId()
                    }]
                };
            }
        case 'element':
            const className = node.attr && node.attr.class && node.attr.class.join(' ') || '';
            switch (node.tag) {
                case 'p':
                    return {
                        tag: 'p',
                        id: generateId(),
                        attr: {
                            className: className
                        },
                        children: htmlJsonChild2childrenTags(node.child)
                    };
                case 'i':
                    return {
                        tag: 'em',
                        id: generateId(),
                        attr: {
                            className: className
                        },
                        children: htmlJsonChild2childrenTags(node.child)
                    };
                case 'b':
                case 'strong':
                    return {
                        tag: 'strong',
                        id: generateId(),
                        attr: {
                            className: className
                        },
                        children: htmlJsonChild2childrenTags(node.child)
                    };
                case 'span':
                    return {
                        tag: 'span',
                        id: generateId(),
                        attr: {
                            className: className
                        },
                        children: htmlJsonChild2childrenTags(node.child)
                    };
                case 'div':
                    return {
                        tag: 'div',
                        id: generateId(),
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

export default {
    setIds,
    convertToTreeData,
    findTagById,
    copyObject,
    getConstructorTemplate,
    generateId,
    updateChildrenText,
    html2childrenTags,
    resolveTagHandler,
    CodeGenerator,
    Properties
};