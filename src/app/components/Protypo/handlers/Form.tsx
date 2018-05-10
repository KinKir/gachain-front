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
import * as propTypes from 'prop-types';
import StyledComponent from './StyledComponent';
import ValidatedForm from 'components/Validation/ValidatedForm';

export interface IFormProps {
    'class'?: string;
    'className'?: string;
}

interface IFormState {
    form: ValidatedForm;
}

class Form extends React.Component<IFormProps, IFormState> {
    constructor(props: IFormProps) {
        super(props);
        this.state = {
            form: null
        };
    }

    getChildContext() {
        return {
            form: this.state.form
        };
    }

    bindForm(form: ValidatedForm) {
        if (!this.state.form) {
            this.setState({
                form
            });
        }
    }

    render() {
        return (
            <ValidatedForm ref={this.bindForm.bind(this)} className={[this.props.class, this.props.className].join(' ')}>
                {this.props.children}
            </ValidatedForm>
        );
    }
}

(Form as React.ComponentClass).childContextTypes = {
    form: propTypes.instanceOf(ValidatedForm)
};

export default StyledComponent(Form);