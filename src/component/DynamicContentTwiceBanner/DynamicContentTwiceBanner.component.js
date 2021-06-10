import { PureComponent } from 'react';
// import Image from 'Component/Image';
import { formatCDNLink } from 'Util/Url';
import Link from 'Component/Link';
import { isArabic } from 'Util/App';

import './DynamicContentTwiceBanner.style';

class DynamicContentTwiceBanner extends PureComponent {
    state = {
        isArabic: isArabic(),
        isAllShowing: true
    };

    static defaultProps = {
        button: {},
        typeOfBanner : ''
    };

    constructor(props) {
        super(props);
    }

    renderImage = (item, isTwiceBanner) => {
        const { typeOfBanner } = this.props;
        const { title, subtitle, button_label, button_link } = this.props[typeOfBanner];
        const {
            url,
            link,
            height = "",
            width = ""
        } = item;
        // let ht, wd;
        // if (screen.width > 900) {
        //     wd = (isTwiceBanner) ? "334px" : "408px"; // (screen.width - 20 ).toString() + "px";
        //     ht = (isTwiceBanner) ? "201px" : "334px";
        //     // ht = (ht / width)*(screen.width)
        // }
        // else{
        //     wd = (isTwiceBanner) ? (width - 25 ).toString() + "px" : width.toString() + "px";
        //     ht = (isTwiceBanner) ? (height - 85 ).toString() + "px" : height.toString() + "px";
        // }

        // TODO: calculate aspect ratio to ensure images not jumping.
        // if (!link) {
        //     return (
        //         <>
        //             <Image
        //               key={ i }
        //               src={ url }
        //               ratio="custom"
        //               height={ ht }
        //               width={ wd }
        //             />
        //             { this.renderButton() }
        //         </>
        //     );
        // }
        if(isTwiceBanner) {
            return (
                <div className= 'TwiceBanner'>
                    <div className= 'TwiceBannerBlock'>
                        <div className="TwiceBannerBlockChildTitle">{title}</div>
                        <div className="TwiceBannerBlockChildSub">{subtitle}</div>
                        <div className="TwiceBannerBlockChild"> <a href={button_link}><button>{button_label}</button></a> </div>
                    </div>
                </div>
            );
        }
        return (
            <Link
              to={ formatCDNLink(link) }
              data-banner-type="banner"
              data-promotion-name= {item.promotion_name ? item.promotion_name : ""}
              data-tag={item.tag ? item.tag : ""}
              onClick={() => {this.onclick(item)}}
            >
                <img src={ url } className='BannerImage' style={{ maxWidth: width, maxHeight: height }}/>
            </Link>
        );
    };

    renderImages(isTwiceBanner = false) {
        const { items = [] } = this.props;
        return this.renderImage(items[0], isTwiceBanner);
    }

    render() {
        // const { isArabic } = this.state;
        // const { isAllShowing } = this.state;
        const { typeOfBanner } = this.props;
        const BannerPosition = typeOfBanner === "header" ? "Right" : "Left";
        return (
            <div block="DynamicContentTwiceBanner" className="row" elem='Content'>
                {(BannerPosition === "Left") ?
                <>
                <div block="DynamicContentTwiceBanner" elem="BannerImg" class="banner1" >
                    {this.renderImages()}
                </div>
                <div block="DynamicContentTwiceBanner" elem="Figure" class="banner2" >
                    {this.renderImages(true)}
                </div></>
                :
                <>
                    <div block="DynamicContentTwiceBanner" elem="FigureRight" class="banner1" >
                        {this.renderImages(true)}
                    </div>
                    <div block="DynamicContentTwiceBanner" elem="BannerImgRight" class="banner2" >
                        {this.renderImages()}
                    </div>
                </>
                }
            </div>
        );
    }
}

export default DynamicContentTwiceBanner;
