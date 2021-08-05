import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import UrlRewritesQuery from "Query/UrlRewrites.query";
import { hideActiveOverlay } from "Store/Overlay/Overlay.action";
import { LocationType } from "Type/Common";
import history from "Util/History";
import { fetchQuery } from "Util/Request";

import UrlRewrites from "./UrlRewrites.component";
import {
  TYPE_CATEGORY,
  TYPE_NOTFOUND,
  TYPE_PRODUCT,
} from "./UrlRewrites.config";
import WebUrlParser from "Util/API/helper/WebUrlParser";

export const mapStateToProps = (state) => ({
  locale: state.AppState.locale,
});

export const mapDispatchToProps = (_dispatch) => ({
  hideActiveOverlay: () => _dispatch(hideActiveOverlay()),
});

export class UrlRewritesContainer extends PureComponent {
  static propTypes = {
    location: LocationType.isRequired,
    locale: PropTypes.string.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
  };

  containerFunctions = {
    // getData: this.getData.bind(this)
  };

  state = {
    prevPathname: "",
    isLoading: true,
    type: "",
    id: -1,
    sku: "",
    query: "",
    brandDescription: "",
    brandImg: "",
    brandName: "",
  };

  constructor(props) {
    super(props);
    
    this.requestUrlRewrite();
  }

  componentDidUpdate(prevProps, prevState) {
    const { pathname } = location;
    const {
      locale,
      hideActiveOverlay,
      history: {
        location: { state: search },
      },
    } = this.props;
    const {
      locale: prevLocale,
      location: { state: prevLocaState },
    } = prevProps;
    const {
      location: { state: LocationState ,pathname:prevLocaPathname },
    } = this.props;
    const { prevPathname, query } = this.state;
    const { prevPathname: prevStatePathname, query: prevQuery } = prevState;

    if (query && query !== prevQuery) {
      let partialQuery = location.search;

      if (location.search) {
        if (partialQuery.indexOf("idx") !== -1) {
          return;
        } else {
          // If we are sharing URL with filters do if condition
          if (location.href.includes("?")) {
            const {
              location: { state: locationState, search: locationSearch },
            } = history;
            let queryURL = new URL(
              location.origin +
                location.pathname +
                "?" +
                query +
                "&%26" +
                location.href.split("?")[1].split("&").join("&%26")
            );
            history.push({
              pathname: `${pathname + locationSearch}`,
              state: `${queryURL.href}`,
            });
          } else {
            partialQuery = partialQuery.substring(1);
            history.push(`${pathname}?${query}&${partialQuery}`);
          }
        }
      } else {
        if (query && search) {
          history.push({
            pathname: `${pathname}`,
            state: `${pathname}?${search.split("?")[1]}`,
          });
        } else {
          history.push({
            pathname: `${pathname}`,
            state: `${pathname}?${query}`,
          });
        }
      }
    }

    if (pathname !== prevPathname || locale !== prevLocale) {
      if (!this.state.isLoading) {
        hideActiveOverlay();
        document.body.style.overflow = "visible";
        // Request URL rewrite if pathname or locale changed
        this.requestUrlRewrite(true);
      }
    }
  }

  async requestUrlRewrite(isUpdate = false) {
    // TODO: rename this to pathname, urlParam is strange
    const { pathname: urlParam = "" } = location;
    const slicedUrl = urlParam.slice(urlParam.search("id/"));
    // eslint-disable-next-line no-magic-numbers
    const magentoProductId = Number(slicedUrl.slice("3").split("/")[0]);
    const possibleSku = this.getPossibleSku();
    if (isUpdate) {
      this.setState({
        isLoading: true,
      });
    }

    // TODO: switch to "executeGet" afterwards
    const { urlResolver } = await fetchQuery(
      UrlRewritesQuery.getQuery({ urlParam })
    );
    const {
      type = magentoProductId || possibleSku ? TYPE_PRODUCT : TYPE_NOTFOUND,
      id,
      data: {
        url: query,
        brand_html: brandDescription,
        brand_logo: brandImg,
        brand_name: brandName,
      },
    } = urlResolver || { data: {} };
    const finalType =
      type === TYPE_NOTFOUND && decodeURI(location.search).match(/idx=/)
        ? TYPE_CATEGORY
        : type;

    window.pageType = finalType;
    this.setState({
      prevPathname: urlParam,
      isLoading: false,
      type: finalType,
      id: id === undefined ? magentoProductId : id,
      sku: possibleSku,
      query: finalType === TYPE_PRODUCT ? "" : query,
      brandDescription: brandDescription,
      brandImg: brandImg,
      brandName: brandName,
    });
  }

  getPossibleSku() {
    const { pathname } = location;

    const uriElements = pathname
      .substr(0, pathname.indexOf(".html"))
      .substr(1)
      .split("-");

    const result = uriElements
      .reduce((acc, element) => {
        if (/\d/.test(element) || acc.length !== 0) {
          acc.push(element);
        }

        return acc;
      }, [])
      .join("-");

    return result.length ? result : false;
  }

  containerProps = () => {
    const { isLoading, type, id, sku, brandDescription, brandImg, brandName } =
      this.state;

    return {
      isLoading,
      type,
      id,
      sku,
      brandDescription,
      brandImg,
      brandName,
    };
  };

  render() {
    return (
      <UrlRewrites {...this.containerFunctions} {...this.containerProps()} />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UrlRewritesContainer);
