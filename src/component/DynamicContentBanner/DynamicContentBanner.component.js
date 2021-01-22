import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import isMobile from 'Util/Mobile';
import { formatCDNLink } from 'Util/Url';

import './DynamicContentBanner.style';

class DynamicContentBanner extends PureComponent {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                url: PropTypes.string,
                link: PropTypes.string,
                height: PropTypes.string,
                width: PropTypes.string
            })
        ).isRequired,
        isMenu: PropTypes.bool
    };

    static defaultProps = {
        isMenu: false
    };

    state = {
        isMobile: isMobile.any() || isMobile.tablet()
    };

    renderImage = (item, i) => {
        // const { items } = this.props;
        // const { height, width } = items[0];
        const {
            url,
            link
            // height,
            // width
        } = item;

        // TODO: calculate aspect ratio to ensure images not jumping.
        if (!link) {
            return (
                <>
                    <Image
                      key={ i }
                      src={ url }
                      ratio="custom"
                    //   height={ height }
                    //   width={ width }
                    />
                    { this.renderButton() }
                </>
            );
        }

        return (
            <Link
              to={ formatCDNLink(link) }
              key={ i }
            >
                <Image
                  src={ url }
                  ratio="custom"
                //   height={ height }
                //   width={ width }
                />
                { this.renderButton() }
            </Link>
        );
    };

    renderButton() {
        const { isMobile } = this.state;
        const { isMenu } = this.props;

        return isMobile || !isMenu ? null : (
            <button>{ __('Shop now') }</button>
        );
    }

    renderImages() {
        const { items = [] } = this.props;
        return items.map(this.renderImage);
    }

    render() {
        return (
            <div
              block="DynamicContentBanner"
            >
                 { this.renderImages() }
            </div>
        );
    }
}

export default DynamicContentBanner;
