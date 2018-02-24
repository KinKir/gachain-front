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
import { getPage } from 'modules/admin/actions';
import { navigatePage } from 'modules/content/actions';

import EditPage from 'components/Main/Admin/Interface/EditPage';

interface IEditPageProps {
    vde?: boolean;
    pageID: string;
    tabData: any;
    // page: { id: string, name: string, menu: string, conditions: string, value: string };
    menus: { id: string, name: string, conditions: string, value: string }[];
    navigatePage?: (params: { name: string, params?: any }) => void;
    getPage?: typeof getPage.started;
    onSave?: (pageID: string, vde?: boolean) => void;
    random?: number;
}

class EditPageContainer extends React.Component<IEditPageProps> {
    componentWillMount() {
        this.getPage();
    }

    getPage() {
        this.props.getPage({ id: this.props.pageID, vde: this.props.vde });
    }

    componentWillReceiveProps(props: IEditPageProps) {
        if (props.random && this.props.random !== props.random) {
            this.getPage();
        }
    }

    onSave(block: string, error?: { type: string, error: string }) {
        if (this.props.onSave) {
            this.props.onSave(this.props.pageID, this.props.vde);
        }
    }

    render() {
        const pageTab = this.props.tabData && this.props.tabData['interfacePage' + this.props.pageID + (this.props.vde ? '-vde' : '')] || null;
        let page = null;
        if (pageTab) {
            page = pageTab.data;
        }

        return (
            <EditPage page={page} menus={this.props.menus} tabView={true} navigatePage={this.props.navigatePage} onExec={this.onSave.bind(this)}/>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    tabData: state.admin.tabs && state.admin.tabs.data || null,
    // page: state.admin.page,
    menus: state.admin.menus
});

const mapDispatchToProps = {
    getPage: getPage.started,
    navigatePage: navigatePage.started
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPageContainer);