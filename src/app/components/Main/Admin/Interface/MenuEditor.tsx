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
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Editor from 'components/Editor';

import ValidatedContractForm from 'containers/Widgets/ValidatedContractForm';
import Validation from 'components/Validation';

interface IMenuEditorProps {
    vde?: boolean;
    contractName: string;
    template: string;
    conditions: string;
    menu?: { id: string, name: string, conditions: string, value: string };
    onSourceEdit: (code: string) => void;
    onConditionsEdit: React.ChangeEventHandler<HTMLTextAreaElement>;
    onExec?: (block: string, error?: { type: string, error: string }) => void;
    mapContractParams: (values: { [key: string]: any }) => { values: { [key: string]: any } };
}

const MenuEditor: React.SFC<IMenuEditorProps> = (props) => (
    <Row>
        <Col md={12}>
            <ValidatedContractForm vde={props.vde} contractName={props.contractName} mapContractParams={props.mapContractParams} onExec={props.onExec && props.onExec}>
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <FormattedMessage id="admin.interface.menu" defaultMessage="Menu" />
                    </div>
                    <div className="panel-body">
                        <Validation.components.ValidatedFormGroup for="name">
                            <label htmlFor="name">
                                <FormattedMessage id="admin.interface.menu.name" defaultMessage="Name" />
                            </label>
                            {props.menu ?
                                (
                                    <Validation.components.ValidatedControl key="nameEdit" name="name" readOnly value={props.menu.name} />
                                ) : (
                                    <Validation.components.ValidatedControl key="nameCreate" name="name" validators={[Validation.validators.required]} />
                                )
                            }
                        </Validation.components.ValidatedFormGroup>
                        <Validation.components.ValidatedFormGroup for="content">
                            <label htmlFor="content">
                                <FormattedMessage id="admin.interface.menu.content" defaultMessage="Content" />
                            </label>
                            <div className="form-control" style={{ height: 'auto', padding: 0 }}>
                                <Editor
                                    height={600}
                                    language="protypo"
                                    value={props.template}
                                    onChange={props.onSourceEdit}
                                    options={{
                                        automaticLayout: true,
                                        contextmenu: false,
                                        scrollBeyondLastLine: false
                                    }}
                                />
                            </div>
                        </Validation.components.ValidatedFormGroup>
                        <Validation.components.ValidatedFormGroup for="conditions" className="mb0">
                            <label htmlFor="conditions">
                                <FormattedMessage id="admin.conditions.change" defaultMessage="Change conditions" />
                            </label>
                            <Validation.components.ValidatedTextarea name="conditions" onChange={props.onConditionsEdit} value={props.conditions} validators={[Validation.validators.required]} />
                        </Validation.components.ValidatedFormGroup>
                    </div>
                    <div className="panel-footer">
                        <div className="text-right">
                            <Validation.components.ValidatedSubmit bsStyle="primary">
                                <FormattedMessage id="admin.save" defaultMessage="Save" />
                            </Validation.components.ValidatedSubmit>
                        </div>
                    </div>
                </div>
            </ValidatedContractForm>
        </Col>
    </Row>
);

export default MenuEditor;