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

import GachainAPI, { IRequestTransport, TRequestMethod, IRequestOptions } from './';
import * as queryString from 'query-string';
import { IContentRequest } from 'gachain/api';

interface IMockTransportResponse {
    method: TRequestMethod;
    endpoint: string;
    body: { [key: string]: any };
    options?: IRequestOptions<any, any>;
}

const apiPassthroughTransportMock: IRequestTransport = (method: TRequestMethod, endpoint: string, body: { [key: string]: any } = {}, options?: IRequestOptions<any, any>) => {
    return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
            resolve({
                body: {
                    method,
                    endpoint,
                    body,
                    options
                }
            });
        }, 0);
    });
};

const apiJsonTransportMock: IRequestTransport = (method: TRequestMethod, url: string, body: { [key: string]: any } = {}, options?: IRequestOptions<any, any>) => {
    return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
            resolve({
                body
            });
        }, 0);
    });
};

const paramsTransportMock: IRequestTransport = (method: TRequestMethod, url: string, body: { [key: string]: any } = {}, options?: IRequestOptions<any, any>) => {
    return new Promise<any>((resolve, reject) => {
        let qs = '';
        if ('get' === method) {
            qs = queryString.stringify(body);
            if (qs) {
                qs = '?' + qs;
            }
        }
        setTimeout(() => {
            resolve({
                body: {
                    ...body,
                    __requestUrl: `${url}${qs}`
                }
            });
        }, 0);
    });
};

const paramTestingAPIHost = 'http://test_Url.com';
const paramTestingAPIEndpoint = 'api/v2';
const paramTestingAPIMock = () => new GachainAPI({
    apiHost: paramTestingAPIHost,
    apiEndpoint: paramTestingAPIEndpoint,
    transport: paramsTransportMock
});

test('Url slug parsing', () => {
    const TEST_URL = '://test_url.com';
    const TEST_ENDPOINT = 'api/v2';
    const TEST_ROUTE = 'test_route';

    class MockAPI extends GachainAPI {
        public slugEndpoint = this.setEndpoint<{ slug: string }, IMockTransportResponse>('get', `${TEST_ROUTE}/{slug}`);
        public complexSlugEndpoint = this.setEndpoint<{ a: string, b: string }, IMockTransportResponse>('get', `${TEST_ROUTE}/{a}/${TEST_ROUTE}/{b}/test`);
        public postSlugEndpoint = this.setEndpoint<{ slug: string, some: 1, more: true, params: 'hello' }, IMockTransportResponse>('post', `${TEST_ROUTE}/{slug}`);
    }

    const api = new MockAPI({
        apiHost: TEST_URL,
        apiEndpoint: TEST_ENDPOINT,
        transport: apiPassthroughTransportMock
    });

    return Promise.all([
        api.slugEndpoint({ slug: 'test0123456789' }).then(l =>
            expect(l.endpoint).toEqual(`${TEST_URL}/${TEST_ENDPOINT}/${TEST_ROUTE}/test0123456789`)
        ),
        api.complexSlugEndpoint({ a: '../../test', b: '-12345-' }).then(l =>
            expect(l.endpoint).toEqual(`${TEST_URL}/${TEST_ENDPOINT}/${TEST_ROUTE}/${encodeURIComponent('../../test')}/${TEST_ROUTE}/-12345-/test`)
        ),
        api.postSlugEndpoint({ slug: 'test0123456789', some: 1, more: true, params: 'hello' }).then(l =>
            expect(l.endpoint).toEqual(`${TEST_URL}/${TEST_ENDPOINT}/${TEST_ROUTE}/test0123456789`)
        )
    ]);
});

test('Request transformer', () => {
    const testArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    class MockAPI extends GachainAPI {
        public transformEndpoint = this.setEndpoint<number[], number[]>('get', 'test', {
            requestTransformer: request =>
                request.slice().reverse()
        });
    }

    const api = new MockAPI({
        apiHost: '://test_url.com',
        apiEndpoint: 'api/v2',
        transport: apiJsonTransportMock
    });

    return api.transformEndpoint(testArray).then(l =>
        expect(l).toEqual(testArray.slice().reverse())
    );
});

test('Response transformer', () => {
    const testArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    class MockAPI extends GachainAPI {
        public transformEndpoint = this.setEndpoint<number[], number[]>('get', 'test', {
            responseTransformer: response => response.slice().reverse()
        });
    }

    const api = new MockAPI({
        apiHost: '://test_url.com',
        apiEndpoint: 'api/v2',
        transport: apiJsonTransportMock
    });

    return api.transformEndpoint(testArray).then(l =>
        expect(l).toEqual(testArray.slice().reverse())
    );
});

test('Login', () => {
    const testRequest = {
        ecosystem: '1',
        expire: 4815162342,
        publicKey: '04123456789',
        signature: 'test',
        role: 123
    };

    return paramTestingAPIMock().login(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/login`,
            ecosystem: '1',
            expire: 4815162342,
            pubkey: '123456789',
            signature: 'test',
            role_id: 123,
            roles: []
        });
    });
});

test('Refresh', () => {
    const testRequest = {
        token: '4815162342',
        expire: 4815162342
    };

    return paramTestingAPIMock().refresh(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/refresh`,
            token: '4815162342',
            expire: 4815162342
        });
    });
});

