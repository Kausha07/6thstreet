import PropTypes from 'prop-types';
import Accordion from "Component/Accordion";
import ShareButton from "Component/ShareButton";
import { PureComponent } from "react";
import { Product } from "Util/API/endpoint/Product/Product.type";
import { fetchVueData } from "Util/API/endpoint/Vue/Vue.endpoint";
import { isArabic } from "Util/App";
import BrowserDatabase from "Util/BrowserDatabase";
import VueQuery from "../../query/Vue.query";
import DynamicContentVueProductSliderContainer from "../DynamicContentVueProductSlider";
import { PDP_ARABIC_VALUES_TRANSLATIONS } from "./PDPDetailsSection.config";
import "./PDPDetailsSection.style";

class PDPDetailsSection extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
    clickAndCollectStores: PropTypes.object.isRequired,
  };

  state = {
    isHidden: true,
    isExpanded: {
      0: true,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
    },
    pdpWidgetsAPIData: [],
    isArabic: isArabic(),
  };

  componentDidMount() {
    this.getPdpWidgetsVueData();
  }

  getPdpWidgetsVueData() {
    const { gender, pdpWidgetsData, product: sourceProduct } = this.props;
    if (pdpWidgetsData && pdpWidgetsData.length > 0) {
      //load vue data for widgets only if widgets data available
      const userData = BrowserDatabase.getItem("MOE_DATA");
      if (userData) {
        //added check if user data is loaded then only load PDP widgets otherwise not.
        const {
          USER_DATA: { deviceUuid },
        } = userData;
        const customer = BrowserDatabase.getItem("customer");
        const userID = customer && customer.id ? customer.id : null;
        const query = {
          filters: [],
          num_results: 10,
          mad_uuid: deviceUuid,
        };

        let promisesArray = [];
        pdpWidgetsData.forEach((element) => {
          const { type } = element;
          const payload = VueQuery.buildQuery(type, query, {
            gender,
            userID,
            sourceProduct,
          });
          promisesArray.push(fetchVueData(payload));
        });
        Promise.all(promisesArray)
          .then((resp) => {
            this.setState({ pdpWidgetsAPIData: resp });
          })
          .catch((err) => {
            console.err(err);
          });
      }
    }
  }

  renderShareButton() {
    const url = new URL(window.location.href);
    url.searchParams.append("utm_source", "pdp_share");
    return (
      <div block="PDPDetailsSection" elem="ShareButtonContainer">
        <ShareButton
          block="PDPDetailsSection-ShareButtonContainer"
          elem="ShareButton"
          title={document.title}
          text={`Hey check this out: ${document.title}`}
          url={url.toString()}
          mods={{ isArabic: isArabic() }}
        >
          <span>{__("Share")}</span>
        </ShareButton>
      </div>
    );
  }

  renderSizeAndFit() {
    const {
      product: { description },
    } = this.props;

    return (
      <>
        <p block="PDPDetailsSection" elem="SizeFit">
          {__("Fitting Information - Items fits true to size")}
        </p>
        <div block="PDPDetailsSection" elem="ModelMeasurements">
          <h4>{__("Model Measurements")}</h4>
        </div>
      </>
    );
  }

  renderMoreDetailsItem(item) {
    return (
      <li block="PDPDetailsSection" elem="MoreDetailsList" key={item.key}>
        <span block="PDPDetailsSection" elem="ListItem" mods={{ mod: "title" }}>
          {isArabic()
            ? this._translateValue(item.key)
            : this.listTitle(__(item.key))}
        </span>
        <span block="PDPDetailsSection" elem="ListItem" mods={{ mod: "value" }}>
          {item.value}
        </span>
      </li>
    );
  }

  _translateValue(value) {
    if (typeof PDP_ARABIC_VALUES_TRANSLATIONS[value] === "undefined") {
      return value;
    }

    return PDP_ARABIC_VALUES_TRANSLATIONS[value];
  }

  openFullInfo = () => {
    this.setState({ isHidden: false });
  };

  renderIconsSection() {
    const { clickAndCollectStores } = this.props;
    return (
      <div block="PDPDetailsSection" elem="IconsSection">
        {
          clickAndCollectStores?.length
          ?
          <div block="PDPDetailsSection" elem="IconContainer">
            <div
              block="PDPDetailsSection"
              elem="Icon"
              mods={{ clickAndCollect: true }}
            />
            <div>
              <div block="Click">{__("Click")}</div>
              <div block="AndCollect">{__("& Collect")}</div>
            </div>
          </div>
          :
          null
        }
        <div block="PDPDetailsSection" elem="IconContainer">
          <div
            block="PDPDetailsSection"
            elem="Icon"
            mods={{ isGenuine: true }}
          />
          <div>{__("100% Genuine")}</div>
        </div>
        <div block="PDPDetailsSection" elem="IconContainer">
          <div
            block="PDPDetailsSection"
            elem="Icon"
            mods={{ freeReturn: true }}
          />
          <div>{__("Free Returns")}</div>
        </div>
      </div>
    );
  }

  renderDescription() {
    const {
      product: { description },
    } = this.props;
    return (
      <>
        <p block="PDPDetailsSection" elem="Description">
          {description}
        </p>
        {this.renderHighlights()}
      </>
    );
  }

  listTitle(str) {
    return str.replace("_", " ");
  }

  renderListItem(arr) {
    return (
      <li block="PDPDetailsSection" elem="HighlightsList" key={arr[0]}>
        <span block="PDPDetailsSection" elem="ListItem" mods={{ mod: "title" }}>
          {isArabic() ? this._translateValue(arr[0]) : this.listTitle(arr[0])}
        </span>
        <span block="PDPDetailsSection" elem="ListItem" mods={{ mod: "value" }}>
          {arr[1]}
        </span>
      </li>
    );
  }

  renderListItems(obj = {}) {
    return Object.entries(obj)
      .filter((item) => item[1] != null)
      .map((item) => this.renderListItem(item));
  }

  renderHighlights() {
    const {
      product: {
        material,
        dress_length,
        heel_height,
        heel_shape,
        leg_length,
        neck_line,
        skirt_length,
        toe_shape,
        sleeve_length,
        product_height,
        product_length,
        product_width,
        model_height,
        model_wearing_size,
        sku,
      },
    } = this.props;

    const productInfo = {
      material,
      dress_length,
      heel_height,
      heel_shape,
      leg_length,
      neck_line,
      skirt_length,
      toe_shape,
      sleeve_length,
      product_height,
      product_length,
      product_width,
    };

    return (
      <div block="PDPDetailsSection" elem="Highlights">
        <h4>{__("Highlights")}</h4>
        <ul>{this.renderListItems(productInfo)}</ul>
        {this.renderModelDetails(model_height, model_wearing_size)}
        {this.renderSKU(sku)}
        {/* {this.renderMoreDetailsList()} */}
      </div>
    );
  }

  renderSKU(sku) {
    return (
      <p block="PDPDetailsSection-Highlights" elem="SKU">
        <span>SKU: </span>
        <span>{sku}</span>
      </p>
    );
  }
  renderModelDetails(height, size) {
    if (!size) {
      return null;
    }

    if (!height) {
      return (
        <p block="PDPDetailsSection-Highlights" elem="ModelDetails">
          <span>{__(`Model is wearing `)}</span>
          <span>{`size `}</span>
          <span>{size}</span>
        </p>
      );
    }
    return (
      <p block="PDPDetailsSection-Highlights" elem="ModelDetails">
        <span>{__(`Model's height is `)}</span>
        <span>{height}</span>
        <span>{__(" & is wearing ")}</span>
        <span>{`size `}</span>
        <span>{size}</span>
      </p>
    );
  }

  renderSizeAndFit() {
    const {
      product: { description },
    } = this.props;
    return (
      <>
        <p block="PDPDetailsSection" elem="SizeFit">
          {__("Fitting Information - Items fits true to size")}
        </p>
        <div block="PDPDetailsSection" elem="ModelMeasurements">
          <h4>{__("Model Measurements")}</h4>
        </div>
      </>
    );
  }

  renderMoreDetailsList() {
    const {
      product: { highlighted_attributes },
    } = this.props;

    if (
      highlighted_attributes !== undefined &&
      highlighted_attributes !== null
    ) {
      return (
        <ul block="PDPDetailsSection" elem="MoreDetailsUl">
          {highlighted_attributes
            .filter(({ key }) => key !== "alternate_name")
            .map((item) => this.renderMoreDetailsItem(item))}
        </ul>
      );
    }

    return null;
  }

  renderMoreDetailsSection() {
    const { isHidden } = this.state;

    return (
      <div block="PDPDetailsSection" elem="MoreDetails" mods={{ isHidden }}>
        {this.renderMoreDetailsList()}
      </div>
    );
  }

  renderAccordionTitle(title) {
    return (
      <div block="'PDPDetailsSection-Description" elem="AccordionTitle">
        <h3>{title}</h3>
      </div>
    );
  }

  renderPdpWidgets() {
    const { pdpWidgetsData,renderMySignInPopup } = this.props;
    const { pdpWidgetsAPIData } = this.state;
    if (pdpWidgetsData.length > 0 && pdpWidgetsAPIData.length > 0) {
      return (
        <React.Fragment>
          {pdpWidgetsAPIData.map((item, index) => {
            if (typeof item === "object" && Object.keys(item).length > 0) {
              const { title: heading } = pdpWidgetsData[index]["layout"];
              const widgetID = pdpWidgetsData[index]["type"];
              const { data } = item;
              if (data && data.length > 0) {
                return (
                  <DynamicContentVueProductSliderContainer
                    widgetID={widgetID}
                    products={data}
                    heading={heading}
                    isHome={true}
                    renderMySignInPopup={renderMySignInPopup}
                    pageType={"pdp"}
                    key={`DynamicContentVueProductSliderContainer${index}`}
                  />
                );
              }
              return null;
            }
            return null;
          })}
        </React.Fragment>
      );
    }
    return null;
  }

  render() {
    const {
      product: { brand_name },
    } = this.props;
    return (
      <div block="PDPDetailsSection">
        <Accordion
          mix={{ block: "PDPDetailsSection", elem: "Accordion" }}
          title={__("Description")}
          is_expanded={this.state.isExpanded["0"]}
        >
          {this.renderIconsSection()}
          {this.renderDescription()}
        </Accordion>
        <div block="Seperator" />
        {this.renderShareButton()}
        {this.renderPdpWidgets()}
        {/* <Accordion
            mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
            title={ __('Size & Fit') }
            is_expanded={this.state.isExpanded["1"]}
          >
              { this.renderSizeAndFit() }
        </Accordion> */}
        {/*        <Accordion
                  mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
                  title={ __('Click & Collect') }
                  is_expanded={this.state.isExpanded["2"]}
                >
                </Accordion>
                <Accordion
                  mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
                  title={ __('Shipping & Free Returns') }
                  is_expanded={this.state.isExpanded["3"]}
                >
                </Accordion>
                <Accordion
                  mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
                  title={ `${__('About')} ${brand_name}` }
                  is_expanded={this.state.isExpanded["4"]}
                >
                </Accordion>
                <Accordion
                  mix={ { block: 'PDPDetailsSection', elem: 'Accordion' } }
                  title={ __('Contact Us') }
                  is_expanded={this.state.isExpanded["5"]}
                >
                </Accordion> */}
      </div>
    );
  }
}

export default PDPDetailsSection;
