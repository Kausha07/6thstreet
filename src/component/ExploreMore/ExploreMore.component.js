import DragScroll from "Component/DragScroll/DragScroll.component";
import {
    HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
    HOME_PAGE_BANNER_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";
import Image from "Component/Image";
import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { isArabic } from "Util/App";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import { formatCDNLink } from "Util/Url";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./ExploreMore.style";

class ExploreMore extends PureComponent {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                url: PropTypes.string,
                label: PropTypes.string,
                link: PropTypes.string,
                plp_config: PropTypes.shape({}), // TODO: describe
            })
        ).isRequired,
    };

    constructor(props) {
        super(props);
        this.cmpRef = React.createRef();
        this.scrollerRef = React.createRef();
        this.itemRef = React.createRef();
        this.state = {
            activeClass: false,
            isDown: false,
            startX: 0,
            scrollLeft: 0,
            isArabic: isArabic(),
            settings: {
                lazyload: true,
                nav: false,
                mouseDrag: true,
                touch: true,
                controlsText: ["&#x27E8", "&#x27E9"],
                gutter: 8,
                loop: false,
                responsive: {
                    1024: {
                        items: 5,
                        gutter: 25,
                    },
                    420: {
                        items: 5,
                    },
                    300: {
                        items: 2.3,
                    },
                },
            },
            impressionSent: false,
        };
    }

    componentDidMount() {
    }


    onclick = (item) => {
        //event for explore more
    };

    renderSliderWithLabel = (item, i) => {
        let height = this.props.data.image_size.height
        let width = this.props.data.image_size.width
        const { link, text, url, plp_config, text_align } = item;
        const { isArabic } = this.state;
        let parseLink = link;
        const wd = `${width.toString()}px`;
        const ht = `${height.toString()}px`;
        return (
            <div
                block="SliderWithLabel"
                mods={{ isArabic }}
                ref={this.itemRef}
                key={i * 10}
            >
                <Link
                    to={formatCDNLink(parseLink)}
                    key={i * 10}
                    block="SliderWithLabel"
                    elem="Link"
                    data-banner-type="sliderWithLabel"
                    data-promotion-name={item.promotion_name ? item.promotion_name : ""}
                    data-tag={item.tag ? item.tag : ""}
                    onClick={() => {
                        this.onclick(item);
                    }}
                >
                    <Image
                        lazyLoad={true}
                        src={url}
                        alt={text}
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

    handleContainerScroll = (event) => {
        const target = event.nativeEvent.target;
        if (this.scrollerRef && this.scrollerRef.current) {
            this.scrollerRef.current.scrollLeft = target.scrollLeft;
        }
    };

    handleScroll = (event) => {
        const target = event.nativeEvent.target;
        const prentComponent = [...this.cmpRef.current.childNodes].filter(
            (node) => node.className == "SliderWithLabelWrapper"
        )[0];
        prentComponent && (prentComponent.scrollLeft = target.scrollLeft);
    };
    renderScrollbar = () => {
        const { items = [] } = this.props;

        const width = `${(this.itemRef.current && this.itemRef.current.clientWidth) *
            items.length +
            items.length * 7 * 2 -
            690
            }px`;
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

    renderSliderWithLabels() {
        let items = this.props.data.items
        if (items.length > 0) {
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
                    </div>
                    {this.renderScrollbar()}
                </DragScroll>
            );
        }


    }

    render() {
        let setRef = (el) => {
            this.viewElement = el;
        };
        const { isArabic } = this.state;
        const { index } = this.props;
        return (
            <div
                ref={setRef}
                block="DynamicContentSliderWithLabel"
                id={`DynamicContentSliderWithLabel${index}`}
            >
                {this.props.data.header && (
                    <DynamicContentHeader header={this.props.data.header} />
                )}
                {this.props.title && (
                    <h1 block="Title" mods={{ isArabic }}>
                        {this.props.title}
                    </h1>
                )}
                {this.renderSliderWithLabels()}
                {/* {this.props.footer && (
                    <DynamicContentFooter footer={this.props.footer} />
                )} */}
            </div>
        );
    }

}

export default ExploreMore;
