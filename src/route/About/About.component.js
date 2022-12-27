import { PureComponent } from "react";
import "./About.style";
import Link from "Component/Link";
import Image from "Component/Image";
import { isArabic } from "Util/App";
import SliderAboutPage from "Component/SliderAboutPage";
import isMobile from "Util/Mobile";
import { getCountryFromUrl } from "Util/Url/Url";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import Logger from "Util/Logger";
export class About extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isArabic: isArabic(),
      isMobile: isMobile.any() || isMobile.tablet(),
      isTablet: isMobile.tablet(),
      content: {},
    };
    this.getWidgets();
  }

  getWidgets = async () => {
    try {
      const resp = await getStaticFile("about_page", {
        $FILE_NAME: `pages/aboutpage.json`,
      });
      if (resp) {
        this.setState({
          content: resp,
        });
      }
    } catch (e) {
      Logger.log(e);
    }
  };

  renderDescription() {
    const { isArabic, content = {} } = this.state;
    if (isArabic) {
      return (
        <>
          <div dangerouslySetInnerHTML={{ __html: content?.["descriptionAr"] }} />
        </>
      );
    }
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: content?.["descriptionEn"] }} />
      </>
    );
  }

  renderVideo() {
    const isMobileDev = isMobile.any();
    const isDesktopDev = !(isMobile.any() || isMobile.tablet());
    const {
      content: { video },
    } = this.state;

    const desktopSource = video?.desktop.map((videoItem, index) => {
      return <source key={index} src={videoItem.src} type={videoItem.type} />;
    });
    const mobileSource = video?.mobile.map((videoItem, index) => {
      return <source key={index} src={videoItem.src} type={videoItem.type} />;
    });

    if (isDesktopDev) {
      return (
        <>
          <div className="VideoOuterDiv">
            <video width="100%" controls autoPlay muted loop>
              {desktopSource}
            </video>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="VideoOuterDiv">
          {isMobileDev ? (
            <video width="100%" controls autoPlay muted loop>
              {mobileSource}
            </video>
          ) : (
            <video width="100%" controls autoPlay muted loop>
              {desktopSource}
            </video>
          )}
        </div>
      </>
    );
  }

  renderAppRow() {
    const mobileDevice = isMobile.any() || isMobile.tablet();
    const isAndroid = isMobile.android();
    const {
      isArabic,
      content: { appLink },
    } = this.state;

    return mobileDevice ? (
      <div block="aboutuswrapper" elem="WrapperFirst" mods={{ isArabic }}>
        {isAndroid
          ? appLink?.googlePlay && (
              <Link
                to={appLink?.googlePlay?.app_onclick}
                key={appLink?.googlePlay?.app_id}
              >
                <Image
                  lazyLoad={true}
                  src={appLink?.googlePlay?.app_image}
                  alt="google play download"
                />{" "}
              </Link>
            )
          : appLink?.appleStore && (
              <Link
                to={appLink?.appleStore?.app_onclick}
                key={appLink?.appleStore?.app_id}
              >
                <Image
                  lazyLoad={true}
                  src={appLink?.appleStore?.app_image}
                  alt="app store download"
                />
              </Link>
            )}
      </div>
    ) : (
      <div block="aboutuswrapper" elem="WrapperFirst">
        {appLink?.googlePlay && (
          <Link
            to={appLink?.googlePlay?.app_onclick}
            key={appLink?.googlePlay?.app_id}
          >
            <Image
              lazyLoad={true}
              src={appLink?.googlePlay?.app_image}
              alt="google play download"
            />{" "}
          </Link>
        )}
        {appLink?.appleStore && (
          <Link
            to={appLink?.appleStore?.app_onclick}
            key={appLink?.appleStore?.app_id}
          >
            <Image
              lazyLoad={true}
              src={appLink?.appleStore?.app_image}
              alt="app store download"
            />
          </Link>
        )}

        {appLink?.huawei && (
          <Link to={appLink?.huawei?.app_onclick} key={appLink?.huawei?.app_id}>
            <Image
              lazyLoad={true}
              src={appLink?.huawei?.app_image}
              alt="app gallery download"
              className="appGallery"
            />
          </Link>
        )}
      </div>
    );
  }

  render() {
    const {
      isMobile,
      isArabic,
      content: {
        pagetitleEn = "",
        pagetitleAr = "",
        experienceWidget = {},
        brandWidget = {},
      },
    } = this.state;
    let country = getCountryFromUrl();

    return (
      <div block="aboutuswrapper" mods={{ isArabic }}>
        {isMobile && (
          <h1
            block="aboutuswrapper"
            elem="heading"
            className="headingAbout"
            dangerouslySetInnerHTML={
              isArabic ? { __html: pagetitleAr } : { __html: pagetitleEn }
            }
          />
        )}
        <div block="aboutuswrapper" elem="flexdiv">
          <div block="aboutuswrapper" elem="description">
            {!isMobile && (
              <h1
                block="aboutuswrapper"
                elem="heading"
                className="headingAbout"
                dangerouslySetInnerHTML={
                  isArabic ? { __html: pagetitleAr } : { __html: pagetitleEn }
                }
              />
            )}

            {this.renderDescription()}
            {this.renderAppRow()}
          </div>
          <div block="aboutuswrapper" elem="video">
            {this.renderVideo()}
          </div>
        </div>
        <div className="experienceSection">
          <h2
            block="aboutuswrapper"
            elem="heading"
            className="experience6thStreet"
            mods={{ isArabic }}
            dangerouslySetInnerHTML={
              isArabic
                ? { __html: experienceWidget?.sectionHeadingAr }
                : { __html: experienceWidget?.sectionHeadingEn }
            }
          />

          <SliderAboutPage
            sliderItems={this.state?.content?.experienceWidget?.data}
            sliderType="ExperienceSlider"
          />
        </div>
        <div className="brandsSection">
          <h2
            block="aboutuswrapper"
            elem="heading"
            className="brandsWeLove"
            mods={{ isArabic }}
            dangerouslySetInnerHTML={
              isArabic
                ? { __html: brandWidget?.sectionHeadingAr }
                : { __html: brandWidget?.sectionHeadingEn }
            }
          />

          {/* {brandWidget && Object.keys(brandWidget).length === 0 && Object.getPrototypeOf(brandWidget) === Object.prototype
           ? null :<SliderAboutPage
            sliderItems={brandWidget?.[country]}
            sliderType="BrandSlider"
          />} */}

          {/* { (typeof brandWidget?.[country] != "undefined" && brandWidget?.[country] != null && brandWidget?.[country].length != null && brandWidget?.[country].length > 0) && <SliderAboutPage
            sliderItems={this.state?.content?.brandWidget?.AE}
            //sliderItems={this.state?.content?.experienceWidget?.data}
            sliderType="AboutBrandSlider"
          /> } */}

          <SliderAboutPage
            sliderItems={this.state?.content?.brandWidget?.[country]}
            sliderType="AboutBrandSlider"
          />
        </div>
        <br />
        <br />
      </div>
    );
  }
}

export default About;
