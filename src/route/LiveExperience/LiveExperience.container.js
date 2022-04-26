import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { updateMeta } from "Store/Meta/Meta.action";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { capitalize } from "Util/App";
import { getQueryParam } from "Util/Url";
import { changeNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";
import LivePartyDispatcher from "Store/LiveParty/LiveParty.dispatcher";
import Config from "./LiveExperience.config";
import LiveExperience from "./LiveExperience.component";
import { getCountryFromUrl } from "Util/Url/Url";

export const BreadcrumbsDispatcher = import(
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  country: state.AppState.country,
  live: state.LiveParty.live,
  upcoming: state.LiveParty.upcoming,
  archived: state.LiveParty.archived,
});

export const mapDispatchToProps = (dispatch) => ({
  requestLiveParty: (options) =>
    LivePartyDispatcher.requestLiveParty(options, dispatch),

  requestUpcomingParty: (options) =>
    LivePartyDispatcher.requestUpcomingParty(options, dispatch),

  requestArchivedParty: (options) =>
    LivePartyDispatcher.requestArchivedParty(options, dispatch),

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
  }

  requestLiveParty() {
    const broadcastId = getQueryParam("broadcastId", location);
    const { requestLiveParty } = this.props;
    requestLiveParty({ broadcastId });
  }

  requestUpcomingParty() {
    const { requestUpcomingParty } = this.props;
    const isStaging = getQueryParam("isStaging", location) === "true" ? true : false;
    requestUpcomingParty({ storeId: Config.storeId, isStaging });
  }

  requestArchivedParty() {
    const { requestArchivedParty } = this.props;
    const isStaging = getQueryParam("isStaging", location) === "true" ? true : false;
    requestArchivedParty({ storeId: Config.storeId, isStaging });
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

  static getDerivedStateFromProps(props) {
    const { live, upcoming, archived } = props;
  }

  componentDidMount() {
    this.requestLiveParty();
    this.requestUpcomingParty();
    this.requestArchivedParty();
    const showHeaderFooter = getQueryParam("showHeaderFooter", location);

    const isShowHeaderFooter = this.getParameterByName("showHeaderFooter");

    if (isShowHeaderFooter) {
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
      description: getCountryFromUrl() === 'QA' ? __(
        // eslint-disable-next-line max-len
        "Shop %s %s Online. Explore your favourite brands ✯ Free Receiving ✯ Cash On Receiving ✯ 100% original brands | 6thStreet.",
        genderName,
        categoryName
      )
        :
        __(
          // eslint-disable-next-line max-len
          "Shop %s %s Online. Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet.",
          genderName,
          categoryName
        ),
      twitter_title: __(
        "%s %s Online shopping in %s | 6thStreet",
        genderName,
        categoryName,
        countryName
      ),
      twitter_desc: getCountryFromUrl() === 'QA' ? __(
        // eslint-disable-next-line max-len
        "Shop %s %s Online. Explore your favourite brands ✯ Free Receiving ✯ Cash On Receiving ✯ 100% original brands | 6thStreet.",
        genderName,
        categoryName
      )
        :
        __(
          // eslint-disable-next-line max-len
          "Shop %s %s Online. Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet.",
          genderName,
          categoryName
        ),
      og_title: __(
        "%s %s Online shopping in %s | 6thStreet",
        genderName,
        categoryName,
        countryName
      ),
      og_desc: getCountryFromUrl() === 'QA' ? __(
        // eslint-disable-next-line max-len
        "Shop %s %s Online. Explore your favourite brands ✯ Free Receiving ✯ Cash On Receiving ✯ 100% original brands | 6thStreet.",
        genderName,
        categoryName
      )
        :
        __(
          // eslint-disable-next-line max-len
          "Shop %s %s Online. Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet.",
          genderName,
          categoryName
        ),
    });
  }
  containerProps = () => {
    const broadcastId = getQueryParam("broadcastId", location);
    let { live, upcoming, archived } = this.props;
    // Updating upcoming data to remove current broadCastId from it.
    let updatedUpcoming = upcoming.filter((val) => {
      return (val.id.toString() !== broadcastId)
    })
    let updatedArchived = archived.filter((val) => {
      return (val.id.toString() !== broadcastId)
    })
    return {
      broadcastId
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