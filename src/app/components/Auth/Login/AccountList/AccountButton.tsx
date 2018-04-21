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
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

import Avatar from 'containers/Avatar';

export interface IAccountButtonProps {
    className?: string;
    keyID: string;
    address: string;
    username: string;
    ecosystemID: string;
    ecosystemName: string;
    notifications?: number;
    onSelect: () => void;
    onRemove: () => void;
}

const AccountButton: React.SFC<IAccountButtonProps> = props => (
    <div className={props.className}>
        <Button className="account-main" block bsStyle="default" onClick={props.onSelect}>
            <div className="media-box text-left">
                <div className="pull-left">
                    <Avatar
                        size={44}
                        keyID={props.keyID}
                        ecosystem={props.ecosystemID}
                    />
                </div>
                <div className="media-box-body clearfix">
                    <p className="m0">
                        <b>{props.username || props.keyID}</b>
                        <span className="ml">({props.ecosystemName || props.ecosystemID})</span>
                    </p>
                    <p className="m0">
                        <small>{props.address}</small>
                    </p>
                </div>
                {props.notifications && (
                    <div className="notifications">
                        {props.notifications}
                    </div>
                )}
            </div>
        </Button>
        <button className="account-delete" onClick={props.onRemove}>&times;</button>
    </div>
);

export default styled(AccountButton) `
    padding-right: 46px;
    margin-top: 8px;
    position: relative;

    button.account-main {
        position: relative;
        border: solid 1px transparent;
        padding: 0;
        height: 46px;
        overflow: hidden;
        padding-right: 45px;

        .notifications {
            text-align: center;
            position: absolute;
            right: 10px;
            top: 10px;
            bottom: 10px;
            width: 25px;
            line-height: 25px;
            background: #d87272;
            color: #fff;
        }
    }

    button.account-delete {
        font-size: 19px;
        border: 0;
        background: 0;
        margin: 5px;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        color: #999;

        &:hover {
            color: #666;
        }
    }
`;