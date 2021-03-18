import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import GTMRouteWrapper from 'Component/GoogleTagManager/GoogleTagManagerRouteWrapper.component';
import {
    CATEGORY,
    CMS_PAGE,
    NOT_FOUND,
    PDP as PRODUCT_PAGE
} from 'Component/Header/Header.config';
import Loader from 'Component/Loader';
import CmsPage from 'Route/CmsPage';
import NoMatch from 'Route/NoMatch';
import PDP from 'Route/PDP';
import PLP from 'Route/PLP';

import { TYPE_CATEGORY, TYPE_CMS_PAGE, TYPE_PRODUCT } from './UrlRewrites.config';

import './UrlRewrites.style';

class UrlRewrites extends PureComponent {
    static propTypes = {
        type: PropTypes.string,
        id: PropTypes.number,
        sku: PropTypes.string,
        isLoading: PropTypes.bool.isRequired
    };

    static defaultProps = {
        type: '',
        id: -1,
        sku: ''
    };

    typeMap = {
        [TYPE_CATEGORY]: this.renderCategory.bind(this),
        [TYPE_CMS_PAGE]: this.renderCmsPage.bind(this),
        [TYPE_PRODUCT]: this.renderPDP.bind(this)
    };

    render404;

    renderPDP() {
        const { id, sku } = this.props;

        return (
            <GTMRouteWrapper route={ PRODUCT_PAGE }>
                <PDP id={ id } sku={ sku } />
            </GTMRouteWrapper>
        );
    }

    renderCategory() {
        return (
            <GTMRouteWrapper route={ CATEGORY }>
                <PLP />
            </GTMRouteWrapper>
        );
    }

    renderCmsPage() {
        const { id } = this.props;

        return (
            <GTMRouteWrapper route={ CMS_PAGE }>
                <CmsPage pageIds={ id } />
            </GTMRouteWrapper>
        );
    }

    render() {
        const {
            type,
            isLoading
        } = this.props;

        this.render404 = () => (
            <GTMRouteWrapper route={ NOT_FOUND }>
                <NoMatch { ...this.props } />
            </GTMRouteWrapper>
        );

        if (isLoading) {
            return <Loader isLoading={ isLoading } />;
        }

        const renderFunction = this.typeMap[type] || this.render404;

        return (
            <div block="UrlRewrites">
                { renderFunction() }
            </div>
        );
    }
}

export default UrlRewrites;
