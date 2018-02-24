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
import { Link } from 'react-router-dom';

import DocumentTitle from 'components/DocumentTitle';
import Heading from 'components/Heading';
import PageEditor from './PageEditor';

export interface ICreatePageProps {
    vde?: boolean;
    menus: { id: string, name: string, conditions: string, value: string }[];
    navigate: (url: string) => void;
}

interface ICreatePageState {
    template?: string;
    conditions?: string;
    menu?: { id: string, name: string, conditions: string, value: string };
}

class CreatePage extends React.Component<ICreatePageProps, ICreatePageState> {
    constructor(props: ICreatePageProps) {
        super(props);
        this.state = {
            template: '',
            menu: null
        };
    }

    componentWillReceiveProps(props: ICreatePageProps) {
        if (props.menus && !this.state.menu) {
            this.setState({
                menu: props.menus[0]
            });
        }
    }

    mapContractParams(values: { [key: string]: any }) {
        return {
            Name: values.name,
            Value: this.state.template,
            Menu: this.state.menu.name,
            Conditions: this.state.conditions
        };
    }

    onExec(block: string, error: string) {
        if (block) {
            this.props.vde ?
                this.props.navigate('/vde/interface') :
                this.props.navigate('/admin/interface');
        }
    }

    onSourceEdit(template: string) {
        this.setState({ template });
    }

    onConditionsEdit(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            conditions: e.target.value
        });
    }

    onMenuSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const menu = this.props.menus && this.props.menus.find(l => l.name === e.target.value);
        this.setState({
            menu
        });
    }

    render() {
        return (
            <DocumentTitle title="admin.interface.page.create" defaultTitle="Create page">
                <div>
                    <Heading>
                        <FormattedMessage id="admin.interface" defaultMessage="Interface" />
                    </Heading>
                    <div className="content-wrapper">
                        <ol className="breadcrumb">
                            <li>
                                <Link to={this.props.vde ? '/vde/interface' : '/admin/interface'}>
                                    <FormattedMessage id="admin.interface" defaultMessage="Interface" />
                                </Link>
                            </li>
                            <li>
                                <FormattedMessage id="admin.interface.page.create" defaultMessage="Create page" />
                            </li>
                        </ol>
                        <PageEditor
                            contractName="@1NewPage"
                            mapContractParams={this.mapContractParams.bind(this)}

                            vde={this.props.vde}
                            template={this.state.template}
                            conditions={this.state.conditions}
                            menu={this.state.menu}
                            menus={this.props.menus || []}
                            onConditionsEdit={this.onConditionsEdit.bind(this)}
                            onSourceEdit={this.onSourceEdit.bind(this)}
                            onMenuSelect={this.onMenuSelect.bind(this)}
                            onExec={this.onExec.bind(this)}
                        />
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

export default CreatePage;