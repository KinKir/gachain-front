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
import { connect } from 'react-redux';
import { IRootState } from 'modules';
import Tabs from 'components/Tabs';
// import { removeTabList } from 'modules/admin/actions';
import { addTabList, removeTabList } from 'modules/storage/actions';
import styled from 'styled-components';
import ContractEditTabbed from 'containers/Main/containers/Admin/Contracts/EditTabbed';
import ParameterEditTabbed from 'containers/Main/containers/Admin/Parameters/EditTabbed';
import InterfacePageEditTabbed from 'containers/Main/containers/Admin/Interface/EditPageTabbed';
import InterfaceBlockEditTabbed from 'containers/Main/containers/Admin/Interface/EditBlockTabbed';
import InterfaceMenuEditTabbed from 'containers/Main/containers/Admin/Interface/EditMenuTabbed';
import InterfaceConstructorTabbed from 'containers/Main/containers/Admin/Interface/ConstructorTabbed';

const Title = styled.div`
    padding-left: 20px;
    line-height: 30px;
    font-weight: bold;
    color: #777;
`;

interface ITabsContainerProps {
    tabData: any;
    tabList: { id: string, type: string, name?: string, vde?: boolean; visible?: boolean }[];
    // getTabList?: typeof getTabList.started;
    addTabList?: typeof addTabList;
    removeTabList?: typeof removeTabList;
    vde?: boolean;
}

interface ITabsContainerState {
    random: {
        [key: string]: number
    };

}

class TabsContainer extends React.Component<ITabsContainerProps & { match: { params: { type: string, id: string, name: string } } }, ITabsContainerState> {
    constructor(props: ITabsContainerProps & { match: { params: { type: string, id: string, name: string } } }) {
        super(props);
        this.state = {
            random: null
        };
    }

    componentWillMount() {
        let addTab = {};
        if (this.props.match.params.type && this.props.match.params.id) {
            addTab = {
                addID: this.props.match.params.id,
                addName: this.props.match.params.name,
                addType: this.props.match.params.type,
                addVDE: !!this.props.vde
            };
        }
        // this.props.loadTabList(addTab);
        this.props.addTabList(addTab);
        // this.props.getTabList(addTab);
    }

    componentWillReceiveProps(props: ITabsContainerProps & { match: { params: { type: string, id: string, name: string } } }) {
        // alert(JSON.stringify(props));
        // alert('new' + JSON.stringify(this.props));
        // TODO: bugfix reopen closed tab from same page
        if (props.match.params.type && props.match.params.id) {
            if (this.props.match.params.type !== props.match.params.type || this.props.match.params.id !== props.match.params.id || this.props.match.params.name !== props.match.params.name || this.props.vde !== props.vde) {
                let addTab = {
                    addID: props.match.params.id,
                    addName: props.match.params.name,
                    addType: props.match.params.type,
                    addVDE: !!props.vde
                };
                this.props.addTabList(addTab);
                // this.props.getTabList(addTab);
            }
        }
    }

    onTabClose(id: string, type: string, vde: boolean) {
        // alert('close ' + index);
        this.props.removeTabList({ id, type, vde });
    }

    onTabSave(pageID: string, vde?: boolean) {
        // alert('saved tab ' + pageID + ' ' + (vde ? 'vde' : 'not vde'));
        this.setState({
            random: {
                ...this.state.random,
                ['page' + pageID + (vde ? 'vde' : '')]: Math.random()
            }
        });
    }

