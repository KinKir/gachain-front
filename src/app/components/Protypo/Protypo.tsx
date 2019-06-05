/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import { resolveHandler, resolveFunction } from 'components/Protypo';
import propTypes from 'prop-types';
import contextDefinitions from './contexts';
import { TProtypoElement, ISource } from 'gachain/protypo';
import { IValidationResult } from 'components/Validation/ValidatedForm';
import Heading from 'components/Heading';
import ToolButton, { IToolButtonProps } from 'containers/ToolButton/ToolButton';
import { IConstructorElementProps } from 'gachain/editor';

export interface IProtypoProps extends IConstructorElementProps {
    apiHost: string;
    wrapper?: JSX.Element;
    context: string;
    page: string;
    content: TProtypoElement[];
    menuPush: (params: { name: string, content: TProtypoElement[] }) => void;
    navigatePage: (params: { name: string, params: any, force?: boolean }) => void;
    navigate: (url: string) => void;
    displayData: (link: string) => void;
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
    private _sources: { [key: string]: ISource };
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

    registerSource(name: string, payload: ISource) {
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
                const Handler = resolveHandler(element.tag);
                const func = resolveFunction(element.tag);
                if (Handler) {
                    if (-1 !== contextDefinitions[this.props.context].disabledHandlers.indexOf(element.tag)) {
                        return null;
                    }
                    else {
                        const key = optionalKey || (this._lastID++).toString();

                        return (
                            <Handler
                                {...element.attr}
                                key={key}
                                id={key}
                                childrenTree={element.children}
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
        return (this.props.context === 'page' && this._title) ? (
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
