import { PureComponent } from 'react';

class ChatPopup extends PureComponent {
    render() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = process.env.REACT_APP_CHAT_URL;

        document.getElementsByTagName('head')[0].appendChild(script);

        return null;
    }
}

export default ChatPopup;
