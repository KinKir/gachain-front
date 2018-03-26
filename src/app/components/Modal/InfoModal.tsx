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
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import Modal from './';

export interface IInfoModalProps {
    value: string;
}

class InfoModal extends Modal<IInfoModalProps, void> {
    render() {
        return (
            <div>
                <Modal.Header>
                    <FormattedMessage id="alert.info" defaultMessage="Information" />
                </Modal.Header>
                <Modal.Body>
                    <div>{this.props.params.value}</div>
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
export default InfoModal;