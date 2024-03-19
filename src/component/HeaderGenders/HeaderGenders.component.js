import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import GenderButton from 'Component/GenderButton';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';
import { FlashAnimation } from "../Icons";

import './HeaderGenders.style';
import { getCountryFromUrl } from "Util/Url/Url";
import { isMsiteMegaMenuRoute } from "Component/MobileMegaMenu/Utils/MobileMegaMenu.helper";
import Event,  {
    EVENT_INFLUENCER_HOME_SCREEN_VIEW,
    EVENT_GTM_INFLUENCER
  } from "Util/Event";


export const mapStateToProps = (state) => (
    {
        currContentGender: state.AppState.gender
    }
);

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
        changeMenuGender: () => { },
        isMobile: false,
        isMenu: false
    };


    genderList = [
        {
            label: `${__('All')}`,
            key: 'all'
        },
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
            label: `${__('Premium')}`,
            key: 'home'
        },
        {
            label: `${__('Influencer')}`,
            key: 'influencer',
            icon: <img block="GenderIcon" src={FlashAnimation} alt="my-gif" />
        }
    ];
    
    megamenuGenderList = [
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
    ]
    getNewActiveMenuGender = (key) => {
        const { currentGenderButton } = this.state;
        if (currentGenderButton !== key) {
            this.setState({ currentGenderButton: key });
        }
    };

    isCurrentGender(key) {

        let { currentContentGender } = this.props;
        if (currentContentGender === '' && (key === 'women' || key === 'all')) {
            return true;
        }

        return key === currentContentGender;
    }

    handleUnsetStyle = (isUnsetStyle) => {
        this.setState({ isUnsetStyle });
    };

    MoenangeInfluencerHomeScreen = (key) => {

        if (key.match("influencer")) {
          const eventData = {
            EventName: EVENT_INFLUENCER_HOME_SCREEN_VIEW,
          };
          Event.dispatch(EVENT_GTM_INFLUENCER, eventData);
        }
    }

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
              mods={{isArabic: isArabic()}}
              onClick={()=>{ this.MoenangeInfluencerHomeScreen(key)}}
            >
                <GenderButton
                    gender={gender}
                    mix={{
                        block: 'HeaderGenders',
                        elem: 'Button'
                    }}
                    handleUnsetStyle={this.handleUnsetStyle}
                    isUnsetStyle={isUnsetStyle}
                    isCurrentGender={isCurrentGender}
                    changeMenuGender={changeMenuGender}
                    getNewActiveMenuGender={this.getNewActiveMenuGender}
                />
            </div>
        );
    };


    renderGenders() {
        let countryList = ['BH'];
        let showAllStatus = countryList.includes(getCountryFromUrl());
        const { isMobileMegaMenu = false, mobileMegaMenuPageOpenFlag = "" } =
          this.props;
        const megaMenuGenderList = (isMsiteMegaMenuRoute()) ? this.megamenuGenderList : this.genderList;
        return megaMenuGenderList?.map((value) => {
            if (showAllStatus) {
                return this.renderGender(value)
            } else {
                if (value.key !== "all") {
                    return (
                        this.renderGender(value)
                    )
                }
            }

        })
    }

    render() {
        const { isArabic } = this.state;
        const { isMobile } = this.props;
        const isMegaMenuValue = isMsiteMegaMenuRoute();
        return (
            <div
                mix={{ block: `${this.props.currContentGender === "influencer" ? "moveUpGenders" : "moveDownGenders"} HeaderGenders ${(isMegaMenuValue) ? "mobileMegaMenuHeaderGender" : ""}`, mods: { isArabic, isMobile } }}
            >
                {this.renderGenders()}
            </div>
        );
    }
}
export default connect(mapStateToProps, null)(HeaderGenders)
