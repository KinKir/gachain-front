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

import GachainAPI, { IRequestTransport, TRequestMethod } from './';
import { IContentRequest } from 'gachain/api';

class FormDataMock implements FormData {
    private _values: { [key: string]: any } = {};

    public append(name: string, value: string | Blob, fileName?: string) {
        this.set(name, value, fileName);
    }

    delete(name: string) {
        delete this._values[name];
    }

    get(name: string) {
        return this._values[name];
    }

    getAll(name: string) {
        return this._values[name];
    }

    has(name: string) {
        return !!this._values[name];
    }

    set(name: string, value: string | Blob, fileName?: string) {
        if (value instanceof Blob) {
            this._values[name] = {
                type: 'file',
                value,
                fileName
            };
        }
        else {
            this._values[name] = String(value);
        }
    }
}

(window as any).FormData = FormDataMock;

interface IMockTransportResponse {
    __requestUrl: string;
    method: TRequestMethod;
    url: string;
    body: { [key: string]: any };
    query: { [key: string]: any };
    headers: { [key: string]: any };
}

const apiPassthroughTransportMock: IRequestTransport = request => {
    return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
            resolve({
                json: request
            });
        }, 0);
    });
};

const paramsTransportMock: IRequestTransport = request => {
    return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
            resolve({
                json: {
                    __requestUrl: request.url,
                    body: request.body
                }
            });
        }, 0);
    });
};

const mockFormData = (values: { [key: string]: any }) => {
    const value = new FormData();
    for (let itr in values) {
        if (values.hasOwnProperty(itr)) {
            value.append(itr, values[itr]);
        }
    }
    return value;
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
            expect(l.url).toEqual(`${TEST_URL}/${TEST_ENDPOINT}/${TEST_ROUTE}/test0123456789?slug=test0123456789`)
        ),
        api.complexSlugEndpoint({ a: '../../test', b: '-12345-' }).then(l =>
            expect(l.url).toEqual(`${TEST_URL}/${TEST_ENDPOINT}/${TEST_ROUTE}/${encodeURIComponent('../../test')}/${TEST_ROUTE}/-12345-/test?a=..%2F..%2Ftest&b=-12345-`)
        ),
        api.postSlugEndpoint({ slug: 'test0123456789', some: 1, more: true, params: 'hello' }).then(l =>
            expect(l.url).toEqual(`${TEST_URL}/${TEST_ENDPOINT}/${TEST_ROUTE}/test0123456789`)
        )
    ]);
});

test('Request transformer', () => {
    const testData = {
        first: 1,
        second: 2,
        third: 3
    };

    class MockAPI extends GachainAPI {
        public transformEndpoint = this.setEndpoint<typeof testData, IMockTransportResponse>('get', 'test', {
            requestTransformer: request => ({
                first: request.third,
                third: request.first
            })
        });
    }

    const api = new MockAPI({
        apiHost: '://test_url.com',
        apiEndpoint: 'api/v2',
        transport: apiPassthroughTransportMock
    });

    return api.transformEndpoint(testData).then(l => {
        expect(l.url).toEqual('://test_url.com/api/v2/test?first=3&third=1');
    });
});

test('Response transformer', () => {
    const testData = {
        first: 1,
        second: 2,
        third: 3
    };

    class MockAPI extends GachainAPI {
        public transformEndpoint = this.setEndpoint<typeof testData, Partial<typeof testData>>('post', 'test', {
            responseTransformer: response => ({
                first: response.body.get('third'),
                third: response.body.get('first')
            })
        });
    }

    const api = new MockAPI({
        apiHost: '://test_url.com',
        apiEndpoint: 'api/v2',
        transport: apiPassthroughTransportMock
    });

    return api.transformEndpoint(testData).then(l =>
        expect(l).toEqual({
            first: '3',
            third: '1'
        })
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
            body: mockFormData({
                ecosystem: '1',
                expire: 4815162342,
                pubkey: '123456789',
                signature: 'test',
                role_id: 123,
            }),
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
            body: mockFormData({
                token: '4815162342',
                expire: 4815162342
            })
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
            body: mockFormData({
                ids: JSON.stringify(testRequest)
            })
        });
    });
});

test('GetConfig', () => {
    const testRequest = 'centrifugo';

    return paramTestingAPIMock().getConfig({ name: 'centrifugo' }).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/config/${testRequest}`,
            body: null
        });
    });
});

test('GetContract', () => {
    const testRequest = {
        name: 'TEST_CONTRACT',
    };

    return paramTestingAPIMock().getContract(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/contract/TEST_CONTRACT`,
            body: null
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
            body: null
        });
    });
});

test('GetParam', () => {
    const testRequest = {
        name: 'TEST_PARAM'
    };

    return paramTestingAPIMock().getParam(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/ecosystemparam/TEST_PARAM`,
            body: null
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
            body: null
        });
    });
});

test('GetPage', () => {
    const testRequest = {
        name: 'TEST_PAGE'
    };

    return paramTestingAPIMock().getPage(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/interface/page/TEST_PAGE`,
            body: null
        });
    });
});

test('GetMenu', () => {
    const testRequest = {
        name: 'TEST_MENU'
    };

    return paramTestingAPIMock().getMenu(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/interface/menu/TEST_MENU`,
            body: null
        });
    });
});

test('GetBlock', () => {
    const testRequest = {
        name: 'TEST_BLOCK'
    };

    return paramTestingAPIMock().getBlock(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/interface/block/TEST_BLOCK`,
            body: null
        });
    });
});

test('GetTable', () => {
    const testRequest = {
        name: 'TEST_TABLE'
    };

    return paramTestingAPIMock().getTable(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/table/TEST_TABLE`,
            body: null
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
            body: null
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
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/history/TEST_TABLE/4815162342`,
            body: null
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
            body: null
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
            body: null
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
            body: mockFormData({
                lang: 'en-US',
                strParam: 'hello?',
                numParam: 4815162342,
                boolParam: true
            })
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
            body: mockFormData({
                lang: 'en-US',
                template: 'TEST_DATA',
                strParam: 'hello?',
                numParam: 4815162342,
                boolParam: true
            })
        });
    });
});

test('TxCall', () => {
    const testRequest = {
        pubkey: '4815162342',
        signature: 'TEST_SIGN',
        time: '4815162342',
        requestID: 'RID-4815162342'
    };

    return paramTestingAPIMock().txCall(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/contract/RID-4815162342`,
            body: mockFormData({
                pubkey: '4815162342',
                signature: 'TEST_SIGN',
                time: '4815162342'
            })
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
            body: mockFormData({
                strParam: 'hello?',
                numParam: 4815162342,
                boolParam: true
            })
        });
    });
});

test('TxStatus', () => {
    const testRequest = {
        hash: '4815162342'
    };

    return paramTestingAPIMock().txStatus(testRequest).then((response: any) => {
        expect(response).toEqual({
            __requestUrl: `${paramTestingAPIHost}/${paramTestingAPIEndpoint}/txstatus/4815162342`,
            body: null
        });
    });
});