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
import { connect } from 'react-redux';
import { IRootState } from 'modules';
import { IntlProvider } from 'react-intl';
import { DragDropContext } from 'react-dnd';
import { switchWindow } from 'modules/gui/actions';
import HTML5Backend from 'react-dnd-html5-backend';

import App from 'components/App';

export interface IAppContainerProps {
}

interface IAppContainerState {
    locale: string;
    isAuthenticated: boolean;
    isLoaded: boolean;
    isCollapsed: boolean;
    localeMessages: { [key: string]: string };
}

interface IAppContainerDispatch {
    switchWindow: typeof switchWindow.started;
}

const AppContainer: React.SFC<IAppContainerProps & IAppContainerState & IAppContainerDispatch> = props => (
    <IntlProvider locale={props.locale} defaultLocale="en-US" messages={props.localeMessages}>
        <App
            isAuthenticated={props.isAuthenticated}
            isLoaded={props.isLoaded}
            isCollapsed={props.isCollapsed}
            switchWindow={props.switchWindow}
        />
    </IntlProvider>
);

const mapStateToProps = (state: IRootState) => ({
    locale: state.storage.locale,
    localeMessages: state.engine.localeMessages,
    isAuthenticated: state.auth.isAuthenticated,
    isCollapsed: state.engine.isCollapsed,
    isLoaded: state.engine.isLoaded
});

const mapDispatchToProps = {
    switchWindow: switchWindow.started
};

export default DragDropContext(HTML5Backend)(
    connect<IAppContainerState, IAppContainerDispatch, IAppContainerProps>(mapStateToProps, mapDispatchToProps, null, { pure: false })(AppContainer)
);
