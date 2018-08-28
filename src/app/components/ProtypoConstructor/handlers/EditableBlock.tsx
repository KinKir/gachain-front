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

import * as React from 'react';
import * as classnames from 'classnames';
import ContentEditable from 'react-contenteditable';
import TagWrapper from '../components/TagWrapper';
import { OnPasteStripFormatting } from 'lib/constructor/helpers';
import { IConstructorElementProps } from 'gachain/editor';
import { TProtypoElement } from 'gachain/protypo';

export interface IEditableBlockProps extends IConstructorElementProps {
    'className'?: string;
    'class'?: string;
    'childrenText'?: string;
    'tail'?: TProtypoElement[];

    'src'?: string;
    'alt'?: string;
    'for'?: string;
    'name'?: string;
    'disabled'?: string;
    'placeholder'?: string;
    'type'?: string;
}

interface IEditableBlockState {
    condition: boolean;
}

export default class EditableBlock extends React.Component<IEditableBlockProps, IEditableBlockState> {
    protected logic = false;
    protected editableTag = 'div';
    protected editableDisplay = 'block';
    protected renderTag = 'div';
    protected editable = true;
    protected canMove = true;
    notEmpty(childrenText: string) {
        return childrenText !== undefined && childrenText !== null && childrenText.length >= 0;
    }
    hasTag(text: string) {
        return text.indexOf('<') === -1;
    }
    classChanged(nextProps: IEditableBlockProps): boolean {
        return this.props.class !== nextProps.class;
    }
    tailChanged(nextProps: IEditableBlockProps): boolean {
        return this.props.tail !== nextProps.tail;
    }
    conditionChanged(nextState: IEditableBlockState): boolean {
        return this.state && nextState && this.state.condition !== nextState.condition;
    }
    elementSelectedAndNotEmptyChildrenText(nextProps: IEditableBlockProps): boolean {
        return this.props.selected && this.notEmpty(this.props.childrenText)
            && nextProps.selected && this.notEmpty(nextProps.childrenText);
    }
    getClasses() {
        return classnames({
            [this.props.class]: true,
            [this.props.className]: true,
            'b-selected': this.props.selected
        });
    }
    shouldComponentUpdate(nextProps: IEditableBlockProps, nextState: IEditableBlockState) {
        if (!nextProps.selected) {
            return true;
        }

        if (this.elementSelectedAndNotEmptyChildrenText(nextProps)) {
            if (this.hasTag(nextProps.childrenText)) {
                return true;
            }
            return (
                this.classChanged(nextProps)
                || this.tailChanged(nextProps)
                || this.conditionChanged(nextState)
            );
        }

        return true;
    }

    onPaste(e: any) {
        OnPasteStripFormatting(this, e);
    }

    onClick(e: any) {
        e.stopPropagation();
        this.props.selectTag(this.props.tag);
    }

    handleChange(e: any) {
        this.props.changePage({text: e.target.value, tagID: this.props.tag.id});
    }

    removeTag() {
        this.props.removeTag({ tag: this.props.tag });
    }

    hasChildrenText() {
        return this.props.selected && this.props.childrenText !== undefined && this.props.childrenText !== null && this.props.childrenText.length >= 0;
    }
    contentEditable(tagName: string, classes: string) {
        return (
            <ContentEditable
                tagName={tagName}
                className={classes}
                html={this.props.childrenText}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
    renderChildrenWrapper() {
        const classes = this.getClasses();
        return (
            (this.hasChildrenText() && this.editable) ? (
                this.contentEditable(this.editableTag, classes)
            ) : (
                this.renderChildren(classes)
            )
        );
    }
    renderChildren(classes: string) {
        const Tag = `${this.renderTag}`;
        return (
            <Tag
                className={classes}
            >
                {this.props.children}
            </Tag>
        );
    }
    render() {
        if (this.logic && !this.props.logic) {
            return null;
        }
        const { connectDropTarget, connectDragSource, connectDragPreview, isOver } = this.props;
        const style = {
            display: (this.editableDisplay === 'inline') ? 'inline-block' : ''
        };

        return connectDragPreview(connectDropTarget(
            <span style={style}>
                <TagWrapper
                    display={this.editableDisplay}
                    selected={this.props.selected}
                    canDrop={isOver}
                    canDropPosition={this.props.canDropPosition}
                    onClick={this.onClick.bind(this)}
                    removeTag={this.removeTag.bind(this)}
                    connectDragSource={connectDragSource}
                    canMove={this.canMove}
                >
                    {this.renderChildrenWrapper()}
                </TagWrapper>
            </span>
        ));
    }
}