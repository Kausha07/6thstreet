import { memo } from "react";
import { TYPE_CATEGORY, TYPE_PRODUCT, TYPE_CMS_PAGE } from "Util/Common/config";
import GTMRouteWrapper from "Component/GoogleTagManager/GoogleTagManagerRouteWrapper.component";
import {
  CATEGORY,
  CMS_PAGE,
  NOT_FOUND,
  PDP as PRODUCT_PAGE,
} from "Component/Header/Header.config";
import Loader from "Component/Loader";
import CmsPage from "Route/CmsPage";
import NoMatch from "Route/NoMatch";
import PDP from "Route/PDP";
import PLP from "Route/PLP";
import "./UrlRewrites.style";

function UrlRewrite({
  id,
  string_sku,
  brandDescription,
  brandImg,
  brandName,
  query,
  type,
  isLoading,
}) {
  const renderPDP = () => {
    return (
      <GTMRouteWrapper route={PRODUCT_PAGE}>
        <PDP
          id={id}
          sku={string_sku}
          brandDescription={brandDescription}
          brandImg={brandImg}
          brandName={brandName}
        />
      </GTMRouteWrapper>
    );
  };

  const renderCategory = () => {
    return (
      <GTMRouteWrapper route={CATEGORY}>
        <PLP
          brandDescription={brandDescription}
          brandImg={brandImg}
          brandName={brandName}
          query={query}
          location={location}
        />
      </GTMRouteWrapper>
    );
  };

  const renderCmsPage = () => {
    return (
      <GTMRouteWrapper route={CMS_PAGE}>
        <CmsPage pageIds={id} />
      </GTMRouteWrapper>
    );
  };

  const render404 = () => {
    return (
      <GTMRouteWrapper route={NOT_FOUND}>
        <NoMatch />
      </GTMRouteWrapper>
    );
  };

  const renderFunction = () => {
    if (isLoading) {
      return (
        <>
          <div block="EmptyPage"></div>
          <Loader isLoading={isLoading} />
        </>
      );
    } else if (type === TYPE_CATEGORY) {
      return renderCategory();
    } else if (type === TYPE_CMS_PAGE) {
      return renderCmsPage();
    } else if (type === TYPE_PRODUCT) {
      return renderPDP();
    } else {
      return render404();
    }
  };

  return (
    <div block="UrlRewrites" id="UrlRewrites">
      {renderFunction()}
    </div>
  );
}

const UrlRewrites = memo(UrlRewrite);
export default UrlRewrites;
