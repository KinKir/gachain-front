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
import styled from 'styled-components';

const PanelDiv = styled.div`
    .b-panel__header {
        position: relative;
        height: 34px;
        background-color: #3a4653;
        padding-left: 20px;
    }
    
    .b-panel__header__text {
        line-height: 34px;
        font-size: 14px;
        font-family: "Avenir-Book", "Source Sans Pro", sans-serif;
        text-transform: uppercase;
        color: #707c91;
    }
    
    .b-panel__header__toggle {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 16px;
        height: 3px;
        background-color: #dcdfe2;
        cursor: pointer;
    }
    
    .b-panel__body {
        background-color: #465669;
        min-height: 100px;
    }   
`;

interface IConstructorPanelProps {
    title: string;
}

const ConstructorPanel: React.SFC<IConstructorPanelProps> = (props) => (
    <PanelDiv>
        <div className="b-panel__header">
            <div className="b-panel__header__text">
                {props.title}
            </div>
            <div className="b-panel__header__toggle"/>
        </div>
        <div className="b-panel__body">
            {props.children}
        </div>
    </PanelDiv>
);

export default ConstructorPanel;