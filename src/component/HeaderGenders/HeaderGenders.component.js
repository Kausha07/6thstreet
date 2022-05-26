import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import GenderButton from 'Component/GenderButton';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './HeaderGenders.style';


export const mapStateToProps = (state) => ({
    currContentGender: state.AppState.gender
});

class HeaderGenders extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isArabic: isArabic(),
            currentGenderButton: '',
            isUnsetStyle: false,
            curContGender: this.props.currentContentGender

        };
      }

    static propTypes = {
        currentContentGender: PropTypes.string.isRequired,
        currContentGender: PropTypes.string.isRequired,
        changeMenuGender: PropTypes.func,
        isMobile: PropTypes.bool,
        isMenu: PropTypes.bool
    };

    static defaultProps = {
        changeMenuGender: () => {},
        isMobile: false,
        isMenu: false
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
        },
        {
            label: `${__('Home')}`,
            key: 'home'
        },
        {
            label: `${__('All')}`,
            key: 'all'
        }
    ];

    getNewActiveMenuGender = (key) => {
        const { currentGenderButton } = this.state;
        if (currentGenderButton !== key) {
            this.setState({ currentGenderButton: key });
        }
    };

    isCurrentGender(key) {

        let { currentContentGender } = this.props;

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
        const {
            changeMenuGender,
            currentContentGender,
            isMenu
        } = this.props;

        if (key === 'home_beauty_women' && (!isMobile.any() || (isMobile.any() && isMenu))
        ) {
            return null;
        }

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
export default connect(mapStateToProps, null)(HeaderGenders)
