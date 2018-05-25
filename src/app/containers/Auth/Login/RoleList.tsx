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
import { IAccount } from 'gachain/auth';

import RoleList from 'components/Auth/Login/RoleList';
import { logout, selectRole } from 'modules/auth/actions';
import getNotificationsCount from 'modules/socket/reducers/getNotificationsCount';

export interface IAccountListContainerProps {

}

interface IRoleListContainerState {
    account: IAccount;
    roles: {
        id: number;
        name: string;
        notifications: number;
    }[];
}

interface IRoleListContainerDispatch {
    onSubmit: (role: number) => void;
    onCancel: () => void;
}

const mapStateToProps = (state: IRootState) => ({
    account: state.auth.account,
    roles: state.auth.roles.map(r => ({
        ...r,
        notifications: getNotificationsCount(state.socket, {
            account: state.auth.account,
            role: r.id
        })
    }))
});

const mapDispatchToProps = {
    onSubmit: (role: number) => selectRole.started(role),
    onCancel: () => logout.started(null)
};

const AccountListContainer: React.SFC<IAccountListContainerProps & IRoleListContainerState & IRoleListContainerDispatch> = props => (
    <RoleList {...props} />
);

export default connect<IRoleListContainerState, IRoleListContainerDispatch, IAccountListContainerProps>(mapStateToProps, mapDispatchToProps)(AccountListContainer);