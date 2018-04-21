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
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { IAccount } from 'gachain/auth';

import { CloseDropdownButton } from 'components/DropdownButton';
import Avatar from 'containers/Avatar';
import PageLink from 'containers/Routing/PageLink';
import SystemButton from './SystemButton';

const StyledUserMenu = styled.div`
    -webkit-app-region: no-drag;
    line-height: 0;
    display: inline-block;
    vertical-align: top;
    height: 40px;   
    padding: 0 0 0 10px !important;
    line-height: 18px;
    color: #fff;

    > .user-info {
        text-align: right;
        float: left;
        margin-right: 5px;
        white-space: nowrap;
        max-width: 170px;

        > .user-title {
            margin-top: 4px;
            font-size: 14px;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        > .user-subtitle {
            text-transform: uppercase;
            font-size: 13px;
            font-weight: 300;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    > .user-avatar {
        float: right;
        margin: 4px;
    }

    .user-dropdown {
        background: #fff;
        box-shadow: 0 0 25px rgba(0,0,0,.15);
        border-left: solid 1px #add1ff;
        border-bottom: solid 1px #add1ff;
    }
`;

export interface IUserMenuProps {
    account: IAccount;
    ecosystemAccounts: IAccount[];
    switchAccount: (account: IAccount) => void;
    logout: () => void;
}

class UserMenu extends React.Component<IUserMenuProps> {
    render() {
        return this.props.account ? (
            <SystemButton
                className="p0"
                width={225}
                align="right"
                rightMost
                content={
                    <div>
                        <ul className="dropdown-group">
                            <li>
                                <CloseDropdownButton disabled>
                                    <em className="icon icon-key text-muted" />
                                    <span>
                                        <FormattedMessage id="general.account.changepassword" defaultMessage="Change password" />
                                    </span>
                                </CloseDropdownButton>
                            </li>
                            <li>
                                <PageLink page="backup" section="home">
                                    <CloseDropdownButton>
                                        <em className="icon icon-shield text-muted" />
                                        <span>
                                            <FormattedMessage id="general.account.backup" defaultMessage="Backup account" />
                                        </span>
                                    </CloseDropdownButton>
                                </PageLink>
                            </li>
                            <li>
                                <CloseDropdownButton onClick={this.props.logout}>
                                    <em className="icon icon-logout text-danger" />
                                    <span>
                                        <FormattedMessage id="general.account.signout" defaultMessage="Sign out" />
                                    </span>
                                </CloseDropdownButton>
                            </li>
                        </ul>
                        <div className="dropdown-heading">
                            <FormattedMessage id="general.ecosystems" defaultMessage="Ecosystems" />
                        </div>
                        <ul className="dropdown-group">
                            {this.props.ecosystemAccounts.map(account => (
                                <li key={account.ecosystem}>
                                    <CloseDropdownButton onClick={account.ecosystem !== this.props.account.ecosystem && this.props.switchAccount.bind(this, account)}>
                                        {account.ecosystemName ?
                                            (
                                                account.ecosystemName
                                            ) :
                                            (
                                                <FormattedMessage id="general.account.ecosystemNo" defaultMessage="Ecosystem #{ecosystem}" values={{ ecosystem: account.ecosystem }} />
                                            )
                                        }
                                    </CloseDropdownButton>
                                </li>
                            ))}
                            {/*_.map(this.props.account.ecosystems, ((value, key) => (
                                <li key={key}>
                                    <CloseDropdownButton onClick={key !== this.props.ecosystem && this.onSwitchEcosystem.bind(this, key)}>
                                        {value.name || key}
                                    </CloseDropdownButton>
                                </li>
                            )))*/}
                        </ul>
                    </div>
                }
            >
                <StyledUserMenu>
                    <div className="user-info">
                        <div className="user-title">
                            {this.props.account.username || this.props.account.address}
                        </div>
                        <div className="user-subtitle">
                            {this.props.account.ecosystemName || (
                                <FormattedMessage id="general.account.ecosystemNo" defaultMessage="Ecosystem #{ecosystem}" values={{ ecosystem: this.props.account.ecosystem }} />
                            )}
                        </div>
                    </div>
                    <Avatar
                        className="user-avatar"
                        size={32}
                        keyID={this.props.account.id}
                        ecosystem={this.props.account.ecosystem}
                    />
                </StyledUserMenu>
            </SystemButton>
        ) : null;
    }
}

export default UserMenu;