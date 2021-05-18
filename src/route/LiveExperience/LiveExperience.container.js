import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { updateMeta } from "Store/Meta/Meta.action";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { capitalize } from "Util/App";
import { getQueryParam } from "Util/Url";
import { changeNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";

import LiveExperience from "./LiveExperience.component";

export const BreadcrumbsDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  country: state.AppState.country,
});

export const mapDispatchToProps = (dispatch) => ({
  updateBreadcrumbs: (breadcrumbs) => {
    BreadcrumbsDispatcher.then(({ default: dispatcher }) =>
      dispatcher.update(breadcrumbs, dispatch)
    );
  },
  changeHeaderState: (state) =>
    dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
  setMeta: (meta) => dispatch(updateMeta(meta)),
});

export class LiveExperienceContainer extends PureComponent {
  static propTypes = {
    gender: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    updateBreadcrumbs: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
    broadcastId: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.setMetaData();
    const showHeaderFooter = getQueryParam("showHeaderFooter", location);
  }

  parseBool = (b) => {
    return !/^(false|0)$/i.test(b) && !!b;
  };

  getParameterByName = (name, url = window.location.href) => {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  componentDidMount() {
    const showHeaderFooter = getQueryParam("showHeaderFooter", location);

    const isShowHeaderFooter = this.getParameterByName("showHeaderFooter");

    if (isShowHeaderFooter !== null) {
      const { changeHeaderState } = this.props;
      changeHeaderState({
        isHiddenOnDesktop: !this.parseBool(showHeaderFooter),
      });
    }
    this.updateBreadcrumbs();
    this.setMetaData();
  }

  componentDidUpdate() {
    this.updateBreadcrumbs();
  }
  updateBreadcrumbs() {
    const { updateBreadcrumbs } = this.props;
    const breadcrumbs = [
      {
        url: "/",
        name: "Live Shopping",
      },
      {
        url: "/",
        name: __("Home"),
      },
    ];

    updateBreadcrumbs(breadcrumbs);
  }

  setMetaData() {
    const {
      setMeta,
      country,
      config,
      requestedOptions: { q } = {},
      gender,
    } = this.props;

    if (!q) {
      return;
    }

    const genderName = capitalize(gender);
    const countryList = getCountriesForSelect(config);
    const { label: countryName = "" } =
      countryList.find((obj) => obj.id === country) || {};
    const breadcrumbs = location.pathname
      .split(".html")[0]
      .substring(1)
      .split("/");
    const categoryName = capitalize(breadcrumbs.pop() || "");

    setMeta({
      title: __(
        "%s %s Online shopping in %s | 6thStreet",
        genderName,
        categoryName,
        countryName
      ),
      keywords: __(
        "%s %s %s online shopping",
        genderName,
        categoryName,
        countryName
      ),
      description: __(
        // eslint-disable-next-line max-len
        "Shop %s %s Online. Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet.",
        genderName,
        categoryName
      ),
    });
  }
  containerProps = () => {
    const broadcastId = getQueryParam("broadcastId", location);
    return {
      broadcastId,
    };
  };

  render() {
    return <LiveExperience {...this.containerProps()} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveExperienceContainer);
