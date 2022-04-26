/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import Image from "Component/Image";

import ContentWrapper from "Component/ContentWrapper";
import { TYPE_NOTFOUND } from "../UrlRewrites/UrlRewrites.config";
import { DEFAULT_STATE_NAME } from "Component/NavigationAbstract/NavigationAbstract.config";

import pageNotFound from "./images/pagenotfound.png";
import pageNotFoundSVG from "./images/No_Results.svg";

import "./NoMatch.style.override";

import { HOME_STATIC_FILE_KEY } from "Route/HomePage/HomePage.config";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import { setLastTapItemOnHome} from "Store/PLP/PLP.action";
import DynamicContent from "Component/DynamicContent";

export class NoMatch extends PureComponent {
  static propTypes = {
    updateBreadcrumbs: PropTypes.func.isRequired,
    cleanUpTransition: PropTypes.func.isRequired,
    changeHeaderState: PropTypes.func.isRequired,
  };
  state = {
    gender: "",
    isArabic: isArabic(),
    notFoundWidgetData :[]
    
  };

  componentDidMount() {
    this.updateBreadcrumbs();
    this.updateHeaderState();
    this.cleanUpTransition();
    window.pageType = TYPE_NOTFOUND;
    this.requestNoMatchWidgetData();
  }

  componentWillUnmount() {
    window.pageType=undefined;
  }

  cleanUpTransition() {
    const { cleanUpTransition } = this.props;

    cleanUpTransition();
  }

  updateHeaderState() {
    const { changeHeaderState } = this.props;

    changeHeaderState({
      name: DEFAULT_STATE_NAME,
      isHiddenOnMobile: true,
    });
  }

  updateBreadcrumbs() {
    const { updateBreadcrumbs } = this.props;
    const breadcrumbs = [
      {
        url: "",
        name: __("Not Found"),
      },
      {
        url: "/",
        name: __("Home"),
      },
    ];

    updateBreadcrumbs(breadcrumbs);
  }

