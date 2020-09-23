import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './HeaderWishlist.style';

class HeaderWishlist extends PureComponent {
    static propTypes = {
        isBottomBar: PropTypes.bool.isRequired,
        isWishlist: PropTypes.bool.isRequired
        // TODO: implement prop-types
    };

    render() {
        const { isBottomBar, isWishlist } = this.props;

        return (
            <div
              block="HeaderWishlist"
              mods={ { isWishlist } }
              mix={ {
                  block: 'HeaderWishlist',
                  mods: { isBottomBar }
              } }
            >
                <div> </div>
                <label htmlFor="WishList">{ __('WishList') }</label>
            </div>
        );
    }
}

export default HeaderWishlist;
