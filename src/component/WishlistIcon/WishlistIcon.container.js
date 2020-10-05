import { PureComponent } from 'react';

import WishlistIcon from './WishlistIcon.component';

class WishlistIconContainer extends PureComponent {
    render() {
        return (
            <WishlistIcon
              { ...this.props }
            />
        );
    }
}

export default WishlistIconContainer;
