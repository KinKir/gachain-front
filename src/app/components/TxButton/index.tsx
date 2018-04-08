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
import { injectIntl, InjectedIntlProps } from 'react-intl';

export interface ITxButtonConfirm {
    icon: string;
    title: string;
    text: string;
    confirmButton: string;
    cancelButton: string;
}

export interface ITxButtonProps {
    disabled?: boolean;
    pending?: boolean;
    className?: string;
    contractName?: string;
    contractParams?: { [key: string]: any } | (() => { [key: string]: any });
    contractStatus?: { block: string, error?: { type: string, error: string } };
    confirm?: ITxButtonConfirm;
    page?: string;
    pageParams?: { [key: string]: any };
    execContract: (contractName: string, contractParams: { [key: string]: any }, confirm?: ITxButtonConfirm) => void;
    navigate: (page: string, params: { [key: string]: any }, confirm?: ITxButtonConfirm) => void;
    onExec?: (block: string, error?: { type: string, error: string }) => void;
}

class TxButton extends React.Component<ITxButtonProps & InjectedIntlProps> {
    componentWillReceiveProps(props: ITxButtonProps) {
        // Received non-empty transaction status, proceed to actions
        if (!props.pending && props.contractStatus && this.props.contractStatus !== props.contractStatus) {
            if (props.contractStatus.block) {
                if (this.props.page) {
                    this.props.navigate(this.props.page, this.props.pageParams);
                }
            }

            if (this.props.onExec) {
                this.props.onExec(props.contractStatus.block, props.contractStatus.error);
            }
        }
    }

    onClick() {
        if (this.props.contractName) {
            this.props.execContract(this.props.contractName, this.props.contractParams, this.props.confirm);
        }
        else if (this.props.page) {
            this.props.navigate(this.props.page, this.props.pageParams, this.props.confirm);
        }
    }

    render() {
        return (
            <button
                type="button"
                onClick={this.onClick.bind(this)}
                disabled={this.props.disabled || this.props.pending}
                className={this.props.className}
            >
                {this.props.children}
            </button>
        );
    }
}

export default injectIntl(TxButton);