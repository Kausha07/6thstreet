import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import { formatCDNLink } from 'Util/Url';

import './DynamicContentMainBanner.style';

class DynamicContentMainBanner extends PureComponent {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                url: PropTypes.string,
                link: PropTypes.string,
                height: PropTypes.number,
                width: PropTypes.number
            })
        ).isRequired
    };

    renderImage(item, i) {
        const {
            url,
            link
            // height,
            // width
        } = item;

        // TODO: calculate aspect ratio to ensure images not jumping.
        if (!link) {
            return (
                <Image
                  key={ i }
                  src={ url }
                  ratio="custom"
                  height="auto"
                />
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
                  height="auto"
                />
            </Link>
        );
    }

    renderImages() {
        const { items = [] } = this.props;
        return items.map(this.renderImage);
    }

    render() {
        return (
            <div block="DynamicContentMainBanner">
                { this.renderImages() }
            </div>
        );
    }
}

export default DynamicContentMainBanner;
