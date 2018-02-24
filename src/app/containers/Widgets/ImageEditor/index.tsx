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
import { connect } from 'react-redux';
import { IRootState } from 'modules';
import { imageEditorOpen } from 'modules/content/actions';

import ImageEditor from 'components/ImageEditor';

interface IImageEditorContainerProps {
    mime: string;
    data: string;
    aspectRatio?: number;
    width?: number;
    onResult: (data: string) => void;
}

interface IImageEditorState {
    active: boolean;
    result: string;
}

interface IImageEditorDispatch {
    openEditor: typeof imageEditorOpen;
}

const ImageEditorContainer: React.SFC<IImageEditorContainerProps & IImageEditorState & IImageEditorDispatch> = props => (
    <ImageEditor {...props} />
);

const mapStateToProps = (state: IRootState) => ({
    active: !!state.content.imageEditor.data,
    result: state.content.imageEditor.result
});

const mapDispatchToProps = {
    openEditor: imageEditorOpen
};

export default connect<IImageEditorState, IImageEditorDispatch, IImageEditorContainerProps>(mapStateToProps, mapDispatchToProps)(ImageEditorContainer);