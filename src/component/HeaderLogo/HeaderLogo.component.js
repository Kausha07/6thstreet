// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';

import logo from './logo/6thstreet_logo.png';

import './HeaderLogo.style';

class HeaderLogo extends PureComponent {
    render() {
        return (
            <div block="HeaderLogo">
                <Image src={ logo } />
            </div>
        );
    }
}

export default HeaderLogo;
