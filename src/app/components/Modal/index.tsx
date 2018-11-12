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

import React from 'react';

import themed from 'components/Theme/themed';

export interface IModalProps<P, R> {
    params: P;
    onResult: (data: R) => void;
    onCancel: () => void;
    notify: (type: string, params: any) => void;
    changeLocale: (locale: string) => void;
    children: React.ReactNode[];
}

export type TModalComponentClass<P, R> =
    React.ComponentType<IModalProps<P, R>> |
    React.SFC<IModalProps<P, R>>;

const StyledHeader = themed.div`
    background: ${props => props.theme.modalHeaderBackground};
    color: ${props => props.theme.modalHeaderForeground};
    margin: -1px -1px 0 -1px;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
`;

const StyledBody = themed.div`
    padding: 15px;
    min-width: 300px;
`;

const StyledFooter = themed.div`
    padding: 15px;
    background: #efefef;
    border-top: solid 1px #d0dff3;
`;

export abstract class ModalContainer<P, S = {}> extends React.Component<P, S> {
    public static Header = StyledHeader;
    public static Body = StyledBody;
    public static Footer = StyledFooter;
}

export default abstract class Modal<P, R, S = {}> extends React.Component<IModalProps<P, R>, S> {
    public static Header = StyledHeader;
    public static Body = StyledBody;
    public static Footer = StyledFooter;
}