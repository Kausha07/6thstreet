import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDP from 'Route/PDP';
import NoMatch from 'Route/NoMatch';
import PLP from 'Route/PLP';

import { TYPE_CATEGORY, TYPE_CMS_PAGE, TYPE_PRODUCT } from './UrlRewrites.config';

import './UrlRewrites.style';

class UrlRewrites extends PureComponent {
    static propTypes = {
        type: PropTypes.string,
        isLoading: PropTypes.bool.isRequired
    };

    static defaultProps = {
        type: ''
    };

    typeMap = {
        [TYPE_CATEGORY]: () => <PLP />,
        [TYPE_CMS_PAGE]: () => 'cms',
        [TYPE_PRODUCT]: () => <PDP />
    };

    render404;

    render() {
        const { props } = this;
        const { type, isLoading } = this.props;

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
