import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { isArabic } from 'Util/App';

import './HeaderWishlist.style';

class HeaderWishlist extends PureComponent {
    static propTypes = {
        isBottomBar: PropTypes.bool.isRequired,
        isWishlist: PropTypes.bool.isRequired,
        isMobile: PropTypes.bool
    };

    static defaultProps = {
        isMobile: false
    };

    state = {
        isArabic: isArabic()
    };

    render() {
        const { isBottomBar, isWishlist, isMobile } = this.props;
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
                      mods: { isArabic },
                      mix: {
                          block: 'HeaderWishlist',
                          mods: { isMobile }
                      }
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
