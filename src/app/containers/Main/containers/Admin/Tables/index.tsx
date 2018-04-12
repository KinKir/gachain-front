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
import { getTables } from 'modules/admin/actions';
import { ITablesResponse } from 'gachain/api';

import DataPreloader from 'components/Animation/DataPreloader';
import Tables from 'components/Main/Admin/Tables';

export interface ITablesContainerProps {
    match?: { params: { tableName: string } };
}

interface ITablesContainerState {
    tables: ITablesResponse;
}

interface ITablesContainerDispatch {
    getTables: typeof getTables.started;
}

class TablesContainer extends React.Component<ITablesContainerProps & ITablesContainerState & ITablesContainerDispatch> {
    componentDidMount() {
        this.props.getTables({});
    }

    render() {
        return (
            <DataPreloader data={[this.props.tables]}>
                <Tables tables={this.props.tables} />
            </DataPreloader>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    tables: state.admin.tables
});

const mapDispatchToProps = {
    getTables: getTables.started
};

export default connect<ITablesContainerState, ITablesContainerDispatch, ITablesContainerProps>(mapStateToProps, mapDispatchToProps)(TablesContainer);