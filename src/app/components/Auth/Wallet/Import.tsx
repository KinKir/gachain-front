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
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';

import LocalizedDocumentTitle from 'components/DocumentTitle/LocalizedDocumentTitle';
import Generator from './Generator';
import Validation from 'components/Validation';
import Heading from 'components/Auth/Heading';

export interface IImportProps {
    backup: string;
    pending: boolean;
    onImportBackup: (file: File) => void;
    onConfirm: (params: { backup: string, password: string, flag: boolean}) => void;
}

interface IImportState {
    backup: string;
    password: string;
    flag: boolean;
}

class Import extends React.Component<IImportProps & InjectedIntlProps, IImportState> {
    private _inputFile: HTMLInputElement;

    constructor(props: IImportProps & InjectedIntlProps) {
        super(props);
        this.state = {
            backup: '',
            password: '',
            flag: false
        };
    }

    componentWillReceiveProps(props: IImportProps) {
        this._inputFile.setAttribute('value', null);

        // if (this.props.backup !== props.backup) {
            this.setState({
                backup: props.backup
            });
        // }
    }

    onSubmit = (values: { [key: string]: any }) => {
        this.props.onConfirm({
            backup: this.state.flag === false ? ' ' : this.state.backup,
            password: this.state.password,
            flag: false
        });
    }

    onBackupChange = (backup: string) => {
        this.setState({
            backup
        });
    }

    onPasswordChange = (password: string) => {
        this.setState({
            password
        });
    }

    onLoad = () => {
        this._inputFile.click();
    }

    onLoadSuccess = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onImportBackup(e.target.files[0]);
        this.setState({
            flag: true
        });
    }

    render() {
        return (
            <LocalizedDocumentTitle title="wallet.import" defaultTitle="Import wallet">
                <div>
                    <Heading returnUrl="/wallet">
                        <FormattedMessage id="wallet.import" defaultMessage="Import wallet" />
                    </Heading>
                    <input type="file" className="hidden" onChange={this.onLoadSuccess} ref={l => this._inputFile = l} />
                    <div className="text-center">
                        <Validation.components.ValidatedForm onSubmitSuccess={this.onSubmit}>
                            <Generator
                                seed={this.state.flag === false ? '' : this.state.backup}
                                onLoad={this.onLoad}
                                onSeedChange={this.onBackupChange}
                                onPasswordChange={this.onPasswordChange}
                                password={this.state.password}
                                action="import"
                                descriptionValue={
                                    <FormattedMessage
                                        id="auth.import.disclaimer"
                                        defaultMessage="Please enter your wallet backup payload to restore access to the system"
                                    />
                                }
                            />
                            <div className="text-right">
                                <Validation.components.ValidatedSubmit bsStyle="primary">
                                    <FormattedMessage id="process.confirm" defaultMessage="Confirm" />
                                </Validation.components.ValidatedSubmit>
                            </div>
                        </Validation.components.ValidatedForm>
                    </div>
                </div>
            </LocalizedDocumentTitle>
        );
    }
}

export default injectIntl(Import);