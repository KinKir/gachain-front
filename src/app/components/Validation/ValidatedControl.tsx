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
import { FormControl, FormControlProps } from 'react-bootstrap';
import { Validator } from './Validators';
import * as propTypes from 'prop-types';

import ValidatedForm, { IValidatedControl } from './ValidatedForm';

export interface IValidatedControlProps extends FormControlProps {
    validators?: Validator[];
}

interface IValidatedControlState {
    value: string;
}

export default class ValidatedControl extends React.Component<IValidatedControlProps, IValidatedControlState> implements IValidatedControl {
    constructor(props: IValidatedControlProps) {
        super(props);

        this.state = {
            value: (props.value || props.defaultValue || '') as string
        };
    }

    componentDidMount() {
        if (this.context.form) {
            (this.context.form as ValidatedForm)._registerElement(this.props.name, this);
        }
    }

    componentWillUnmount() {
        if (this.context.form) {
            (this.context.form as ValidatedForm)._unregisterElement(this.props.name);
        }
    }

    componentWillReceiveProps(props: IValidatedControlProps) {
        if (this.props.value !== props.value) {
            this.setState({
                value: props.value as string
            });
            (this.context.form as ValidatedForm).updateState(props.name, props.value);
        }
    }

    getValue() {
        return this.state.value;
    }

    onChange(e: React.ChangeEvent<FormControl>) {
        this.setState({
            value: (e.target as any).value
        });

        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    onBlur(e: React.FocusEvent<FormControl>) {
        (this.context.form as ValidatedForm).updateState(this.props.name);

        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    }

    render() {
        return (
            <FormControl
                style={this.props.style}
                className={this.props.className}
                readOnly={this.props.readOnly}
                disabled={this.props.disabled}
                onChange={this.onChange.bind(this)}
                onBlur={this.onBlur.bind(this)}
                bsClass={this.props.bsClass}
                bsSize={this.props.bsSize}
                componentClass={this.props.componentClass}
                id={this.props.id}
                name={this.props.name}
                inputRef={this.props.inputRef}
                type={this.props.type}
                placeholder={this.props.placeholder}
                value={this.state.value}
                noValidate
            >
                {this.props.children}
            </FormControl>
        );
    }
}

(ValidatedControl as React.ComponentClass).contextTypes = {
    form: propTypes.instanceOf(ValidatedForm)
};