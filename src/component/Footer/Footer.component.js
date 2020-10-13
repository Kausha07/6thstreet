import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CmsBlock from 'Component/CmsBlock';
import FooterBottom from 'Component/FooterBottom';
import FooterMain from 'Component/FooterMain';
import FooterMiddle from 'Component/FooterMiddle';
import FooterMobile from 'Component/FooterMobile';
import isMobile from 'Util/Mobile';

export class Footer extends PureComponent {
    static propTypes = {
        isVisibleOnMobile: PropTypes.bool
    };

    static defaultProps = {
        isVisibleOnMobile: false
    };

    renderSections() {
        const { footer_content: { footer_cms } = {} } = window.contentConfiguration;

        if (footer_cms) {
            return <CmsBlock identifier={ footer_cms } />;
        }

        if (location.pathname.match(/checkout/)) {
            return <FooterMiddle />;
        }

        return (
            <>
                <FooterMain />
                <FooterMiddle />
                <FooterBottom />
                <FooterMobile />
            </>
        );
    }

    render() {
        const { isVisibleOnMobile } = this.props;

        if (!isVisibleOnMobile && (isMobile.any() || isMobile.tablet())) {
            return null;
        }

        if (isVisibleOnMobile && (!isMobile.any() && !isMobile.tablet())) {
            return null;
        }

        return (
            <footer block="Footer" aria-label="Footer">
                { this.renderSections() }
            </footer>
        );
    }
}

export default Footer;
