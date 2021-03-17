import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import { isArabic } from 'Util/App';

import logo from './logo/6thstreet_logo.png';

import './HeaderLogo.style';

class HeaderLogo extends PureComponent {
    static propTypes = {
        setGender: PropTypes.func.isRequired
    };

    state = {
        isArabic: isArabic()
    };

    render() {
        const { isArabic } = this.state;
        const { setGender } = this.props;

        return (
            <Link to="/women.html" block="HeaderLogo" mods={ { isArabic } } onClick={ setGender }>
                <Image mix={ { block: 'Image', mods: { isArabic } } } src={ logo } />
            </Link>
        );
    }
}

export default HeaderLogo;
