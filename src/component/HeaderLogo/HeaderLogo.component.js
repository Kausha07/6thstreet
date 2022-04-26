import Image from "Component/Image";
import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { withRouter } from "react-router";
import { isArabic } from "Util/App";
import "./HeaderLogo.style";
import logo from "./logo/6thstreet_logo.png";
import BrowserDatabase from "Util/BrowserDatabase";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";

class HeaderLogo extends PureComponent {
  static propTypes = {
    setGender: PropTypes.func.isRequired,
    setPrevPath: PropTypes.func.isRequired,
  };

  state = {
    isArabic: isArabic(),
  };

  handleLinkOnClick = (path) => {
    const {setGender, setPrevPath} = this.props;
    setGender();
    setPrevPath(path)
  }

  render() {
    const { isArabic } = this.state;
    const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      : "home";
    return (
      <Link
        to={`/${gender}.html`}
        block="HeaderLogo"
        mods={{ isArabic }}
        onClick={() => this.handleLinkOnClick(window.location.href)}
      >
        <Image lazyLoad={true} mix={{ block: "Image", mods: { isArabic } }} src={logo} />
      </Link>
    );
  }
}

export default withRouter(HeaderLogo);