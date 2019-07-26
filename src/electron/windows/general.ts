/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindow } from 'electron';
import calcScreenOffset from '../util/calcScreenOffset';

export default () => {
    return new BrowserWindow({
        frame: false,
        backgroundColor: '#17437b',
        resizable: false,
        show: false,
        ...calcScreenOffset({ width: 640, height: 485 })
    });
};