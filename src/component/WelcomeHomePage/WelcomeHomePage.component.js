import { PureComponent } from 'react';
import { isArabic } from 'Util/App';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setCountry, setLanguage } from 'Store/AppState/AppState.action';
import { setAppConfig } from 'Store/AppConfig/AppConfig.action'
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { getCountriesForSelect, getCountryLocaleForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';
import { URLS } from 'Util/Url/Url.config';
import Footer from "Component/Footer";
import logo from './icons/6thstreet_logo.png'
import dummy from './icons/dummy.png'
import dummy1 from './icons/dummy1.png'
import dummy2 from './icons/dummy2.png'
import './WelcomeHomePage.style';



export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    language: state.AppState.language,
    country: state.AppState.country
});

export const mapDispatchToProps = (dispatch) => ({
    setCountry: (value) => dispatch(setCountry(value)),
    setLanguage: (value) => dispatch(setLanguage(value)),
    setAppConfig: (value) => dispatch(setAppConfig(value)),
    updateStoreCredits: () => StoreCreditDispatcher.getStoreCredit(dispatch)
});

class WelcomeHomePage extends PureComponent {
    state = {
        isArabic: false
    };

    onGenderSelect = (val) => {
        const { country, language } = this.props;
        console.log(val, country, language)
        const locale = `${language}-${country.toLowerCase()}`;
        let url = URLS[locale] + `/${val}.html`
        window.location.href = url
    }

    render() {
        const { isArabic } = this.state;
        return (
            <div>
                <div block="WelcomeHomePage">
                    <div block="WelcomeHomePage" elem="Top" >
                        <div block="WelcomeHomePage-Top-Logo" >
                            <img src={logo} />
                        </div>


                    </div>
                    <div block="WelcomeHomePage" elem="MainSection" >
                        <div block="WelcomeHomePage-GenderSelection">
                            <img src={dummy} onClick={() => this.onGenderSelect('women')} />
                            <button block="WelcomeHomePage-GenderSelection-Button">Shop Women</button>
                        </div>
                        <div block="WelcomeHomePage-GenderSelection">
                            <img src={dummy1} onClick={() => this.onGenderSelect('men')} />
                            <button block="WelcomeHomePage-GenderSelection-Button">Shop Men</button>
                        </div>
                        <div block="WelcomeHomePage-GenderSelection">
                            <img src={dummy2} onClick={() => this.onGenderSelect('kids')} />
                            <button block="WelcomeHomePage-GenderSelection-Button">Shop Kids</button>
                        </div>
                    </div>



                </div>
                <Footer/>
            </div>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeHomePage);
