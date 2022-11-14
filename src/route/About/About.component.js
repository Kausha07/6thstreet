import { PureComponent } from 'react';
import "./About.style"

import Link from "Component/Link";
import Image from "Component/Image";

import DragScroll from "Component/DragScroll/DragScroll.component";
import { isArabic } from "Util/App";
import SliderAboutPage from "Component/SliderAboutPage";
import isMobile from "Util/Mobile";
import { getCountryFromUrl } from "Util/Url/Url";
import datasintests from "./datas.json";
export class About extends PureComponent {

    constructor(props) {
        super(props);
        this.cmpRef = React.createRef();
        this.scrollerRef = React.createRef();
        this.itemRef = React.createRef();
        this.state = {
          isArabic: isArabic(),
          isMobile: isMobile.any() || isMobile.tablet(),
          isTablet: isMobile.tablet(),
          screenWidth: window.innerWidth,
          minusWidth: 690,
        };
      }

    renderDescription() {
      const { isArabic } = this.state;

      if(isArabic){
        return (
          <>
              <h3 block="aboutuswrapper" elem="descriptionheading" mods={{ isArabic }}>من نحن؟</h3>
              <p block="aboutuswrapper" elem="descriptiondetails" mods={{ isArabic }}>

               نحن موقع تسوق إلكتروني رائد في منطقة الخليج، حيث نُقدم أرقى تصاميم الملابس، الأحذية والإكسسوارات العصرية للنساء، الرجال والأطفال. يوفر موقع 6 ستريت تشكيلة متنوعة تُرضي جميع الأذواق، فهو يحتوي عل أكثر من 1200 ماركة عالمية بأسعار في متناول الجميع. يمكن التسوق من خلال موقع 6 ستريت في الإمارات العربية المتحدة والمملكة العربية السعودية ودولة الكويت وسلطنة عمان ودولة قطر ومملكة البحرين. <br /> <br />

               حفزّ نفسك على التمرين مع أروع الماركات الرياضية مثل <u><Link to={`/nike.html`} >نايك</Link></u>, <u><Link to={`/adidas.html`} >أديداس</Link></u>, <u><Link to={`/skechers.html`} >سكتشرز</Link></u> واون.<br /><br/>

               أما إذا كنت تبحث عن إطلالات أنيقة لمناسباتك المختلفة، اكتشف تشكيلة من التصاميم الخالدة التي لا تزول موضتها من <u><Link to={`/tommy-hilfiger.html`} >تومي هيلفيغر</Link></u> و<u><Link to={`/calvin-klein.html`} >كالفن كلاين</Link></u> ولإطلالة عملية عصرية اختر ما يناسبك من <u><Link to={`/tommy-hilfiger.html`} >ترينديول</Link></u>.<br/><br/>
               هل تبحث عن تجربة تسوق ممتعة؟ تعال وقم بزيارة المتجر الفيجيتال الأول في دول مجلس التعاون الخليجي في دبي هيلز مول. مساحة مبتكرة تقنيًا تجمع بين تجربتي التسوق الإلكتروني والتسوق الواقعي مع التصفح عبر الإنترنت وغرف القياس الذكية.<br/><br/>

               في 6ستريت ، نشجعك أن تعيش بشكل أفضل ونؤمن بأن الإعتناء بإطلالتك ستكون الخطوة الأولى لذلك. <br/><br/>

                  {/* At 6thStreet, we encourage you to live your best life and we think looking your best is a great place to start. <br /><br />  */}
              </p>
          </>
        )
      }
        return (
            <>
                <h3 block="aboutuswrapper" elem="descriptionheading" mods={{ isArabic }}>Who we are</h3>
                <p block="aboutuswrapper" elem="descriptiondetails" mods={{ isArabic }}>

                We are an elevated fashion and lifestyle destination committed to styling GCC’s GEN NOW to WOW. We deliver on-trend shoes, bags, outfits, beauty essentials and accessories right at your doorstep in the UAE, KSA, Kuwait, Oman, Qatar & Bahrain. We believe in looking like a million bucks, not spending it – which is why we bring to you over 1200+ global brands at the most accessible prices. <br /> <br />

                <i>Off to the gym?</i> Performance sportswear from <u><Link to={`/nike.html`} >Nike</Link></u>, <u><Link to={`/adidas.html`} >Adidas</Link></u>, <u><Link to={`/skechers.html`} >Skechers</Link></u> and On will power up your routine.<br /><br />

                <i>Date night tonight?</i> Get elegant outfits from <u><Link to={`/tommy-hilfiger.html`} >Tommy Hilfiger</Link></u>, <u><Link to={`/calvin-klein.html`} >Calvin Klein</Link></u> or <u><Link to={`/trendyol.html`} >Trendyol</Link></u>. Complete your look with shoes & accessories from <u><Link to={`/charles-keith.html`} >Charles & Keith</Link></u>, <u><Link to={`/dune-london.html`} >Dune London</Link></u> and <u><Link to={`/aldo.html`} >Aldo</Link></u> and add finishing touches from our exclusive selection of fragrances designed by top influencers.<br /><br />

                <i>Looking for an immersive shopping experience?</i> Come visit GCC’s first phygital store at Dubai Hills Mall. An innovative tech-led space that combines the best of both online & offline shopping with online browsing & smart fitting rooms.<br/><br/>

                At 6thStreet, we encourage you to live your best life and we think looking your best is a great place to start. </p>
            </>
        )
    }

