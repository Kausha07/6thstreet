import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './HeaderWishlist.style';

class HeaderWishlist extends PureComponent {
    static propTypes = {
        isBottomBar: PropTypes.bool.isRequired,
        isWishlist: PropTypes.bool.isRequired,
        language: PropTypes.string.isRequired
    };

    state = {
        isArabic: false
    };

    static getDerivedStateFromProps(nextProps) {
        const { language } = nextProps;
        return ({ isArabic: language !== 'en' });
    }

    render() {
        const { isBottomBar, isWishlist } = this.props;
        const { isArabic } = this.state;

        return (
            <div
              block="HeaderWishlist"
              mods={ { isWishlist } }
              mix={ {
                  block: 'HeaderWishlist',
                  mods: { isBottomBar },
                  mix: {
                      block: 'HeaderWishlist',
                      mods: { isArabic }
                  }
              } }
            >
                <div> </div>
                <label htmlFor="WishList">{ __('WishList') }</label>
            </div>
        );
    }
}

export default HeaderWishlist;
