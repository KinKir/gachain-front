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
import { FormattedMessage } from 'react-intl';
import { columnDisplayRules } from './Tables/View';

import Table, { ICellRenderer } from 'components/Table';

export interface IHistoryProps {
    id: string;
    table: string;
    columns: {
        name: string;
        type: string;
        perm: string;
        index: string;
    }[];
    data: {
        [key: string]: string;
    }[];
}

const renderValue: ICellRenderer = (value: { type: string, value: any }, rowData) => {
    const displayRule = columnDisplayRules[value.type];
    if (displayRule) {
        return (
            <div>{displayRule.render(value.value)}</div>
        );
    }
    else {
        return (
            <div>{value.value && value.value.toString()}</div>
        );
    }
};

const HistoryViewer: React.SFC<IHistoryProps> = (props) => props.data && props.data.length ?
    (
        <Table
            striped
            renderCell={renderValue}
            columns={props.columns.map(column => ({
                title: column.name,
                sortable: false
            }))}
            data={
                props.data.map(row =>
                    props.columns.map(column => ({
                        type: column.type,
                        value: row[column.name]
                    }))
                )
            }
        />
    ) :
    (
        <div className="content-wrapper">
            <FormattedMessage id="admin.tables.history.empty" defaultMessage="This element has no history" />
        </div>
    );

export default HistoryViewer;