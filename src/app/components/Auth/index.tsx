/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import imgLogo from 'images/logo.svg';
import platform from 'lib/platform';

import themed from 'components/Theme/themed';
import Titlebar from 'components/Main/Titlebar';
import Wallet from 'components/Auth/Wallet';
import Login from 'containers/Auth/Login';
import NetworkList from 'containers/Auth/Login/NetworkList';
import AddNetwork from 'containers/Auth/Login/NetworkList/AddNetwork';

export interface IAuthProps {
    className?: string;
    locale: string;
    changeLocale: () => void;
}

const Auth: React.SFC<IAuthProps & InjectedIntlProps> = props => (
    <div className={props.className}>
        <div className="auth-window-container">
            <div className="auth-window">
                <div className="panel panel-default m0">
                    {platform.select({
                        desktop: (
                            <div className="panel-heading" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                                <Titlebar maximizable={false} />
                            </div>
                        )
                    })}
                    <div className="panel-body">
                        <Switch>
                            <Route path="/account" component={Wallet} />
                            <Route path="/networks/add" component={AddNetwork} />
                            <Route path="/networks" component={NetworkList} />
                            <Route path="/" component={Login} />
                            <Redirect to="/" />
                        </Switch>
                    </div>
                </div>
                {platform.select({
                    web: (
                        <div className="clearfix p-lg text-center text-white">
                            <div className="pull-left">
                                <div>
                                    <FormattedMessage id="legal.copy" defaultMessage="Gachain © 2017-2019 - " />
                                    <a
                                        href={props.intl.formatMessage({
                                            id: 'legal.homepage',
                                            defaultMessage: 'https://gachain.org'
                                        })}
                                    >
                                        <FormattedMessage id="legal.homepage" defaultMessage="https://gachain.org" />
                                    </a>
                                </div>
                            </div>
                            <div className="pull-right">
                                <a href="#" onClick={props.changeLocale}>
                                    <FormattedMessage id="LANG_NAME" defaultMessage={props.locale} />
                                </a>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
);

export default themed(injectIntl(Auth))`
    display: ${platform.select({ web: 'table', desktop: 'block' })};
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: hidden;

    .auth-window-container {
        display: ${platform.select({ web: 'table-cell', desktop: 'block' })};
        vertical-align: middle;
        overflow: hidden;
        height: 100%;

        .auth-window {
            text-align: center;
            max-width: ${platform.select({ web: '600px', desktop: 'none' })};
            height: ${platform.select({ web: 'auto', desktop: '100%' })};
            padding: ${platform.select({ web: '10px', desktop: '0' })};
            padding-top: ${props => platform.select({ web: '0', desktop: props.theme.headerHeight + 'px' })};
            margin: 0 auto;
            
            .panel {
                height: ${platform.select({ web: 'auto', desktop: '100%' })};
                overflow: hidden;
                background: #fff;
                border: 0;

                > .panel-heading {
                    position: relative;
                    background: url(${imgLogo}) no-repeat 50% 50% ${props => props.theme.headerBackground};
                    background-size: 65px;
                    height: 28px;
                    padding: 0;
                    user-select: none;
                    -webkit-app-region: drag;

                    .auth-back {
                        -webkit-app-region: no-drag;
                        position: absolute;
                        right: auto;
                        left: 30px;
                        top: 0;
                        line-height: 28px;

                        .icon {
                            position: relative;
                            vertical-align: middle;
                            font-size: 16px;
                            top: -2px;
                            margin-right: 5px;
                        }

                        &.auth-back-darwin {
                            left: auto;
                            right: 30px;
                        }
                    }
                }

                > .panel-body {
                    overflow-x: hidden;
                    overflow-y: auto;
                    max-height: 100%;
                    height: 100%;
                }
            }
        }
    }
`;