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
import { getTable } from 'modules/admin/actions';
import { ITableResponse, IListResponse } from 'lib/api';

import View, { columnDisplayRules } from 'components/Main/Admin/Tables/View';

export interface IViewContainerProps {
    vde?: boolean;
    match?: { params: { tableName: string } };
}

interface IViewContainerState {
    tableData: IListResponse;
    table: ITableResponse;
}

interface IViewContainerDispatch {
    getTable: typeof getTable.started;
}

class ViewContainer extends React.Component<IViewContainerProps & IViewContainerState & IViewContainerDispatch> {
    componentDidMount() {
        const columnTypes = [];
        for (let itr in columnDisplayRules) {
            if (columnDisplayRules.hasOwnProperty(itr)) {
                const columnDef = columnDisplayRules[itr];
                if (!columnDef.disabled) {
                    columnTypes.push(itr);
                }
            }
        }
        this.props.getTable({
            table: this.props.match.params.tableName,
            columnTypes,
            vde: this.props.vde
        });
    }

    render() {
        return (
            <View vde={this.props.vde} tableName={this.props.match.params.tableName} table={this.props.table} tableData={this.props.tableData} />
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    table: state.admin.table,
    tableData: state.admin.tableData
});

const mapDispatchToProps = {
    getTable: getTable.started
};

export default connect<IViewContainerState, IViewContainerDispatch, IViewContainerProps>(mapStateToProps, mapDispatchToProps)(ViewContainer);