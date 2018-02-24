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
import { Button, Row, Col } from 'react-bootstrap';
import { sendAttachment } from 'lib/fs';

import Wrapper from 'components/Wrapper';
import ImportTable from './ImportTable';
import ImportTableData from './ImportTableData';
import TabView from 'components/TabView';
import TxButton from 'containers/Widgets/TxButton';

export interface IImportProps {
    vde?: boolean;
    payload: {
        pages: { Name: string }[];
        blocks: { Name: string }[];
        menus: { Name: string }[];
        parameters: { Name: string }[];
        languages: { Name: string }[];
        contracts: { Name: string }[];
        tables: { Name: string }[];
        data: {
            Table: string;
            Columns: string[];
            Data: any[][];
        }[];
    };
    importData: (payload: File) => void;
    onPrunePage: (name: string) => void;
    onPruneBlock: (name: string) => void;
    onPruneMenu: (name: string) => void;
    onPruneParameter: (name: string) => void;
    onPruneLanguage: (name: string) => void;
    onPruneContract: (name: string) => void;
    onPruneTable: (name: string) => void;
    onPruneData: (table: string, index: number) => void;
}

class Import extends React.Component<IImportProps & InjectedIntlProps> {
    onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        // TODO: Set backup max size
        if (e.target.files && e.target.files[0]) {
            this.props.importData(e.target.files[0]);
        }
    }

    onSave() {
        sendAttachment('backup.sim', JSON.stringify(this.props.payload));
    }

    isPristine() {
        return !this.props.payload || (
            0 === this.props.payload.blocks.length &&
            0 === this.props.payload.menus.length &&
            0 === this.props.payload.pages.length &&
            0 === this.props.payload.parameters.length &&
            0 === this.props.payload.languages.length &&
            0 === this.props.payload.contracts.length &&
            0 === this.props.payload.tables.length &&
            0 === this.props.payload.data.length
        );
    }

    renderItem(title: string, items: string[], badge: number) {
        return items.length ? (
            <div className="list-group m0">
                <div className="list-group-item">
                    <div className="media-box">
                        <div className="media-box-body clearfix">
                            <small className="text-muted pull-right ml">
                                ({badge})
                            </small>
                            <div className="media-box-heading">
                                <div className="m0">
                                    {title}
                                </div>
                            </div>
                            <p className="m0">
                                <small>
                                    {items.length ?
                                        (
                                            <span>{items.join(', ')}</span>
                                        ) :
                                        (
                                            <span className="text-muted">
                                                <FormattedMessage id="admin.export.selection.empty" defaultMessage="Nothing selected" />
                                            </span>
                                        )
                                    }
                                </small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }

    renderTabsContent() {
        let tabs: JSX.Element[] = [];
        if (this.props.payload.pages.length) {
            tabs.push(
                <ImportTable
                    key="pages"
                    dataKey="Name"
                    payload={this.props.payload.pages}
                    onPrune={this.props.onPrunePage.bind(this)}
                />
            );
        }
        if (this.props.payload.blocks.length) {
            tabs.push(
                <ImportTable
                    key="blocks"
                    dataKey="Name"
                    payload={this.props.payload.blocks}
                    onPrune={this.props.onPruneBlock.bind(this)}
                />
            );
        }
        if (this.props.payload.menus.length) {
            tabs.push(
                <ImportTable
                    key="menus"
                    dataKey="Name"
                    payload={this.props.payload.menus}
                    onPrune={this.props.onPruneMenu.bind(this)}
                />
            );
        }
        if (this.props.payload.parameters.length) {
            tabs.push(
                <ImportTable
                    key="parameters"
                    dataKey="Name"
                    payload={this.props.payload.parameters}
                    onPrune={this.props.onPruneParameter.bind(this)}
                />
            );
        }
        if (this.props.payload.languages.length) {
            tabs.push(
                <ImportTable
                    key="languages"
                    dataKey="Name"
                    payload={this.props.payload.languages}
                    onPrune={this.props.onPruneLanguage.bind(this)}
                />
            );
        }
        if (this.props.payload.contracts.length) {
            tabs.push(
                <ImportTable
                    key="contracts"
                    dataKey="Name"
                    payload={this.props.payload.contracts}
                    onPrune={this.props.onPruneContract.bind(this)}
                />
            );
        }
        if (this.props.payload.tables.length) {
            tabs.push(
                <ImportTable
                    key="tables"
                    dataKey="Name"
                    payload={this.props.payload.tables}
                    onPrune={this.props.onPruneTable.bind(this)}
                />
            );
        }
        if (this.props.payload.data.length) {
            tabs.push(
                <ImportTableData
                    key="data"
                    payload={this.props.payload.data}
                    onPrune={this.props.onPruneData.bind(this)}
                />
            );
        }

        return tabs;
    }

    render() {
        let tabs = [];

        if (this.props.payload) {
            if (this.props.payload.pages.length) { tabs.push(this.props.intl.formatMessage({ id: 'admin.interface.pages', defaultMessage: 'Pages' })); }
            if (this.props.payload.blocks.length) { tabs.push(this.props.intl.formatMessage({ id: 'admin.interface.blocks', defaultMessage: 'Blocks' })); }
            if (this.props.payload.menus.length) { tabs.push(this.props.intl.formatMessage({ id: 'admin.interface.menu', defaultMessage: 'Menu' })); }
            if (this.props.payload.parameters.length) { tabs.push(this.props.intl.formatMessage({ id: 'admin.parameters.short', defaultMessage: 'Parameters' })); }
            if (this.props.payload.languages.length) { tabs.push(this.props.intl.formatMessage({ id: 'admin.languages.short', defaultMessage: 'Languages' })); }
            if (this.props.payload.contracts.length) { tabs.push(this.props.intl.formatMessage({ id: 'admin.contracts.short', defaultMessage: 'Contracts' })); }
            if (this.props.payload.tables.length) { tabs.push(this.props.intl.formatMessage({ id: 'admin.tables', defaultMessage: 'Tables' })); }
            if (this.props.payload.data.length) { tabs.push(this.props.intl.formatMessage({ id: 'admin.tables.data', defaultMessage: 'Table data' })); }
        }

        return (
            <Wrapper
                type="default"
                title={{
                    title: 'admin.import',
                    defaultTitle: 'Import'
                }}
                heading={{
                    content: (
                        <FormattedMessage id="admin.import" defaultMessage="Import" />
                    )
                }}
                description={
                    <FormattedMessage id="admin.import.description" defaultMessage="Select payload that you want to import. Import editor tool will be shown to allow you to view, edit and reorder provided data before doing actual import" />
                }
            >
                <div className="form-control">
                    <input type="file" onChange={this.onFileSelect.bind(this)} />
                </div>
                <hr className="mt0" />
                {this.props.payload ? (
                    <Row>
                        <Col md={8} lg={9}>
                            <TabView
                                className="p0"
                                tabs={tabs}
                            >
                                {this.renderTabsContent()}
                            </TabView>
                        </Col>
                        <Col md={4} lg={3}>
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <FormattedMessage id="admin.export.selected" defaultMessage="Selected items" />
                                </div>

                                <div className="list-group">
                                    {this.renderItem(this.props.intl.formatMessage(
                                        { id: 'admin.interface.pages', defaultMessage: 'Pages' }),
                                        this.props.payload.pages.map(l => l.Name),
                                        this.props.payload.pages.length
                                    )}
                                    {this.renderItem(this.props.intl.formatMessage(
                                        { id: 'admin.interface.blocks', defaultMessage: 'Blocks' }),
                                        this.props.payload.blocks.map(l => l.Name),
                                        this.props.payload.blocks.length
                                    )}
                                    {this.renderItem(this.props.intl.formatMessage(
                                        { id: 'admin.interface.menu', defaultMessage: 'Menu' }),
                                        this.props.payload.menus.map(l => l.Name),
                                        this.props.payload.menus.length
                                    )}
                                    {this.renderItem(this.props.intl.formatMessage(
                                        { id: 'admin.parameters.short', defaultMessage: 'Parameters' }),
                                        this.props.payload.parameters.map(l => l.Name),
                                        this.props.payload.parameters.length
                                    )}
                                    {this.renderItem(this.props.intl.formatMessage(
                                        { id: 'admin.languages', defaultMessage: 'Language resources' }),
                                        this.props.payload.languages.map(l => l.Name),
                                        this.props.payload.languages.length
                                    )}
                                    {this.renderItem(this.props.intl.formatMessage(
                                        { id: 'admin.contracts', defaultMessage: 'Smart contracts' }),
                                        this.props.payload.contracts.map(l => l.Name),
                                        this.props.payload.contracts.length
                                    )}
                                    {this.renderItem(this.props.intl.formatMessage(
                                        { id: 'admin.tables', defaultMessage: 'Tables' }),
                                        this.props.payload.tables.map(l => l.Name),
                                        this.props.payload.tables.length
                                    )}
                                    {this.renderItem(this.props.intl.formatMessage(
                                        { id: 'admin.tables.data', defaultMessage: 'Table data' }),
                                        this.props.payload.data.map(l => l.Table),
                                        this.props.payload.data.length
                                    )}
                                </div>

                                <div className="panel-footer clearfix">
                                    <Button onClick={this.onSave.bind(this)}>
                                        <FormattedMessage id="admin.import.save" defaultMessage="Save changes" />
                                    </Button>

                                    <div className="pull-right">
                                        <TxButton className="btn btn-primary" vde={this.props.vde} contractName="@1Import" contractParams={{ Data: JSON.stringify(this.props.payload) }} disabled={this.isPristine()}>
                                            <FormattedMessage id="admin.import.confirm" defaultMessage="Import" />
                                        </TxButton>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                ) : null}
            </Wrapper>
        );
    }
}

export default injectIntl(Import);