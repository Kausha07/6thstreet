// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';

import logo from './logo/6thstreet_logo.png';

import './HeaderLogo.style';

class HeaderLogo extends PureComponent {
    render() {
        return (
            <Link to="/men.html" block="HeaderLogo">
                <Image src={ logo } />
            </Link>
        );
    }
}

export default HeaderLogo;
