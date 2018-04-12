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
import { resolveHandler, resolveFunction } from 'components/Protypo';
import * as propTypes from 'prop-types';
import contextDefinitions from './contexts';
import { TProtypoElement } from 'gachain/protypo';
import { IValidationResult } from 'components/Validation/ValidatedForm';

import Heading from 'components/Heading';
import ToolButton, { IToolButtonProps } from 'components/Protypo/components/ToolButton';

export interface IProtypoProps {
    apiHost: string;
    editable?: boolean;
    wrapper?: JSX.Element;
    context: string;
    page: string;
    content: TProtypoElement[];
    menuPush: (params: { name: string, content: TProtypoElement[] }) => void;
    navigatePage: (params: { name: string, params: any, force?: boolean }) => void;
    navigate: (url: string) => void;
    displayData: (link: string) => void;
    changePage?: any;
    addTag?: any;
    moveTag?: any;
    copyTag?: any;
    removeTag?: any;
    setTagCanDropPosition?: any;
    selectTag?: any;
    selectedTag?: any;
    logic?: boolean;
}

export interface IParamsSpec {
    [key: string]: IParamSpec;
}

export interface IParamSpec {
    type: string;
    text?: string;
    params: string[];
}

class Protypo extends React.Component<IProtypoProps> {
    private _lastID: number;
    private _menuPushBind: Function;
    private _navigatePageBind: Function;
    private _navigateBind: Function;
    private _resolveSourceBind: Function;
    private _renderElementsBind: Function;
    private _title: string;
    private _toolButtons: IToolButtonProps[];
    private _sources: { [key: string]: { columns: string[], types: string[], data: string[][] } };
    private _errors: { name: string, description: string }[];

    constructor(props: IProtypoProps) {
        super(props);
        this._menuPushBind = props.menuPush.bind(this);
        this._navigatePageBind = props.navigatePage.bind(this);
        this._navigateBind = props.navigate.bind(this);
        this._resolveSourceBind = this.resolveSource.bind(this);
        this._renderElementsBind = this.renderElements.bind(this);
    }

    getChildContext() {
        return {
            protypo: this,
            menuPush: this._menuPushBind,
            navigatePage: this._navigatePageBind,
            navigate: this._navigateBind,
            resolveSource: this._resolveSourceBind,
            renderElements: this._renderElementsBind
        };
    }

    getCurrentPage() {
        return this.props.page;
    }

    setTitle(title: string) {
        this._title = title;
    }

    addToolButton(props: IToolButtonProps) {
        this._toolButtons.push(props);
    }

    displayData(link: string) {
        this.props.displayData(link);
    }

    registerSource(name: string, payload: { columns: string[], types: string[], data: string[][] }) {
        this._sources[name] = payload;
    }

    resolveSource(name: string) {
        return this._sources[name];
    }

    resolveData(name: string) {
        return `${this.props.apiHost}${name}`;
    }

    resolveParams(values: IParamsSpec, formValues?: { [key: string]: IValidationResult }) {
        const result: { [key: string]: string } = {};
        for (let itr in values) {
            if (values.hasOwnProperty(itr)) {
                const param = values[itr];
                switch (param.type) {
                    case 'text': result[itr] = param.text; break;
                    case 'Val':
                        const inputName = param.params[0];
                        const inputValue = formValues && formValues[inputName] && formValues[inputName].value;
                        result[itr] = inputValue;
                        break;
                    default: break;
                }
            }
        }
        return result;
    }

