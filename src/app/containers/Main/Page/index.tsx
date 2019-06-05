/*---------------------------------------------------------------------------------------------
 *  Copyright (c) GACHAIN All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react';
import * as _ from 'lodash';
import * as queryString from 'query-string';
import { connect } from 'react-redux';
import { IRootState } from 'modules';
import { ecosystemInit } from 'modules/content/actions';
import { renderPage, renderLegacyPage, navigatePage, switchSection } from 'modules/sections/actions';
import { TSection } from 'gachain/content';
import { LEGACY_PAGES } from 'lib/legacyPages';

import Page from 'components/Main/Page';
import NotFound from 'components/Main/Page/NotFound';

export interface IPageContainerProps {
    match?: { params: { [key: string]: string } };
    location?: {
        key: string;
        search: string;
    };
}

interface IPageContainerState {
    initialized: boolean;
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
        if (!this.props.initialized) {
            this.props.ecosystemInit({
                section: this.props.match.params.section
            });
        }
    }

    componentWillReceiveProps(props: IPageContainerProps & IPageContainerState & IPageContainerDispatch) {
        if (!props.initialized) {
            return;
        }

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
        const requestPage = (props.match.params.pageName || (section && section.defaultPage));
        const params = queryString.parse(props.location.search);

        if (!isPending && section) {
            if (!section.page || section.page.name !== requestPage || section.force || this.props.location.search !== props.location.search) {
                const legacyPage = LEGACY_PAGES[requestPage];

                if (legacyPage && (!legacyPage.section || section.name === legacyPage.section)) {
                    props.renderLegacyPage({
                        section: legacyPage.section || section.name,
                        name: requestPage,
                        menu: legacyPage.menu,
                        params
                    });
                }
                else {
                    props.renderPage({
                        key: props.location.key,
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
                {this.props.initialized && !this.props.sections[this.props.match.params.section] && (
                    <NotFound />
                )}
                {_.map(this.props.sections, section => {
                    const isLegacy = section.page && section.page.legacy;
                    const legacyPage = isLegacy ? LEGACY_PAGES[section.page.name] : null;

                    return (
                        <div key={section.name || 'error'} className="flex-col flex-stretch" style={{ display: this.props.section === section.name ? null : 'none', overflowX: 'hidden', overflowY: 'auto' }}>
                            {isLegacy ? legacyPage.render(section.page.params) : (
                                <Page
                                    key={section.key}
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
    initialized: state.sections.inited,
    section: state.sections.section,
    sections: state.sections.sections
});

const mapDispatchToProps = {
    navigatePage: navigatePage.started,
    renderPage: renderPage.started,
    renderLegacyPage: renderLegacyPage.started,
    ecosystemInit: ecosystemInit.started,
    switchSection
};

export default connect<IPageContainerState, IPageContainerDispatch, IPageContainerProps>(mapStateToProps, mapDispatchToProps)(PageContainer);