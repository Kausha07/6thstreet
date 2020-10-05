// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './WishlistIcon.style';

class WishlistIcon extends PureComponent {
    renderIcon() {
        return (
            <div block="WishlistIcon" elem="Icon" />
        );
    }

    render() {
        return (
            <div block="WishlistIcon">
                { this.renderIcon() }
            </div>
        );
    }
}

export default WishlistIcon;