    renderTabsContent() {
        let tabsContent: JSX.Element[] = [];
        if (this.props.tabList.length) {
            for (let tabListItem of this.props.tabList) {
                // switch components depending on tabListItem.type: page, contract, etc
                if (tabListItem.type === 'interfacePage') {
                    tabsContent.push(
                        <div key={tabListItem.type + tabListItem.id + (tabListItem.vde ? 'vde' : '')}>
                            <Title>Interface Page</Title>
                            <InterfacePageEditTabbed pageID={tabListItem.id} vde={tabListItem.vde} onSave={this.onTabSave.bind(this)} random={this.state.random && this.state.random['page' + tabListItem.id + (tabListItem.vde ? 'vde' : '')]}/>
                        </div>
                    );
                }
                else
                if (tabListItem.type === 'interfaceBlock') {
                    tabsContent.push(
                        <div key={tabListItem.type + tabListItem.id + (tabListItem.vde ? 'vde' : '')}>
                            <Title>Interface Block</Title>
                            <InterfaceBlockEditTabbed blockID={tabListItem.id} vde={tabListItem.vde}/>
                        </div>
                    );
                }
                else
                if (tabListItem.type === 'interfaceMenu') {
                    tabsContent.push(
                        <div key={tabListItem.type + tabListItem.id + (tabListItem.vde ? 'vde' : '')}>
                            <Title>Interface Menu</Title>
                            <InterfaceMenuEditTabbed menuID={tabListItem.id} vde={tabListItem.vde}/>
                        </div>
                    );
                }
                else
                if (tabListItem.type === 'interfaceConstructor') {
                    tabsContent.push(
                        <div key={tabListItem.type + tabListItem.id + (tabListItem.vde ? 'vde' : '')} className="fullscreen">
                            <Title>Interface Constructor</Title>
                            <div className="flex-col flex-stretch">
                                <InterfaceConstructorTabbed pageID={tabListItem.id} pageName={tabListItem.name} vde={tabListItem.vde} onSave={this.onTabSave.bind(this)} random={this.state.random && this.state.random['page' + tabListItem.id + (tabListItem.vde ? 'vde' : '')]}/>
                            </div>
                        </div>
                    );
                }
                else
                if (tabListItem.type === 'contract') {
                    tabsContent.push(
                        <div className="fullscreen animated fadeIn" key={tabListItem.type + tabListItem.id + (tabListItem.vde ? 'vde' : '')}>
                            <Title>Smart Contract</Title>
                            <ContractEditTabbed contractID={tabListItem.id} vde={tabListItem.vde}/>
                        </div>
                    );
                }
                else
                if (tabListItem.type === 'parameter') {
                    tabsContent.push(
                        <div key={tabListItem.type + tabListItem.id + (tabListItem.vde ? 'vde' : '')}>
                            <Title>Ecosystem Parameter</Title>
                            <ParameterEditTabbed parameterName={tabListItem.id} vde={tabListItem.vde}/>
                        </div>
                    );
                }
                else {
                    tabsContent.push(
                        <div key={tabListItem.type + tabListItem.id}/>
                    );
                }
            }

        }
        return tabsContent;
    }

    render() {
        let tabTitles = [];

        if (this.props.tabList.length) {
            for (let tabListItem of this.props.tabList) {
                tabTitles.push({
                    id: tabListItem.id,
                    type: tabListItem.type,
                    name: tabListItem.name || tabListItem.id,
                    vde: !!tabListItem.vde,
                    visible: tabListItem.visible
                });
            }
        }

        let openedTab = { id: '', type: '', vde: false };
        if (this.props.match.params.id && this.props.match.params.type) {
            openedTab.id = this.props.match.params.id;
            openedTab.type = this.props.match.params.type;
            openedTab.vde = !!this.props.vde;
        }

        return (
            <Tabs
                tabList={tabTitles}
                openedTab={openedTab}
                onTabClose={this.onTabClose.bind(this)}
            >
                {this.renderTabsContent()}
            </Tabs>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    tabList: (state.admin.tabs && state.admin.tabs.list) || [],
    tabData: (state.admin.tabs && state.admin.tabs.data) || null,
});

const mapDispatchToProps = {
    // getTabList: getTabList.started,
    addTabList: addTabList,
    removeTabList: removeTabList
};

export default connect(mapStateToProps, mapDispatchToProps)(TabsContainer);