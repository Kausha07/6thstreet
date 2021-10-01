import Image from "Component/Image";
import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { withRouter } from "react-router";
import { isArabic } from "Util/App";
import "./HeaderLogo.style";
import logo from "./logo/6thstreet_logo.png";

class HeaderLogo extends PureComponent {
  static propTypes = {
    setGender: PropTypes.func.isRequired,
  };

  state = {
    isArabic: isArabic(),
  };

  render() {
    const { isArabic } = this.state;
    const { setGender } = this.props;

    return (
      <Link
        to={{
          pathname: "/women.html",
          state: {
            prevPath: window.location.href,
          },
        }}
        block="HeaderLogo"
        mods={{ isArabic }}
        onClick={setGender}
      >
        <Image mix={{ block: "Image", mods: { isArabic } }} src={logo} />
      </Link>
    );
  }
}

export default withRouter(HeaderLogo);
