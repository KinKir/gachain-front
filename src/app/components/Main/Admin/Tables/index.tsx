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
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ITablesResponse } from 'lib/api';

import Wrapper from 'components/Wrapper';
import Table, { ICellRenderer } from 'components/Table';

export interface ITablesProps {
    vde?: boolean;
    tables: ITablesResponse;
}

const renderTable: ICellRenderer = (value, rowData) => {
    switch (rowData.colIndex) {
        case 0: return (
            <div className="text-bold">
                {value}
            </div>
        );

        case 2: return '0' === rowData.rowData[1] ?
            (
                <Button bsStyle="primary" disabled>
                    <FormattedMessage id="admin.tables.show" defaultMessage="Show" />
                </Button>
            ) : (
                <Link to={`/${rowData.rowData[2] ? 'vde' : 'admin'}/tables/${rowData.rowData[0]}`}>
                    <Button bsStyle="primary">
                        <FormattedMessage id="admin.tables.show" defaultMessage="Show" />
                    </Button>
                </Link>
            );

        case 3: return (
            <Link to={`/${rowData.rowData[2] ? 'vde' : 'admin'}/tables/${rowData.rowData[0]}/edit`}>
                <Button bsStyle="primary" type="button">
                    <FormattedMessage id="admin.tables.edit" defaultMessage="Edit" />
                </Button>
            </Link>
        );

        default: return value;
    }
};

const Tables: React.SFC<ITablesProps & InjectedIntlProps> = (props) => (
    <Wrapper
        type="fullscreen"
        title={{
            title: 'admin.tables',
            defaultTitle: 'Tables'
        }}
        heading={{
            content: (
                <FormattedMessage id="admin.tables" defaultMessage="Tables" />
            ),
            toolButtons: [
                {
                    url: props.vde ? '/vde/tables/create' : '/admin/tables/create',
                    icon: 'icon-plus',
                    title: (
                        <FormattedMessage id="admin.tables.create" defaultMessage="Create" />
                    )
                }
            ]
        }}
        breadcrumbs={[
            {
                title: (
                    <FormattedMessage id="admin.tables" defaultMessage="Tables" />
                )
            }
        ]}
    >
        <Table
            striped
            renderCell={renderTable}
            columns={[
                { title: props.intl.formatMessage({ id: 'admin.tables.name', defaultMessage: 'Name' }), sortable: true },
                { title: props.intl.formatMessage({ id: 'admin.tables.count', defaultMessage: 'Count' }), sortable: true, width: 1 },
                { width: 1 },
                { width: 1 }
            ]}
            data={props.tables.list.map(p => [p.name, p.count, props.vde])}
        />
    </Wrapper>
);

export default injectIntl(Tables);