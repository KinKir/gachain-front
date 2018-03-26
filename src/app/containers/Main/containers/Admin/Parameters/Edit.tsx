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
import { getParameter } from 'modules/admin/actions';
import { IParameterResponse } from 'lib/api';

import DataPreloader from 'components/Animation/DataPreloader';
import Edit from 'components/Main/Admin/Parameters/Edit';

export interface IEditContainerProps {
    parameterName: string;
}

interface IEditContainerState {
    parameter: IParameterResponse;
}

interface IEditContainerDispatch {
    getParameter: typeof getParameter.started;
}

class EditContainer extends React.Component<IEditContainerProps & IEditContainerState & IEditContainerDispatch> {
    componentDidMount() {
        this.props.getParameter({
            name: this.props.parameterName
        });
    }

    componentWillReceiveProps(props: IEditContainerProps & IEditContainerState & IEditContainerDispatch) {
        if (this.props.parameterName !== props.parameterName) {
            props.getParameter({
                name: props.parameterName
            });
        }
    }

    render() {
        return (
            <DataPreloader data={[this.props.parameter]}>
                <Edit parameter={this.props.parameter} />
            </DataPreloader>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    parameter: state.admin.parameter
});

const mapDispatchToProps = {
    getParameter: getParameter.started
};

export default connect<IEditContainerState, IEditContainerDispatch, IEditContainerProps>(mapStateToProps, mapDispatchToProps)(EditContainer);