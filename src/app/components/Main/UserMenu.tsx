/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { IAccountContext } from 'gachain/auth';
import { IEcosystemInfo } from 'gachain/api';

import { CloseDropdownButton } from 'components/DropdownButton';
import PageLink from 'containers/Routing/PageLink';
import SystemButton from './SystemButton';
import Avatar from 'containers/Avatar';

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
    isDefaultWallet: boolean;
    wallet: IAccountContext;
    walletEcosystems: IEcosystemInfo[];
    onSwitchEcosystem: (ecosystem: string, defaultRole?: boolean) => void;
    onLogout: () => void;
    onChangePassword: () => void;
}

class UserMenu extends React.Component<IUserMenuProps> {
    render() {
        return this.props.wallet && this.props.wallet.wallet ? (
            <SystemButton
                className="p0"
                width={225}
                align="right"
                rightMost
                content={
                    <div>
                        <ul className="dropdown-group">
                            {!this.props.isDefaultWallet && (
                                <>
                                    <li>
                                        <CloseDropdownButton onClick={this.props.onChangePassword}>
                                            <em className="icon icon-key text-muted" />
                                            <span>
                                                <FormattedMessage id="general.wallet.changepassword" defaultMessage="Change password" />
                                            </span>
                                        </CloseDropdownButton>
                                    </li>
                                    <li>
                                        <PageLink page="backup">
                                            <CloseDropdownButton>
                                                <em className="icon icon-shield text-muted" />
                                                <span>
                                                    <FormattedMessage id="general.wallet.backup" defaultMessage="Backup account" />
                                                </span>
                                            </CloseDropdownButton>
                                        </PageLink>
                                    </li>
                                </>
                            )}
                            <li>
                                <CloseDropdownButton onClick={this.props.onLogout}>
                                    <em className="icon icon-logout text-danger" />
                                    <span>
                                        <FormattedMessage id="general.wallet.signout" defaultMessage="Sign out" />
                                    </span>
                                </CloseDropdownButton>
                            </li>
                        </ul>
                        <div className="dropdown-heading">
                            <FormattedMessage id="general.ecosystems" defaultMessage="Ecosystems" />
                        </div>
                        <ul className="dropdown-group">
                            {this.props.walletEcosystems.map(value => (
                                <li key={value.ecosystem}>
                                    {/*wallet.ecosystem !== this.props.wallet.ecosystem && this.props.switchWallet.bind(this, wallet)*/}
                                    <CloseDropdownButton style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onClick={() => this.props.onSwitchEcosystem(value.ecosystem, !value.roles.length)}>
                                        {value.name ?
                                            (
                                                value.name
                                            ) :
                                            (
                                                <FormattedMessage id="general.wallet.ecosystemNo" defaultMessage="Ecosystem #{ecosystem}" values={{ ecosystem: value.ecosystem }} />
                                            )
                                        }
                                    </CloseDropdownButton>
                                </li>
                            ))}
                        </ul>
                    </div>
                }
            >
                <StyledUserMenu>
                    <div className="user-info">
                        <div className="user-title">
                            {this.props.isDefaultWallet ?
                                (
                                    <FormattedMessage id="auth.login.guest" defaultMessage="Demo" />
                                ) :
                                (
                                    <span>{this.props.wallet.wallet.address}</span>
                                )
                            }
                        </div>
                        <div className="user-subtitle">
                            {this.props.wallet.access.name || (
                                <FormattedMessage id="general.wallet.ecosystemNo" defaultMessage="Ecosystem #{ecosystem}" values={{ ecosystem: this.props.wallet.access.ecosystem }} />
                            )}
                        </div>
                    </div>
                    <Avatar
                        className="user-avatar"
                        size={32}
                        account={this.props.wallet.wallet.address}
                        ecosystem={this.props.wallet.access.ecosystem}
                    />
                </StyledUserMenu>
            </SystemButton>
        ) : null;
    }
}

export default UserMenu;