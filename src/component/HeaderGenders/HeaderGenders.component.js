import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import GenderButton from 'Component/GenderButton';
import { isArabic } from 'Util/App';

import './HeaderGenders.style';

class HeaderGenders extends PureComponent {
    state = {
        isArabic: isArabic()
    };

    static propTypes = {
        isMobile: PropTypes.bool
    };

    static defaultProps = {
        isMobile: false
    };

    genderList = [
        {
            label: __('Men'),
            key: 'men'
        },
        {
            label: __('Women'),
            key: 'women'
        },
        {
            label: __('Kids'),
            key: 'kids'
        }
    ];

    renderGender = (gender) => {
        const { key } = gender;

        return (
            <div
              block="GenderButton"
              elem="Container"
              key={ key }
            >
                <GenderButton
                  gender={ gender }
                  mix={ {
                      block: 'HeaderGenders',
                      elem: 'Button'
                  } }
                />
            </div>
        );
    };

    renderGenders() {
        return this.genderList.map(this.renderGender);
    }

    render() {
        const { isArabic } = this.state;
        const { isMobile } = this.props;

        return (
            <div
              mix={ { block: 'HeaderGenders', mods: { isArabic, isMobile } } }
            >
                { this.renderGenders() }
            </div>
        );
    }
}

export default HeaderGenders;
