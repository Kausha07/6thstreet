import { useState, useEffect } from "react";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { useSelector } from "react-redux";
import MyWalletHome from "./MyWalletHome/MyWalletHome";
import MyCashTransactions from "./MyCashTransactions/MyCashTransactions";

import RewardsTransactions from "./RewardsTransactions/RewardsTransactions";
import AllTransactions from "./AllTransactions/AllTransactions";
import {
  TransactionHeading,
  CollapsableComponent,
} from "./HelperComponents/HelperComponents";
import { getFAQsJson } from "./../../util/API/endpoint/Wallet/Wallet.endpoint.js";

import "./MyWalletHomeBase.style.scss";

export default function MyWalletHomeBase() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [faqsData, setFaqsData] = useState([]);
  const language = getLanguageFromUrl().toUpperCase();
  const isWalletEnabled = useSelector(
    (state) => state.AppConfig.isWalletV1Enabled
  );

  async function fetchFAQsData() {
    const res = await getFAQsJson();
    if (res) {
      const countryCode = getCountryFromUrl().toUpperCase();
      const faqs = res["countries"].filter((faq) => {
        return faq["value"] === countryCode;
      });
      setFaqsData(faqs?.[0]?.["data"]);
    }
  }

  useEffect(() => {
    fetchFAQsData();
  }, []);
  return (
    <>
      {isWalletEnabled && (
        <>
          <div>
            {currentScreen === "home" && (
              <>
                <MyWalletHome setCurrentScreen={setCurrentScreen} />
                <div>
                  <div className="FaqHeading">{__("FAQs")}</div>
                </div>
                {faqsData.map((faq, index) => {
                  return (
                    <div key={index}>
                      {language == "EN" ? (
                        <CollapsableComponent
                          title={faq?.title}
                          description={faq?.description}
                        />
                      ) : (
                        <CollapsableComponent
                          title={faq?.title_ar}
                          description={faq?.description_ar}
                        />
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <div>
            {currentScreen === "all" && (
              <>
                <TransactionHeading
                  setCurrentScreen={setCurrentScreen}
                  currentScreen={currentScreen}
                />
                <AllTransactions setCurrentScreen={setCurrentScreen} />
              </>
            )}
            {currentScreen === "my-cash" && (
              <>
                <TransactionHeading
                  setCurrentScreen={setCurrentScreen}
                  currentScreen={currentScreen}
                />
                <MyCashTransactions setCurrentScreen={setCurrentScreen} />
              </>
            )}
            {currentScreen === "rewards" && (
              <>
                <TransactionHeading
                  setCurrentScreen={setCurrentScreen}
                  currentScreen={currentScreen}
                />
                <RewardsTransactions setCurrentScreen={setCurrentScreen} />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
