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
import * as _ from 'lodash';
import * as queryString from 'query-string';
import { connect } from 'react-redux';
import { IRootState } from 'modules';
import { renderPage, ecosystemInit, renderLegacyPage, navigatePage, switchSection } from 'modules/content/actions';
import { TSection } from 'gachain/content';
import { LEGACY_PAGES } from 'lib/legacyPages';

import Page from 'components/Main/Page';

export interface IPageContainerProps {
    match?: { params: { [key: string]: string } };
    location?: {
        search: string;
    };
}

interface IPageContainerState {
    section: string;
    sections: {
        [name: string]: TSection;
    };
}

interface IPageContainerDispatch {
    navigatePage: typeof navigatePage.started;
    renderPage: typeof renderPage.started;
    renderLegacyPage: typeof renderLegacyPage.started;
    switchSection: typeof switchSection;
    ecosystemInit: typeof ecosystemInit.started;
}

class PageContainer extends React.Component<IPageContainerProps & IPageContainerState & IPageContainerDispatch> {
    componentDidMount() {
        this.props.ecosystemInit({
            section: this.props.match.params.section
        });
    }

    componentWillReceiveProps(props: IPageContainerProps & IPageContainerState & IPageContainerDispatch) {
        if (props.section !== props.match.params.section && this.props.match.params.section !== props.match.params.section) {
            this.props.switchSection(props.match.params.section);
        }
        else {
            this.renderPage(props);
        }
    }

    renderPage(props: IPageContainerProps & IPageContainerState & IPageContainerDispatch) {
        const section = props.sections[props.match.params.section];
        const isPending = section ? section.pending : false;
        const requestPage = (props.match.params.pageName || section.defaultPage);
        const params = queryString.parse(props.location.search);

        if (!isPending) {
            if (!section) {
                props.navigatePage({
                    section: 'home',
                    params: {}
                });
            }
            else if (!section.page || section.page.name !== requestPage || section.force || this.props.location.search !== props.location.search) {
                const legacyPage = LEGACY_PAGES[requestPage];

                if (legacyPage && section.name === legacyPage.section) {
                    props.renderLegacyPage({
                        section: legacyPage.section || section.name,
                        name: requestPage,
                        menu: legacyPage.menu,
                        params
                    });
                }
                else {
                    props.renderPage({
                        section: section.name,
                        name: requestPage,
                        params
                    });
                }
            }
        }
    }

    render() {
        return (
            <div className="flex-col flex-stretch">
                {_.map(this.props.sections, section => {
                    const isLegacy = section.page && section.page.legacy;
                    const legacyPage = isLegacy ? LEGACY_PAGES[section.page.name] : null;

                    return (
                        <div key={section.name || 'error'} className="flex-col flex-stretch" style={{ display: this.props.section === section.name ? null : 'none', overflowX: 'hidden', overflowY: 'auto' }}>
                            {isLegacy ?
                                (
                                    legacyPage.render(section.page.params)
                                ) :
                                (
                                    <Page
                                        error={section.page && section.page.error}
                                        name={section.page && section.page.name}
                                        params={section.page && section.page.params}
                                        content={section.page && section.page.content}
                                    />
                                )}
                        </div>
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    section: state.content.section,
    sections: state.content.sections
});

const mapDispatchToProps = {
    navigatePage: navigatePage.started,
    renderPage: renderPage.started,
    renderLegacyPage: renderLegacyPage.started,
    ecosystemInit: ecosystemInit.started,
    switchSection
};

export default connect<IPageContainerState, IPageContainerDispatch, IPageContainerProps>(mapStateToProps, mapDispatchToProps)(PageContainer);