    renderVideo() {
      const isMobileDev = isMobile.any();
      const isDesktopDev = !(isMobile.any() || isMobile.tablet());

      if(isDesktopDev){
        return (
          <>
            <div className="VideoOuterDiv">
              <video width="100%" controls autoPlay muted loop>                
                <source src="https://mobilecdn.6thstreet.com/landing_media_assets/About/videosdesk.webm" type="video/webm"/>
                <source src="https://mobilecdn.6thstreet.com/landing_media_assets/About/videosdesk.mp4" type="video/mp4"/>
              </video>
            </div>
          </>
        )
      }
        return (
            <>
                <div className="VideoOuterDiv">
                  { isMobileDev ? (
                    <video width="100%" controls autoPlay muted loop>                
                      <source src="https://mobilecdn.6thstreet.com/landing_media_assets/About/videosmobi.webm" type="video/webm"/>
                      <source src="https://mobilecdn.6thstreet.com/landing_media_assets/About/videosmobi.mp4" type="video/mp4"/>
                    </video>
                  ) : (
                    <video width="100%" controls autoPlay muted loop>                
                      <source src="https://mobilecdn.6thstreet.com/landing_media_assets/About/videosdec.webm" type="video/webm"/>
                      <source src="https://mobilecdn.6thstreet.com/landing_media_assets/About/videosdec.mp4" type="video/mp4"/>
                    </video>
                  ) }
                </div>
            </>
        )
    }

    items = {
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
      }

    renderAppRow() {

      const mobileDevice = isMobile.any() || isMobile.tablet();
      const isAndroid = isMobile.android();
      const { isArabic } = this.state;
        return (

          mobileDevice ? 
          (
            <div block="aboutuswrapper" elem="WrapperFirst" mods={{ isArabic }}>
              {isAndroid ? (
                <Link to={this.items.google_onclick} key={this.items.id_google}>
                  <Image lazyLoad={true} src={this.items.google_play} alt="google play download" />{" "}
                </Link>
              ) : (
                <Link to={this.items.app_onclick} key={this.items.id_app}>
                    <Image lazyLoad={true} src={this.items.app_store} alt="app store download" />
                </Link>
              )}    
            </div>
          ) : (
            <div block="aboutuswrapper" elem="WrapperFirst">

                <Link to={this.items.google_onclick} key={this.items.id_google}>
                    <Image lazyLoad={true} src={this.items.google_play} alt="google play download" />{" "}
                </Link>

                <Link to={this.items.app_onclick} key={this.items.id_app}>
                    <Image lazyLoad={true} src={this.items.app_store} alt="app store download" />
                </Link>

                <Link to={this.items.gallery_onclick} key={this.items.id_gallery}>
                    <Image lazyLoad={true} src={this.items.app_gallery} alt="app gallery download" className="appGallery"/>
                </Link>

            </div>
          )
        )
        
    }

handleContainerScroll = (event) => {
    const target = event.nativeEvent.target;
    if (this.scrollerRef && this.scrollerRef.current) {
      this.scrollerRef.current.scrollLeft = target.scrollLeft;
    }
};



renderSliderWithLabel = (item, i) => {
    const { link, text, url, plp_config, height, width, text_align } = item;
    const { isArabic } = this.state;
    let parseLink = link;
    const wd = `${width.toString()}px`;
    const ht = `${height.toString()}px`;

    return (
      <div
        block="SliderWithLabel"
        mods={{ isArabic }}
        ref={this.itemRef}
        key={i * 11}
      >
        <Link
          to={`${link}`}
          key={i * 10}
          block="SliderWithLabel"
          elem="Link"
          data-banner-type="sliderWithLabel"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
        >
          <Image
            lazyLoad={true}
            src={url}
            alt={text || "Brand Image"}
            block="Image"
            style={{ maxWidth: wd }}
          />
        </Link>
        {text ? (
          <div block="SliderText" style={{ textAlign: text_align }}>
            {text}
          </div>
        ) : null}
      </div>
    );
};

checkWidth(){
  const { screenWidth, minusWidth } = this.state;
  if(screenWidth > 1500){
    this.setState({minusWidth: 590});
  }else if(screenWidth < 1400){
    this.setState({minusWidth: 660});
  }
}

renderScrollbar = () => {
    const datasintest = datasintests;
    const items = datasintest.items;
    this.checkWidth();
    const { screenWidth, minusWidth } = this.state;

    const width = `${
      (this.itemRef.current && this.itemRef.current.clientWidth) *
        items.length +
      items.length * 7 * 2 -
      minusWidth
    }px`;
    // const width = `${900}px`;

    return (
      <div
        block="Outer"
        mods={{
          Hidden:
            this.scrollerRef.current &&
            this.scrollerRef.current.clientWidth >= width,
        }}
        ref={this.scrollerRef}
        onScroll={this.handleScroll}
      >
        <div block="Outer" style={{ width: width }} elem="Inner"></div>
      </div>
    );
  };

