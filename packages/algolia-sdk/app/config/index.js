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
  "promotion",
];

const MORE_FILTERS = [
  "fit",
  "sleeve_length",
  "sleeve_type",
  "material",
  "neck_line",
  "collar_type",
  "occasion",
  "pattern",
  "dress_length",
  "skirt_length",
  "leg_length",
  "design_details",
  "denim_wash",
  "trend",
  "padded",
  "wired",
  "discount",
  "price.AED.default",
  "price.SAR.default",
  "price.KWD.default",
  "price.OMR.default",
  "price.BHD.default",
  "price.QAR.default",
]

const config = {
  FACET_FILTERS: [...FACET_FILTERS, ...MORE_FILTERS],
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
  PREPROD_INDICES: {
    "en-ae": {
      default: "english_products",
      latest: "english_products_created_at_desc",
      price_low: "english_products_price_default_asc",
      price_high: "english_products_price_default_desc",
      discount: "english_products_discount_desc",
    },
    "ar-ae": {
      default: "arabic_products",
      latest: "arabic_products_created_at_desc",
      price_low: "arabic_products_price_default_asc",
      price_high: "arabic_products_price_default_desc",
      discount: "arabic_products_discount_desc",
    },
    "en-sa": {
      default: "en_sa_products",
      latest: "en_sa_products_created_at_desc",
      price_low: "en_sa_products_price_default_asc",
      price_high: "en_sa_products_price_default_desc",
      discount: "en_sa_products_discount_desc",
    },
    "ar-sa": {
      default: "ar_sa_products",
      latest: "ar_sa_products_created_at_desc",
      price_low: "ar_sa_products_price_default_asc",
      price_high: "ar_sa_products_price_default_desc",
      discount: "ar_sa_products_discount_desc",
    },
    "en-kw": {
      default: "en_kw_products",
      latest: "en_kw_products_created_at_desc",
      price_low: "en_kw_products_price_default_asc",
      price_high: "en_kw_products_price_default_desc",
      discount: "en_kw_products_discount_desc",
    },
    "ar-kw": {
      default: "ar_kw_products",
      latest: "ar_kw_products_created_at_desc",
      price_low: "ar_kw_products_price_default_asc",
      price_high: "ar_kw_products_price_default_desc",
      discount: "ar_kw_products_discount_desc",
    },
    "en-om": {
      default: "en_om_products",
      latest: "en_om_products_created_at_desc",
      price_low: "en_om_products_price_default_asc",
      price_high: "en_om_products_price_default_desc",
      discount: "en_om_products_discount_desc",
    },
    "ar-om": {
      default: "ar_om_products",
      latest: "ar_om_products_created_at_desc",
      price_low: "ar_om_products_price_default_asc",
      price_high: "ar_om_products_price_default_desc",
      discount: "ar_om_products_discount_desc",
    },
    "en-bh": {
      default: "en_bh_products",
      latest: "en_bh_products_created_at_desc",
      price_low: "en_bh_products_price_default_asc",
      price_high: "en_bh_products_price_default_desc",
      discount: "en_bh_products_discount_desc",
    },
    "ar-bh": {
      default: "ar_bh_products",
      latest: "ar_bh_products_created_at_desc",
      price_low: "ar_bh_products_price_default_asc",
      price_high: "ar_bh_products_price_default_desc",
      discount: "ar_bh_products_discount_desc",
    },
    "en-qa": {
      default: "en_qa_products",
      latest: "en_qa_products_created_at_desc",
      price_low: "en_qa_products_price_default_asc",
      price_high: "en_qa_products_price_default_desc",
      discount: "en_qa_products_discount_desc",
    },
    "ar-qa": {
      default: "ar_qa_products",
      latest: "ar_qa_products_created_at_desc",
      price_low: "ar_qa_products_price_default_asc",
      price_high: "ar_qa_products_price_default_desc",
      discount: "ar_qa_products_discount_desc",
    },
  },
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
      "timer_start_time",
      "timer_end_time",
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
      "highlighted_attributes",
      "product_tag",
      "material_composition",
      "6s_also_available",
      "6s_also_available_color",
      "6s_also_available_count",
      "gallery_image_urls",
      "color_hex",
    ],
    facets: [...FACET_FILTERS, ...MORE_FILTERS],
    facetFilters: [],
    numericFilters: [],
    maxValuesPerFacet: 1000,
    sortFacetValuesBy: "alpha",
  },

  megaMenuBrandsSearchParams: {
    attributesToHighlight: "",
    attributesToRetrieve: [
      "name",
      "name_ar",
      "sku",
      "brand_name",
      "url",
      "url_path"
    ],
    facets: ["brand_name"],
    facetFilters: [],
    numericFilters: [],
    maxValuesPerFacet: 1000,
    sortFacetValuesBy: "alpha",
  }
};

const NUMERIC_FILTERS = config.NUMERIC_FILTERS;
const VISIBLE_FILTERS = config.VISIBLE_FILTERS;
const SIZE_FILTERS = config.SIZE_FILTERS;
const CURRENCY_STRIP_INSIGNIFICANT_ZEROS =
  config.CURRENCY_STRIP_INSIGNIFICANT_ZEROS;
const INDICES = config.INDICES;
const PREPROD_INDICES = config.PREPROD_INDICES;
const searchParams = config.searchParams;
const megamenuSearchParams = config.megaMenuBrandsSearchParams;

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
  PREPROD_INDICES,
  searchParams,
  megamenuSearchParams,
  VISIBLE_GENDERS,
  MORE_FILTERS
};

export default config;
