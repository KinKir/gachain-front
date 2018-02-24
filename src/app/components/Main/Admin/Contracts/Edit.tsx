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
import { FormControlProps } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { getContract } from 'modules/admin/actions';

import Wrapper from 'components/Wrapper';
import ContractEditor from './ContractEditor';

export interface IEditProps {
    vde?: boolean;
    tabView?: boolean;
    contract: {
        id: string;
        active: string;
        name: string;
        conditions: string;
        address: string;
        value: string;
    };
    getContract: typeof getContract.started;
}

interface IEditState {
    bound: boolean;
    code: string;
    wallet: string;
    conditions: string;
}

class Edit extends React.Component<IEditProps, IEditState> {
    constructor(props: IEditProps) {
        super(props);
        this.state = props.contract ?
            {
                bound: '1' === props.contract.active,
                code: props.contract.value,
                conditions: props.contract.conditions,
                wallet: props.contract.address
            } : {
                bound: false,
                code: '',
                conditions: '',
                wallet: ''
            };
    }

    componentWillReceiveProps(props: IEditProps) {
        if (props.contract && this.props.contract !== props.contract) {
            this.setState({
                bound: '1' === props.contract.active,
                code: props.contract.value,
                conditions: props.contract.conditions,
                wallet: props.contract.address
            });
        }
    }

    mapContractParams(values: { [key: string]: any }) {
        return {
            Id: this.props.contract.id,
            Value: this.state.code,
            Conditions: this.state.conditions
        };
    }

    setBound(bound: boolean) {
        this.setState({
            bound
        });
    }

    onContractActivation(block: string, error: string) {
        if (block) {
            this.props.getContract({
                id: this.props.contract.id,
                vde: this.props.vde
            });
        }
    }

    onSourceEdit(code: string) {
        this.setState({ code });
    }

    onConditionsEdit(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            conditions: e.target.value
        });
    }

    onWalletEdit(e: React.ChangeEvent<FormControlProps>) {
        this.setState({
            wallet: e.target.value as string
        });
    }

    render() {
        if (this.props.tabView) {
            return (
                <div className="fullscreen-wrapper">
                    <ContractEditor
                        vde={this.props.vde}
                        contractName="@1EditContract"
                        mapContractParams={this.mapContractParams.bind(this)}

                        bound={this.state.bound}
                        code={this.state.code}
                        wallet={this.state.wallet}
                        conditions={this.state.conditions}
                        contract={this.props.contract}
                        setBound={this.setBound.bind(this)}
                        onSourceEdit={this.onSourceEdit.bind(this)}
                        onWalletEdit={this.onWalletEdit.bind(this)}
                        onConditionsEdit={this.onConditionsEdit.bind(this)}
                    />
                </div>
            );
        }

        return (
            <Wrapper
                type="noscroll"
                title={{
                    title: 'admin.contracts.edit',
                    defaultTitle: 'Edit contract'
                }}
                heading={{
                    content: (
                        <FormattedMessage id="admin.contracts" defaultMessage="Smart contracts" />
                    )
                }}
                breadcrumbs={[
                    {
                        url: this.props.vde ? '/vde/contracts' : '/admin/contracts',
                        title: (
                            <FormattedMessage id="admin.contracts" defaultMessage="Smart contracts" />
                        )
                    },
                    {
                        title: (
                            <FormattedMessage id="admin.edit" defaultMessage="Edit" />
                        )
                    }
                ]}
            >
                <ContractEditor
                    bound={this.state.bound}
                    vde={this.props.vde}
                    contractName="@1EditContract"
                    mapContractParams={this.mapContractParams.bind(this)}

                    code={this.state.code}
                    wallet={this.state.wallet}
                    conditions={this.state.conditions}
                    contract={this.props.contract}
                    setBound={this.setBound.bind(this)}
                    onSourceEdit={this.onSourceEdit.bind(this)}
                    onWalletEdit={this.onWalletEdit.bind(this)}
                    onConditionsEdit={this.onConditionsEdit.bind(this)}
                />
            </Wrapper>
        );
    }
}

export default Edit;