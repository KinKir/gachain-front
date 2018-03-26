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

import * as React from 'react';
import StyledComponent from './StyledComponent';
import TagWrapper from '../components/TagWrapper';
import DnDComponent from './DnDComponent';
import * as classnames from 'classnames';

export interface IElseProps {
    'className'?: string;
    'class'?: string;
    'children': any;
    'editable'?: boolean;
    'changePage'?: any;
    'setTagCanDropPosition'?: any;
    'addTag'?: any;
    'moveTag'?: any;
    'copyTag'?: any;
    'removeTag'?: any;
    'selectTag'?: any;
    'selected'?: boolean;
    'tag'?: any;

    'canDropPosition'?: string;

    connectDropTarget?: any;
    isOver?: boolean;

    connectDragSource?: any;
    connectDragPreview?: any;
    isDragging?: boolean;
    logic?: boolean;
}

interface IElseState {
    condition: boolean;
}

class Else extends React.Component<IElseProps, IElseState> {
    onClick(e: any) {
        e.stopPropagation();
        this.props.selectTag({ tag: this.props.tag });
    }

    removeTag() {
        this.props.removeTag({ tag: this.props.tag });
    }

    render() {
        if (!this.props.logic) {
            return null;
        }
        const { connectDropTarget, connectDragSource, connectDragPreview, isOver } = this.props;

        const classes = classnames({
            'b-selected': this.props.selected
        });

        return connectDragPreview(connectDropTarget(
            <span>
                <TagWrapper
                    display="block"
                    selected={this.props.selected}
                    canDrop={isOver}
                    canDropPosition={this.props.canDropPosition}
                    onClick={this.onClick.bind(this)}
                    removeTag={this.removeTag.bind(this)}
                    connectDragSource={connectDragSource}
                    canMove={false}
                >
                <div
                    className={classes}
                >
                    <span style={{'backgroundColor': '#FFCC66'}}>Else &#123;</span>
                    <div>
                        {this.props.children}
                    </div>
                    <span style={{'backgroundColor': '#FFCC66'}}>&#125;</span>
                </div>
                </TagWrapper>
            </span>
        ));
    }
}

export default DnDComponent(StyledComponent(Else));
