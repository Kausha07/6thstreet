import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { updateMeta } from "Store/Meta/Meta.action";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { capitalize } from "Util/App";

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
  setMeta: (meta) => dispatch(updateMeta(meta)),
});

export class LiveExperienceContainer extends PureComponent {
  static propTypes = {
    gender: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    updateBreadcrumbs: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.setMetaData();
  }

  componentDidMount() {
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

  render() {
    return <LiveExperience />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveExperienceContainer);
