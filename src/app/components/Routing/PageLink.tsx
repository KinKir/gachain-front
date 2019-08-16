/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import { Link } from 'react-router-dom';
import { generateRoute } from 'services/router';
import { TBreadcrumbType } from 'gachain/content';

export interface IPageLinkProps {
    className?: string;
    section: string;
    page: string;
    params?: {
        [key: string]: string
    };
    from?: {
        name: string;
        title?: string;
        type: TBreadcrumbType;
    };
}

const PageLink: React.SFC<IPageLinkProps> = props => (
    <Link
        to={{
            pathname: generateRoute(`/browse/${props.section}/${props.page}`, props.params),
            state: {
                from: props.from
            }
        }}
        className={props.className}
    >
        {props.children}
    </Link>
);

export default PageLink;