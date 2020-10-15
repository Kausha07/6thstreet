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
        const { isBottomBar, isWishlist, isMobile } = this.props;
        const { isArabic } = this.state;
        console.log(this.props);

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
                    <span />
                </button>
                <label htmlFor="WishList">{ __('WishList') }</label>
            </div>
        );
    }
}

export default withRouter(HeaderWishlist);
