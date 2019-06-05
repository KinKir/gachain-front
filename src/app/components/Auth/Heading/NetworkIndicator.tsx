/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import styled from 'styled-components';
import platform from 'lib/platform';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export interface IOptionButtonProps {
    className?: string;
    navigateUrl: string;
    status: 'PENDING' | 'ONLINE' | 'OFFLINE';
}

const NetworkIndicator: React.SFC<IOptionButtonProps> = props => (
    <Link to={props.navigateUrl} className={props.className}>
        <div className="button-title">
            {'PENDING' === props.status && <FormattedMessage id="general.network.connecting" defaultMessage="Connecting..." />}
            {'OFFLINE' === props.status && <FormattedMessage id="general.network.offline" defaultMessage="Offline" />}
            {'ONLINE' === props.status && props.children}
        </div>
        <em className="button-icon" />
    </Link>
);

export default styled(NetworkIndicator)`
    text-decoration: none !important;
    border: 0;
    background: 0;
    padding: 0;
    color: ${platform.select({ desktop: '#4085dc', web: '#fff' })};
    font-size: 14px;

    &:hover {
        color: #76a6e2;
    }

    .button-icon {
        margin-left: 8px;
        width: 8px;
        height: 8px;
        background-color: #ccc;
        border-radius: 100%;
        display: inline-block;
        vertical-align: middle;

        ${props => 'PENDING' === props.status ? 'background-color: #E6C366' : ''};
        ${props => 'ONLINE' === props.status ? 'background-color: #6AC751' : ''};
    }

    .button-title {
        vertical-align: middle;
        display: inline-block;
        line-height: 40px;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;