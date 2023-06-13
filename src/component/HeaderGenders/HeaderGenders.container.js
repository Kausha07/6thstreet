import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { setGender } from "Store/AppState/AppState.action";
import HeaderGenders from "./HeaderGenders.component";
import "./HeaderGenders.style";

export const mapStateToProps = (state) => ({
  currentContentGender: state.AppState.gender,
  product: state.PDP.product,
  gender: state.AppState.gender,
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
    let urlGender = window.location.pathname?.split("/")?.[1]?.split(".")?.[0];
    if (currentContentGender !== "all") {
      // set gender from URL
      if (
        window.location.pathname === "/women.html" ||
        window.location.pathname === "/men.html" ||
        window.location.pathname === "/kids.html" ||
        window.location.pathname === "/home.html"
      ) {
        this.props.setGender(urlGender);
      }
      // if user land on PDP from influencer page
      // and pdp URL contains women or any other gender, then
      // the selected gender should be influencer rather than any other gender
      else if (this.props.gender === "influencer") {
        this.props.setGender("influencer");
      }
      // set gender if PDP URL contains any gender name
      else if (window.location.pathname.includes("women")) {
        this.props.setGender("women");
      } else if (window.location.pathname.includes("men")) {
        this.props.setGender("men");
      } else if (window.location.pathname.includes("kid")) {
        this.props.setGender("kids");
      } else if (window.location.pathname.includes("home")) {
        this.props.setGender("home");
      }
      // set gender Influencer for Influencer pages
      else if (
        window.location.pathname === "/influencer.html" ||
        window.location.pathname === "/influencer.html/Store" ||
        window.location.pathname === "/influencer.html/Collection"
      ) {
        this.props.setGender("influencer");
      }
      // this is also for PDP but if PDP URL didn't contain any gender
      else if (this.props.product?.gender === "Women") {
        this.props.setGender("women");
      } else if (this.props.product?.gender === "Men") {
        this.props.setGender("men");
      } else if (this.props.product?.gender === "Kids") {
        this.props.setGender("kids");
      } else if (this.props.product?.gender === "Home") {
        this.props.setGender("home");
      } else if (this.props.product?.gender === "Influencer") {
        this.props.setGender("influencer");
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
