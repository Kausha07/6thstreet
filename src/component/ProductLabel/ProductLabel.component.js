/**
 * @category  6thstreet
 * @author    Alona Zvereva <alona.zvereva@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import { PureComponent } from "react";
import Logger from "Util/Logger";
import { Product } from "Util/API/endpoint/Product/Product.type";

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

  renderNew() {
    const {
      product: { news_from_date, news_to_date },
    } = this.props;
    const { date } = this.state;
    try {
      if (
        Date.parse(date) <= Date.parse(news_to_date.replaceAll("-", "/")) &&
        Date.parse(date) >= Date.parse(news_from_date.replaceAll("-", "/"))
      ) {
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
    return (
      <div block="ProductContainer">
        {this.renderNew()}
        {/* { this.renderDash() } */}
        {/* { this.renderExclusive() } */}
      </div>
    );
  }
}

export default ProductLabel;