    renderElement(element: TProtypoElement, optionalKey?: string): React.ReactNode {
        switch (element.tag) {
            case 'text':
                return element.text;

            default:
                const Handler = resolveHandler(element.tag, this.props.editable);
                const func = resolveFunction(element.tag);
                if (Handler) {
                    const selected = this.props.selectedTag && this.props.selectedTag.id === element.id;

                    if (-1 !== contextDefinitions[this.props.context].disabledHandlers.indexOf(element.tag)) {
                        return null;
                    }
                    else {
                        const key = optionalKey || (this._lastID++).toString();

                        if (element.tag === 'if') {
                            return (
                                <Handler
                                    {...element.attr}
                                    key={key}
                                    id={key}
                                    tag={element}
                                    childrenTree={element.children}
                                    editable={this.props.editable}
                                    changePage={this.props.changePage}
                                    setTagCanDropPosition={this.props.setTagCanDropPosition}
                                    addTag={this.props.addTag}
                                    moveTag={this.props.moveTag}
                                    copyTag={this.props.copyTag}
                                    removeTag={this.props.removeTag}
                                    selectTag={this.props.selectTag}
                                    selected={selected}
                                    logic={this.props.logic}
                                    tail={this.renderElements(element.tail)}
                                >

                                    {this.renderElements(element.children)}
                                </Handler>
                            );
                        }

                        return (
                            <Handler
                                {...element.attr}
                                key={key}
                                id={key}
                                tag={element}
                                childrenTree={element.children}
                                editable={this.props.editable}
                                changePage={this.props.changePage}
                                setTagCanDropPosition={this.props.setTagCanDropPosition}
                                addTag={this.props.addTag}
                                moveTag={this.props.moveTag}
                                copyTag={this.props.copyTag}
                                removeTag={this.props.removeTag}
                                selectTag={this.props.selectTag}
                                selected={selected}
                                logic={this.props.logic}
                            >
                                {this.renderElements(element.children)}
                            </Handler>
                        );
                    }
                }
                else if (func) {
                    if (-1 !== contextDefinitions[this.props.context].disabledFunctions.indexOf(element.tag)) {
                        return null;
                    }
                    else {
                        func(this, { ...element.attr });
                        return null;
                    }
                }
                else {
                    this._errors.push({
                        name: 'E_UNREGISTERED_HANDLER',
                        description: `Unknown template handler '${element.tag}'. This error must be reported`
                    });
                    return null;
                }
        }
    }

    renderElements(elements: TProtypoElement[], keyPrefix?: string): React.ReactNode[] {
        if (!elements) {
            return null;
        }

        return elements.map((element, index) => (
            this.renderElement(element, keyPrefix ? `${keyPrefix}_${index}` : undefined)
        ));
    }

    renderHeading() {
        return (this.props.context === 'page' && !this.props.editable) ? (
            <Heading key="func_heading">
                <span>{this._title}</span>
                <div className="pull-right">
                    {this._toolButtons.map((props, index) => (
                        <ToolButton {...props} key={index} />
                    ))}
                </div>
            </Heading>
        ) : null;
    }

    render() {
        this._lastID = 0;
        this._sources = {};
        this._toolButtons = [];
        this._title = null;
        this._errors = [];

        const body = this.renderElements(this.props.content);
        const head = this.renderHeading();
        const children = [
            this._errors.length ? (
                <div key="errors">
                    {this._errors.map((error, errorIndex) => (
                        <div key={errorIndex} className="alert alert-danger">
                            <strong>[{error.name}]</strong>
                            <span className="mr">:</span>
                            <span>{error.description}</span>
                        </div>
                    ))}
                </div>
            ) : null,
            head,
            ...body
        ];

        if (this.props.wrapper) {
            return React.cloneElement(this.props.wrapper, this.props.wrapper.props, children);
        }
        else {
            if (this.props.editable) {
                return (
                    <div>
                        {children}
                    </div>
                );
            }
            return (
                <div className="fullscreen">
                    {children}
                </div>
            );
        }
    }
}

(Protypo as any).childContextTypes = {
    protypo: propTypes.object.isRequired,
    navigatePage: propTypes.func.isRequired,
    navigate: propTypes.func.isRequired,
    menuPush: propTypes.func.isRequired,
    resolveSource: propTypes.func.isRequired,
    renderElements: propTypes.func.isRequired
};

export default Protypo;
