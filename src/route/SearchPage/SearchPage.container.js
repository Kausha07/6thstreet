// import PropTypes from 'prop-types';
import VueIntegrationQueries from "Query/vueIntegration.query";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {
  mapDispatchToProps,
  mapStateToProps,
  PLPContainer,
} from "Route/PLP/PLP.container";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { getUUID } from "Util/Auth";
import { VUE_PAGE_VIEW } from "Util/Event";
import SearchPage from "./SearchPage.component";
import { TYPE_CATEGORY } from "../../route/UrlRewrites/UrlRewrites.config";
export class SearchPageContainer extends PLPContainer {
  componentDidMount() {
    window.pageType = TYPE_CATEGORY;
    const {
      location: { state },
    } = this.props;
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_PAGE_VIEW,
      params: {
        event: VUE_PAGE_VIEW,
        pageType: "search",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: state?.prevPath ? state?.prevPath : null,
        url: window.location.href,
      },
    });
  }
  updateBreadcrumbs() {
    const {
      updateBreadcrumbs,
      location: { pathname = "", search = "" } = {},
      options: { q } = {},
    } = this.props;
    const link = `${pathname}${search}`;
    let breadCrumbName = q?.trim() ? q?.trim() : "Available products";
    updateBreadcrumbs([
      { name: breadCrumbName, url: link },
      { name: __("Home"), url: "/" },
    ]);
  }

  containerProps = () => {
    const {
      options,
      pages,
      isLoading,
      location: { prevPath = null },
    } = this.props;

    return { options, pages, isLoading, prevPath };
  };

  setMetaData() {
    const { setMeta, country, config, options: { q } = {} } = this.props;

    if (!q) {
      return;
    }

    const countryList = getCountriesForSelect(config);
    const { label: countryName = "" } =
      countryList.find((obj) => obj.id === country) || {};

    setMeta({
      title: __(
        "Search results for %s. Online shopping in %s | 6thStreet",
        q,
        countryName
      ),
      keywords: __("%s online shopping", q),
      description: __(
        // eslint-disable-next-line max-len
        "Buy %s. Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet.",
        q
      ),
    });
  }

  render() {
    return (
      <SearchPage {...this.containerFunctions} {...this.containerProps()} />
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchPageContainer)
);
