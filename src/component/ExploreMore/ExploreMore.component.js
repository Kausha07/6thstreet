
import Image from "Component/Image";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { isArabic } from "Util/App";
import Event, {
    EVENT_CLICK_RECENT_SEARCHES_CLICK
} from "Util/Event";
import { formatCDNLink } from "Util/Url";
import BrowserDatabase from "Util/BrowserDatabase";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./ExploreMore.style";

class ExploreMore extends PureComponent {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                link: PropTypes.string,
                url: PropTypes.string,
                title: PropTypes.string,
            })
        ).isRequired,
        header: PropTypes.shape({
            title: PropTypes.string,
        }),
        items_per_row: PropTypes.number,
    };

    static defaultProps = {
        items_per_row: 4,
        header: {},
    };
    state = {
        isArabic: isArabic(),
        isAllShowing: true,
        impressionSent: false,
    };
    componentDidMount() {
    }


    onclick = (item) => {
        Event.dispatch(EVENT_CLICK_RECENT_SEARCHES_CLICK, item)

    };

    renderItem = (item, i) => {
        const { link, url } = item;
        const { isArabic } = this.state;
        const { items_per_row, index } = this.props;
        let item_height = this.props.data

        let ht = item_height.toString() + "px";
        let contentClass = "contentAll";
        if (item_height >= 500 && items_per_row === 2) {
            contentClass = `Content_${i}`;
        }
        const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
            ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
            : "home";
        let requestedGender = isArabic ? getGenderInArabic(gender) : gender;

        return (
            <div
                block="CategoryItem"
                mods={{ isArabic }}
                elem="Content"
                className={contentClass}
                key={i}
            >
                <Link
                    to={formatCDNLink(link)}
                    key={i}
                    data-banner-type="grid"
                    data-promotion-name={item.promotion_name ? item.promotion_name : ""}
                    data-tag={item.tag ? item.tag : ""}
                    onClick={() => {
                        this.onclick(item);
                    }}
                >
                    <Image
                        lazyLoad={index === 34 ? false : true}
                        src={url}
                        className="GridImage"
                    />
                    {item.footer && (
                        <div block="Footer">
                            {item.footer.title && (
                                <p block="Footer-Title">{item.footer.title}</p>
                            )}
                            {item.footer.subtitle && (
                                <p block="Footer-SubTitle">{item.footer.subtitle}</p>
                            )}
                            {item.footer.button_label && (
                                <p>
                                    <a block="Footer-Button">{item.footer.button_label}</a>
                                </p>
                            )}
                        </div>
                    )}
                </Link>
            </div>
        );
    };

    renderItemMobile = (item, i) => {
        const { link, url } = item;
        const { index } = this.props;
        let ht = this.props.item_height.toString() + "px";
        const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
            ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
            : "home";
        let requestedGender = isArabic ? getGenderInArabic(gender) : gender;

        return (
            <div block="CategoryItem" elem="Content" key={i}>
                <Link
                    to={formatCDNLink(link)}
                    key={i}
                    data-banner-type="grid"
                    data-promotion-name={item.promotion_name ? item.promotion_name : ""}
                    data-tag={item.tag ? item.tag : ""}
                    onClick={() => {
                        this.onclick(item);
                    }}
                >
                    <Image lazyLoad={index === 34 ? false : true} src={url} />

                    {item.footer && (
                        <div block="Footer">
                            {item.footer.title && (
                                <p block="Footer-Title">{item.footer.title}</p>
                            )}
                            {item.footer.subtitle && (
                                <p block="Footer-SubTitle">{item.footer.subtitle}</p>
                            )}
                            {item.footer.button_label && (
                                <a block="Footer-Button">{item.footer.button_label}</a>
                            )}
                        </div>
                    )}
                </Link>
            </div>
        );
    };

    renderItems() {
        let items = this.props.data.items
        // if (isMobile.any()) {
        //     return items.map(this.renderItemMobile);
        // }
        return items.map(this.renderItem);
    }

    renderGrid() {
        const { items_per_row, header: { title } = {} } = this.props.data;

        const style = { gridTemplateColumns: `repeat(4, 1fr)` };

        return (
            <>
                {this.props.data.header && title && (
                    <DynamicContentHeader header={this.props.data.header} />
                )}

                <div block="DynamicContentGrid" elem="Grid" style={style}>
                    {this.renderItems()}
                </div>
            </>
        );
    }

    render() {
        let setRef = (el) => {
            this.viewElement = el;
        };
        const { index } = this.props;

        return (
            <div
                ref={setRef}
                block="DynamicContentGrid"
                id={`DynamicContentGrid${index}`}
            >
                {this.renderGrid()}
            </div>
        );
    }
}


