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
import BlockEditor from './BlockEditor';
import BlockOnlyEditor from './BlockOnlyEditor';

export interface IEditBlockProps {
    vde?: boolean;
    tabView?: boolean;
    block: { id: string, name: string, conditions: string, value: string };
}

interface IEditBlockState {
    template: string;
    conditions: string;
}

class EditBlock extends React.Component<IEditBlockProps, IEditBlockState> {
    constructor(props: IEditBlockProps) {
        super(props);
        this.state = {
            template: props.block ? props.block.value : '',
            conditions: props.block ? props.block.conditions : ''
        };
    }

    componentWillReceiveProps(props: IEditBlockProps) {
        if (props.block && this.props.block !== props.block) {
            this.setState({
                template: props.block.value,
                conditions: props.block.conditions
            });
        }
    }

    mapContractParams(values: { [key: string]: any }) {
        return {
            Id: this.props.block.id,
            Value: this.state.template,
            Conditions: this.state.conditions
        };
    }

    onSourceEdit(template: string) {
        this.setState({ template });
    }

    onConditionsEdit(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            conditions: e.target.value
        });
    }

    render() {
        if (this.props.tabView) {
            return (
                <BlockOnlyEditor
                    contractName="@1EditBlock"
                    mapContractParams={this.mapContractParams.bind(this)}
                    vde={this.props.vde}
                    template={this.state.template}
                    conditions={this.state.conditions}
                    block={this.props.block}
                    onSourceEdit={this.onSourceEdit.bind(this)}
                    onConditionsEdit={this.onConditionsEdit.bind(this)}
                />
            );
        }

        return (
            <DocumentTitle title={this.props.block && this.props.block.name}>
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
                                <FormattedMessage id="admin.interface.blocks" defaultMessage="Blocks" />
                            </li>
                            <li>
                                {this.props.block && this.props.block.name}
                            </li>
                        </ol>
                        <BlockEditor
                            contractName="@1EditBlock"
                            mapContractParams={this.mapContractParams.bind(this)}

                            vde={this.props.vde}
                            template={this.state.template}
                            conditions={this.state.conditions}
                            block={this.props.block}
                            onSourceEdit={this.onSourceEdit.bind(this)}
                            onConditionsEdit={this.onConditionsEdit.bind(this)}
                        />
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

export default EditBlock;