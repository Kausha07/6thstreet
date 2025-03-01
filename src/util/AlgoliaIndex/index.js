import { getAlgoliaIndexForQuerySuggestion } from "Util/API/endpoint/Suggestions/Suggestions.create";
import { isArabic } from "Util/App";
import { getLocaleFromUrl } from "Util/Url/Url";

const indexCodeList = {
  production: {
    enterprise_magento_english_products: "ae-en-c",
    enterprise_magento_arabic_products: "ae-ar-c",
    enterprise_magento_english_products_ABtest: "ae-en-t",
    enterprise_magento_arabic_products_ABtest: "uae-ar-t",
    enterprise_magento_en_sa_products: "sa-en-c",
    enterprise_magento_ar_sa_products: "sa-ar-c",
    enterprise_magento_en_sa_products_ABtest: "sa-en-t",
    enterprise_magento_ar_sa_products_ABtest: "sa-ar-t",
    enterprise_magento_en_kw_products: "kw-en-c",
    enterprise_magento_ar_kw_products: "kw-ar-c",
    enterprise_magento_en_kw_products_ABtest: "kw-en-t",
    enterprise_magento_ar_kw_products_ABtest: "kw-ar-t",
    enterprise_magento_en_om_products: "om-en-c",
    enterprise_magento_ar_om_products: "om-ar-c",
    enterprise_magento_en_om_products_ABtest: "om-en-t",
    enterprise_magento_ar_om_products_ABtest: "om-ar-t",
    enterprise_magento_en_bh_products: "bh-en-c",
    enterprise_magento_ar_bh_products: "bh-ar-c",
    enterprise_magento_en_bh_products_ABtest: "bh-en-t",
    enterprise_magento_ar_bh_products_ABtest: "bh-ar-t",
    enterprise_magento_en_qa_products: "qa-en-c",
    enterprise_magento_ar_qa_products: "qa-ar-c",
    enterprise_magento_en_qa_products_ABtest: "qa-en-t",
    enterprise_magento_ar_qa_products_ABtest: "qa-ar-t",
  },
  staging: {
    stage_magento_english_products: "ae-en-c",
    stage_magento_arabic_products: "ae-ar-c",
    stage_magento_english_products_ABtest: "ae-en-t",
    stage_magento_arabic_products_ABtest: "uae-ar-t",
    stage_magento_en_sa_products: "sa-en-c",
    stage_magento_ar_sa_products: "sa-ar-c",
    stage_magento_en_sa_products_ABtest: "sa-en-t",
    stage_magento_ar_sa_products_ABtest: "sa-ar-t",
    stage_magento_en_kw_products: "kw-en-c",
    stage_magento_ar_kw_products: "kw-ar-c",
    stage_magento_en_kw_products_ABtest: "kw-en-t",
    stage_magento_ar_kw_products_ABtest: "kw-ar-t",
    stage_magento_en_om_products: "om-en-c",
    stage_magento_ar_om_products: "om-ar-c",
    stage_magento_en_om_products_ABtest: "om-en-t",
    stage_magento_ar_om_products_ABtest: "om-ar-t",
    stage_magento_en_bh_products: "bh-en-c",
    stage_magento_ar_bh_products: "bh-ar-c",
    stage_magento_en_bh_products_ABtest: "bh-en-t",
    stage_magento_ar_bh_products_ABtest: "bh-ar-t",
    stage_magento_en_qa_products: "qa-en-c",
    stage_magento_ar_qa_products: "qa-ar-c",
    stage_magento_en_qa_products_ABtest: "qa-en-t",
    stage_magento_ar_qa_products_ABtest: "qa-ar-t",
  },
  uat: {
    preprod_magento_english_products: "ae-en-c",
    preprod_magento_arabic_products: "ae-ar-c",
    preprod_magento_english_products_ABtest: "ae-en-t",
    preprod_magento_arabic_products_ABtest: "uae-ar-t",
    preprod_magento_en_sa_products: "sa-en-c",
    preprod_magento_ar_sa_products: "sa-ar-c",
    preprod_magento_en_sa_products_ABtest: "sa-en-t",
    preprod_magento_ar_sa_products_ABtest: "sa-ar-t",
    preprod_magento_en_kw_products: "kw-en-c",
    preprod_magento_ar_kw_products: "kw-ar-c",
    preprod_magento_en_kw_products_ABtest: "kw-en-t",
    preprod_magento_ar_kw_products_ABtest: "kw-ar-t",
    preprod_magento_en_om_products: "om-en-c",
    preprod_magento_ar_om_products: "om-ar-c",
    preprod_magento_en_om_products_ABtest: "om-en-t",
    preprod_magento_ar_om_products_ABtest: "om-ar-t",
    preprod_magento_en_bh_products: "bh-en-c",
    preprod_magento_ar_bh_products: "bh-ar-c",
    preprod_magento_en_bh_products_ABtest: "bh-en-t",
    preprod_magento_ar_bh_products_ABtest: "bh-ar-t",
    preprod_magento_en_qa_products: "qa-en-c",
    preprod_magento_ar_qa_products: "qa-ar-c",
    preprod_magento_en_qa_products_ABtest: "qa-en-t",
    preprod_magento_ar_qa_products_ABtest: "qa-ar-t",
  },
};

const countryCodeFromUrl = getLocaleFromUrl();
const lang = isArabic() ? "arabic" : "english";
const algoliaQueryIndex = getAlgoliaIndexForQuerySuggestion(
  countryCodeFromUrl,
  lang
);
export const indexCode =
  indexCodeList[process.env.REACT_APP_ALGOLIA_ENV][algoliaQueryIndex] || null;

export const getAlgoliaIndexCode = (algoliaQueryIndex) => {
  return indexCodeList[process.env.REACT_APP_ALGOLIA_ENV][algoliaQueryIndex] || null;
};
