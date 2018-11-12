// MIT License
// 
// Copyright (c) 2016-2018 GACHAIN
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { IRoleInfo } from 'gachain/api';

import Modal, { ModalContainer, IModalProps } from './';
import Avatar from 'containers/Avatar';

export interface IRolePickerModalParams {
    walletID: string;
    ecosystem: string;
    ecosystemName: string;
    roles: IRoleInfo[];
}

export interface IRolePickerModalProps extends IModalProps<IRolePickerModalParams, void> {
    onSwitchWallet: (role: string) => void;
}

class RolePickerModal extends ModalContainer<IRolePickerModalProps> {
    render() {
        return (
            <div>
                <Modal.Header>
                    <FormattedMessage id="auth.role.select" defaultMessage="Role selection" />
                </Modal.Header>
                <Modal.Body>
                    <div className="pull-left">
                        <Avatar
                            size={44}
                            keyID={this.props.params.walletID}
                            ecosystem={this.props.params.ecosystem}
                        />
                    </div>
                    <div className="pl media-box-body clearfix">
                        <div>
                            <div><b>({this.props.params.ecosystem}) {this.props.params.ecosystemName}</b></div>
                            <div>
                                <span>
                                    <FormattedMessage id="auth.login.as" defaultMessage="Login with role" />:
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt">
                        {this.props.params.roles.map(r => (
                            <button key={r.id} className="btn btn-default btn-block" onClick={() => this.props.onSwitchWallet(r.id)}>
                                {r.name}
                            </button>
                        ))}
                        <button className="btn btn-link btn-block" onClick={() => this.props.onSwitchWallet(null)}>
                            <FormattedMessage id="auth.role.guest" defaultMessage="Guest" />
                        </button>
                    </div>
                </Modal.Body>
                <Modal.Footer className="text-right">
                    <Button type="button" bsStyle="primary" onClick={this.props.onCancel.bind(this)}>
                        <FormattedMessage id="cancel" defaultMessage="Cancel" />
                    </Button>
                </Modal.Footer>
            </div>
        );
    }
}
export default RolePickerModal;