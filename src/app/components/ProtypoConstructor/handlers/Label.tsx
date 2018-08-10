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
import StyledComponent from 'components/Protypo/handlers/StyledComponent';
import TagWrapper from '../components/TagWrapper';
import DnDComponent from './DnDComponent';
import * as classnames from 'classnames';
import ContentEditable from 'react-contenteditable';
import EditableBlock from './EditableBlock';

class Label extends EditableBlock {
    render() {
        const { connectDropTarget, connectDragSource, connectDragPreview, isOver } = this.props;

        const classes = classnames({
            [this.props.class]: true,
            [this.props.className]: true,
            'b-selected': this.props.selected
        });

        return connectDragPreview(connectDropTarget(
            <span>
                <TagWrapper
                    display="inline"
                    selected={this.props.selected}
                    canDrop={isOver}
                    canDropPosition={this.props.canDropPosition}
                    onClick={this.onClick.bind(this)}
                    removeTag={this.removeTag.bind(this)}
                    connectDragSource={connectDragSource}
                    canMove={true}
                >
                {this.hasChildrenText() ? (
                    <ContentEditable
                        tagName="label"
                        className={classes}
                        html={this.props.childrenText}
                        onChange={this.handleChange.bind(this)}
                    />
                ) : (
                    <label
                        className={classes}
                    >
                        {this.props.children}
                    </label>
                )}
                </TagWrapper>
            </span>
        ));
    }
}

export default DnDComponent(StyledComponent(Label));
