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
import * as propTypes from 'prop-types';

import Protypo from '../Protypo';
import StyledComponent from './StyledComponent';
import * as classnames from 'classnames';
import TagWrapper from '../components/TagWrapper';
import DnDComponent from './DnDComponent';
import { IConstructorElementProps } from 'gachain/editor';

export interface IImageProps extends IConstructorElementProps {
    'className'?: string;
    'class'?: string;
    'src'?: string;
    'alt'?: string;
}

interface IImageContext {
    protypo: Protypo;
}

const Image: React.SFC<IImageProps> = (props, context: IImageContext) => {
    const onClick = (e: any) => {
        e.stopPropagation();
        props.selectTag(props.tag);
    };

    const removeTag = () => {
        props.removeTag({ tag: props.tag });
    };

    if (props.editable) {
        const { connectDropTarget, connectDragSource, connectDragPreview, isOver } = props;

        const classes = classnames({
            [props.class]: true,
            // [props.className]: true,
            'b-selected': props.selected
        });

        return connectDragPreview(connectDropTarget(
            <span style={{ display: 'inline-block' }}>
                <TagWrapper
                    display="inline"
                    selected={props.selected}
                    canDrop={isOver}
                    canDropPosition={props.canDropPosition}
                    onClick={onClick}
                    removeTag={removeTag}
                    connectDragSource={connectDragSource}
                    canMove={true}
                >
                    <img
                        className={classes}
                        src={props.src}
                        alt={props.alt}
                    />
                </TagWrapper>
            </span>
        ));
    }

    return (
        <img className={[props.class, props.className].join(' ')} src={context.protypo.resolveData(props.src)} alt={props.alt} />
    );
};

Image.contextTypes = {
    protypo: propTypes.object.isRequired
};

export default StyledComponent(Image);
export const ImageDnD = DnDComponent(StyledComponent(Image));