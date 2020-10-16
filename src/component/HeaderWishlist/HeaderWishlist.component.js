import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import { isArabic } from 'Util/App';

import './HeaderWishlist.style';

class HeaderWishlist extends PureComponent {
    static propTypes = {
        history: PropTypes.object.isRequired,
        isBottomBar: PropTypes.bool.isRequired,
        isWishlist: PropTypes.bool.isRequired,
        wishListItems: PropTypes.array.isRequired,
        isMobile: PropTypes.bool
    };

    static defaultProps = {
        isMobile: false
    };

    state = {
        isArabic: isArabic()
    };

    routeChangeWishlist = () => {
        const { history } = this.props;

        history.push('/my-account/my-wishlist');
    };

    render() {
        const {
            isBottomBar,
            isWishlist,
            isMobile,
            wishListItems
        } = this.props;
        const { isArabic } = this.state;
        const itemsCount = wishListItems.length;

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
                <button
                  onClick={ this.routeChangeWishlist }
                >
                    <div block="HeaderWishlist" elem="Count" mods={ { have: !!itemsCount } }>{ itemsCount }</div>
                    <span block="HeaderWishlist" elem="Heart" mods={ { isBlack: !!itemsCount } } />
                </button>
                <label htmlFor="WishList">{ __('WishList') }</label>
            </div>
        );
    }
}

export default withRouter(HeaderWishlist);
