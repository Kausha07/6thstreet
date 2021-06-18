import PropTypes from "prop-types";
import React from "react";
import { PureComponent } from "react";
import TinySlider from "tiny-slider-react";
import Image from "Component/Image";
import Link from "Component/Link";
import { formatCDNLink } from "Util/Url";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import "./DynamicContentSliderWithLabel.style";
import DragScroll from "Component/DragScroll/DragScroll.component";
import { isArabic } from "Util/App";

class DynamicContentSliderWithLabel extends PureComponent {
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
    };
  }

  componentDidMount() {}

  onclick = (item) => {
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
  };

  renderSliderWithLabel = (item, i) => {
    const { link, text, url, plp_config, height, width, text_align } = item;
    const { isArabic } = this.state;
    const linkTo = {
      pathname: formatCDNLink(link),
      state: { plp_config },
    };

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
          to={linkTo}
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
          <img
            src={url}
            alt={text}
            block="Image"
            style={{ maxWidth: wd, maxHeight: ht }}
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
    this.scrollerRef.current.scrollLeft = target.scrollLeft;
  };

  handleScroll = (event) => {
    const target = event.nativeEvent.target;
    const prentComponent = [...this.cmpRef.current.childNodes].filter(
      (node) => node.className == "SliderWithLabelWrapper"
    )[0];
    prentComponent.scrollLeft = target.scrollLeft;
  };
  renderScrollbar = () => {
    const { items = [] } = this.props;

    const width = `${
      (this.itemRef.current && this.itemRef.current.clientWidth) *
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
    const { items = [], title } = this.props;

    const width = `${
      items[0] && items[0].width
        ? items[0].width * items.length + items.length * 10 * 2 - 690
        : 0
    }px`;

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

  render() {
    const { isArabic } = this.state;
    return (
      <div block="DynamicContentSliderWithLabel" mods={{ isArabic }}>
        {this.props.header && (
          <DynamicContentHeader header={this.props.header} />
        )}
        {this.props.title && (
          <h1 block="Title" mods={{ isArabic }}>
            {this.props.title}
          </h1>
        )}
        {this.renderSliderWithLabels()}
        {this.props.footer && (
          <DynamicContentFooter footer={this.props.footer} />
        )}
      </div>
    );
  }
}

export default DynamicContentSliderWithLabel;
