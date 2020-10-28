import { LOADING_TIME } from '@scandipwa/scandipwa/src/route/CmsPage/CmsPage.config';
import { mapDispatchToProps, mapStateToProps } from '@scandipwa/scandipwa/src/route/CmsPage/CmsPage.container';
import { gql, request } from 'graphql-request';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { CMS_PAGE } from 'Component/Header/Header.config';
import {
    CmsPageContainer as SourceCmsPageContainer
} from 'SourceRoute/CmsPage/CmsPage.container';
import { debounce, getGraphqlEndpoint } from 'Util/Request';
import { appendWithStoreCode } from 'Util/Url';

import CmsPage from './CmsPage.component';

export class CmsPageContainer extends SourceCmsPageContainer {
    async requestPage() {
        const params = this.getRequestQueryParams();
        const { id } = params;
        const CmsPageQuery = gql`
            query cmsPage(
                $id: Int!
            ) {
                cmsPage(id: $id) {
                    title,
                    content,
                    content_heading,
                    meta_title
                }
            }
        `;
        const endPoint = getGraphqlEndpoint();

        const variables = {
            id
        };

        const data = await request(endPoint, CmsPageQuery, variables);
        const { cmsPage } = data;

        this.onPageLoad(cmsPage);
    }

    onPageLoad = (cmsPage) => {
        const {
            location: { pathname },
            updateMeta,
            setHeaderState,
            updateBreadcrumbs
        } = this.props;

        const { content_heading, meta_title, title } = cmsPage;

        debounce(this.setOfflineNoticeSize, LOADING_TIME)();

        updateBreadcrumbs(cmsPage);
        updateMeta({ title: meta_title || title });

        if (
            pathname !== appendWithStoreCode('/')
            && pathname !== '/'
        ) {
            setHeaderState({
                name: CMS_PAGE,
                title: content_heading,
                onBackClick: () => history.goBack()
            });
        }

        this.setState({ page: cmsPage, isLoading: false });
    };

    render() {
        return (
            <CmsPage
              { ...this.props }
              { ...this.state }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CmsPageContainer));
