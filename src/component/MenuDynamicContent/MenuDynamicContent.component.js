// import PropTypes from 'prop-types';
import { PureComponent } from "react";
import DynamicContent from "Component/DynamicContent";
import MenuBanner from "Component/MenuBanner";
import MenuBrands from "Component/MenuBrands";
import MenuGrid from "Component/MenuGrid";

import "./MenuDynamicContent.style";
class MenuDynamicContent extends PureComponent {
  state = {
    impressions: [],
    sliderImpressionCount: 0,
  };

  renderMap = {
    banner: MenuBanner,
    grid: MenuGrid,
    slider: MenuBrands,
  };

  renderBlock = (block, i) => {
    const { type, ...restProps } = block;
    const Component = this.renderMap[type];
    const { toggleMobileMenuSideBar } = this.props;

    if (!Component) {
      // TODO: implement all types
      Logger.log(type, restProps);
      return null;
    }

    return (
      <Component
        toggleMobileMenuSideBar={toggleMobileMenuSideBar}
        {...restProps}
        key={i}
      />
    );
  };

  renderBlocks = () => {
    const { content = [] } = this.props;
    return content.map(this.renderBlock);
  };

  render() {
    return <div block="DynamicContent">{this.renderBlocks()}</div>;
  }
}

export default MenuDynamicContent;
