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
import { OnPasteStripFormatting } from 'lib/constructor';
import StyledComponent from './StyledComponent';
import TagWrapper from '../components/TagWrapper';
import DnDComponent from './DnDComponent';
import * as classnames from 'classnames';

export interface IPProps {
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
}

interface IPState {
}

class P extends React.Component<IPProps, IPState> {

    constructor(props: IPProps) {
        super(props);
    }

    onPaste(e: any) {
        OnPasteStripFormatting(this, e);
    }

    onClick(e: any) {
        e.stopPropagation();
        this.props.selectTag({ tag: this.props.tag });
    }

    onBlur(e: any) {
        e.stopPropagation();
        this.props.changePage({ text: e.target.innerHTML, tagID: this.props.tag.id });
    }

    removeTag() {
        this.props.removeTag({ tag: this.props.tag });
    }

    render() {
        if (this.props.editable) {
            const { connectDropTarget, connectDragSource, connectDragPreview, isOver } = this.props;

            const classes = classnames({
                [this.props.class]: true,
                [this.props.className]: true,
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
                        canMove={true}
                    >
                    <p
                        className={classes}
                        contentEditable={this.props.selected}
                        onPaste={this.onPaste.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                    >
                        {this.props.children}
                    </p>
                    </TagWrapper>
                </span>
            ));
        }
        return (
            <p
                className={[this.props.class, this.props.className].join(' ')}
            >
                {this.props.children}
            </p>
        );

    }
}

export default StyledComponent(P);
export const PDnD = DnDComponent(StyledComponent(P));