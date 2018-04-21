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

import axios from 'axios';
import GachainAPI from 'lib/gachainAPI';
import constructorModule from 'lib/constructor';

export const apiEndpoint = 'api/v2';

export interface IStoreDependencies {
    api: IAPIDependency;
    defaultKey: string;
    constructorModule: typeof constructorModule;
}

export interface IAPIDependency {
    (options: { apiHost: string, sessionToken?: string }): GachainAPI;
}

const storeDependencies: IStoreDependencies = {
    api: (params: { apiHost: string, sessionToken?: string }) => new GachainAPI({
        transport: request => axios({
            url: request.url,
            method: request.method,
            headers: request.headers,
            data: request.body,
            params: request.query

        }).then(l => {
            return l ? { body: l.data } : null;

        }).catch(e => {
            throw e && e.response && e.response.data ? e.response.data.error : null;
        }),
        apiHost: params.apiHost,
        apiEndpoint,
        session: params.sessionToken
    }),
    defaultKey: '04e5a87a96a445cb55a214edaad3661018061ef2936e63a0a93bdb76eb28251c1f',
    constructorModule
};

export default storeDependencies;