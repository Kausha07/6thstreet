import { PureComponent } from "react";

import "./ChatPopup.style";

class ChatPopup extends PureComponent {
  render() {
    if (location.pathname.match(/checkout|cart/)) {
      return null;
    }
    window.onload = function () {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = process.env.REACT_APP_CHAT_URL;

      document.getElementsByTagName("head")[0].appendChild(script);
    };

    return null;
  }
}

export default ChatPopup;
