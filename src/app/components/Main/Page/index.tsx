/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react';
import Protypo from 'containers/Widgets/Protypo';
import { TPage } from 'gachain/content';

import DocumentTitle from 'components/DocumentTitle';
import Error from './Error';
import Timeout from './Timeout';
import NotFound from './NotFound';

export interface IPageProps extends TPage {

}

const Page: React.SFC<IPageProps> = (props) => {
    if (props.error) {
        switch (props.error) {
            case 'E_HEAVYPAGE': return (<Timeout />);
            case 'E_NOTFOUND': return (<NotFound />);
            default: return (<Error error={props.error} />);
        }
    }
    else {
        return (
            <DocumentTitle title={props.name}>
                <Protypo context="page" {...props} />
            </DocumentTitle>
        );
    }
};

export default Page;