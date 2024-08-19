import apple from "Component/CheckoutPayment/icons/apple.png";
import card from "Component/CheckoutPayment/icons/card.png";
import cash from "Component/CheckoutPayment/icons/cash.png";
import tabby from "Component/CheckoutPayment/icons/tabby_preferred.png";
import qpay from "Component/CheckoutPayment/icons/qpay.png";
import tamaraIcon from "Component/TamaraCard/icons/tamaraIcon.png";
import tabbyLogo from "./icons/tabbyLogo.png";

export const PAYMENTS_DATA = {
  checkoutcom_card_payment: {
    name: "card",
    mod: { card: true },
    paragraph: __("card"),
    img: card,
  },
  checkout_qpay: {
    name: "card",
    mod: { qpay: true },
    paragraph: null,
    img: qpay,
  },
  apple_pay: {
    name: "apple",
    mod: { apple: true },
    paragraph: null,
    img: apple,
  },
  checkout_apple_pay: {
    name: "apple",
    mod: { apple: true },
    paragraph: null,
    img: apple,
  },
  tabby_installments: {
    name: "tabby",
    mod: { tabby: true },
    paragraph: null,
    img: tabbyLogo,
  },
  msp_cashondelivery: {
    name: "cash",
    mod: { cash: true },
    paragraph: __("cash"),
    img: cash,
  },
  free: {
    name: "free",
    mod: { free: true },
    paragraph: __("free"),
    img: cash,
  },
  tamara_pay_by_instalments_4: {
    name: "Tamara",
    mod: { tamara: true },
    paragraph: null,
    img: tamaraIcon,
  },
};
