import React from "react";
import "./MegaMenuHorizontalSlider.style.scss";
import DynamicContentSliderWithLabel from "Component/DynamicContentSliderWithLabel";
const MegaMenuHorizontalSlider = () => {
  const horizantalSliderData = {
    type: "bannerSliderWithLabel",
    index: 11,
    promotion_name: "Men-EN",
    tag: "FreshStyle",
    title: "New In",
    items: [
      {
        promotion_name: "Home-FreshStyle-Tommy Hilfiger",
        tag: "Tommy Hilfiger",
        url: "https://s3-alpha-sig.figma.com/img/fc69/8bb0/8c7de4da8201006bf30dec89f4b05180?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=fAex0P1uO1OqRZ3Cwbt-jiPSyTcE3nCfwUwC6eDSPlsrRyg5Z8cC~KRN37KeuIw8yYBLJG7K6TKqEvw2WxbplGVhPwxsYlJGHz1dj0RjSU~jrK8DfdsdtEE6vbKmYGaxLW64-dDlQCTRQja4ntgmBWVCIUwvSDjjbYqvfSYtIFJBoRASCn6~6ehvskcBUSI7k~t~pSAn0IGk8WSZBRFHzmM6Ay6SZa9z-Wx17~wbzN-EdRbnCoQVX0vhc~OVBOEU7DEeYoVLkx29Nc6MPyUbbwe6njXJDYrWJ8UqSmRafuYzBLCK2BhCQ1byiDVjkgUNhkHdUYGPo1hs-UTwwBc0LA__",
        link: "/catalogsearch/result/?q=Tommy+Hilfiger&qid=41b8cae6659d1a65d9fb276a9abf11bc&p=0&dFR%5Bbrand_name%5D%5B0%5D=Tommy+Hilfiger%2CTommy+Jeans&dFR%5Bgender%5D%5B0%5D=Men&dFR%5Bin_stock%5D%5B0%5D=1&dFR%5Bsort%5D%5B0%5D=latest&idx=enterprise_magento_english_products",
        text: "Brands",
        width: 280,
        height: 360,
      },
      {
        promotion_name: "Home-FreshStyle-Aldo",
        tag: "Aldo",
        url: "https://via.placeholder.com/111x136",
        link: "/catalogsearch/result/?q=Aldo&qid=1c24752e5fed8b2747e9c735aaca1e56&p=0&dFR%5Bbrand_name%5D%5B0%5D=Aldo%2CAldo+Accessories&dFR%5Bgender%5D%5B0%5D=Men&dFR%5Bin_stock%5D%5B0%5D=1&dFR%5Bsort%5D%5B0%5D=latest&idx=enterprise_magento_english_products",
        text: "New In",
        width: 280,
        height: 360,
      },
      {
        promotion_name: "Home-FreshStyle-Beverly Hills Polo Club",
        tag: "Beverly Hills Polo Club",
        url: "https://via.placeholder.com/111x136",
        link: "/catalogsearch/result/?q=Beverly+Hills+Polo+Club&qid=930c8d4a97bcf608d9ccf0da40663e7f&p=0&dFR%5Bgender%5D%5B0%5D=Men&dFR%5Bin_stock%5D%5B0%5D=1&dFR%5Bbrand_name%5D%5B0%5D=Beverly+Hills+Polo+Club&dFR%5Bsort%5D%5B0%5D=latest&idx=enterprise_magento_english_products",
        text: "outlet",
        width: 280,
        height: 360,
      },
      {
        promotion_name: "Home-FreshStyle-Dune London",
        tag: "Dune London",
        url: "https://via.placeholder.com/111x136",
        link: "/catalogsearch/result/?q=Dune+London&qid=dfca6fb50c4683884cca8bd3e1cba77c&p=0&dFR%5Bbrand_name%5D%5B0%5D=Dune+London&dFR%5Bgender%5D%5B0%5D=Men&dFR%5Bin_stock%5D%5B0%5D=1&dFR%5Bsort%5D%5B0%5D=latest&idx=enterprise_magento_english_products",
        text: "brands",
        width: 280,
        height: 360,
      },
      {
        promotion_name: "Home-FreshStyle-Herschel",
        tag: "Herschel",
        url: "https://via.placeholder.com/111x136",
        link: "/catalogsearch/result/?q=Herschel&qid=9993d54b4740e5f4f5413dbfeb4ce46f&p=0&dFR%5Bgender%5D%5B0%5D=Men&dFR%5Bin_stock%5D%5B0%5D=1&dFR%5Bbrand_name%5D%5B0%5D=Herschel&dFR%5Bsort%5D%5B0%5D=latest&idx=enterprise_magento_english_products",
        text: "outlet",
        width: 280,
        height: 360,
      }
    ],
  };


  return (
    <div block="megemenu-horizantal-slider-container">
      <DynamicContentSliderWithLabel
        megeMenuHorizontalSliderData={horizantalSliderData?.items}
        promotion_name={horizantalSliderData?.promotion_name}
        tag={horizantalSliderData?.tag}
        type={horizantalSliderData?.type}
        widgetID={horizantalSliderData?.type}
        isHomePage={true}
        megamenuType={true}
      />
    </div>
  );
};

export default MegaMenuHorizontalSlider;