//     constructor(props) {
//         super(props);
//         this.cmpRef = React.createRef();
//         this.scrollerRef = React.createRef();
//         this.itemRef = React.createRef();
//         this.state = {
//             activeClass: false,
//             isDown: false,
//             startX: 0,
//             scrollLeft: 0,
//             isArabic: isArabic(),
//             settings: {
//                 lazyload: true,
//                 nav: false,
//                 mouseDrag: true,
//                 touch: true,
//                 controlsText: ["&#x27E8", "&#x27E9"],
//                 gutter: 8,
//                 loop: false,
//                 responsive: {
//                     1024: {
//                         items: 5,
//                         gutter: 25,
//                     },
//                     420: {
//                         items: 5,
//                     },
//                     300: {
//                         items: 2.3,
//                     },
//                 },
//             },
//             impressionSent: false,
//         };
//     }

//     componentDidMount() {
//     }


//     onclick = (item) => {
//         //event for explore more
//     };

//     renderSliderWithLabel = (item, i) => {
//         let height = this.props.data.image_size.height
//         let width = this.props.data.image_size.width
//         const { link, text, url, plp_config, text_align } = item;
//         const { isArabic } = this.state;
//         let parseLink = link;
//         const wd = `${width.toString()}px`;
//         const ht = `${height.toString()}px`;
//         return (
//             <div
//                 block="SliderWithLabel"
//                 mods={{ isArabic }}
//                 ref={this.itemRef}
//                 key={i * 10}
//             >
//                 <Link
//                     to={formatCDNLink(parseLink)}
//                     key={i * 10}
//                     block="SliderWithLabel"
//                     elem="Link"
//                     data-banner-type="sliderWithLabel"
//                     data-promotion-name={item.promotion_name ? item.promotion_name : ""}
//                     data-tag={item.tag ? item.tag : ""}
//                     onClick={() => {
//                         this.onclick(item);
//                     }}
//                 >
//                     <Image
//                         lazyLoad={true}
//                         src={url}
//                         alt={text}
//                         block="Image"
//                         style={{ maxWidth: wd }}
//                     />
//                 </Link>
//                 {text ? (
//                     <div block="SliderText" style={{ textAlign: text_align }}>
//                         {text}
//                     </div>
//                 ) : null}
//             </div>
//         );
//     };

//     handleContainerScroll = (event) => {
//         const target = event.nativeEvent.target;
//         if (this.scrollerRef && this.scrollerRef.current) {
//             this.scrollerRef.current.scrollLeft = target.scrollLeft;
//         }
//     };

//     handleScroll = (event) => {
//         const target = event.nativeEvent.target;
//         const prentComponent = [...this.cmpRef.current.childNodes].filter(
//             (node) => node.className == "SliderWithLabelWrapper"
//         )[0];
//         prentComponent && (prentComponent.scrollLeft = target.scrollLeft);
//     };
//     renderScrollbar = () => {
//         const { items = [] } = this.props;

//         const width = `${(this.itemRef.current && this.itemRef.current.clientWidth) *
//             items.length +
//             items.length * 7 * 2 -
//             690
//             }px`;
//         return (
//             <div
//                 block="Outer"
//                 mods={{
//                     Hidden:
//                         this.scrollerRef.current &&
//                         this.scrollerRef.current.clientWidth >= width,
//                 }}
//                 ref={this.scrollerRef}
//                 onScroll={this.handleScroll}
//             >
//                 <div block="Outer" style={{ width: width }} elem="Inner"></div>
//             </div>
//         );
//     };

//     renderSliderWithLabels() {
//         let items = this.props.data.items
//         if (items.length > 0) {
//             return (
//                 <DragScroll
//                     data={{ rootClass: "SliderWithLabelWrapper", ref: this.cmpRef }}
//                 >
//                     <div
//                         block="SliderWithLabelWrapper"
//                         id="SliderWithLabelWrapper"
//                         ref={this.cmpRef}
//                         onScroll={this.handleContainerScroll}
//                     >
//                         <div className="SliderHelper"></div>
//                         {items.map(this.renderSliderWithLabel)}
//                         <div className="SliderHelper"></div>
//                     </div>
//                     {this.renderScrollbar()}
//                 </DragScroll>
//             );
//         }


//     }

//     render() {
//         let setRef = (el) => {
//             this.viewElement = el;
//         };
//         const { isArabic } = this.state;
//         const { index } = this.props;
//         return (
//             <div
//                 ref={setRef}
//                 block="DynamicContentSliderWithLabel"
//                 id={`DynamicContentSliderWithLabel${index}`}
//             >
//                 {this.props.data.header && (
//                     <DynamicContentHeader header={this.props.data.header} />
//                 )}
//                 {this.props.title && (
//                     <h1 block="Title" mods={{ isArabic }}>
//                         {this.props.title}
//                     </h1>
//                 )}
//                 {this.renderSliderWithLabels()}
//                 {/* {this.props.footer && (
//                     <DynamicContentFooter footer={this.props.footer} />
//                 )} */}
//             </div>
//         );
//     }

// }

export default ExploreMore;
