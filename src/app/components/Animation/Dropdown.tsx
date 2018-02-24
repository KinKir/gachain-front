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
import Transition from 'react-transition-group/Transition';

const animationDuration = 300;
const containerAnimationDef = {
    defaultStyle: {
        position: 'absolute',
        overflow: 'hidden',
        zIndex: 600
    },

    alignStyle: {
        left: { left: 0 },
        right: { right: 0 }
    },

    // Negative margins are used to mitigate padding that is used to
    // show the box-shadow. After animation completes we reset overflow
    // back to visible, so we don't need those again
    entering: {
        padding: '0 50px 50px',
        margin: '0 -50px',
        overflow: 'hidden'
    },
    entered: {
        overflow: 'visible'
    },

    // Same as 'entering'. Padding is used to correctly show the box-shadow
    exiting: {
        padding: '0 50px 50px',
        margin: '0 -50px',
        overflow: 'hidden',
        zIndex: 500
    }
};

const animationDef = {
    defaultStyle: {
        transition: `transform ${animationDuration}ms cubic-bezier(0,0.5,0,1)`,
        transform: 'translateY(-100%)',
        marginTop: '0'
    },
    entering: {
        transform: 'translateY(0)'
    },
    entered: {
        transform: 'translateY(0)'
    },

    // We use negative margin to make children unclickable and not to break
    // animation that will be used later
    exited: {
        transform: 'translateY(-100%)',
        marginTop: '-100000px'
    }
};

export interface IDropdownProps {
    visible: boolean;
    align?: 'left' | 'right';
    width?: number;
}

const Dropdown: React.SFC<IDropdownProps> = props => (
    <Transition in={props.visible} timeout={animationDuration}>
        {(state: string) => (
            <div style={{ ...containerAnimationDef.defaultStyle, ...containerAnimationDef[state], ...(props.align ? containerAnimationDef.alignStyle[props.align] : null) }}>
                <div style={{ ...animationDef.defaultStyle, ...animationDef[state], width: props.width }}>
                    {props.children}
                </div>
            </div>
        )}
    </Transition>
);

export default Dropdown;