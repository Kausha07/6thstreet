/**
 * @category  6thstreet
 * @author    Alona Zvereva <alona.zvereva@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import { PureComponent } from "react";
import Logger from "Util/Logger";
import { Product } from "Util/API/endpoint/Product/Product.type";
import Link from "Component/Link";

class ProductLabel extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
  };

  state = {
    date: "",
  };

  componentDidMount() {
    this.getDate();
  }

  getDate = () => {
    const date = new Date().toLocaleString("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    this.setState({ date });
  };
  renderExclusiveLink(){
    const { product:{brand_name = '', promotion},brandNameLink } = this.props;
    
    let urlString = brandNameLink ?`/${brandNameLink}?q=${brand_name}&p=0&hFR[categories.level0][0]=${brand_name}&dFR[promotion][0]=${promotion}&nR[visibility_catalog][=][0]=1&dFR[in_stock][0]=1`:'';
    if (promotion !== undefined) {
      return promotion !== null ? (
        <>
          {brandNameLink &&
                <Link
                  block="PDPSummary" elem="Exclusive"
                  to={ urlString }
                >
                  {promotion}
                </Link>
          }
          {!brandNameLink && <span block="PDPSummary" elem="Exclusive">{promotion}</span>}
        </>
      ) : null;
    }
  }

  renderNewLink() {
    const {
      product: { is_new_in, brand_name },
      brandNameLink
    } = this.props;
    
    let productTag = this.props.product.product_tag ? this.props.product.product_tag : ""
    const { date } = this.state;
    let urlString;
    try {
      if (productTag) {
        urlString = brandNameLink ? `/${brandNameLink}?q=${brand_name}&p=0&hFR[categories.level0][0]=${brand_name}&nR[visibility_catalog][=][0]=1&dFR[in_stock][0]=1&dFR[product_tag][0]=${productTag}`:'';
        return(
          <>
          {brandNameLink &&
             <Link 
              block="ProductTag"
              to={ urlString }
              >
                {__(productTag)}
            </Link>}
            {!brandNameLink && <span block="ProductTag">{__(productTag)}</span>}
          </>
        );
      }
      else if (is_new_in) {
        urlString = brandNameLink ? `/${brandNameLink}?q=${brand_name}&p=0&hFR[categories.level0][0]=${brand_name}&dFR[is_new_in][0]=${is_new_in ? 1 : 0}&nR[visibility_catalog][=][0]=1&dFR[in_stock][0]=1` :'';
        return (
          <>
            {brandNameLink &&
              <Link
                block="ProductLabel"
                to={ urlString }
                >{__("New")}
              </Link>
            }
            {!brandNameLink && <span block="ProductLabel">{__("New")}</span>}
          </>
        );
      }
    } catch (error) {
      Logger.log(error);
    }

    return null;
  }

  renderNew() {
    const {
      product: { is_new_in },
    } = this.props;
    let productTag = this.props.product.product_tag ? this.props.product.product_tag : ""
    const { date } = this.state;
    try {
      if (productTag) {
        return <span block="ProductTag">{__(productTag)}</span>;
      }
      else if (is_new_in) {
        return <span block="ProductLabel">{__("New")}</span>;
      }
    } catch (error) {
      Logger.log(error);
    }

    return null;
  }

  renderExclusive() {
    const {
      product: { promotion },
    } = this.props;

    if (promotion !== undefined) {
      return promotion !== null ? (
        <span block="PDPSummary" elem="Exclusive">
          {promotion}
        </span>
      ) : null;
    }

    return null;
  }

  renderDash() {
    if (this.renderNew() !== null && this.renderExclusive() !== null) {
      return (
        <span block="PDPSummary" elem="Dash">
          &nbsp; &#8210; &nbsp;
        </span>
      );
    }

    return null;
  }

  render() {
    const { section } = this.props;
    let productTag = this.props.product.product_tag ? this.props.product.product_tag : ""
    return (
      <div block={productTag ? "ProductTagContainer" : "ProductContainer"}>
        {section !== "PDPSummary" && this.renderNew()}
        {section === "PDPSummary" && this.renderNewLink()}
        {/* { this.renderDash() } */}
        {/* {section !== "PDPSummary" && this.renderExclusive()} */}
        {section === "PDPSummary" && this.renderExclusiveLink()}
      </div>
    );
  }
}

export default ProductLabel;