  handleScroll = (event) => {
    const target = event.nativeEvent.target;
    const prentComponent = [...this.cmpRef.current.childNodes].filter(
      (node) => node.className == "SliderWithLabelWrapper"
    )[0];
    prentComponent && (prentComponent.scrollLeft = target.scrollLeft);
  };


  handleScrollEXP = (event) => {
    const target = event.nativeEvent.target;
    const prentComponent = [...this.cmpRef.current.childNodes].filter(
      (node) => node.className == "SliderWithExperienceWrapper"
    )[0];
    prentComponent && (prentComponent.scrollLeft = target.scrollLeft);
  };

renderSliderWithLabels() {

    let country = getCountryFromUrl()
    const datasintest = datasintests;
    const items = datasintest[country];

    return (
      <DragScroll
        data={{ rootClass: "SliderWithLabelWrapper", ref: this.cmpRef }}
      >
        <div
          block="SliderWithLabelWrapper"
          id="SliderWithLabelWrapper"
          ref={this.cmpRef}
          onScroll={this.handleContainerScroll}
        >
          <div className="SliderHelper"></div>
          {items.map(this.renderSliderWithLabel)}
          <div className="SliderHelper"></div>
          <div className='SliderHelperTab'></div>
        </div>
        
        {this.renderScrollbar()}
      </DragScroll>
    );
}

    render() {
      const { isMobile, isArabic } = this.state;
        return (
            <div block="aboutuswrapper" mods={{ isArabic }}>
                {isMobile ? (
                  <>
                    <br />
                    <h1 block="aboutuswrapper" elem="heading" className='headingAbout' mods={{ isArabic }}>{__("About")} <b>{__("6thStreet")}</b> </h1>
                  </>
                ) : null}
                <div block="aboutuswrapper" elem="flexdiv">
                    <div block="aboutuswrapper" elem="description">
                      {isMobile ? null
                       : (<h1 block="aboutuswrapper" elem="heading">{__("About")} <b>{__("6thStreet")}</b> </h1>)}
                        {this.renderDescription()}
                        {this.renderAppRow()}
                    </div>
                    <div block="aboutuswrapper" elem="video">
                        {this.renderVideo()}
                    </div>
                </div>
                {
                  isArabic ? (
                    <h2 block="aboutuswrapper" elem="heading" className="experience6thStreet" mods={{ isArabic }}>تجربة تسوق مميّزة على <b>6 ستريت</b></h2>
                  ) : (
                    <h2 block="aboutuswrapper" elem="heading" className="experience6thStreet" mods={{ isArabic }}>The <b>6thStreet.com</b> experience</h2>
                  )
                }

                <SliderAboutPage 
                  {...this.props} 
                  {...this.state}
                />

                {
                  isArabic ? (
                    <h2 block="aboutuswrapper" elem="heading" className="brandsWeLove" mods={{ isArabic }}><b>ماركات </b>الكل يحبها </h2>
                  ) : (
                    <h2 block="aboutuswrapper" elem="heading" className="brandsWeLove" mods={{ isArabic }}>Brands <b>We love</b> </h2>
                  )
                }
                
                <div
                    // ref={setRef}
                    block="DynamicContentSliderWithLabel"
                    // id={`DynamicContentSliderWithLabel${index}`}
                >
                    { this.renderSliderWithLabels() }
                </div>
                <br /><br />
            </div>
        )
    }
}

export default About;
