import PropTypes from 'prop-types';
import { PureComponent } from 'react';

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
        isLoading: PropTypes.bool.isRequired
    };

    static defaultProps = {
        type: '',
        id: -1
    };

    typeMap = {
        [TYPE_CATEGORY]: () => <PLP />,
        [TYPE_CMS_PAGE]: this.renderCmsPage.bind(this),
        [TYPE_PRODUCT]: this.renderPDP.bind(this)
    };

    render404;

    renderPDP() {
        const { id } = this.props;

        return (
            <PDP id={ id } />
        );
    }

    renderCmsPage() {
        const { id } = this.props;

        return (
            <CmsPage pageIds={ id } />
        );
    }

    render() {
        const { props } = this;
        const {
            type,
            isLoading
        } = this.props;

        this.render404 = () => <NoMatch { ...props } />;

        if (isLoading) {
            return 'loading...';
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
