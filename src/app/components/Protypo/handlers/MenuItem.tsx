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
import * as classnames from 'classnames';
import styled from 'styled-components';
import * as propTypes from 'prop-types';

import Protypo, { IParamsSpec } from '../Protypo';

export interface IMenuItemProps {
    'title'?: string;
    'page'?: string;
    'icon'?: string;
    'params'?: IParamsSpec;
    'vde'?: string;

    // TODO: Stub value
    '_systemPageHook'?: string;
}

export const StyledLinkButton = styled.div`
    &.active {
        > .link-active-decorator {
            opacity: 1;
        }
    }

    > .link-active-decorator {
        opacity: 0;
        background: #4c7dbd;
        float: left;
        width: 4px;
        height: 50px;
        transition: opacity .2s ease-in-out;
    }

    > a {
        display: block;
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        color: #0a1d33;
        font-size: 14px;
        font-weight: 200;
        text-decoration: none;

        &:hover {
            background: #ececec;
        }
    }

    .link-body {
        display: block;
        margin: 0 5px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        .icon {
            margin-right: 14px;
            color: #3577cc;
            font-size: 17px;
            position: relative;
            top: 3px;
        }
    }
`;

interface ILinkButtonContext {
    vde?: boolean;
    protypo: Protypo;
    navigate: (url: string) => void;
    navigatePage: (params: { name: string, params: any, vde?: boolean }) => void;
}

// TODO: Missing page params
const LinkButton: React.SFC<IMenuItemProps> = (props, context: ILinkButtonContext) => {
    const isActive = context.protypo.getCurrentPage() === props.page;
    const classes = classnames({
        active: isActive
    });

    const linkBody = (
        <div className="link-body">
            {props.icon && (<em className={`icon ${props.icon}`} />)}
            <span>{props.title}</span>
        </div>
    );

    const onNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (props._systemPageHook) {
            context.navigate(props._systemPageHook);
        }
        else {
            context.navigatePage({
                name: props.page,
                params: context.protypo.resolveParams(props.params),
                vde:
                    props.vde === 'true' ? true :
                        props.vde === 'false' ? false :
                            context.vde
            });
        }
        return false;
    };

    const navigateUrl =
        !props.page ? '' :
            props.vde === 'true' ? `/vde/page/${props.page}` :
                props.vde === 'false' ? `/page/${props.page}` :
                    `/${context.vde ? 'vde/page' : 'page'}/${props.page}`;

    return (
        <StyledLinkButton className={classes}>
            <div className="link-active-decorator" />
            {props._systemPageHook || props.page ?
                (
                    <a href={props._systemPageHook ? props._systemPageHook : navigateUrl} onClick={onNavigate}>
                        {linkBody}
                    </a>
                ) : (
                    <a href="#">
                        {linkBody}
                    </a>
                )}
        </StyledLinkButton>
    );
};

LinkButton.contextTypes = {
    protypo: propTypes.object.isRequired,
    navigatePage: propTypes.func.isRequired,
    navigate: propTypes.func.isRequired,
    vde: propTypes.bool
};

export default LinkButton;