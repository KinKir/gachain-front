// MIT License
// 
// Copyright (c) 2016-2019 GACHAIN
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
import { connect } from 'react-redux';
import { IRootState } from 'modules';
import { TProtypoElement } from 'gachain/protypo';

import ProtypoConstructor from 'components/ProtypoConstructor';

export interface IProtypoConstructorContainerProps {
    editable?: boolean;
    wrapper?: JSX.Element;
    context: string;
    content: TProtypoElement[];
    changePage?: any;
    setTagCanDropPosition?: any;
    addTag?: any;
    moveTag?: any;
    copyTag?: any;
    removeTag?: any;
    selectTag?: any;
    selectedTag?: any;
    logic?: boolean;
}

interface IProtypoConstructorContainerState {
    apiHost: string;
    page: string;
}

interface IProtypoConstructorContainerDispatch {
}

const ProtypoConstructorContainer: React.SFC<IProtypoConstructorContainerState & IProtypoConstructorContainerDispatch & IProtypoConstructorContainerProps> = (props) => (
    <ProtypoConstructor {...props} />
);

const mapStateToProps = (state: IRootState) => {
    const section = state.sections.sections[state.sections.section];

    return {
        apiHost: state.auth.session.apiHost + '/api/v2',
        section: state.sections.section,
        page: section.page && section.page.name
    };
};

const mapDispatchToProps = {
};

export default connect<IProtypoConstructorContainerState, IProtypoConstructorContainerDispatch, IProtypoConstructorContainerProps>(mapStateToProps, mapDispatchToProps)(ProtypoConstructorContainer);