  getDevicePrefix() {
    return isMobile.any() ? "m/" : "d/";
  }
  async requestNoMatchWidgetData() {
    const { isArabic } = this.state;
    const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      : "Home";
    this.setState({ gender});
    const devicePrefix = this.getDevicePrefix();    
    
    // if (gender) {
      try {
        const notFoundWidget = await getStaticFile(HOME_STATIC_FILE_KEY, {
          //$FILE_NAME: `${devicePrefix}not_found.json`,
          $FILE_NAME: `${devicePrefix}${gender}.json`,
        });
        
        if (typeof notFoundWidget === 'object') {

          let newWidgetData = notFoundWidget.filter((data)=>{
              return data.type=== "grid" && data.tag=== "SBC-Grid-1" || data.type=== "vue_recently_viewed_slider"
          })
          const exploreMore = {
            type: "grid",
            index: 3,
            promotion_name: "Women-EN",
            tag: "",
            background_color: "#000000",
            items_per_row: 4,
            item_height: 240,
            header:
            {
                title: "EXPLORE MORE"
            },
            items: [
            {
                promotion_name: "Home-SBC-Accessories",
                footer:
                {
                    title: "Women"
                },
                link: "/women/accessories.html?q=Women+Accessories&p=0&hFR%5Bcategories.level0%5D%5B0%5D=Women+%2F%2F%2F+Accessories&nR%5Bvisibility_catalog%5D%5B%3D%5D%5B0%5D=1&dFR%5Bgender%5D%5B0%5D=Women&idx=enterprise_magento_english_products",
                url: "https://mobilecdn.6thstreet.com/AllBanners/bmt/08-04-2022/Shop+by+category/Abaya+copy+4.jpg",
                tag: "Women"
            },
            {
                promotion_name: "Home-SBC-Footwear",
                footer:
                {
                    title: "Men"
                },
                link: "/women/shoes.html?q=Women+Shoes&p=0&hFR%5Bcategories.level0%5D%5B0%5D=Women+%2F%2F%2F+Shoes&nR%5Bvisibility_catalog%5D%5B%3D%5D%5B0%5D=1&dFR%5Bin_stock%5D%5B0%5D=1&dFR%5Bgender%5D%5B0%5D=Women&idx=enterprise_magento_english_products",
                url: "https://mobilecdn.6thstreet.com/AllBanners/bmt/08-04-2022/Shop+by+category/Shoes+copy+2.jpg",
                tag: "Men"
            },
            {
                promotion_name: "Home-SBC-Clothing",
                footer:
                {
                    title: "Kids"
                },
                link: "/women/clothing.html?q=Women+Clothing&p=0&hFR%5Bcategories.level0%5D%5B0%5D=Women+%2F%2F%2F+Clothing&nR%5Bvisibility_catalog%5D%5B%3D%5D%5B0%5D=1&dFR%5Bgender%5D%5B0%5D=Women&dFR%5Bin_stock%5D%5B0%5D=1&idx=enterprise_magento_english_products",
                url: "https://mobilecdn.6thstreet.com/AllBanners/bmt/08-04-2022/Shop+by+category/Sleeves+dress+copy.jpg",
                tag: "Kids"
            },
            {
                promotion_name: "Home-SBC-Sports",
                footer:
                {
                    title: "Home"
                },
                link: "/sportswear.html?q=Sportswear&p=0&hFR%5Bcategories.level0%5D%5B0%5D=Sportswear&nR%5Bvisibility_catalog%5D%5B=%5D%5B0%5D%3D1&dFR%5Bgender%5D%5B0%5D=Women&dFR%5Bin_stock%5D%5B0%5D=1&idx=enterprise_magento_english_products",
                url: "https://mobilecdn.6thstreet.com/AllBanners/bmt/08-04-2022/Shop+by+category/sports+copy.jpg",
                tag: "Home"
            }],
            image_size:
            {
                height: 400,
                width: 400
            }
        }
        newWidgetData.push(exploreMore);
        this.setState({ notFoundWidgetData: newWidgetData || [] });
        } else {
          this.setState({ notFoundWidgetData: [] });
        }
      } catch (e) {
        this.setState({ notFoundWidgetData: [] });
        console.error(e);
      }
    // } else {
    //   this.setState({ notFoundWidgetData: [] });
    // }
    
  }
  renderDynamicBanners(){
    const {gender, notFoundWidgetData} = this.state;
    return(
     (notFoundWidgetData.length) ?
      <>      
      <DynamicContent
        gender={gender}
        content={notFoundWidgetData}
      />
      </>
      : null
    )
  }

  render() {
    return (
      <main block="NoMatch" aria-label={__("Page not found")}>
        <ContentWrapper
          //mix={{ block: "NoMatch" }}
          wrapperMix={{
            block: "NoMatch",
            elem: "Wrapper",
          }}
          label={__("Page Not Found Content")}
        >
          {/* <div block="NoMatch">
            <div block="NoMatch-PageNotFound">
              <h4 block="PageNotFound-Title">
                {__("we are sorry!")}
                <span>{__("error 404!")}</span>
              </h4>
              <div block="PageNotFound">
                <Image lazyLoad={true} src={pageNotFound} alt="pageNotFound" />

              </div>
              <span block="PageNotFound-SubTitle">
                {__("this page could not be found :(")}
              </span>
              <p block="PageNotFound-Content">
                {__(
                  "Can't find what you need? Take a moment\nand do a search or start from our homepage"
                )}
              </p>
              <a block="PageNotFound-LinkHome" href="/">
                {__("back to homepage")}
              </a>
            </div>
          </div> */}
          <div block="NotFoundContent">
            <div block="notFoundImage">
              <Image lazyLoad={true} src={pageNotFoundSVG} alt="pageNotFound" />
            </div>            
            <h4 block="Title">{__("Oops! Nothing here.")}</h4>
            <p block="SubTitle">{__("Here are some products you may like.")}</p>
          </div>
          {this.renderDynamicBanners()}
        </ContentWrapper>
      </main>
    );
  }
}

export default NoMatch;
