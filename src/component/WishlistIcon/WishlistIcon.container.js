// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import WishlistIcon from './WishlistIcon.component';

class WishlistIconContainer extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        // isDisabled: this._getIsDisabled()
    };

    render() {
        return (
            <WishlistIcon
              { ...this.props }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default WishlistIconContainer;
