// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import { isArabic } from 'Util/App';

import logo from './logo/6thstreet_logo.png';

import './HeaderLogo.style';

class HeaderLogo extends PureComponent {
    state = {
        isArabic: isArabic()
    };

    render() {
        const { isArabic } = this.state;

        return (
            <Link to="/men.html" block="HeaderLogo" mods={ { isArabic } }>
                <Image mix={ { block: 'Image', mods: { isArabic } } } src={ logo } />
            </Link>
        );
    }
}

export default HeaderLogo;
