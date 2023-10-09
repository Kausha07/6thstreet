import "./MyAccountVipCustomer.style.scss";
import Accordion from "Component/Accordion";
import { useState, useEffect } from "react";
import { isArabic } from "Util/App";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import Logger from "Util/Logger";
import Loader from "Component/Loader";

export default function MyAccountVipCustomer() {
  const [vipContent, setVipContent] = useState();
  const [faqContent, setFaqContent] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const isArabicState = isArabic();

  
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const resp = await getStaticFile("vip_screen", {
        $FILE_NAME: `pages/vip_page.json`,
      });
      if (resp && resp[0]) {
        if (resp[0].vip_screen) {
          setVipContent(resp[0]?.vip_screen);
        }
        if (resp[0].faq) {
          setFaqContent(resp[0].faq);
        }
        setIsLoading(false);
      }
    } catch (e) {
      Logger.log(e);
      setIsLoading(false);
    }
  }

  function renderAccordion() {
    const faqData = faqContent
      ? isArabicState
        ? faqContent?.ar
        : faqContent?.en
      : null;
    return (
      <>
        <div block="faq" elem="Container" mods={{ isArabic: isArabicState }}>
          {faqData.title ? <h3>{faqData.title}</h3> : null}
          {faqData.content
            ? faqData?.content.map((item, index) => (
                <Accordion
                  mix={{ block: "VIP", elem: "Accordion" }}
                  title={item.title}
                  isVipAccordion={true}
                  key={index}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: item.description,
                    }}
                  ></p>
                  {item?.htmlContent ? (
                    <div
                      className="customerSupport"
                      dangerouslySetInnerHTML={{ __html: item.htmlContent }}
                    ></div>
                  ) : null}
                </Accordion>
              ))
            : null}
        </div>
      </>
    );
  }
  function renderVIPContainer() {
    const vipData = vipContent
      ? isArabicState
        ? vipContent?.ar
        : vipContent?.en
      : null;
    return (
      <>
        {vipData ? (
          <div
            block="MyAccountVIP"
            elem="Wrapper"
            mods={{ isArabic: isArabicState }}
            dangerouslySetInnerHTML={{ __html: vipData }}
          ></div>
        ) : null}
      </>
    );
  }
  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="MyAccountVIPScreen">
          {renderVIPContainer()}
          {renderAccordion()}
        </div>
      )}
    </>
  );
}
