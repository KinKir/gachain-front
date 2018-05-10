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
    const section = state.content.sections[state.content.section];

    return {
        apiHost: state.auth.session.apiHost + '/api/v2',
        section: state.content.section,
        page: section.page && section.page.name
    };
};

const mapDispatchToProps = {
};

export default connect<IProtypoConstructorContainerState, IProtypoConstructorContainerDispatch, IProtypoConstructorContainerProps>(mapStateToProps, mapDispatchToProps)(ProtypoConstructorContainer);