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

import * as React from 'react';
import styled from 'styled-components';

const Tab = styled.div`
    overflow-y: auto;
`;

export interface ITabViewProps {
    tabs: string[];
    children: JSX.Element[];
    className?: string;
    tabsClassName?: string;
    wrapperClassName?: string;
    paneClassName?: string;
}

interface ITabViewState {
    tabIndex: number;
}

export default class TabView extends React.Component<ITabViewProps, ITabViewState> {
    constructor(props: ITabViewProps) {
        super(props);
        this.state = {
            tabIndex: 0
        };
    }

    onTabSwitch(tabIndex: number) {
        this.setState({
            tabIndex
        });
    }

    render() {
        return (
            <Tab className={`${this.props.wrapperClassName || ''}`}>
                <ul className={`nav nav-tabs ${this.props.tabsClassName || ''}`}>
                    {this.props.tabs.map((tab, index) => (
                        <li key={index} className={`uib-tab ${index === this.state.tabIndex ? 'active' : ''}`}>
                            <a href="javascript:void(0)" onClick={this.onTabSwitch.bind(this, index)}>{tab}</a>
                        </li>
                    ))}
                </ul>
                <div className={`tab-content ${this.props.className || ''}`}>
                    {this.props.children.map((element, index) => (
                        <div key={index} className={`tab-pane ${this.props.paneClassName || ''} ${this.state.tabIndex === index ? 'active' : ''}`}>
                            {element}
                        </div>
                    ))}
                </div>
            </Tab>
        );
    }
}