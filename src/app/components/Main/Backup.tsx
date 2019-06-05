/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import { Button, Panel } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import keyring from 'lib/keyring';
import { sendAttachment } from 'lib/fs';
import { IAccountContext } from 'gachain/auth';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';

import Wrapper from 'components/Wrapper';
import Validation from 'components/Validation';

export interface IBackupProps {
    wallet: IAccountContext;
    privateKey: string;
    onError?: () => any;
    onCopy?: () => any;
}

interface IBackupState {
    privateKey: string;
    publicKey: string;
}

class Backup extends React.Component<IBackupProps, IBackupState> {
    constructor(props: IBackupProps) {
        super(props);
        this.state = {
            privateKey: props.privateKey,
            publicKey: props.privateKey ? keyring.generatePublicKey(props.privateKey) : null
        };
    }

    onSubmit = (values: { [key: string]: string }) => {
        const privateKey = keyring.decryptAES(this.props.wallet.wallet.encKey, values.password);

        if (keyring.validatePrivateKey(privateKey)) {
            const publicKey = keyring.generatePublicKey(privateKey);
            this.setState({
                privateKey,
                publicKey
            });
        }
        else {
            this.props.onError();
        }
    }

    onKeyDownlaod = () => {
        sendAttachment('key.txt', this.props.privateKey);
    }

    formatKey = (key: string) => {
        return key.match(/.{1,2}/g).join(' ');
    }

    renderFirst() {
        return (
            <Panel
                bsStyle="default"
                footer={(
                    <div className="clearfix">
                        <div className="pull-right">
                            <Button bsStyle="primary" type="submit">
                                <FormattedMessage id="general.backup.create" defaultMessage="Create backup" />
                            </Button>
                        </div>
                    </div>
                )}
            >
                <Validation.components.ValidatedFormGroup for="password">
                    <label htmlFor="password">
                        <FormattedMessage id="auth.password" defaultMessage="Password" />
                        <strong className="text-danger">*</strong>
                    </label>
                    <Validation.components.ValidatedControl type="password" name="password" validators={[Validation.validators.required]} />
                </Validation.components.ValidatedFormGroup>
            </Panel>
        );
    }

    renderSecond() {
        return (
            <Panel
                bsStyle="default"
                footer={(
                    <div className="clearfix">
                        <div className="pull-right">
                            <Button bsStyle="primary" onClick={this.onKeyDownlaod}>
                                <FormattedMessage id="general.download.asfile" defaultMessage="Download as file" />
                            </Button>
                        </div>
                    </div>
                )}
            >
                <table className="table table-striped table-bordered table-hover preline" style={{ wordBreak: 'break-all' }}>
                    <tbody>
                        <tr>
                            <td style={{ minWidth: 100 }}>
                                <FormattedMessage id="general.key.private" defaultMessage="Private key" />
                            </td>
                            <td>
                                <span>
                                    {this.state.privateKey}
                                </span>
                                <CopyToClipboard text={this.props.privateKey} onCopy={this.props.onCopy}>
                                    <Button bsStyle="link" className="p0 ml" style={{ verticalAlign: 'top' }}>
                                        <FormattedMessage id="general.clipboard.copy" defaultMessage="Copy to clipboard" />
                                    </Button>
                                </CopyToClipboard>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ minWidth: 100 }}>
                                <FormattedMessage id="general.key.public" defaultMessage="Public key" />
                            </td>
                            <td>{this.state.publicKey}</td>
                        </tr>
                        <tr>
                            <td>
                                <FormattedMessage id="general.address" defaultMessage="Address" />
                            </td>
                            <td>{this.props.wallet.wallet.address}</td>
                        </tr>
                        <tr>
                            <td>
                                <FormattedMessage id="auth.qrcode" defaultMessage="QR-Code" />
                            </td>
                            <td>
                                <div className="text-center">
                                    <QRCode value={this.props.privateKey || this.state.privateKey} />
                                    <div className="text-muted">
                                        <FormattedMessage id="auth.qrcode.desc" defaultMessage="Use this code to import the account on your mobile device" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Panel>
        );
    }

    render() {
        return (
            <Wrapper
                type="default"
                title={{
                    title: 'general.wallet.backup',
                    defaultTitle: 'Backup wallet'
                }}
                heading={{
                    content: (
                        <FormattedMessage id="general.wallet.backup" defaultMessage="Backup account" />
                    )
                }}
                description={
                    <FormattedMessage id="general.wallet.backup" defaultMessage="This section is used to backup your account data. You will not be able to restore access to your account if you forget your password or lose the private key" />
                }
            >
                {this.props.wallet && (
                    <Validation.components.ValidatedForm onSubmitSuccess={this.onSubmit}>
                        {this.state.privateKey ? this.renderSecond() : this.renderFirst()}
                    </Validation.components.ValidatedForm>
                )}
            </Wrapper>
        );
    }
}

export default Backup;