test('RequestNotifications', () => {
    const testRequest = [
        { id: '1', ecosystem: '2' },
        { id: '1', ecosystem: '1' },
        { id: '1', ecosystem: '3' },
        { id: '2', ecosystem: '1' },
        { id: '2', ecosystem: '2' },
        { id: '3', ecosystem: '3' },
        { id: '3', ecosystem: '1' },
        { id: '3', ecosystem: '2' },
        { id: '3', ecosystem: '3' },
    ];

    return paramTestingAPIMock().requestNotifications(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/updnotificator`,
            ids: JSON.stringify(testRequest)
        });
    });
});

test('GetContract', () => {
    const testRequest = {
        name: 'TEST_CONTRACT',
    };

    return paramTestingAPIMock().getContract(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/contract/TEST_CONTRACT`
        });
    });
});

test('GetContracts', () => {
    const testRequest = {
        offset: 4,
        limit: 8
    };

    return paramTestingAPIMock().getContracts(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/contracts?limit=8&offset=4`,
            offset: 4,
            limit: 8
        });
    });
});

test('GetParam', () => {
    const testRequest = {
        name: 'TEST_PARAM'
    };

    return paramTestingAPIMock().getParam(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/ecosystemparam/TEST_PARAM`
        });
    });
});

test('GetParams', () => {
    const testRequest = {
        names: ['TEST_PARAM', 'MOCK_PARAM', ',#PARAM']
    };

    return paramTestingAPIMock().getParams(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/ecosystemparams?names=TEST_PARAM%2CMOCK_PARAM%2C%2C%23PARAM`,
            names: 'TEST_PARAM,MOCK_PARAM,,#PARAM'
        });
    });
});

test('GetPage', () => {
    const testRequest = {
        name: 'TEST_PAGE'
    };

    return paramTestingAPIMock().getPage(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/interface/page/TEST_PAGE`
        });
    });
});

test('GetMenu', () => {
    const testRequest = {
        name: 'TEST_MENU'
    };

    return paramTestingAPIMock().getMenu(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/interface/menu/TEST_MENU`
        });
    });
});

test('GetBlock', () => {
    const testRequest = {
        name: 'TEST_BLOCK'
    };

    return paramTestingAPIMock().getBlock(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/interface/block/TEST_BLOCK`
        });
    });
});

test('GetTable', () => {
    const testRequest = {
        name: 'TEST_TABLE'
    };

    return paramTestingAPIMock().getTable(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/table/TEST_TABLE`
        });
    });
});

test('GetTables', () => {
    const testRequest = {
        offset: 4,
        limit: 8
    };

    return paramTestingAPIMock().getTables(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/tables?limit=8&offset=4`,
            offset: 4,
            limit: 8
        });
    });
});

test('GetHistory', () => {
    const testRequest = {
        id: '4815162342',
        table: 'TEST_TABLE'
    };

    return paramTestingAPIMock().getHistory(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/history/TEST_TABLE/4815162342`
        });
    });
});

test('GetRow', () => {
    const testRequest = {
        id: '4815162342',
        table: 'TEST_TABLE',
        columns: ['COL_1', 'COL2', '@COL"3']
    };

    return paramTestingAPIMock().getRow(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/row/TEST_TABLE/4815162342?columns=COL_1%2CCOL2%2C%40COL%223`,
            columns: 'COL_1,COL2,@COL"3'
        });
    });
});

test('GetData', () => {
    const testRequest = {
        name: 'TEST_TABLE',
        columns: ['COL_1', 'COL2', '@COL"3']
    };

    return paramTestingAPIMock().getData(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/list/TEST_TABLE?columns=COL_1%2CCOL2%2C%40COL%223`,
            columns: 'COL_1,COL2,@COL"3'
        });
    });
});

test('Content', () => {
    const testRequest = {
        type: 'page',
        name: 'TEST_PAGE',
        locale: 'en-US',
        params: {
            strParam: 'hello?',
            numParam: 4815162342,
            boolParam: true
        }
    } as IContentRequest;

    return paramTestingAPIMock().content(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/content/page/TEST_PAGE`,
            lang: 'en-US',
            strParam: 'hello?',
            numParam: 4815162342,
            boolParam: true
        });
    });
});

test('ContentTest', () => {
    const testRequest = {
        template: 'TEST_DATA',
        locale: 'en-US',
        params: {
            strParam: 'hello?',
            numParam: 4815162342,
            boolParam: true
        }
    };

    return paramTestingAPIMock().contentTest(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/content`,
            lang: 'en-US',
            template: 'TEST_DATA',
            strParam: 'hello?',
            numParam: 4815162342,
            boolParam: true
        });
    });
});

test('TxCall', () => {
    const testRequest = {
        name: 'TEST_TX',
        pubkey: '4815162342',
        signature: 'TEST_SIGN',
        time: '4815162342',
        params: {
            strParam: 'hello?',
            numParam: 4815162342,
            boolParam: true
        }
    };

    return paramTestingAPIMock().txCall(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/contract/TEST_TX`,
            pubkey: '4815162342',
            signature: 'TEST_SIGN',
            time: '4815162342',
            strParam: 'hello?',
            numParam: 4815162342,
            boolParam: true
        });
    });
});

test('TxPrepare', () => {
    const testRequest = {
        name: 'TEST_TX',
        params: {
            strParam: 'hello?',
            numParam: 4815162342,
            boolParam: true
        }
    };

    return paramTestingAPIMock().txPrepare(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/prepare/TEST_TX`,
            strParam: 'hello?',
            numParam: 4815162342,
            boolParam: true
        });
    });
});

test('TxStatus', () => {
    const testRequest = {
        hash: '4815162342'
    };

    return paramTestingAPIMock().txStatus(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/txstatus/4815162342`
        });
    });
});