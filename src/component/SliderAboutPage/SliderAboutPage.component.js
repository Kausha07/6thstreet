import { PureComponent } from 'react';
import "./SliderAboutPage.style";

import Link from "Component/Link";
import Image from "Component/Image";

import DragScroll from "Component/DragScroll/DragScroll.component";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";

import CA from "./asets/CA.png";
import globe from "./asets/globe.png";
import returns from "./asets/return.png";
import store from "./asets/store.png";
import tabby from "./asets/tabby.png";

export class SliderAboutPage extends PureComponent {
    constructor(props) {
        super(props);
        this.cmpRef = React.createRef();
        this.scrollerRef = React.createRef();
        this.itemRef = React.createRef();
        this.state = {
          isArabic: isArabic(),
          isMobile: isMobile.any(),
        };
      }

experienceData = {
    index: 0,
    promotion_name: "Men-EN",
    tag: "Home-FreshStyle",
    Datas:[
        {
            height: 475,
            imglink: globe,
            url: "https://i.postimg.cc/Vrbszcbd/globe.png",
            text: "Trends from around the world",
            textDescription: "800+ international brands to browse",
            link: "/catalogsearch/result/?q=%2B&qid=88b49e11f7414c75016a8915fef6e978&p=0&dFR%5Bgender%5D%5B0%5D=Men&dFR%5Bbrand_name%5D%5B0%5D=Berastogi+%40+CCC&dFR%5Bin_stock%5D%5B0%5D=1&idx=enterprise_magento_english_products",
            width: 84
        },
        {
            height: 475,
            imglink: returns,
            url: "https://i.postimg.cc/5Qd40kwp/return.png",
            text: "Not feeling your purchase?",
            textDescription: "Return it within 100 days. No-questions-asked.",
            link: "/catalogsearch/result/?q=%2B&qid=88b49e11f7414c75016a8915fef6e978&p=0&dFR%5Bgender%5D%5B0%5D=Men&dFR%5Bbrand_name%5D%5B0%5D=Berastogi+%40+CCC&dFR%5Bin_stock%5D%5B0%5D=1&idx=enterprise_magento_english_products",
            width: 84
        },
        {
            height: 475,
            imglink: store,
            url: "https://i.postimg.cc/LqW6ds5c/store.png",
            text: "In-store experience without the hassle?",
            textDescription: "Buy online, pick-up in store with Click & Collect",
            link: "/catalogsearch/result/?q=%2B&qid=88b49e11f7414c75016a8915fef6e978&p=0&dFR%5Bgender%5D%5B0%5D=Men&dFR%5Bbrand_name%5D%5B0%5D=Berastogi+%40+CCC&dFR%5Bin_stock%5D%5B0%5D=1&idx=enterprise_magento_english_products",
            width: 84
        },
        {
            height: 475,
            imglink: CA,
            url: "https://i.postimg.cc/McHKrB60/CA.png",
            text: "Spend more & redeem!",
            textDescription: "Earn Club Apparel points and shop till you drop",
            link: "/catalogsearch/result/?q=%2B&qid=88b49e11f7414c75016a8915fef6e978&p=0&dFR%5Bgender%5D%5B0%5D=Men&dFR%5Bbrand_name%5D%5B0%5D=Berastogi+%40+CCC&dFR%5Bin_stock%5D%5B0%5D=1&idx=enterprise_magento_english_products",
            width: 84
        },
        {
            height: 475,
            imglink: tabby,
            url: "https://i.postimg.cc/Vrbszcbd/globe.png",
            text: "Can’t pay it all right now?",
            textDescription: "Shop now & pay later in 4 easy monthly installments",
            link: "/catalogsearch/result/?q=%2B&qid=88b49e11f7414c75016a8915fef6e978&p=0&dFR%5Bgender%5D%5B0%5D=Men&dFR%5Bbrand_name%5D%5B0%5D=Berastogi+%40+CCC&dFR%5Bin_stock%5D%5B0%5D=1&idx=enterprise_magento_english_products",
            width: 84
        },
    ],
    type: "bannerSliderWithLabel",
    isHomePage: true
}

handleContainerScroll = (event) => {
    const target = event.nativeEvent.target;
    if (this.scrollerRef && this.scrollerRef.current) {
      this.scrollerRef.current.scrollLeft = target.scrollLeft;
    }
};

renderScrollbar = () => {
    const items = this.experienceData.Datas;

    // const width = `${
    //   (this.itemRef.current && this.itemRef.current.clientWidth) *
    //     items.length +
    //   items.length * 7 * 2 -
    //   690
    // }px`;
    const width = `${900}px`;

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

//   for experience section cards  //

renderSliderForCards = (item, i) => {
  const { link, text, url, plp_config, height, width, text_align, textDescription, imglink } = item;
  const { isArabic } = this.state;
  let parseLink = link;
  const wd = `${width.toString()}px`;
  const ht = `${height.toString()}px`;
  const { isMobile } = this.state;
  return (
      <div
        block="SliderWithExperiences"
        mods={{ isArabic }}
        ref={this.itemRef}
        key={i * 11}
      >
        <div className="sliderwithexpclass">
        <Link
          to={`/about`}
          key={i * 11}
          block="SliderWithExperiences"
          elem="Link"
          data-banner-type="SliderWithExperiences"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
        >
          
          { isMobile ? (
            <div className='imgwrapperdiv'>            
            <Image
            lazyLoad={true}
            src={imglink}
            alt={text}
            block="Image"
            style={{ maxWidth: "50px", width: "50px", minWidth: "50px" }}
            />
            </div>
          ) : (
            <div className='imgwrapperdiv'>            
            <Image
            lazyLoad={true}
            src={imglink}
            alt={text}
            block="Image"
            style={{ maxWidth: wd, width: "84px", minWidth: "84px" }}
            />
            </div>
          )}

        </Link>
          {text ? (
            <div block="SliderText" style={{ textAlign: text_align }}>
              {text}
            </div>
          ) : null}

          {text ? (
            <div block="SliderTextDescri" style={{ textAlign: text_align }}>
              {textDescription}
            </div>
          ) : null}
        </div>
      </div>
    );
}

renderSliderExperience() {
    const cardsData = this.experienceData.Datas;

    return (
        <DragScroll
            data={{ rootClass: "SliderWithExperienceWrapper", ref: this.cmpRef }}
        >
            <div
            block="SliderWithExperienceWrapper"
            id="SliderWithExperienceWrapper"
            ref={this.cmpRef}
            onScroll={this.handleContainerScroll}
            >
            <div className="SliderHelperE"></div>
            {cardsData.map(this.renderSliderForCards)}
            <div className="SliderHelperE"></div>
            <div className='SliderHelperET'></div>
            </div>
            {this.renderScrollbar()}
        </DragScroll>
    )
}

render() {
    return (
        <div block="renderSliderExperienceWrapper">
            { this.renderSliderExperience() }
        </div>
    )
}

}

export default SliderAboutPage;