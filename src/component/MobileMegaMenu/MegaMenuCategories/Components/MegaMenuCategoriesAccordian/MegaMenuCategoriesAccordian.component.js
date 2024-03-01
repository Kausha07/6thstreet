import React, { useRef } from 'react';
import Image from "Component/Image";
import "./MegaMenuCategoriesAccordian.style.scss";
import MegaMenuNestedCategoriesList from "../MegaMenuNestedCategoriesList/MegaMenuNestedCategoriesList.component";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { getLocaleFromUrl } from "Util/Url/Url";
import { getQueryParam } from "Util/Url";
import CategoriesListDispatcher from "Store/MegaMenuCategoriesList/CategoriesList.dispatcher";

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  categories: state?.CategoriesListReducer?.categories
});

export const mapDispatchToProps = (dispatch) => ({
  requestMegaMenuCategoriesList: (gender,locale) => CategoriesListDispatcher.requestMegaMenuCategoriesList(gender, locale, dispatch)
});

const MegaMenuCategoriesAccordion = (props) => {
  const [showList, setShowList] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(null);
  const ScrollerRef = useRef(null);
  const MegamenuCategoriesData = [
    {
      type: "banner",
      label: "clothes",
      desc: "Tops, dresses, t-shirts & more",
      image:"https://s3-alpha-sig.figma.com/img/5e58/e768/8d0b87be22362909859842e9b1cf9ae5?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=mPsgG3b0xHS~NY3kwbeg47YIteeY6kdZsqNNrbyy9lWWdvv2l8YVAjIAkXlMM5ICVuxVbYCFKEcmPudRDuYyyyO3COf5bXsNiPcFdmFQNCldjOuQh-zh2uEIgWBCOtJim2VlBCbkq2axCK7gSiFjeSqjRc-VXdT2gkmMn6Ao05JPzxOYF7uU6BltQcUzwRP73ZCIurUZ9zG20Fpo0x9u~95zP4JCuXBNYXH-qZLtLQYdQBNMyPn--r~rZ-eGge5iusDRztRu0Nu7IwGr3vetaHH8MD-Z2x-wqT0CHLxRbONpzq0Nqf12tBchF3SgvWFew3mtTn2coL~3N2Ln06SFvA__",
      tag: "clothes",
      promotion_name: "shoes_promotion",
      item: [
        {
          label: "View All",
          link: "/catalogsearch/result/?q=aldo&qid=f22a5e78a8ff0bf6b73ca1e06abc837e&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "Boots",
          link: "/catalogsearch/result/?q=adidias&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "casual shoes",
          link: "/catalogsearch/result/?q=casual%20shoes&qid=0db8359086046a2cfaf02ab65f4aefe3&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/339a/d95b/0101e30bcda3c679c06a78d995fc327a?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oILJtaJKelGxpmGZUD1t3JvVwQzxDRVb7Jw5J98BD8NalWnBSrwKJSWGv8zQ5mPFcJGQc1FKdNvDuEej8Rnv91q43Wt7HaWYTy3lOPqTChL4-2rcuo97HCEa31plycT2gU1e-jZNJumQR1ntEgXJMSS14MaVm-NBlojQ6nn0OG~cF8AoL-0R~tvU38zDhecK~ewKLNqib~PW06c1J0Z1UMjOZNnUTSuBrdRvTppZdkC-ViRGVygav8Goqny8gf8Se-V5krxxvLCUHIKuSjQObPf3BQ2Sbxvh7I1SYZeQ9vDsUl0xK-FNnZzx7D3QnLthGR6WExVZDdrIJaKav4AF9A__",
          promotion_name: "",
        },
        {
          label: "slippers",
          link: "/catalogsearch/result/?q=slippers&qid=993f64e0ba74071bd1de0d5567efcd11&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/b59c/0c13/7ad319104a663ee1b5546108c629e6c5?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gyGpfsbRxfaaAvl-kDcGJ~L3Co66TfGl1nO9NoCXzdgdclip~0jrKU2~wRM1YqrWcE5cPCXB-OZ39daZSrtWKadc0wfQM-QGY3C-bEQUP4HJC~t6Wi631ePvXt4edNHFE7mqoDfpgX1R0h0R909wf8niLvHd~CwQVMSoKt7woVoCEU4W24dDRhMR1doc0XTs2L2nSZcGwbV8NXAfy44pjEzgBU1ocFtD~zJzD8fW-HhD7Qu7PNPzcdQ6ibWAnhwfB-Sm0m34ueR6n1dQcrfWhzr4koEvBfZ3wovlfWy6EB5lV566483qX0g8utxZ49KJ18w9rNT2j6tZzgnhuwpCcA__",
          promotion_name: "",
        }, 
        {
          label: "sneaker",
          link: "/catalogsearch/result/?q=sneakers&qid=5ee2ea73840b828defda7800cfbaa182&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/1192/314b/a9e8934aa6ea2c30107dd48a40421ebd?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZE8d37vnlUe57q8MZUPFZi2Bix2xHRcU5jRkk8Wj6sAczP6XM9CtrkfI0eIxfEo9Jk3ivqR3vmZyaG6mLn3MOUqm~Rx6iolx8987W9kFd3VEPxX4XF1y4wIdm7tz92FVHIruwMhMkbvQeXrNC9-9ktPX8gOUAYh~fCrX83Sb-W~WdZFKGmNjlAX9ogm6EXoMT9vWbbOxXYjVRoeEnLkD3kvHAfHLisMxq3~PAsq1TEwZobkBDWmS0uKPSVtnbOvF0p~46qhgdXSySgwKaK-q3PhZ0pKi4NjgD6J2PZt8Goedq06~EabJcJv1slfDNIbbM6CXGQQLc4OgJGplpGhkpg__",
          promotion_name: "",
        },
        {
          label: "View All",
          link: "/catalogsearch/result/?q=aldo&qid=f22a5e78a8ff0bf6b73ca1e06abc837e&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "Boots",
          link: "/catalogsearch/result/?q=adidias&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "casual shoes",
          link: "/catalogsearch/result/?q=casual%20shoes&qid=0db8359086046a2cfaf02ab65f4aefe3&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/339a/d95b/0101e30bcda3c679c06a78d995fc327a?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oILJtaJKelGxpmGZUD1t3JvVwQzxDRVb7Jw5J98BD8NalWnBSrwKJSWGv8zQ5mPFcJGQc1FKdNvDuEej8Rnv91q43Wt7HaWYTy3lOPqTChL4-2rcuo97HCEa31plycT2gU1e-jZNJumQR1ntEgXJMSS14MaVm-NBlojQ6nn0OG~cF8AoL-0R~tvU38zDhecK~ewKLNqib~PW06c1J0Z1UMjOZNnUTSuBrdRvTppZdkC-ViRGVygav8Goqny8gf8Se-V5krxxvLCUHIKuSjQObPf3BQ2Sbxvh7I1SYZeQ9vDsUl0xK-FNnZzx7D3QnLthGR6WExVZDdrIJaKav4AF9A__",
          promotion_name: "",
        },
        {
          label: "slippers",
          link: "/catalogsearch/result/?q=slippers&qid=993f64e0ba74071bd1de0d5567efcd11&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/b59c/0c13/7ad319104a663ee1b5546108c629e6c5?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gyGpfsbRxfaaAvl-kDcGJ~L3Co66TfGl1nO9NoCXzdgdclip~0jrKU2~wRM1YqrWcE5cPCXB-OZ39daZSrtWKadc0wfQM-QGY3C-bEQUP4HJC~t6Wi631ePvXt4edNHFE7mqoDfpgX1R0h0R909wf8niLvHd~CwQVMSoKt7woVoCEU4W24dDRhMR1doc0XTs2L2nSZcGwbV8NXAfy44pjEzgBU1ocFtD~zJzD8fW-HhD7Qu7PNPzcdQ6ibWAnhwfB-Sm0m34ueR6n1dQcrfWhzr4koEvBfZ3wovlfWy6EB5lV566483qX0g8utxZ49KJ18w9rNT2j6tZzgnhuwpCcA__",
          promotion_name: "",
        }, 
        {
          label: "sneaker",
          link: "/catalogsearch/result/?q=sneakers&qid=5ee2ea73840b828defda7800cfbaa182&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/1192/314b/a9e8934aa6ea2c30107dd48a40421ebd?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZE8d37vnlUe57q8MZUPFZi2Bix2xHRcU5jRkk8Wj6sAczP6XM9CtrkfI0eIxfEo9Jk3ivqR3vmZyaG6mLn3MOUqm~Rx6iolx8987W9kFd3VEPxX4XF1y4wIdm7tz92FVHIruwMhMkbvQeXrNC9-9ktPX8gOUAYh~fCrX83Sb-W~WdZFKGmNjlAX9ogm6EXoMT9vWbbOxXYjVRoeEnLkD3kvHAfHLisMxq3~PAsq1TEwZobkBDWmS0uKPSVtnbOvF0p~46qhgdXSySgwKaK-q3PhZ0pKi4NjgD6J2PZt8Goedq06~EabJcJv1slfDNIbbM6CXGQQLc4OgJGplpGhkpg__",
          promotion_name: "",
        }
      ],
    },
    {
      type: "banner",
      label: "shoes",
      desc: "Tops, dresses, t-shirts & more",
      image:"https://s3-alpha-sig.figma.com/img/a195/f857/f122780fe714fd6d64a1ff688e3f597c?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ty4Rd83xP2h2MYz78C-IQM9oJaMiRkzz8OuQOxOrEJQOQViCO5D-gh0JLQH4gZ9sovI8Hx1vdn7Y4hKMoyphHQKcK6hsHcm3Avd~T40eop~J-hJvcgBuz7olCkWUlBiztp2Bx7WAA-4dFtglf3Lk8FwOvukXsvK76NMHKmWPByPB86ObstoLHWlpzFUPT120r6jzsTeZyjeD7tV1Hv~r-UElaOaoqnxeEUZIhTYnXLyJTtUayhAx5xDfnpl4aeci5yexlYp~6wg~H3KjBv-P36moQoF6zSROGQpuAx5RHaLeEHLlplVnefSMmfUFim2Y3BkUni3j1pDgp7tCiKqYkA__",
      tag: "shoes",
      promotion_name: "shoes_promotion",
      item: [
        {
          label: "View All",
          link: "/catalogsearch/result/?q=aldo&qid=f22a5e78a8ff0bf6b73ca1e06abc837e&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "Boots",
          link: "/catalogsearch/result/?q=adidias&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "casual shoes",
          link: "/catalogsearch/result/?q=casual%20shoes&qid=0db8359086046a2cfaf02ab65f4aefe3&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/339a/d95b/0101e30bcda3c679c06a78d995fc327a?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oILJtaJKelGxpmGZUD1t3JvVwQzxDRVb7Jw5J98BD8NalWnBSrwKJSWGv8zQ5mPFcJGQc1FKdNvDuEej8Rnv91q43Wt7HaWYTy3lOPqTChL4-2rcuo97HCEa31plycT2gU1e-jZNJumQR1ntEgXJMSS14MaVm-NBlojQ6nn0OG~cF8AoL-0R~tvU38zDhecK~ewKLNqib~PW06c1J0Z1UMjOZNnUTSuBrdRvTppZdkC-ViRGVygav8Goqny8gf8Se-V5krxxvLCUHIKuSjQObPf3BQ2Sbxvh7I1SYZeQ9vDsUl0xK-FNnZzx7D3QnLthGR6WExVZDdrIJaKav4AF9A__",
          promotion_name: "",
        },
        {
          label: "slippers",
          link: "/catalogsearch/result/?q=slippers&qid=993f64e0ba74071bd1de0d5567efcd11&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/b59c/0c13/7ad319104a663ee1b5546108c629e6c5?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gyGpfsbRxfaaAvl-kDcGJ~L3Co66TfGl1nO9NoCXzdgdclip~0jrKU2~wRM1YqrWcE5cPCXB-OZ39daZSrtWKadc0wfQM-QGY3C-bEQUP4HJC~t6Wi631ePvXt4edNHFE7mqoDfpgX1R0h0R909wf8niLvHd~CwQVMSoKt7woVoCEU4W24dDRhMR1doc0XTs2L2nSZcGwbV8NXAfy44pjEzgBU1ocFtD~zJzD8fW-HhD7Qu7PNPzcdQ6ibWAnhwfB-Sm0m34ueR6n1dQcrfWhzr4koEvBfZ3wovlfWy6EB5lV566483qX0g8utxZ49KJ18w9rNT2j6tZzgnhuwpCcA__",
          promotion_name: "",
        }, 
        {
          label: "sneaker",
          link: "/catalogsearch/result/?q=sneakers&qid=5ee2ea73840b828defda7800cfbaa182&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/1192/314b/a9e8934aa6ea2c30107dd48a40421ebd?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZE8d37vnlUe57q8MZUPFZi2Bix2xHRcU5jRkk8Wj6sAczP6XM9CtrkfI0eIxfEo9Jk3ivqR3vmZyaG6mLn3MOUqm~Rx6iolx8987W9kFd3VEPxX4XF1y4wIdm7tz92FVHIruwMhMkbvQeXrNC9-9ktPX8gOUAYh~fCrX83Sb-W~WdZFKGmNjlAX9ogm6EXoMT9vWbbOxXYjVRoeEnLkD3kvHAfHLisMxq3~PAsq1TEwZobkBDWmS0uKPSVtnbOvF0p~46qhgdXSySgwKaK-q3PhZ0pKi4NjgD6J2PZt8Goedq06~EabJcJv1slfDNIbbM6CXGQQLc4OgJGplpGhkpg__",
          promotion_name: "",
        },
        {
          label: "nike",
          link: "/catalogsearch/result/?q=aldo&qid=f22a5e78a8ff0bf6b73ca1e06abc837e&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "Boots",
          link: "/catalogsearch/result/?q=adidias&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "casual shoes",
          link: "/catalogsearch/result/?q=casual%20shoes&qid=0db8359086046a2cfaf02ab65f4aefe3&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/339a/d95b/0101e30bcda3c679c06a78d995fc327a?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oILJtaJKelGxpmGZUD1t3JvVwQzxDRVb7Jw5J98BD8NalWnBSrwKJSWGv8zQ5mPFcJGQc1FKdNvDuEej8Rnv91q43Wt7HaWYTy3lOPqTChL4-2rcuo97HCEa31plycT2gU1e-jZNJumQR1ntEgXJMSS14MaVm-NBlojQ6nn0OG~cF8AoL-0R~tvU38zDhecK~ewKLNqib~PW06c1J0Z1UMjOZNnUTSuBrdRvTppZdkC-ViRGVygav8Goqny8gf8Se-V5krxxvLCUHIKuSjQObPf3BQ2Sbxvh7I1SYZeQ9vDsUl0xK-FNnZzx7D3QnLthGR6WExVZDdrIJaKav4AF9A__",
          promotion_name: "",
        },
        {
          label: "slippers",
          link: "/catalogsearch/result/?q=slippers&qid=993f64e0ba74071bd1de0d5567efcd11&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/b59c/0c13/7ad319104a663ee1b5546108c629e6c5?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gyGpfsbRxfaaAvl-kDcGJ~L3Co66TfGl1nO9NoCXzdgdclip~0jrKU2~wRM1YqrWcE5cPCXB-OZ39daZSrtWKadc0wfQM-QGY3C-bEQUP4HJC~t6Wi631ePvXt4edNHFE7mqoDfpgX1R0h0R909wf8niLvHd~CwQVMSoKt7woVoCEU4W24dDRhMR1doc0XTs2L2nSZcGwbV8NXAfy44pjEzgBU1ocFtD~zJzD8fW-HhD7Qu7PNPzcdQ6ibWAnhwfB-Sm0m34ueR6n1dQcrfWhzr4koEvBfZ3wovlfWy6EB5lV566483qX0g8utxZ49KJ18w9rNT2j6tZzgnhuwpCcA__",
          promotion_name: "",
        }, 
        {
          label: "sneaker",
          link: "/catalogsearch/result/?q=sneakers&qid=5ee2ea73840b828defda7800cfbaa182&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/1192/314b/a9e8934aa6ea2c30107dd48a40421ebd?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZE8d37vnlUe57q8MZUPFZi2Bix2xHRcU5jRkk8Wj6sAczP6XM9CtrkfI0eIxfEo9Jk3ivqR3vmZyaG6mLn3MOUqm~Rx6iolx8987W9kFd3VEPxX4XF1y4wIdm7tz92FVHIruwMhMkbvQeXrNC9-9ktPX8gOUAYh~fCrX83Sb-W~WdZFKGmNjlAX9ogm6EXoMT9vWbbOxXYjVRoeEnLkD3kvHAfHLisMxq3~PAsq1TEwZobkBDWmS0uKPSVtnbOvF0p~46qhgdXSySgwKaK-q3PhZ0pKi4NjgD6J2PZt8Goedq06~EabJcJv1slfDNIbbM6CXGQQLc4OgJGplpGhkpg__",
          promotion_name: "",
        }
      ],
    },
    {
      type: "banner",
      label: "Bags",
      desc: "Tops, dresses, t-shirts & more",
      image: "https://s3-alpha-sig.figma.com/img/eb4d/6d37/526ee4163820f781917b5a1917491bc0?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=k9UzQ5~9jimYTjWb76s-YnAdmB~WhFWoshZvUcNTkr5KqVsTwDzYTjf-hP~A95pfivn3QM7PSQdeBoZQR5KmI-mLnj0vV6ihq~UPDKKef5q-cg~~Rqz5DKqM~y2o~snIYlxotgRka0KqVw3xvjJMPOOFrGTzX59a6Px4~4IOLzZqDYu6T~Zr3QBbaeXtBGe0nMygxl0Db990lDB1Uw2W9m0kRkXaVxL-ORjWPQGsI33r0E5dXBHQ~F~K~JhtNYt7hFkDjFVCytuTlGR53KHE16cxPjnX0liL~rMORmUzcZ7n8wXREi17NQOAJbZe0WFyU62zWAedTOaOzfyT3b34Sw__",
      tag: "",
      promotion_name: "",
      item: [
        {
          label: "View All",
          link: "/catalogsearch/result/?q=bags&qid=1f5285f4c3cb9fc61c2cbf7a715a0349&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "Boots",
          link: "/catalogsearch/result/?q=casual%20shoes&qid=0db8359086046a2cfaf02ab65f4aefe3&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "casual shoes",
          link: "/catalogsearch/result/?q=casual%20shoes&qid=0db8359086046a2cfaf02ab65f4aefe3&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/339a/d95b/0101e30bcda3c679c06a78d995fc327a?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oILJtaJKelGxpmGZUD1t3JvVwQzxDRVb7Jw5J98BD8NalWnBSrwKJSWGv8zQ5mPFcJGQc1FKdNvDuEej8Rnv91q43Wt7HaWYTy3lOPqTChL4-2rcuo97HCEa31plycT2gU1e-jZNJumQR1ntEgXJMSS14MaVm-NBlojQ6nn0OG~cF8AoL-0R~tvU38zDhecK~ewKLNqib~PW06c1J0Z1UMjOZNnUTSuBrdRvTppZdkC-ViRGVygav8Goqny8gf8Se-V5krxxvLCUHIKuSjQObPf3BQ2Sbxvh7I1SYZeQ9vDsUl0xK-FNnZzx7D3QnLthGR6WExVZDdrIJaKav4AF9A__",
          promotion_name: "",
        },
        {
          label: "slippers",
          link: "/catalogsearch/result/?q=slippers&qid=993f64e0ba74071bd1de0d5567efcd11&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/b59c/0c13/7ad319104a663ee1b5546108c629e6c5?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gyGpfsbRxfaaAvl-kDcGJ~L3Co66TfGl1nO9NoCXzdgdclip~0jrKU2~wRM1YqrWcE5cPCXB-OZ39daZSrtWKadc0wfQM-QGY3C-bEQUP4HJC~t6Wi631ePvXt4edNHFE7mqoDfpgX1R0h0R909wf8niLvHd~CwQVMSoKt7woVoCEU4W24dDRhMR1doc0XTs2L2nSZcGwbV8NXAfy44pjEzgBU1ocFtD~zJzD8fW-HhD7Qu7PNPzcdQ6ibWAnhwfB-Sm0m34ueR6n1dQcrfWhzr4koEvBfZ3wovlfWy6EB5lV566483qX0g8utxZ49KJ18w9rNT2j6tZzgnhuwpCcA__",
          promotion_name: "",
        }, 
        {
          label: "sneaker",
          link: "/catalogsearch/result/?q=sneakers&qid=5ee2ea73840b828defda7800cfbaa182&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/1192/314b/a9e8934aa6ea2c30107dd48a40421ebd?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZE8d37vnlUe57q8MZUPFZi2Bix2xHRcU5jRkk8Wj6sAczP6XM9CtrkfI0eIxfEo9Jk3ivqR3vmZyaG6mLn3MOUqm~Rx6iolx8987W9kFd3VEPxX4XF1y4wIdm7tz92FVHIruwMhMkbvQeXrNC9-9ktPX8gOUAYh~fCrX83Sb-W~WdZFKGmNjlAX9ogm6EXoMT9vWbbOxXYjVRoeEnLkD3kvHAfHLisMxq3~PAsq1TEwZobkBDWmS0uKPSVtnbOvF0p~46qhgdXSySgwKaK-q3PhZ0pKi4NjgD6J2PZt8Goedq06~EabJcJv1slfDNIbbM6CXGQQLc4OgJGplpGhkpg__",
          promotion_name: "",
        },
      ],
    },
    {
      type: "banner",
      label: "ACCESSORIES",
      desc: "Tops, dresses, t-shirts & more",
      image: "https://s3-alpha-sig.figma.com/img/b189/bdee/ab2f9510cf131919790571468c57aecd?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=O91e5OIimbTG-OpPW1idIR0WJ3wobXndQ7jKOkSVheSn8BqjC0pFrLMBdLmCpS7B7hGx3QMrK3-Wt5K1N8~zhiUwcUDRaO7Acc2OnLRusAQWPeufSLghidaw0hSQtlwBDzUwAig-pjVBif1jry2TtHkOxzT72WlQXA0IyE3nLPRr5i1mTvxpiAHpAXtZ6mCm~8oh43HvQNQIqOsNru47cC~5s2PUq6LHTDHueRHx4W7i~6dTpVUJqYfEQ2jXV817ksGkKf0~yiePTCPsduTZV2hw6PkHoVbXrH9F1Bg29Q5M6rA-~dnzVxwiE0OWXXshoGCoul4FDzJPla5HVzOkdQ__",
      tag: "",
      promotion_name: "",
      item: [
        {
          label: "View All",
          link: "/catalogsearch/result/?q=bags&qid=1f5285f4c3cb9fc61c2cbf7a715a0349&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "Boots",
          link: "/catalogsearch/result/?q=casual%20shoes&qid=0db8359086046a2cfaf02ab65f4aefe3&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "casual shoes",
          link: "/catalogsearch/result/?q=casual%20shoes&qid=0db8359086046a2cfaf02ab65f4aefe3&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/339a/d95b/0101e30bcda3c679c06a78d995fc327a?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oILJtaJKelGxpmGZUD1t3JvVwQzxDRVb7Jw5J98BD8NalWnBSrwKJSWGv8zQ5mPFcJGQc1FKdNvDuEej8Rnv91q43Wt7HaWYTy3lOPqTChL4-2rcuo97HCEa31plycT2gU1e-jZNJumQR1ntEgXJMSS14MaVm-NBlojQ6nn0OG~cF8AoL-0R~tvU38zDhecK~ewKLNqib~PW06c1J0Z1UMjOZNnUTSuBrdRvTppZdkC-ViRGVygav8Goqny8gf8Se-V5krxxvLCUHIKuSjQObPf3BQ2Sbxvh7I1SYZeQ9vDsUl0xK-FNnZzx7D3QnLthGR6WExVZDdrIJaKav4AF9A__",
          promotion_name: "",
        },
        {
          label: "slippers",
          link: "/catalogsearch/result/?q=slippers&qid=993f64e0ba74071bd1de0d5567efcd11&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/b59c/0c13/7ad319104a663ee1b5546108c629e6c5?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gyGpfsbRxfaaAvl-kDcGJ~L3Co66TfGl1nO9NoCXzdgdclip~0jrKU2~wRM1YqrWcE5cPCXB-OZ39daZSrtWKadc0wfQM-QGY3C-bEQUP4HJC~t6Wi631ePvXt4edNHFE7mqoDfpgX1R0h0R909wf8niLvHd~CwQVMSoKt7woVoCEU4W24dDRhMR1doc0XTs2L2nSZcGwbV8NXAfy44pjEzgBU1ocFtD~zJzD8fW-HhD7Qu7PNPzcdQ6ibWAnhwfB-Sm0m34ueR6n1dQcrfWhzr4koEvBfZ3wovlfWy6EB5lV566483qX0g8utxZ49KJ18w9rNT2j6tZzgnhuwpCcA__",
          promotion_name: "",
        }, 
        {
          label: "sneaker",
          link: "/catalogsearch/result/?q=sneakers&qid=5ee2ea73840b828defda7800cfbaa182&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/1192/314b/a9e8934aa6ea2c30107dd48a40421ebd?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZE8d37vnlUe57q8MZUPFZi2Bix2xHRcU5jRkk8Wj6sAczP6XM9CtrkfI0eIxfEo9Jk3ivqR3vmZyaG6mLn3MOUqm~Rx6iolx8987W9kFd3VEPxX4XF1y4wIdm7tz92FVHIruwMhMkbvQeXrNC9-9ktPX8gOUAYh~fCrX83Sb-W~WdZFKGmNjlAX9ogm6EXoMT9vWbbOxXYjVRoeEnLkD3kvHAfHLisMxq3~PAsq1TEwZobkBDWmS0uKPSVtnbOvF0p~46qhgdXSySgwKaK-q3PhZ0pKi4NjgD6J2PZt8Goedq06~EabJcJv1slfDNIbbM6CXGQQLc4OgJGplpGhkpg__",
          promotion_name: "",
        },
      ],
    },
    {
      type: "banner",
      label: "BEAUTY",
      desc: "Tops, dresses, t-shirts & more",
      image: "https://s3-alpha-sig.figma.com/img/d2f3/5ebf/fe8eb5b026d7ac0cfbb362a28ba8c2e1?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OTdp8T6NOhppiIDgYVPRWiiE~OppghwQdpyGs-FBvaUwTE5YAsfU6U4j495GDHlxCyBmjlAYf3mU5Xdtd9QePdn4zvurn5HEf0W0WRVqQdDSYJ1rjQb454LoNX5zgw-~pmC9820xHCqa-MqnNOyNKyESfaYhtiUQ8x0SIF0i50JrJpYS96JxNbsYRiLCwrKo4bKJ2g6CeETjd8IgF-gn2yVLsa3Dmrq2a7b4Twevt3H8AjS-BGfftO29N5GzWZ~6279ZjiWghe9SYyMFkMpyWsKjY1cMhzzwDrzDmEkgZq5jzrXfNZZURdf9SpMdX32qVfP1hE2LfQnU3GkgfiIPrQ__",
      tag: "",
      promotion_name: "",
      item: [
        {
          label: "View All",
          link: "/catalogsearch/result/?q=bags&qid=1f5285f4c3cb9fc61c2cbf7a715a0349&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "Boots",
          link: "/catalogsearch/result/?q=casual%20shoes&qid=0db8359086046a2cfaf02ab65f4aefe3&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/f777/a2fc/a2badb9c477432247223569242661328?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZmzUNTpAo-g2idJNuT-sVDk32p-ht1pqqrfmus5teKmFuQeokJGh772u~cEFf55-SKYHotWuDtCZyp1t7eEUho89BQcMHju-6ocpmb08deIUXMlTnMJu4hsqkBhg8-nOw5uwCv9yyP8ljWlVUKDk5rAOppjMaz6sOGZ92BAIp3OuYbjnfOqwgCH3QHK~3IjDWRZs0NKoXlalTsqE5DHXVa3ixXzUsSo1YTLj0uYOoZqQ8dNEgLqTxuvE1XZYfO-sh~wQVMU3QKyrdAKzGzWZ4KYGPiLulSoFA9T3xGfsXvB4UHe9X23R1TlaDQD4hAV3-X7ea3YNJwIxEx7GvjO-ng__",
          promotion_name: "",
        },
        {
          label: "casual shoes",
          link: "/catalogsearch/result/?q=casual%20shoes&qid=0db8359086046a2cfaf02ab65f4aefe3&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/339a/d95b/0101e30bcda3c679c06a78d995fc327a?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oILJtaJKelGxpmGZUD1t3JvVwQzxDRVb7Jw5J98BD8NalWnBSrwKJSWGv8zQ5mPFcJGQc1FKdNvDuEej8Rnv91q43Wt7HaWYTy3lOPqTChL4-2rcuo97HCEa31plycT2gU1e-jZNJumQR1ntEgXJMSS14MaVm-NBlojQ6nn0OG~cF8AoL-0R~tvU38zDhecK~ewKLNqib~PW06c1J0Z1UMjOZNnUTSuBrdRvTppZdkC-ViRGVygav8Goqny8gf8Se-V5krxxvLCUHIKuSjQObPf3BQ2Sbxvh7I1SYZeQ9vDsUl0xK-FNnZzx7D3QnLthGR6WExVZDdrIJaKav4AF9A__",
          promotion_name: "",
        },
        {
          label: "slippers",
          link: "/catalogsearch/result/?q=slippers&qid=993f64e0ba74071bd1de0d5567efcd11&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/b59c/0c13/7ad319104a663ee1b5546108c629e6c5?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gyGpfsbRxfaaAvl-kDcGJ~L3Co66TfGl1nO9NoCXzdgdclip~0jrKU2~wRM1YqrWcE5cPCXB-OZ39daZSrtWKadc0wfQM-QGY3C-bEQUP4HJC~t6Wi631ePvXt4edNHFE7mqoDfpgX1R0h0R909wf8niLvHd~CwQVMSoKt7woVoCEU4W24dDRhMR1doc0XTs2L2nSZcGwbV8NXAfy44pjEzgBU1ocFtD~zJzD8fW-HhD7Qu7PNPzcdQ6ibWAnhwfB-Sm0m34ueR6n1dQcrfWhzr4koEvBfZ3wovlfWy6EB5lV566483qX0g8utxZ49KJ18w9rNT2j6tZzgnhuwpCcA__",
          promotion_name: "",
        }, 
        {
          label: "sneaker",
          link: "/catalogsearch/result/?q=sneakers&qid=5ee2ea73840b828defda7800cfbaa182&p=0&dFR[gender][0]=Women&dFR[in_stock][0]=1",
          image: "https://s3-alpha-sig.figma.com/img/1192/314b/a9e8934aa6ea2c30107dd48a40421ebd?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZE8d37vnlUe57q8MZUPFZi2Bix2xHRcU5jRkk8Wj6sAczP6XM9CtrkfI0eIxfEo9Jk3ivqR3vmZyaG6mLn3MOUqm~Rx6iolx8987W9kFd3VEPxX4XF1y4wIdm7tz92FVHIruwMhMkbvQeXrNC9-9ktPX8gOUAYh~fCrX83Sb-W~WdZFKGmNjlAX9ogm6EXoMT9vWbbOxXYjVRoeEnLkD3kvHAfHLisMxq3~PAsq1TEwZobkBDWmS0uKPSVtnbOvF0p~46qhgdXSySgwKaK-q3PhZ0pKi4NjgD6J2PZt8Goedq06~EabJcJv1slfDNIbbM6CXGQQLc4OgJGplpGhkpg__",
          promotion_name: "",
        },
      ],
    },
    
  ];
  const {requestMegaMenuCategoriesList, gender, data = [] } = props;
  useState(()=>{
    const locale = getLocaleFromUrl();
    requestMegaMenuCategoriesList(gender,locale);
  },[])

  const renderImage = (image_url = "", description = "") => {
    return (
      <Image
        lazyLoad={true}
        src={image_url}
        block="MegamenImage"
        alt={description ? description : ""}
      />
    );
  };
  const handleNestedCategoriesShowList = (index) => {
    setClickedIndex((prevIndex) => (prevIndex === index ? null : index));
    if(ScrollerRef && ScrollerRef?.current) {
      ScrollerRef?.current?.scrollIntoView({ top: 0, behavior:"smooth"});
    }
  };
  const renderMegaMenuCategoriesLists = (item, index) => {
    const {
      type = "",
      label = "",
      desc = "",
      image = "",
      tag = "",
      promotion_name = "",
    } = item;
    const isClicked = clickedIndex === index;
    return (
      <ul
        block="megamenucategoryList-container"
        key={index}
        onClick={() =>handleNestedCategoriesShowList(index)}
        ref={ScrollerRef}
      >
        <div block="megaMenuCategoryList">
          <div block="megaMenuContentBlock">
            <div block="megeMenuCategoriesHeader">
              <h3>{label}</h3>
              <span block={`accordian ${isClicked ? 'active' : ''}`}></span>
            </div>
            <div block="megaMenuCategoriesDescription">{desc}</div>
          </div>
          {renderImage(image, desc)}
        </div>
        {isClicked ? (
          <div block="megamenu-nested-categories-list-container">
            {item?.item?.map((category)=><MegaMenuNestedCategoriesList nestedCategoiresList={category} ScrollerRef={ScrollerRef} />)}
          </div>
        ) : null}
      </ul>
    );
  };
  return (
    <div block="megamenu-categories-accordian-container">
      {props?.categories?.data?.map((item, index) =>
        renderMegaMenuCategoriesLists(item, index)
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MegaMenuCategoriesAccordion);
