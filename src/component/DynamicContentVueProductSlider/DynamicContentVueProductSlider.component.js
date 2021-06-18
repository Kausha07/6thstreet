import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import DragScroll from "Component/DragScroll/DragScroll.component";
import "./DynamicContentVueProductSlider.style.scss";
import DynamicContentVueProductSliderItem from "./DynamicContentVueProductSlider.Item";

class DynamicContentVueProductSlider extends PureComponent {
  static propTypes = {
    withViewAll: PropTypes.bool,
    sliderLength: PropTypes.number,
    heading: PropTypes.string.isRequired,
    products: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.itemRef = React.createRef();
    this.cmpRef = React.createRef();
    this.scrollerRef = React.createRef();
    this.state = {
      customScrollWidth: null,
    };
  }

  componentDidMount() {
    if (this.state.customScrollWidth < 0) {
      this.renderScrollbar();
    }
  }

  getProducts = () => {
    const { products: data, sliderLength } = this.props;
    let products = [...data];
    if (products.length > sliderLength) {
      products.length = sliderLength;
    }
    return [...products];
  };

  viewAllBtn() {
    const { withViewAll } = this.props;
    if (withViewAll) {
      return (
        <div block="VueProductSlider" elem="ViewAllBtn">
          <span>{"View All"}</span>
        </div>
      );
    }
    return null;
  }

  renderHeader() {
    const { heading } = this.props;
    return (
      <div block="VueProductSlider" elem="HeaderContainer">
        <h1>{heading}</h1>
      </div>
    );
  }
  handleContainerScroll = (event) => {
    const target = event.nativeEvent.target;
    this.scrollerRef.current.scrollLeft = target.scrollLeft;
  };

  handleScroll = (event) => {
    // debugger
    const target = event.nativeEvent.target;
    const prentComponent = [...this.cmpRef.current.childNodes].filter(
      (node) => node.className == "VueSliderWrapper"
    )[0];
    this.cmpRef.current.scrollLeft = target.scrollLeft;
    console.log();
  };

  renderScrollbar = () => {
    let items = this.getProducts();

    const width =
      (this.itemRef.current &&
        this.itemRef.current.childRef.current.clientWidth) *
        items.length +
      items.length * 7 * 2 -
      690;
    this.setState({
      customScrollWidth: width,
    });
    console.log(this.state.width);
    // setTimeout(()=>{console.log(this); debugger}, 5000);
    // this.setState({
    //     hi:"hi"
    // })
    return (
      <div
        block="Outer"
        ref={this.scrollerRef}
        mods={{
          Hidden:
            this.scrollerRef.current &&
            this.scrollerRef.current.clientWidth >=
              this.state.customScrollWidth,
        }}
        onScroll={this.handleScroll}
      >
        <div
          block="Outer"
          style={{ width: this.state.customScrollWidth }}
          elem="Inner"
        ></div>
      </div>
    );
  };

  renderSliderContainer() {
    const items = this.getProducts();
    const { isHome } = this.props;

    return (
      <>
        <div
          block="VueProductSlider"
          elem="SliderContainer"
          ref={this.cmpRef}
          onScroll={this.handleContainerScroll}
        >
          {isHome && <div block="SliderHelper" mods={{ isHome }}></div>}
          {items.map((item) => {
            const { sku } = item;
            return (
              <DynamicContentVueProductSliderItem
                key={sku}
                data={item}
                ref={this.itemRef}
              />
            );
          })}
          {isHome && <div block="SliderHelper" mods={{ isHome }}></div>}
        </div>
        {this.renderScrollbar()}
      </>
    );
  }

  render() {
    return (
      <div block="VueProductSlider" elem="Container">
        {this.renderHeader()}
        {this.renderSliderContainer()}
      </div>
    );
  }
}

export default DynamicContentVueProductSlider;
