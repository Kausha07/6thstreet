import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { setGender } from "Store/AppState/AppState.action";
import HeaderLogo from "./HeaderLogo.component";

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
});
export const mapDispatchToProps = (dispatch) => ({
  setGender: (gender) => dispatch(setGender(gender)),
  prevPath: window.location.href,
});

class HeaderLogoContainer extends PureComponent {
  static propTypes = {
    setGender: PropTypes.func.isRequired,
  };

  containerFunctions = {
    setGender: this.setGender.bind(this),
  };

  setGender() {
    const { setGender, gender } = this.props;

    setGender(gender);
  }

  render() {
    return <HeaderLogo {...this.containerFunctions} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderLogoContainer);
