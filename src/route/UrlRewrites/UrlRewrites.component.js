import { lazy, Suspense } from 'react';
import GTMRouteWrapper from "Component/GoogleTagManager/GoogleTagManagerRouteWrapper.component";
import {
  CATEGORY,
  CMS_PAGE,
  NOT_FOUND,
  PDP as PRODUCT_PAGE,
} from "Component/Header/Header.config";
import Loader from "Component/Loader";
import PropTypes from "prop-types";
import { PureComponent } from "react";
// import CmsPage from "Route/CmsPage";
// import NoMatch from "Route/NoMatch";
const PDP = lazy(() => import(/* webpackChunkName: 'PDP' */ "Route/PDP"));
// import PLP from "Route/PLP";
const CmsPage = lazy(() => import(/* webpackChunkName: 'CmsPage' */ "Route/CmsPage"));
const NoMatch = lazy(() => import(/* webpackChunkName: 'NoMatch' */ "Route/NoMatch"));
const PLP = lazy(() => import(/* webpackChunkName: 'PLP' */ "Route/PLP"));
import {
  TYPE_CATEGORY,
  TYPE_CMS_PAGE,
  TYPE_PRODUCT,
} from "./UrlRewrites.config";
import "./UrlRewrites.style";
import { connect } from "react-redux";


export const mapStateToProps = (state) => ({
  vueTrendingBrandClick: state.PDP.vueTrendingBrandClick,

});


class UrlRewrites extends PureComponent {
  constructor(props) {
    super(props);
    window.history.scrollRestoration = "manual";
  }

  static propTypes = {
    type: PropTypes.string,
    id: PropTypes.number,
    sku: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    type: "",
    id: -1,
    sku: "",
  };

  typeMap = {
    [TYPE_CATEGORY]: this.renderCategory.bind(this),
    [TYPE_CMS_PAGE]: this.renderCmsPage.bind(this),
    [TYPE_PRODUCT]: this.renderPDP.bind(this),
  };

  render404;

  renderPDP() {
    const { id, string_sku, brandDescription, brandImg, brandName } =
      this.props;
    return (
      <GTMRouteWrapper route={PRODUCT_PAGE}>
        <Suspense fallback={<div></div>}>
          <PDP
            id={id}
            sku={string_sku}
            brandDescription={brandDescription}
            brandImg={brandImg}
            brandName={brandName}
          />
        </Suspense>
      </GTMRouteWrapper>
    );
  }

  renderCategory() {
    const { brandDescription, brandImg, brandName, query } = this.props;
    return (
      <GTMRouteWrapper route={CATEGORY}>
        <Suspense fallback={<div></div>}>
          <PLP
            brandDescription={brandDescription}
            brandImg={brandImg}
            brandName={brandName}
            query={query}
          />
        </Suspense>
      </GTMRouteWrapper>
    );
  }

  renderCmsPage() {
    const { id } = this.props;

    return (
      <GTMRouteWrapper route={CMS_PAGE}>
        <Suspense fallback={<div></div>}>
          <CmsPage pageIds={id} />
        </Suspense>
      </GTMRouteWrapper>
    );
  }

  getTrendingBrandsSelection = () => {
    const {
      vueTrendingBrandClick = false,
      brandName = "",
      brandDescription = "",
      type,
      brandNameClick
    } = this.props;

    if (vueTrendingBrandClick) {
      return true;
    } else if (
      brandName != "" &&
      brandDescription != "" &&
      brandDescription != null &&
      type == TYPE_CATEGORY
    ) {
      if(!brandNameClick) {
        return true;
      }else {
        return false;
      }
    }
    
    return true;
  };

  render() {
    const { type, isLoading } = this.props;

    this.render404 = () => (
      <GTMRouteWrapper route={NOT_FOUND}>
        <Suspense fallback={<div></div>}>
          <NoMatch {...this.props} />
        </Suspense>
      </GTMRouteWrapper>
    );

    if (isLoading) {
      return (
        <>
          {/* <div block="EmptyPage"></div> */}
          <Loader isLoading={isLoading} />
        </>
      );
    }
    const renderFunction = this.typeMap[type] || this.render404;

    if (!this.getTrendingBrandsSelection()) {
      return null;
    } else {
      return (
        <div block="UrlRewrites" id="UrlRewrites">
          {renderFunction()}
        </div>
      );
    }
  }
}

export default connect( mapStateToProps, null) (UrlRewrites);
