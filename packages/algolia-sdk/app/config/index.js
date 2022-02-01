import { translations } from "./translations";

const FACET_FILTERS = [
  "brand_name",
  "categories.level0",
  "categories.level1",
  "categories.level2",
  "categories.level3",
  "categories.level4",
  "categories_without_path",
  "color",
  "colorfamily",
  "dress_length",
  "fit",
  "gender",
  "heel_height",
  "is_new_in",
  "leg_length",
  "neck_line",
  "size_uk",
  "size_eu",
  "size_us",
  "skirt_length",
  "sleeve_length",
  "technology",
  "toe_shape",
  "tommy_label",
  "in_stock",
  "age",
  'promotion'
];

const config = {
  FACET_FILTERS,
  NUMERIC_FILTERS: [
    "discount",
    "visibility_catalog",

    // price filter keys
    "price.AED.default",
    "price.SAR.default",
    "price.KWD.default",
    "price.OMR.default",
    "price.BHD.default",
    "price.QAR.default",
  ],

  VISIBLE_FILTERS: [
    "categories.level1",
    "brand_name",
    "colorfamily",
    "gender",
    "age",
    "size",
    "price",
    "discount",
    "in_stock",
  ],

  SIZE_FILTERS: ["size_uk", "size_eu", "size_us"],
  CURRENCY_STRIP_INSIGNIFICANT_ZEROS: ["AED", "SAR", "QAR"],

  INDICES: {
    "en-ae": {
      default: "magento_english_products",
      latest: "magento_english_products_created_at_desc",
      price_low: "magento_english_products_price_default_asc",
      price_high: "magento_english_products_price_default_desc",
      discount: "magento_english_products_discount_desc",
    },
    "ar-ae": {
      default: "magento_arabic_products",
      latest: "magento_arabic_products_created_at_desc",
      price_low: "magento_arabic_products_price_default_asc",
      price_high: "magento_arabic_products_price_default_desc",
      discount: "magento_arabic_products_discount_desc",
    },
    "en-sa": {
      default: "magento_en_sa_products",
      latest: "magento_en_sa_products_created_at_desc",
      price_low: "magento_en_sa_products_price_default_asc",
      price_high: "magento_en_sa_products_price_default_desc",
      discount: "magento_en_sa_products_discount_desc",
    },
    "ar-sa": {
      default: "magento_ar_sa_products",
      latest: "magento_ar_sa_products_created_at_desc",
      price_low: "magento_ar_sa_products_price_default_asc",
      price_high: "magento_ar_sa_products_price_default_desc",
      discount: "magento_ar_sa_products_discount_desc",
    },
    "en-kw": {
      default: "magento_en_kw_products",
      latest: "magento_en_kw_products_created_at_desc",
      price_low: "magento_en_kw_products_price_default_asc",
      price_high: "magento_en_kw_products_price_default_desc",
      discount: "magento_en_kw_products_discount_desc",
    },
    "ar-kw": {
      default: "magento_ar_kw_products",
      latest: "magento_ar_kw_products_created_at_desc",
      price_low: "magento_ar_kw_products_price_default_asc",
      price_high: "magento_ar_kw_products_price_default_desc",
      discount: "magento_ar_kw_products_discount_desc",
    },
    "en-om": {
      default: "magento_en_om_products",
      latest: "magento_en_om_products_created_at_desc",
      price_low: "magento_en_om_products_price_default_asc",
      price_high: "magento_en_om_products_price_default_desc",
      discount: "magento_en_om_products_discount_desc",
    },
    "ar-om": {
      default: "magento_ar_om_products",
      latest: "magento_ar_om_products_created_at_desc",
      price_low: "magento_ar_om_products_price_default_asc",
      price_high: "magento_ar_om_products_price_default_desc",
      discount: "magento_ar_om_products_discount_desc",
    },
    "en-bh": {
      default: "magento_en_bh_products",
      latest: "magento_en_bh_products_created_at_desc",
      price_low: "magento_en_bh_products_price_default_asc",
      price_high: "magento_en_bh_products_price_default_desc",
      discount: "magento_en_bh_products_discount_desc",
    },
    "ar-bh": {
      default: "magento_ar_bh_products",
      latest: "magento_ar_bh_products_created_at_desc",
      price_low: "magento_ar_bh_products_price_default_asc",
      price_high: "magento_ar_bh_products_price_default_desc",
      discount: "magento_ar_bh_products_discount_desc",
    },
    "en-qa": {
      default: "magento_en_qa_products",
      latest: "magento_en_qa_products_created_at_desc",
      price_low: "magento_en_qa_products_price_default_asc",
      price_high: "magento_en_qa_products_price_default_desc",
      discount: "magento_en_qa_products_discount_desc",
    },
    "ar-qa": {
      default: "magento_ar_qa_products",
      latest: "magento_ar_qa_products_created_at_desc",
      price_low: "magento_ar_qa_products_price_default_asc",
      price_high: "magento_ar_qa_products_price_default_desc",
      discount: "magento_ar_qa_products_discount_desc",
    },
  },

  searchParams: {
    attributesToHighlight: "",
    attributesToRetrieve: [
      "name",
      "sku",
      "price",
      "colorfamily",
      "thumbnail_url",
      "brand_name",
      "categories.level1",
      "promotion",
      "is_new_in",
      "url",
      "news_from_date",
      "news_to_date",
      "promotion",
      "in_stock",
      "also_available_color",
      "age",
      "simple_products",
      "size_eu",
      "size_us",
      "size_uk",
      "product_type_6s",
      "color",
      "stock_qty",
      "highlighted_attributes"
    ],
    facets: FACET_FILTERS,
    facetFilters: [],
    numericFilters: [],
    maxValuesPerFacet: 1000,
    sortFacetValuesBy: "alpha",
  },
};

const NUMERIC_FILTERS = config.NUMERIC_FILTERS;
const VISIBLE_FILTERS = config.VISIBLE_FILTERS;
const SIZE_FILTERS = config.SIZE_FILTERS;
const CURRENCY_STRIP_INSIGNIFICANT_ZEROS =
  config.CURRENCY_STRIP_INSIGNIFICANT_ZEROS;
const INDICES = config.INDICES;
const searchParams = config.searchParams;

const VISIBLE_GENDERS = {
  KIDS: {
    [translations.en.girl]: true,
    [translations.ar.girl]: true,
    [translations.en.boy]: true,
    [translations.ar.boy]: true,
    [translations.en.baby_girl]: true,
    [translations.ar.baby_girl]: true,
    [translations.en.baby_boy]: true,
    [translations.ar.baby_boy]: true,
    [translations.en.infant]: true,
    [translations.ar.infant]: true,
    [translations.en.unisex]: true,
    [translations.ar.unisex]: true,
  },
  OTHER: {
    [translations.en.women]: true,
    [translations.ar.women]: true,
    [translations.en.men]: true,
    [translations.ar.men]: true,
  },
};

export {
  FACET_FILTERS,
  NUMERIC_FILTERS,
  VISIBLE_FILTERS,
  SIZE_FILTERS,
  CURRENCY_STRIP_INSIGNIFICANT_ZEROS,
  INDICES,
  searchParams,
  VISIBLE_GENDERS,
};

export default config;
