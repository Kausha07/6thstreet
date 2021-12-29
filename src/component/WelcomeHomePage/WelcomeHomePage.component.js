import { Fragment, PureComponent } from 'react';
import { isArabic } from 'Util/App';
import PropTypes from 'prop-types';
import CDN from "../../util/API/provider/CDN";
import Link from "Component/Link";
import { connect } from 'react-redux';
import { setCountry, setLanguage } from 'Store/AppState/AppState.action';
import { setAppConfig } from 'Store/AppConfig/AppConfig.action'
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { getCountriesForSelect, getCountryLocaleForSelect } from 'Util/API/endpoint/Config/Config.format';
import { Config } from 'Util/API/endpoint/Config/Config.type';
import { URLS } from 'Util/Url/Url.config';
import Footer from "Component/Footer";
import Image from "Component/Image";
import CountrySwitcher from 'Component/CountrySwitcher';
import LanguageSwitcher from 'Component/LanguageSwitcher';
import logo from './icons/6TH_Logo.svg'
import isMobile from "Util/Mobile";
import facebook from "./icons/facebook.png";
import close from "../Icons/Close/icon.svg"
import instagram from "./icons/instagram.png";
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
        isArabic: false,
        welcomeImg: null,
        isPopupOpen: true
    };

    linkMap = {
        title: __("Download The App"),
        items: [
            {
                id_app: "App1",
                app_store:
                    "https://static.6media.me/static/version1600320971/frontend/6SNEW/6snew/en_US/images/apple-store-badge.svg",
                app_onclick:
                    "https://apps.apple.com/ro/app/6thstreet-com/id1370217070",
                id_google: "Google1",
                google_play:
                    "https://static.6media.me/static/version1600320042/frontend/6SNEW/6snew/en_US/images/google-play-badge.svg",
                google_onclick:
                    "https://play.google.com/store/apps/details?id=com.apparel.app6thstreet",
                id_gallery: "Gallery1",
                app_gallery:
                    "https://6thstreetmobileapp-eu-c.s3.eu-central-1.amazonaws.com/resources/20190121/en-ae/d/icon_huaweiappgallery.svg",
                gallery_onclick: "https://appgallery.huawei.com/#/app/C102324663",
                header: __("Follow the latest trends"),
                id_facebook: "Facebook1",
                facebook_href: "https://www.facebook.com/shop6thstreet/",
                id_insta: "Insta1",
                insta_href: "https://www.instagram.com/shop6thstreet/",
            },
        ],
    }


    componentDidMount() {
        this.getWelcomeImageUrl();
    }
    componentDidUpdate(){
        let lang = this.props.language
        let country = this.props.country
        const locale = `${lang}-${country.toLowerCase()}`
        let genders = ["women", "men", "kids"]
        genders.forEach((gender) => {
            const hint = document.createElement("link");
            hint.setAttribute("rel", "prefetch");
            hint.setAttribute("href", `https://${locale}.6thstreet.com/${gender}.html`);

            try {
                const head = document.getElementsByTagName("head")[0]
                head.appendChild(hint);
            }
            catch(err){
                console.error(err);
            }
        })
    }

    closePopup = () => {
        this.setState({
            isPopupOpen: false
        })
    }

    onGenderSelect = (val) => {
        const { country, language } = this.props;
        console.log(val, country, language)
        const locale = `${language}-${country.toLowerCase()}`;
        let url = URLS[locale] + `/${val}.html`
        window.location.href = url
    }

    getWelcomeImageUrl = () => {
        let device = isMobile.any() ? 'm' : 'd'
        console.log("hiiiiii", device);
        let url = `homepage/${device}/home.json`;
        const directory = process.env.REACT_APP_REMOTE_CONFIG_DIR;

        try {
            const resp = CDN.get(`config_staging/${url}`)
                .then((res) => {
                    if (res.men) {
                        this.setState({
                            welcomeImg: res
                        })
                    }
                });
        }
        catch (error) {
            console.error(error);
        }
    }

    renderAppColumn = () => {
        return <div block="FooterMain" elem="LastColumn" >
            <h4>{this.linkMap.title}</h4>
            <div block="FooterMain" elem="Nav">
                {this.linkMap.items.map((items) => (
                    <Fragment key="last_main_footer_column">
                        <div block="FooterMain" elem="WrapperFirst">
                            <Link to={items.app_onclick} key={items.id_app}>
                                <Image lazyLoad={true} src={items.app_store} alt="app store download" />
                            </Link>
                            <br />
                            <Link to={items.google_onclick} key={items.id_google}>
                                <Image lazyLoad={true} src={items.google_play} alt="google play download" />{" "}

                            </Link>
                            <br />
                            <Link to={items.gallery_onclick} key={items.id_gallery}>
                                <Image lazyLoad={true} src={items.app_gallery} alt="app gallery download" className="appGallery" />

                            </Link>
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    }

    render() {
        const { isArabic } = this.state;
        let lang = this.props.language;
        let showSotreSwitcher = !this.state.isPopupOpen || isMobile.any()
        return (
            <div>
                <div block="WelcomeHomePage">
                    <div block="WelcomeHomePage" elem="Top" >
                        <div block="WelcomeHomePage-Top-Logo" >
                            <img src={logo} />
                        </div>
                    </div>
                    {   showSotreSwitcher &&
                        <div block="WelcomeHomePage" elem="StoreSwitcher">
                            {   isMobile.any() &&
                                <div block="Text">
                                    <div block="Text-welcome">Welcome,</div>
                                    <div block="Text-shop">You are shopping in</div>
                                </div>

                            }

                            <div  block="WelcomeHomePage" elem="LanguageSwitcher">
                                <LanguageSwitcher/>
                            </div>
                            <div  block="WelcomeHomePage" elem="CountrySwitcher">
                                <CountrySwitcher/>
                            </div>
                        </div>
                    }

                    { this.state.isPopupOpen &&
                        <div block="WelcomeHomePage" elem="Popup">
                            <div  block="WelcomeHomePage" elem="Popup-LanguageSwitcher">
                                <div block="Popup-text">
                                    <div block="Popup-text-welcome">Welcome,</div>
                                    <div block="Popup-text-shop">You are shopping in</div>
                                </div>
                                <LanguageSwitcher welcomePagePopup={true}/>
                            </div>
                            <div  block="WelcomeHomePage" elem="Popup-CountrySwitcher">
                                <CountrySwitcher/>
                            </div>
                            <button block="WelcomeHomePage" elem="Popup-Button" onClick={this.closePopup}>OK</button>
                            <img  block="WelcomeHomePage" elem="Popup-Close" src={close} onClick={this.closePopup}/>

                        </div>
                    }

                    {
                    this.state.welcomeImg &&
                        <div block="WelcomeHomePage" elem="MainSection" >
                            <div block="WelcomeHomePage-GenderSelection">
                                <img src={this.state.welcomeImg.women.img[lang]} onClick={() => this.onGenderSelect('women')} />
                                <button block="WelcomeHomePage-GenderSelection-Button">Shop Women</button>
                            </div>
                            <div block="WelcomeHomePage-GenderSelection">
                                <img src={this.state.welcomeImg.men.img[lang]} onClick={() => this.onGenderSelect('men')} />
                                <button block="WelcomeHomePage-GenderSelection-Button">Shop Men</button>
                            </div>
                            <div block="WelcomeHomePage-GenderSelection">
                                <img src={this.state.welcomeImg.kids.img[lang]} onClick={() => this.onGenderSelect('kids')} />
                                <button block="WelcomeHomePage-GenderSelection-Button">Shop Kids</button>
                            </div>
                        </div>
                    }
                    {this.state.isPopupOpen && <div block="WelcomeHomePage" elem="ShadeWrapper"></div>}
                </div>
                <div block="WelcomeHomePage" elem="Bottom">
                    {this.renderAppColumn()}
                </div>
                <Footer />

            </div>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeHomePage);
