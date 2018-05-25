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
import { fetchNotifications } from 'modules/content/actions';
import { TProtypoElement } from 'gachain/protypo';

import NotificationsMenu from 'components/Main/NotificationsMenu';

export interface INotificationsMenuContainerProps {

}

interface INotificationsMenuContainerState {
    offline: boolean;
    count: number;
    notificationsBody: TProtypoElement[];
}

interface INotificationsMenuContainerDispatch {
    fetchNotifications: typeof fetchNotifications.started;
}

class NotificationsContainer extends React.Component<INotificationsMenuContainerProps & INotificationsMenuContainerState & INotificationsMenuContainerDispatch> {
    componentWillReceiveProps(props: INotificationsMenuContainerProps & INotificationsMenuContainerState & INotificationsMenuContainerDispatch) {
        if (this.props.count !== props.count) {
            props.fetchNotifications(null);
        }
    }

    render() {
        return (
            <NotificationsMenu {...this.props} />
        );
    }
}

const mapStateToProps = (state: IRootState) => {
    const notifications = state.auth.account ? state.socket.notifications.filter(l =>
        l.id === state.auth.account.id &&
        l.ecosystem === state.auth.account.ecosystem
    ).map(l => l.count) : [];
    const count = notifications.length ? notifications.reduce((a, b) => a + b) : 0;

    return {
        count,
        offline: !state.socket.connected,
        notificationsBody: state.content.notifications
    };
};

const mapDispatchToProps = {
    fetchNotifications: fetchNotifications.started
};

export default connect<INotificationsMenuContainerState, INotificationsMenuContainerDispatch, INotificationsMenuContainerProps>(mapStateToProps, mapDispatchToProps)(NotificationsContainer);