import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import { setGender } from "Store/AppState/AppState.action";
import { toggleOverlayByKey } from "Store/Overlay/Overlay.action";
import { setLastTapItemOnHome } from "Store/PLP/PLP.action";

import HeaderMenu from "./HeaderMenu.component";

export const mapStateToProps = (state) => ({
  activeOverlay: state.OverlayReducer.activeOverlay,
  gender: state.AppState.gender,
  is_msite_megamenu_enabled: state.AppConfig.is_msite_megamenu_enabled,
});

export const mapDispatchToProps = (_dispatch) => ({
  toggleOverlayByKey: (key) => _dispatch(toggleOverlayByKey(key)),
  setGender: (gender) => _dispatch(setGender(gender)),
  setLastTapItemOnHome: (item) => _dispatch(setLastTapItemOnHome(item)),
});

export class HeaderMenuContainer extends PureComponent {
  static propTypes = {
    activeOverlay: PropTypes.string.isRequired,
    newMenuGender: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    is_msite_megamenu_enabled: PropTypes.bool,
    setMobileMegaMenuPageOpenFlag: PropTypes.func,
  };

  containerProps = () => {
    const { activeOverlay, newMenuGender, gender, is_msite_megamenu_enabled = false } = this.props;
    return { activeOverlay, newMenuGender, gender, is_msite_megamenu_enabled };
  };

  render() {
    return <HeaderMenu {...this.props} {...this.containerProps()} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderMenuContainer);
