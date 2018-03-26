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
import { Button, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import keyring from 'lib/keyring';
import { navigate } from 'modules/engine/actions';
import { importSeed, importAccount, login } from 'modules/auth/actions';
import { alertShow } from 'modules/content/actions';

import LocalizedDocumentTitle from 'components/DocumentTitle/LocalizedDocumentTitle';
import General from 'components/General';
import Validation from 'components/Validation';

const StyledForm = styled.div`
    textarea.input-seed {
        height: 100px;
        resize: none;
    }
`;

export interface IImportProps extends InjectedIntlProps {
    isImportingAccount: boolean;
    importAccountError: string;
    return: string;
    loadedSeed: string;
    navigate: typeof navigate;
    alertShow: typeof alertShow;
    login: typeof login.started;
    importSeed: typeof importSeed.started;
    importAccount: typeof importAccount.started;
}

interface IImportState {
    seed?: string;
}

class Import extends React.Component<IImportProps, IImportState> {
    inputFile: HTMLInputElement;

    constructor(props: IImportProps) {
        super(props);
        this.state = {
            seed: ''
        };
    }

    componentWillReceiveProps(props: IImportProps) {
        if (props.loadedSeed) {
            this.setState({
                seed: props.loadedSeed
            });
        }
        if (this.props.isImportingAccount && !props.isImportingAccount) {
            if (props.importAccountError) {
                this.onInvalidKey();
            }
            else {
                this.onImportSuccess();
            }
        }
    }

    onImportSuccess() {
        this.props.alertShow({
            id: 'I_ACCOUNT_IMPORT_SUCCESS',
            title: this.props.intl.formatMessage({ id: 'alert.info', defaultMessage: 'Information' }),
            type: 'info',
            text: this.props.intl.formatMessage({ id: 'auth.import.success', defaultMessage: 'Account has been imported successfully' }),
            cancelButton: this.props.intl.formatMessage({ id: 'alert.close', defaultMessage: 'Close' }),
        });
        this.props.navigate('/');
    }

    onInvalidKey() {
        this.props.alertShow({
            id: 'E_KEY_CORRUPTED',
            title: this.props.intl.formatMessage({ id: 'alert.error', defaultMessage: 'Error' }),
            type: 'error',
            text: this.props.intl.formatMessage({ id: 'auth.backup.invalid', defaultMessage: 'Provided key is corrupted or contains invalid data' }),
            cancelButton: this.props.intl.formatMessage({ id: 'alert.close', defaultMessage: 'Close' }),
        });
    }

    onLoadSuccess(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            if (keyring.MAX_KEY_SIZE < e.target.files[0].size) {
                this.onInvalidKey();
            }
            else {
                this.props.importSeed(e.target.files[0]);
            }
            e.target.value = '';
        }
    }

    onSeedChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            seed: e.target.value
        });
    }

    onLoad() {
        this.inputFile.click();
    }

    onSubmit(values: { [key: string]: any }) {
        this.props.importAccount({
            backup: values.seed,
            password: values.password
        });
    }

    render() {
        return (
            <LocalizedDocumentTitle title="auth.account.import" defaultTitle="Import account">
                <General return={this.props.return}>
                    <input id="importFileLoader" type="file" className="hidden" onChange={this.onLoadSuccess.bind(this)} ref={l => this.inputFile = l} />
                    <div className="text-center">
                        <p>To begin creating your new private key you will need to enter account seed. This is a unique passphrase used by our cryptographic algorithms to generate the private key. In future, you can use your passphrase to re-generate your private key in case you lost it</p>
                        <hr />
                        <StyledForm>
                            <Validation.components.ValidatedForm onSubmitSuccess={this.onSubmit.bind(this)}>
                                <fieldset>
                                    <Validation.components.ValidatedFormGroup for="seed">
                                        <Col md={3}>
                                            <label className="control-label">
                                                <FormattedMessage id="auth.seed" defaultMessage="Account seed" />
                                            </label>
                                        </Col>
                                        <Col md={9}>
                                            <div>
                                                <Validation.components.ValidatedTextarea id="importSeed" className="input-seed" onChange={this.onSeedChange.bind(this)} value={this.state.seed} name="seed" validators={[Validation.validators.required]} />
                                            </div>
                                            <Col md={12} className="pl0 pr0">
                                                <Button className="btn-block" onClick={this.onLoad.bind(this)}>
                                                    <FormattedMessage id="auth.seed.load" defaultMessage="Load" />
                                                </Button>
                                            </Col>
                                        </Col>
                                    </Validation.components.ValidatedFormGroup>
                                </fieldset>
                                <fieldset className="mb0">
                                    <Validation.components.ValidatedFormGroup for="password">
                                        <Col md={3}>
                                            <label className="control-label">
                                                <FormattedMessage id="general.password" defaultMessage="Password" />
                                            </label>
                                        </Col>
                                        <Col md={9}>
                                            <Validation.components.ValidatedControl id="importPassword" name="password" type="password" validators={[Validation.validators.required, Validation.validators.minlength(6)]} />
                                        </Col>
                                    </Validation.components.ValidatedFormGroup>
                                </fieldset>
                                <hr className="mt0" />
                                <Button id="importSubmit" type="submit" bsStyle="primary" className="btn-block">
                                    <FormattedMessage id="auth.import" defaultMessage="Import" />
                                </Button>
                            </Validation.components.ValidatedForm>
                        </StyledForm>
                    </div>
                </General>
            </LocalizedDocumentTitle>
        );
    }
}

export default injectIntl(Import);