import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { setGender } from "Store/AppState/AppState.action";
import HeaderGenders from "./HeaderGenders.component";
import {
  EVENT_MOE_TOP_NAV_HOME,
  EVENT_MOE_TOP_NAV_MEN,
  EVENT_MOE_TOP_NAV_WOMEN,
  EVENT_MOE_TOP_NAV_KIDS,
  EVENT_MOE_TOP_NAV_ALL,
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import "./HeaderGenders.style";

export const mapStateToProps = (state) => ({
  currentContentGender: state.AppState.gender,
  product: state.PDP.product,
});
export const mapDispatchToProps = (dispatch) => ({
  setGender: (gender) => dispatch(setGender(gender)),
});

class HeaderGendersContainer extends PureComponent {
  static propTypes = {
    currentContentGender: PropTypes.string.isRequired,
    changeMenuGender: PropTypes.func,
    isMobile: PropTypes.bool,
  };

  static defaultProps = {
    changeMenuGender: () => {},
    isMobile: false,
  };
  componentDidMount() {
    this.setCurrentGender();
  }

  componentDidUpdate() {
    this.setCurrentGender();
  }
  setCurrentGender() {
    const { currentContentGender } = this.props;
    if (currentContentGender !== "all") {
      if (window.location.pathname.includes("women")) {
        this.props.setGender("women");
      } else if (window.location.pathname.includes("men")) {
        this.props.setGender("men");
      } else if (window.location.pathname.includes("kid")) {
        this.props.setGender("kids");
      } else if (window.location.pathname.includes("home")) {
        this.props.setGender("home");
      } else if (window.location.pathname.includes("all")) {
        this.props.setGender("all");
      } else if (this.props.product.gender === "Women") {
        this.props.setGender("women");
      } else if (this.props.product.gender === "Men") {
        this.props.setGender("men");
      } else if (this.props.product.gender === "Kids") {
        this.props.setGender("kids");
      } else if (this.props.product.gender === "Home") {
        this.props.setGender("home");
      } else if (this.props.product.gender === "All") {
        this.props.setGender("all");
      }
    }
  }
  
  render() {
    return <HeaderGenders {...this.props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderGendersContainer);
