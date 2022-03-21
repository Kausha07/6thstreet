import { PureComponent } from "react";

import "./ChatPopup.style";

class ChatPopup extends PureComponent {

  componentDidMount() {
    // const script = document.createElement("script");
    // script.type = "text/javascript";
    // script.src = process.env.REACT_APP_CHAT_URL;

    // document.getElementsByTagName("head")[0].appendChild(script);
  }
  
  render() {
    if (location.pathname.match(/checkout|cart/)) {
      return null;
    }

    return null;
  }
}

export default ChatPopup;
