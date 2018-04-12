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
import { Button } from 'react-bootstrap';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { IParamResponse } from 'gachain/api';

import Wrapper from 'components/Wrapper';
import PageLink from 'containers/Routing/PageLink';
import Table, { ICellRenderer } from 'components/Table';

export interface IParametersProps {
    parameters: IParamResponse[];
}

const renderParameter: ICellRenderer = (value, rowData) => {
    switch (rowData.colIndex) {
        case 0: return (
            <div className="text-bold">
                {value}
            </div>
        );

        case 1: return value ? value : (
            <em className="text-muted">
                <FormattedMessage id="admin.parameters.empty" defaultMessage="Empty parameter" />
            </em>
        );

        case 3: return (
            <PageLink page="edit-parameter" params={{ name: rowData.rowData[0] }}>
                <Button bsStyle="default" className="btn-labeled btn-icon">
                    <span className="btn-label">
                        <em className="icon-pencil" />
                    </span>
                </Button>
            </PageLink>
        );

        default: return value;
    }
};

const Parameters: React.SFC<IParametersProps & InjectedIntlProps> = (props) => (
    <Wrapper
        type="fullscreen"
        title={{
            title: 'admin.parameters',
            defaultTitle: 'Ecosystem parameters'
        }}
        heading={{
            content: (
                <FormattedMessage id="admin.parameters" defaultMessage="Ecosystem parameters" />
            ),
            toolButtons: [
                {
                    url: '/admin/stylesheet',
                    icon: 'icon-picture',
                    title: (
                        <FormattedMessage id="admin.parameters.stylesheet" defaultMessage="Manage stylesheet" />
                    )
                },
                {
                    url: '/admin/create-parameter',
                    icon: 'icon-picture',
                    title: (
                        <FormattedMessage id="admin.parameters.create" defaultMessage="Create" />
                    )
                }
            ]
        }}
        description={
            <FormattedMessage id="admin.languages.description" defaultMessage="This section is used to configure stored reusable parameters. They are used to control basic ecosystem behavior, but you can create your own ones and use them in the template engine or smart-contracts" />
        }
    >
        <Table
            striped
            renderCell={renderParameter}
            columns={[
                { title: props.intl.formatMessage({ id: 'admin.parameters.name', defaultMessage: 'Name' }), sortable: true, width: 160 },
                { title: props.intl.formatMessage({ id: 'admin.parameters.value', defaultMessage: 'Value' }), sortable: true },
                { title: props.intl.formatMessage({ id: 'admin.conditions.change', defaultMessage: 'Conditions' }), sortable: true, width: 250 },
                { width: 1 }
            ]}
            data={props.parameters.map(p => [p.name, p.value, p.conditions])}
        />
    </Wrapper>
);

export default injectIntl(Parameters);