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
import { columnTypes } from './Create';
import { ITableResponse } from 'lib/api';

import LocalizedDocumentTitle from 'components/DocumentTitle/LocalizedDocumentTitle';
import Heading from 'components/Heading';
import PageLink from 'containers/Routing/PageLink';
import ValidatedContractForm from 'containers/Widgets/ValidatedContractForm';
import Validation from 'components/Validation';

export interface IEditColumnProps {
    tableStruct: ITableResponse;
    column: { name: string, type: string, index: boolean, permissions: string };
}

interface IEditColumnState {
    readPermissions: string;
    updatePermissions: string;
}

export default class EditColumn extends React.Component<IEditColumnProps, IEditColumnState> {
    constructor(props: IEditColumnProps) {
        super(props);
        this.state = props.column ?
            this.mapColumnPermissions(props.column.permissions) :
            this.mapColumnPermissions('');
    }

    componentWillReceiveProps(props: IEditColumnProps) {
        if (!this.props.column && props.column) {
            this.setState(this.mapColumnPermissions(props.column.permissions));
        }
    }

    mapColumnPermissions(plain: string) {
        try {
            const json = JSON.parse(plain);
            if ('object' !== typeof json) {
                throw 'E_OLD_CONDITIONS';
            }

            return {
                updatePermissions: json.update,
                readPermissions: json.read
            };
        }
        catch {
            return {
                updatePermissions: plain,
                readPermissions: null
            };
        }
    }

    mapContractParams(values: { [key: string]: any }) {
        return {
            TableName: this.props.tableStruct.name,
            Name: this.props.column.name,
            Permissions: false ? JSON.stringify({
                ...(this.state.updatePermissions && { update: this.state.updatePermissions }),
                ...(this.state.readPermissions && { read: this.state.readPermissions })
            }) : this.state.updatePermissions
        };
    }

    onReadPermissionsChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            readPermissions: e.target.value
        });
    }

    onUpdatePermissionsChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            updatePermissions: e.target.value
        });
    }

    render() {
        const columnDef = columnTypes.find(l => l.name === (this.props.column && this.props.column.type));
        const columnType = columnDef && columnDef.title;

        return (
            <LocalizedDocumentTitle title="admin.tables.column.edit" defaultTitle="Edit column">
                <div>
                    <Heading>
                        <FormattedMessage id="admin.tables" defaultMessage="Tables" />
                    </Heading>
                    <div className="content-wrapper">
                        <ol className="breadcrumb">
                            <li>
                                <PageLink page="tables">
                                    <FormattedMessage id="admin.tables" defaultMessage="Tables" />
                                </PageLink>
                            </li>
                            {this.props.tableStruct && (
                                <li>
                                    <PageLink page="table" params={{ table: this.props.tableStruct.name }}>
                                        {this.props.tableStruct.name}
                                    </PageLink>
                                </li>
                            )}
                            {this.props.tableStruct && (
                                <li>
                                    <PageLink page="edit-table" params={{ table: this.props.tableStruct.name }}>
                                        <FormattedMessage id="admin.tables.edit" defaultMessage="Edit" />
                                    </PageLink>
                                </li>
                            )}
                            <li>
                                <FormattedMessage id="admin.tables.column.edit" defaultMessage="Edit column" />
                            </li>
                        </ol>
                        <ValidatedContractForm contractName="@1EditColumn" mapContractParams={this.mapContractParams.bind(this)}>
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <div className="form-group">
                                        <label>
                                            <FormattedMessage id="admin.tables.column" defaultMessage="Column" />
                                        </label>
                                        <p className="form-control-static">
                                            {this.props.column && this.props.column.name}
                                        </p>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <FormattedMessage id="admin.tables.column.type" defaultMessage="Type" />
                                        </label>
                                        <p className="form-control-static">
                                            {columnType || (
                                                <span className="text-muted">
                                                    <FormattedMessage id="admin.tables.column.type.unknown" defaultMessage="Unknown" />
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    {false && (
                                        <Validation.components.ValidatedFormGroup for="readperm">
                                            <label htmlFor="readperm">
                                                <FormattedMessage id="admin.tables.permissions.read" defaultMessage="Read permissions" />
                                            </label>
                                            <Validation.components.ValidatedTextarea name="readperm" value={this.state.readPermissions} onChange={this.onReadPermissionsChange.bind(this)} />
                                        </Validation.components.ValidatedFormGroup>
                                    )}
                                    <Validation.components.ValidatedFormGroup for="updateperm" className="mb0">
                                        <label htmlFor="updateperm">
                                            <FormattedMessage id="admin.tables.permissions.update" defaultMessage="Update permissions" />
                                        </label>
                                        <Validation.components.ValidatedTextarea name="updateperm" validators={[Validation.validators.required]} value={this.state.updatePermissions} onChange={this.onUpdatePermissionsChange.bind(this)} />
                                    </Validation.components.ValidatedFormGroup>
                                </div>
                                <div className="panel-footer">
                                    <Validation.components.ValidatedSubmit bsStyle="primary">
                                        <FormattedMessage id="admin.save" defaultMessage="Save" />
                                    </Validation.components.ValidatedSubmit>
                                </div>
                            </div>
                        </ValidatedContractForm>
                    </div>
                </div>
            </LocalizedDocumentTitle>
        );
    }
}