import { PureComponent } from "react";
import { Route, Switch } from "react-router-dom";

import MyAccountCancelCreate from "Component/MyAccountCancelCreate";
import MyAccountCancelCreateSuccess from "Component/MyAccountCancelCreateSuccess";
import MyAccountReturnCreate from "Component/MyAccountReturnCreate";
import MyAccountExchangeCreate from "Component/MyAccountExchangeCreate";
import MyAccountReturnCreateList from "Component/MyAccountReturnCreateList";
import MyAccountReturnList from "Component/MyAccountReturnList";
import MyAccountReturnSuccess from "Component/MyAccountReturnSuccess";
import MyAccountReturnView from "Component/MyAccountReturnView";
import { withStoreRegex } from "Component/Router/Router.component";

import "./MyAccountReturns.style";
const product = {
  name: "Sleeveless Printed Top - White AR-8319-4314",
  url: "https://en-ae-stage.6tst.com/aeropostale-sleeveless-printed-top-white-ar-8319-4314-for-female-ar-8319-4314-arwhite-108.html",
  visibility_search: 1,
  visibility_catalog: 1,
  type_id: "configurable",
  description:
    "Lusting after luster wearing this white colored top by Aeropostale. Made from rayon fabric, it is light in weight and will be soft against your skin. This top can be best teamed with matching sandals and a clutch.Height 174 cm , Bust 80 cm, Waist 56 cm, Hips 86 cmModel is wearing size S",
  ordered_qty: "",
  rating_summary: "",
  categories: {
    level0: ["Women", "Aeropostale", "Exclusive March"],
    level1: ["Women /// Clothing", "Women /// Outlet"],
    level2: ["Women /// Clothing /// Tops & Tshirts"],
  },
  categories_without_path: ["Tops & Tshirts"],
  categoryIds: ["4", "11", "38", "1004", "8026", "1513"],
  thumbnail_url:
    "https://en-ae-stage.6tst.com/media/catalog/product/cache/e051e343fbed6099e8c148bd11733e32/a/r/ar-8319-4314-arwhite-108-760x850.jpg",
  image_url:
    "//en-ae-stage.6tst.com/media/catalog/product/cache/e051e343fbed6099e8c148bd11733e32/a/r/ar-8319-4314-arwhite-108-760x850.jpg",
  in_stock: 1,
  stock_qty: 10109,
  color: "White",
  sku: "AR-8319-4314-ARWHITE-108",
  price: [
    {
      AED: {
        default: 60,
        default_formated: "AED 60.00",
        special_from_date: 1536677002,
        special_to_date: false,
        "6s_base_price": 149,
        "6s_special_price": 60,
        "6s_lowest_price_sub_product_id": "817237",
        is_sale_label: true,
      },
    },
  ],
  created_at: "2018-09-11 14:43:22",
  brand_name: "Aeropostale",
  news_from_date: "Aug 18, 2021",
  news_to_date: ["2018-09-25 00:00:00"],
  category_ids: [
    "11",
    "38",
    "1004",
    "3537",
    "3922",
    "4298",
    "4610",
    "5345",
    "5420",
    "5479",
    "5849",
    "5874",
    "6384",
    "8026",
    "1513",
  ],
  colorfamily: "White",
  status: "Enabled",
  fit_size_url:
    "https://mobilecdn.6thstreet.com/resources/fitguides/WOMENS_CLOTHING_SIZE_CHART.jpg",
  enable_notify_me: "No",
  discount: 60,
  size_eu: ["XS", "S", "M", "L"],
  neck_line: "Round Neck",
  gender: "Women",
  alternate_name: "Sleeveless Printed Top - White AR-8319-4314",
  reviews_count: 0,
  gallery_images: [
    "https://en-ae-stage.6tst.com/media/catalog/product/a/r/ar-8319-4314-arwhite-108-760x850.jpg",
    "https://en-ae-stage.6tst.com/media/catalog/product/a/r/ar-8319-4314-arwhite-108-760x850-2.jpg",
    "https://en-ae-stage.6tst.com/media/catalog/product/a/r/ar-8319-4314-arwhite-108-760x850-3.jpg",
    "https://en-ae-stage.6tst.com/media/catalog/product/a/r/ar-8319-4314-arwhite-108-760x850-4.jpg",
    "https://en-ae-stage.6tst.com/media/catalog/product/a/r/ar-8319-4314-arwhite-108-760x850-5.jpg",
  ],
  is_returnable: 1,
  flipimage_url:
    "https://en-ae-stage.6tst.com/media/catalog/product/cache/15e481ff6e43739ce3dce2e015d41790/a/r/ar-8319-4314-arwhite-108-760x850-2.jpg",
  is_new_in: 0,
  sleeve_length: "Sleeveless",
  fit: false,
  heel_shape: false,
  cross_border: 1,
  "6s_also_available_count": 1,
  "6s_also_available": ["AR-8319-4314-ARBLACK-1"],
  also_available_color: ",#000000,#ffffff",
  dress_length: null,
  leg_length: null,
  skirt_length: null,
  toe_shape: null,
  heel_height: null,
  size_uk: ["XS", "S", "M", "L"],
  size_us: ["XS", "S", "M", "L"],
  material: null,
  simple_products: {
    90812883318: {
      size: {
        eu: "XS",
        uk: "XS",
        us: "XS",
      },
      quantity: "9",
      cross_border_qty: "-1.0000",
    },
    90812891318: {
      size: {
        eu: "S",
        uk: "S",
        us: "S",
      },
      quantity: "60",
      cross_border_qty: "-1.0000",
    },
    90812913318: {
      size: {
        eu: "M",
        uk: "M",
        us: "M",
      },
      quantity: "9976",
      cross_border_qty: "-1.0000",
    },
    90812921318: {
      size: {
        eu: "L",
        uk: "L",
        us: "L",
      },
      quantity: "64",
      cross_border_qty: "-1.0000",
    },
    90812948318: {
      size: {
        eu: "XL",
        uk: "XL",
        us: "XL",
      },
      quantity: "0",
      cross_border_qty: "-1.0000",
    },
  },
  age: [],
  subproduct_color: [],
  swatch_color: [],
  size_availability_priority: 1,
  cart_qty: 0,
  list_clicks: 1,
  rpi: 0,
  weeks_old: 8,
  is_sale: 1,
  algoliaLastUpdateAtCET: "2022-05-12 10:16:11",
  objectID: "817238",
  _highlightResult: {
    name: {
      value: "Sleeveless Printed Top - White AR-8319-4314",
      matchLevel: "none",
      matchedWords: [],
    },
    categories: {
      level0: [
        {
          value: "Women",
          matchLevel: "none",
          matchedWords: [],
        },
        {
          value: "Aeropostale",
          matchLevel: "none",
          matchedWords: [],
        },
        {
          value: "Exclusive March",
          matchLevel: "none",
          matchedWords: [],
        },
      ],
      level1: [
        {
          value: "Women /// Clothing",
          matchLevel: "none",
          matchedWords: [],
        },
        {
          value: "Women /// Outlet",
          matchLevel: "none",
          matchedWords: [],
        },
      ],
      level2: [
        {
          value: "Women /// Clothing /// Tops & Tshirts",
          matchLevel: "none",
          matchedWords: [],
        },
      ],
    },
    color: {
      value: "White",
      matchLevel: "none",
      matchedWords: [],
    },
    sku: {
      value: "AR-8319-4314-ARWHITE-108",
      matchLevel: "none",
      matchedWords: [],
    },
    brand_name: {
      value: "Aeropostale",
      matchLevel: "none",
      matchedWords: [],
    },
    gender: {
      value: "Women",
      matchLevel: "none",
      matchedWords: [],
    },
    alternate_name: {
      value: "Sleeveless Printed Top - White AR-8319-4314",
      matchLevel: "none",
      matchedWords: [],
    },
  },
};
class MyAccountReturns extends PureComponent {
  renderCreateCancel({ match }) {
    return <MyAccountCancelCreate match={match} />;
  }

