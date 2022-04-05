import PropTypes from "prop-types";
import { PureComponent } from "react";
import Image from "Component/Image";

import SizeTable from "Component/SizeTable";
import ExpandableContent from "SourceComponent/ExpandableContent";
import Popup from "SourceComponent/Popup";
import isMobile from "SourceUtil/Mobile/isMobile";
import { isArabic } from "Util/App";
import { Product } from "Util/API/endpoint/Product/Product.type";
import chart from "./sizeChart/sizechart.jpg";

import "./PDPSizeGuide.style";
import { BRANDTITLE } from "Component/SizeTable/SizeTable.config.js";

class PDPSizeGuide extends PureComponent {
  static propTypes = {
    activeOverlay: PropTypes.string.isRequired,
    showOverlay: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    currentContentGender: PropTypes.string.isRequired,
    product: Product.isRequired,
  };

  state = {
    isArabic: isArabic(),
    isOpen: false,
  };

  static getDerivedStateFromProps(nextProps) {
    const { activeOverlay } = nextProps;
    document.body.style.overflow =
      activeOverlay === "PDPSizeGuide" ? "hidden" : "visible";
    return { isOpen: activeOverlay === "PDPSizeGuide" };
  }

  handleModalClick = () => {
    const { isOpen } = this.state;
    const { showOverlay } = this.props;
    showOverlay("PDPSizeGuide");
    this.setState({ isOpen: !isOpen });
  };

  renderButton() {
    const { isArabic } = this.state;
    return (
      <span
        onClick={this.handleModalClick}
        onKeyDown={this.handleModalClick}
        role="button"
        aria-label="Dismiss"
        tabIndex={0}
        block="PDPSizeGuide"
        elem="Button"
        mods={{ isArabic }}
        // mix={{ block: "PDPSizeGuide", elem: "Button", mods: isArabic }}
        // mods={{ isArabic }}
      >
        {__("Size Help")}
        {isArabic}
      </span>
    );
  }

  renderModal() {
    const { isArabic, isOpen } = this.state;

    return (
      <Popup
        mix={{
          block: "PDPSizeGuide",
          elem: "Modal",
          mods: { isOpen, isArabic },
        }}
        id="PDPSizeGuide"
        title="Sizing"
      >
        {this.renderModalContents()}
      </Popup>
    );
  }

  hideOverlay = () => {
    const { hideActiveOverlay } = this.props;
    hideActiveOverlay();
  };
  isBrandPro = () => {
    const {
      currentContentGender,
      product: { brand_name, gender },
    } = this.props;
    let checkingBrand = false;
    if (
      BRANDTITLE[brand_name] &&
      (gender === "Women" ||
        gender === "Men" ||
        gender === "رجال" ||
        gender === "نساء")
    ) {
      checkingBrand = true;
    }
    return checkingBrand;
  };
  renderModalContents() {
    const { isArabic } = this.state;
    const closeBtn = (
      <div
        mix={{ block: "PDPSizeGuide", elem: "BackBtn", mods: { isArabic } }}
        onClick={this.hideOverlay}
        onKeyDown={this.hideOverlay}
        role="button"
        aria-label="Dismiss"
        tabIndex={0}
      />
    );

    return (
      <div
        mix={{
          block: "PDPSizeGuide",
          elem: "GuideContainer",
          mods: { isArabic },
        }}
      >
        <div
          mix={{
            block: "PDPSizeGuide",
            elem: "HeaderContainer",
            mods: { isArabic },
          }}
        >
          {isMobile.any() || isMobile.tablet() ? closeBtn : null}
          {this.isBrandPro() ? (
            ""
          ) : (
            <>
            <h1
              mix={{
                block: "PDPSizeGuide",
                elem: "Header",
                mods: { isArabic },
              }}
            >
              {isMobile.any() || isMobile.tablet()
                ? __("SIZE GUIDE")
                : __("SIZE GUIDE")}
            </h1>
            <hr
            mix={{ block: "PDPSizeGuide", elem: "Line", mods: { isArabic } }}
          />
          </>
          )}
          
        </div>
        {/* <span
                  mix={ { block: 'PDPSizeGuide', elem: 'SubHeader', mods: { isArabic } } }
                >
                    { __('Fitting Information - Items fits true to size') }
                </span> */}
        <div
          mix={{
            block: "PDPSizeGuide",
            elem: "TableContainer",
            mods: { isArabic },
          }}
        >
          {this.renderSizeChart()}
          {/* { this.renderTableUK() }
                    <hr mix={ { block: 'PDPSizeGuide', elem: 'Divider', mods: { isArabic } } } />
                    { this.renderTableInt() }
                    <hr mix={ { block: 'PDPSizeGuide', elem: 'Divider', mods: { isArabic } } } />
                    { this.renderTableEu() } */}
        </div>
      </div>
    );
  }

  renderSizeChart() {
    const {
      currentContentGender,
      product: { fit_size_url, brand_name, gender },
    } = this.props;

    if (!!fit_size_url) {
    return <Image lazyLoad={true} src={fit_size_url} alt="Size Chart" />;
    }

    return (
      <SizeTable
        brand={brand_name}
        gender={gender}
        currentContentGender={currentContentGender}
      />
    );
  }

  renderTableUK() {
    const { isArabic } = this.state;
    const isOpen = true;
    return (
      <ExpandableContent
        isOpen={isOpen}
        heading={__("UK")}
        mix={{ mods: { isArabic } }}
      >
        <SizeTable />
      </ExpandableContent>
    );
  }

  renderTableInt() {
    const { isArabic } = this.state;
    const isOpen = true;
    return (
      <ExpandableContent
        isOpen={isOpen}
        heading={__("International")}
        mix={{ mods: { isArabic } }}
      >
        <SizeTable />
      </ExpandableContent>
    );
  }

  renderTableEu() {
    const { isArabic } = this.state;
    const isOpen = false;
    return (
      <ExpandableContent
        isOpen={isOpen}
        heading={__("European")}
        mix={{ mods: { isArabic } }}
      >
        <SizeTable />
      </ExpandableContent>
    );
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div block="PDPSizeGuide">
        {this.renderButton()}
        {isOpen ? this.renderModal() : null}
      </div>
    );
  }
}

export default PDPSizeGuide;
