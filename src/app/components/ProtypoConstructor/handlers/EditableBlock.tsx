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

    shouldComponentUpdate(nextProps: IEditableBlockProps, nextState: IEditableBlockState) {
        if (!nextProps.selected) {
            return true;
        }
        if (this.props.selected) {
            if (this.props.selected && this.props.childrenText !== undefined && this.props.childrenText !== null && this.props.childrenText.length >= 0
                && nextProps.selected && nextProps.childrenText !== undefined && nextProps.childrenText !== null && nextProps.childrenText.length >= 0) {
                if (nextProps.childrenText.indexOf('<') === -1) {
                    return true;
                }
                return (this.props.class !== nextProps.class
                || this.props.tail !== nextProps.tail
                || (this.state && nextState && this.state.condition !== nextState.condition));
            }
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
}