import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import CmsBlock from 'Component/CmsBlock';
import FooterBottom from 'Component/FooterBottom';
import FooterMain from 'Component/FooterMain';
import FooterMiddle from 'Component/FooterMiddle';
import FooterMobile from 'Component/FooterMobile';
import isMobile from 'Util/Mobile';

import './Footer.style';

export class Footer extends PureComponent {
    static propTypes = {
        isVisibleOnMobile: PropTypes.bool
    };

    static defaultProps = {
        isVisibleOnMobile: false
    };

    state = {
        isCheckout: false,
        isFooterAccountOpen: false
    };

    static getDerivedStateFromProps() {
        return location.pathname.match(/checkout/) ? {
            isCheckout: true
        } : {
            isCheckout: false
        };
    }

    handleFooterIsAccountOpen = () => {
        const { isFooterAccountOpen } = this.state;
        this.setState({ isFooterAccountOpen: !isFooterAccountOpen });
    };

    renderSections() {
        const { footer_content: { footer_cms } = {} } = window.contentConfiguration;

        const { isCheckout } = this.state;

        if (footer_cms) {
            return <CmsBlock identifier={ footer_cms } />;
        }

        if (isCheckout) {
            return <FooterMiddle />;
        }

        return (
            <>
                <FooterMain />
                <FooterMiddle
                  handleFooterIsAccountOpen={ this.handleFooterIsAccountOpen }
                />
                <FooterBottom />
                <FooterMobile />
            </>
        );
    }

    render() {
        const { isVisibleOnMobile } = this.props;
        const { isFooterAccountOpen } = this.state;

        if (!isVisibleOnMobile && (isMobile.any() || isMobile.tablet())) {
            return null;
        }

        if (isVisibleOnMobile && (!isMobile.any() && !isMobile.tablet())) {
            return null;
        }

        return (
            <footer block="Footer" mods={ { isFooterAccountOpen } } aria-label="Footer">
                { this.renderSections() }
            </footer>
        );
    }
}

export default withRouter(Footer);
