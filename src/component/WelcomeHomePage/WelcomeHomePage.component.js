import { Fragment, PureComponent } from 'react';
import BrowserDatabase from 'Util/BrowserDatabase';
import { isArabic } from 'Util/App';
import PropTypes from 'prop-types';
import CDN from "../../util/API/provider/CDN";
import Link from "Component/Link";
import { connect } from 'react-redux';
import { LocationType } from "Type/Common";
import Header from "Component/Header";
import { setCountry, setLanguage, setLanguageForWelcome, setGender} from 'Store/AppState/AppState.action';
import { setAppConfig } from 'Store/AppConfig/AppConfig.action'
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { URLS } from 'Util/Url/Url.config';
import Footer from "Component/Footer";
import Image from "Component/Image";
import CountrySwitcher from 'Component/CountrySwitcher';
import LanguageSwitcher from 'Component/LanguageSwitcher';
import logo from './icons/6TH_Logo.svg'
import isMobile from "Util/Mobile";
import close from "../Icons/Close/icon.svg"
import './WelcomeHomePage.style';



export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    language: state.AppState.language,
    country: state.AppState.country,
    gender: state.AppState.gender,
});

export const mapDispatchToProps = (dispatch) => ({
    setCountry: (value) => dispatch(setCountry(value)),
    setLanguage: (value) => dispatch(setLanguage(value)),
    setGender: (value) => dispatch(setGender(value)),
    setAppConfig: (value) => dispatch(setAppConfig(value)),
    updateStoreCredits: () => StoreCreditDispatcher.getStoreCredit(dispatch),
    setLanguageForWelcome: (value) => dispatch(setLanguageForWelcome(value))

});

export const APP_STATE_CACHE_KEY = 'APP_STATE_CACHE_KEY';
export const PREVIOUS_USER = 'PREVIOUS_USER';

class WelcomeHomePage extends PureComponent {
    static propTypes = {
        location: LocationType.isRequired
    };


    constructor(props) {
        super(props);
        const appStateCacheKey = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)
        const PREVIOUS_USER = BrowserDatabase.getItem('PREVIOUS_USER')
        if(PREVIOUS_USER){
            const { country, language, gender } = this.props;
            const locale = `${language}-${country.toLowerCase()}`;
            let url =  `${URLS[locale]}/${gender}.html`
            window.location.href = url;
        }
        if(appStateCacheKey){
            const { country, language, locale, gender } = appStateCacheKey;
        }

        this.state = {
            isPopupOpen: !isMobile.any() && !!!appStateCacheKey,
            welcomeImg: null
        }
    }


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
        window.pageType="welcome";
        this.getWelcomeImageUrl();
    }

    componentDidUpdate(){
        const { language, country } = this.props;
        const locale = `${language}-${country.toLowerCase()}`
        let genders = ["women", "men", "kids"]
        genders.forEach((gender) => {
            const hint = document.createElement("link");
            hint.setAttribute("rel", "prefetch");
            hint.setAttribute("as", "document");
            hint.setAttribute("href", `${URLS[locale]}/${gender}.html`);

            try {
                const head = document.getElementsByTagName("head");
                if(head?.length){
                    head[0].appendChild(hint);
                }
            }
            catch(err){
                console.error(err);
            }
        })
    }

    componentWillUnmount() {
        window.pageType = undefined;
    }

    closePopup = () => {
        const { language, setLanguageForWelcome, country } = this.props;
        setCountry(country);
        setLanguage(language);
        setLanguageForWelcome(language);
        this.setState({
            isPopupOpen: false
        })
    }

    onGenderSelect = (event, val) => {
        event.persist();
        event.preventDefault();
        const { country, language, setGender } = this.props;
        const locale = `${language}-${country.toLowerCase()}`;
        setGender(val);
        let data = {
            locale: locale
        }

        BrowserDatabase.setItem(data, 'PREVIOUS_USER');
        let url = `${URLS[locale]}/${val}.html`
        window.location.href = url
    }

    getWelcomeImageUrl = async () => {
        let device = isMobile.any() ? 'm' : 'd'
        let url = `homepage/${device}/home.json`;
        try {
            const resp = await CDN.get(`config_staging/${url}`);
            if (resp) {
                this.setState({
                    welcomeImg: resp
                })
            }
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
        const { isPopupOpen, welcomeImg } = this.state;
        const { language, country } = this.props;
        const locale = `${language}-${country.toLowerCase()}`;
        return (
            <>
                {
                    !isMobile.any()
                    ?
                    <Header />
                    :
                    null
                }
                <div block="WelcomeHomePage">
                    <div block="WelcomeHomePage" elem="Top" >
                        <div block="WelcomeHomePage-Top-Logo" >
                            <img src={logo} />
                        </div>
                    </div>
                    {   isMobile.any() &&
                        <div block="WelcomeHomePage" elem="StoreSwitcher">
                            <div block="Text">
                                <div block="Text-welcome">{__("Welcome, ")}</div>
                                <div block="Text-shop">{__("you are shopping in")}</div>
                            </div>
                            <div  block="WelcomeHomePage" elem="LanguageSwitcher">
                                <LanguageSwitcher/>
                            </div>
                            <div  block="WelcomeHomePage" elem="CountrySwitcher">
                                <CountrySwitcher/>
                            </div>
                        </div>
                    }

                    { isPopupOpen &&
                        <div block="WelcomeHomePage" elem="Popup">
                            <div block="WelcomeHomePage-Popup" elem="Action">
                                <img  block="WelcomeHomePage-Popup-Action" elem="Close" src={close} onClick={this.closePopup}/>
                            </div>
                            <div block="WelcomeHomePage-Popup" elem="Content">
                                <div block="WelcomeHomePage-Popup-Content" elem="Text">
                                        <span>Welcome, </span>
                                        <span>you are shopping in</span>
                                </div>
                                <div  block="WelcomeHomePage-Popup-Content" elem="SwitcherContainer">
                                    <LanguageSwitcher welcomePagePopup={true}/>
                                    <CountrySwitcher/>
                                    <button
                                        block="WelcomeHomePage-Popup-Content-SwitcherContainer"
                                        elem="ConfirmButton"
                                        onClick={this.closePopup}
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    }

                    {
                    welcomeImg &&
                        <div block="WelcomeHomePage" elem="MainSection" >
                            {
                                Object.keys(welcomeImg).map((gender) => {
                                    const navigateTo = `${URLS[locale]}/${gender}.html`
                                    return (
                                        <a
                                            href={navigateTo}
                                            block="WelcomeHomePage-GenderSelection"
                                            onClick={(e) => this.onGenderSelect(e, gender)}
                                        >
                                            <img src={welcomeImg[gender][language].img} />
                                            <button block="WelcomeHomePage-GenderSelection-Button">
                                                { welcomeImg[gender][language].label }
                                            </button>
                                        </a>
                                    )
                                })
                            }
                        </div>
                    }
                    { isPopupOpen && <div block="WelcomeHomePage" elem="ShadeWrapper"></div>}
                </div>
                {
                    isMobile.tablet()
                    ?
                    <div block="WelcomeHomePage" elem="Bottom">
                        {this.renderAppColumn()}
                    </div>
                    :
                    null
                }
                {
                    isMobile.any() || isMobile.tablet()
                    ?
                    null
                    :
                    <Footer />
                }
            </>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeHomePage);
