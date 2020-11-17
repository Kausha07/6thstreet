import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import GenderButton from 'Component/GenderButton';
import { isArabic } from 'Util/App';

import './HeaderGenders.style';

class HeaderGenders extends PureComponent {
    state = {
        isArabic: isArabic(),
        currentGenderButton: '',
        isUnsetStyle: false
    };

    static propTypes = {
        currentContentGender: PropTypes.string.isRequired,
        changeMenuGender: PropTypes.func,
        isMobile: PropTypes.bool
    };

    static defaultProps = {
        changeMenuGender: () => {},
        isMobile: false
    };

    genderList = [
        {
            label: __('Women'),
            key: 'women'
        },
        {
            label: __('Men'),
            key: 'men'
        },
        {
            label: __('Kids'),
            key: 'kids'
        }
    ];

    getNewActiveMenuGender = (key) => {
        const { currentGenderButton } = this.state;
        if (currentGenderButton !== key) {
            this.setState({ currentGenderButton: key });
        }
    };

    isCurrentGender(key) {
        const { currentContentGender } = this.props;
        if (currentContentGender === '' && key === 'women') {
            return true;
        }

        return key === currentContentGender;
    }

    handleUnsetStyle = (isUnsetStyle) => {
        this.setState({ isUnsetStyle });
    };

    renderGender = (gender) => {
        const { key } = gender;
        const { changeMenuGender, currentContentGender } = this.props;
        const { currentGenderButton, isUnsetStyle } = this.state;
        const isCurrentGender = this.isCurrentGender(key);
        if (currentGenderButton === '') {
            this.setState({ currentGenderButton: currentContentGender });
        }

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
                  handleUnsetStyle={ this.handleUnsetStyle }
                  isUnsetStyle={ isUnsetStyle }
                  isCurrentGender={ isCurrentGender }
                  changeMenuGender={ changeMenuGender }
                  getNewActiveMenuGender={ this.getNewActiveMenuGender }
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
