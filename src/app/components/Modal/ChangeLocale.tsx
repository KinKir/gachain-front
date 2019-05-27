// MIT License
// 
// Copyright (c) 2016-2019 GACHAIN
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
import locales from 'lib/locales';

import Modal from './';

export interface IChangeLocaleModalProps {
    value: string;
}

class ChangeLocaleModal extends Modal<IChangeLocaleModalProps, void> {
    changeLocale = (locale: string) => {
        this.props.changeLocale(locale);
        this.props.onCancel();
    }

    render() {
        return (
            <div>
                <Modal.Header>
                    <FormattedMessage id="modal.locale.title" defaultMessage="Switch language" />
                </Modal.Header>
                <Modal.Body>
                    {locales.map(l => (
                        <Button key={l.name} block disabled={l.name === this.props.params.value} type="button" bsStyle="default" onClick={() => this.changeLocale(l.name)}>
                            <span>{l.title}</span>
                        </Button>
                    ))}
                </Modal.Body>
                <Modal.Footer className="text-right">
                    <Button type="button" bsStyle="primary" onClick={this.props.onCancel.bind(this)}>
                        <FormattedMessage id="close" defaultMessage="Close" />
                    </Button>
                </Modal.Footer>
            </div>
        );
    }
}
export default ChangeLocaleModal;