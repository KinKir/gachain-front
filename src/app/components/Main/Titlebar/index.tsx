// MIT License
// 
// Copyright (c) 2016-2019 GACHAIN
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

import * as React from 'react';
import styled from 'styled-components';
import platform from 'lib/platform';

export interface ITitlebarProps {
    maximizable?: boolean;
}

const StyledControls = styled.div`
    position: relative;

    .window-title {
        position: absolute;
        text-align: center;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
`;

const Titlebar = platform.select<React.SFC<ITitlebarProps>>({
    web: () => null,
    desktop: props => {
        const DarwinTitlebar = require('./DarwinTitlebar').default;
        const LinuxTitlebar = require('./LinuxTitlebar').default;
        const WinTitlebar = require('./WinTitlebar').default;

        return (
            <StyledControls>
                {platform.select({
                    darwin: (<DarwinTitlebar {...props} />),
                    linux: (<LinuxTitlebar {...props} />),
                    win32: (<WinTitlebar {...props} />),

                    // Fallback for unsupported platforms
                    desktop: (<LinuxTitlebar {...props} />)
                })}
                <div className="window-title">{props.children}</div>
            </StyledControls>
        );
    }
});

export default Titlebar;