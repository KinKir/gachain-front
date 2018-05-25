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

import * as React from 'react';
import * as _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import LoadingBar from 'react-redux-loading-bar';
import { OrderedMap } from 'immutable';
import styled from 'styled-components';
import platform from 'lib/platform';
import { TSection } from 'gachain/content';
import { history } from 'store';

import Titlebar from './Titlebar';
import UserMenu from 'containers/Widgets/UserMenu';
import Navigation from 'containers/Main/Navigation';
import NotificationsMenu from 'containers/Widgets/NotificationsMenu';
import Toolbar from './Toolbar';
import SectionButton from 'components/Main/SectionButton';
import ToolButton from 'components/Main/Toolbar/ToolButton';
import EditorToolbar from 'containers/Main/Toolbar/EditorToolbar';
import { TTransactionStatus } from 'gachain/tx';
// import TransactionsMenu from './TransactionsMenu';

export const styles = {
    headerHeight: platform.select({ desktop: 28, web: 0 }),
    menuHeight: 40,
    toolbarHeight: 40,
    mainColor: '#4c7dbd',
    toolColor: '#f3f3f3'
};

const StyledWrapper = styled.div`
    background-color: #f6f8fa;
`;

export interface IMainProps {
    nodeUrl: string;
    isAuthorized: boolean;
    pending: boolean;
    section: string;
    sections: { [name: string]: TSection };
    stylesheet: string;
    navigationSize: number;
    navigationVisible: boolean;
    pendingTransactions: OrderedMap<string, TTransactionStatus>;
    transactionsCount: number;
    onRefresh: () => void;
    onNavigateHome: () => void;
    onNavigationToggle: () => void;
    onSwitchSection: (section: string) => void;
    onCloseSection: (section: string) => void;
}

const StyledControls = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10000;
`;

const StyledTitlebar = styled.div`
    background: ${styles.mainColor};
    height: ${styles.headerHeight}px;
    line-height: ${styles.headerHeight}px;
    font-size: 15px;
    color: #fff;
    text-align: center;
`;

const StyledMenu = styled.ul`
    background: ${styles.mainColor};
    list-style-type: none;
    padding: 0;
    margin: 0;
    height: ${styles.menuHeight}px;
    position: relative;

    > li {
        margin-top: 6px;
        height: 34px;
        line-height: 34px;
        display: inline-block;
        font-size: 16px;
        color: #fff;
        -webkit-app-region: no-drag;
        user-select: none;

        &.user-menu {
            margin-top: 0;
            height: ${styles.menuHeight}px;
            line-height: normal;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
        }
    }
`;

const StyledContent = styled.section`
    margin-top: ${styles.headerHeight + styles.menuHeight + styles.toolbarHeight}px !important;
    transition: none !important;
`;

const StyledLoadingBar = styled(LoadingBar) `
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
`;

class Main extends React.Component<IMainProps> {
    onBack() {
        history.goBack();
    }

    onForward() {
        history.goForward();
    }

    render() {
        const appTitle = `Gachain (${this.props.nodeUrl})`;

        return (
            <StyledWrapper className="wrapper component-main">
                <style type="text/css">
                    {this.props.stylesheet}
                </style>
                <StyledControls>
                    <StyledTitlebar className="drag">
                        <Titlebar>{appTitle}</Titlebar>
                    </StyledTitlebar>
                    <StyledMenu className="drag">
                        <li>
                            <SectionButton onClick={this.props.onNavigationToggle}>
                                <em className="icon-menu" />
                            </SectionButton>
                        </li>
                        {_.map(this.props.sections, l => l.visible ? (
                            <li key={l.name}>
                                <SectionButton
                                    active={this.props.section === l.name}
                                    closeable={l.closeable}
                                    onClick={this.props.onSwitchSection.bind(this, l.name)}
                                    onClose={this.props.onCloseSection.bind(this, l.name)}
                                >
                                    {l.title}
                                </SectionButton>
                            </li>
                        ) : null)}
                        <li className="user-menu">
                            <NotificationsMenu />
                            {/*<TransactionsMenu />*/}
                            <UserMenu />
                        </li>
                    </StyledMenu>
                    <Toolbar>
                        {this.props.isAuthorized && (
                            <ToolButton right icon="icon-key" />
                        )}
                        {'editor' === this.props.section ?
                            (
                                <EditorToolbar />
                            ) : (
                                <div>
                                    <ToolButton icon="icon-arrow-left" onClick={this.onBack}>
                                        <FormattedMessage id="navigation.back" defaultMessage="Back" />
                                    </ToolButton>
                                    <ToolButton icon="icon-arrow-right" onClick={this.onForward}>
                                        <FormattedMessage id="navigation.forward" defaultMessage="Forward" />
                                    </ToolButton>
                                    <ToolButton icon="icon-home" onClick={this.props.onNavigateHome}>
                                        <FormattedMessage id="navigation.home" defaultMessage="Home" />
                                    </ToolButton>
                                    <ToolButton icon="icon-refresh" onClick={this.props.onRefresh}>
                                        <FormattedMessage id="navigation.refresh" defaultMessage="Refresh" />
                                    </ToolButton>
                                </div>
                            )
                        }
                    </Toolbar>
                    <StyledLoadingBar
                        showFastActions
                        style={{
                            backgroundColor: '#b2c5dc',
                            width: 'auto',
                            height: 2
                        }}
                    />
                </StyledControls >
                <Navigation topOffset={styles.headerHeight + styles.menuHeight + styles.toolbarHeight} />
                <StyledContent style={{ marginLeft: this.props.navigationVisible ? this.props.navigationSize : 0 }}>
                    {this.props.children}
                </StyledContent>
            </StyledWrapper >
        );
    }
}

export default Main;