  renderCreateReturnList() {
    return <MyAccountReturnCreateList />;
  }

  renderCreateReturn({ match }) {
    return <MyAccountReturnCreate match={match} />;
  }

  renderCreateExchange({ match }) {
    return <MyAccountExchangeCreate match={match} product={product} />;
  }

  renderOrderList(type) {
    return <MyAccountReturnList type={type} />;
  }

  renderOrderView({ match }) {
    return <MyAccountReturnView match={match} />;
  }

  renderCreateReturnSuccess({ match }) {
    return <MyAccountReturnSuccess match={match} />;
  }

  renderCreateCancelSuccess({ match }) {
    return <MyAccountCancelCreateSuccess match={match} />;
  }

  render() {
    return (
      <Switch>
        <Route
          path={withStoreRegex(
            "/my-account/return-item/create/success/:returnId"
          )}
          render={this.renderCreateReturnSuccess}
          exact
        />
        <Route
          path={withStoreRegex("/my-account/return-item/create/")}
          render={this.renderCreateReturnList}
          exact
        />
        <Route
          path={withStoreRegex("/my-account/return-item/create/:order")}
          render={this.renderCreateReturn}
          exact
        />
        <Route
          path={withStoreRegex("/my-account/return-item")}
          render={() => this.renderOrderList("return")}
          exact
        />
        <Route
          path={withStoreRegex("/my-account/exchange-item/create/:order")}
          render={this.renderCreateExchange}
          exact
        />
        <Route
          path={withStoreRegex(
            "/my-account/return-item/cancel/success/:cancelId"
          )}
          render={this.renderCreateCancelSuccess}
          exact
        />
        <Route
          path={withStoreRegex("/my-account/return-item/cancel/:order")}
          render={this.renderCreateCancel}
          exact
        />
        <Route
          path={withStoreRegex("/my-account/return-item/:return")}
          render={this.renderOrderView}
          exact
        />
      </Switch>
    );
  }
}

export default MyAccountReturns;
