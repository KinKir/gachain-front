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

import Wrapper from 'components/Wrapper';
import PageLink from 'containers/Routing/PageLink';
import Table, { ICellRenderer } from 'components/Table';

export interface IContractsProps {
    contracts: {
        id: string;
        name: string;
        value: string;
        wallet_id: string;
        address: string;
        conditions: string;
        token_id: string;
        active: string;
    }[];
}

const renderCell: ICellRenderer = (data, rowData) => {
    switch (rowData.colIndex) {
        case 0: return (
            <div className="text-bold">
                {data}
            </div>
        );

        case 3: return (
            <div className="text-center">
                {'1' === data ?
                    (
                        <em className="fa fa-check" />
                    ) : (
                        <span className="text-muted">-</span>
                    )
                }
            </div>
        );

        case 4: return (
            <div>
                <PageLink className="btn btn-link" section="editor" page="editor" params={{ open: 'contract', name: rowData.rowData[1] }}>
                    <FormattedMessage id="admin.contracts.edit" defaultMessage="Edit" />
                </PageLink>
                {!rowData.rowData[4] && (
                    <PageLink className="btn btn-link" page="history" params={{ table: 'contracts', id: rowData.rowData[0] }}>
                        <FormattedMessage id="admin.contracts.history" defaultMessage="History" />
                    </PageLink>
                )}
            </div>
        );

        default: return data;
    }
};

const Contracts: React.SFC<IContractsProps & InjectedIntlProps> = (props) => (
    <Wrapper
        type="fullscreen"
        title={{
            title: 'admin.contracts',
            defaultTitle: 'Smart contracts'
        }}
        heading={{
            content: (
                <FormattedMessage id="admin.contracts" defaultMessage="Smart contracts" />
            ),
            toolButtons: [
                {
                    url: '/editor/editor?create=contract',
                    icon: 'icon-plus',
                    title: (
                        <FormattedMessage id="admin.contracts.create" defaultMessage="Create contract" />
                    )
                }
            ]
        }}
        description={
            <FormattedMessage id="admin.contracts.description" defaultMessage="This section is used to create or modify Smart-Contracts. They are used to create or modify data stored in database tables. Access rights for all operations are also managed by Smart-Contracts" />
        }
    >
        <Table
            striped
            renderCell={renderCell}
            data={props.contracts.map(contract => [contract.id, contract.name, contract.address, contract.active])}
            columns={[
                { title: 'ID', sortable: true, width: 80 },
                { title: props.intl.formatMessage({ id: 'admin.contracts.name', defaultMessage: 'Name' }), sortable: true },
                { title: props.intl.formatMessage({ id: 'admin.contracts.wallet', defaultMessage: 'Wallet' }), sortable: true, width: 200 },
                { title: props.intl.formatMessage({ id: 'admin.contracts.bound', defaultMessage: 'Bound' }), sortable: true, width: 1 },
                { width: 100 }
            ]}
        />
    </Wrapper>
);

export default injectIntl(Contracts);