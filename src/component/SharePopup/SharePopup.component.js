import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { showNotification } from "Store/Notification/Notification.action";
import Overlay from 'SourceComponent/Overlay';
import { Email, Link, WhatsApp, Facebook, Pinterest } from 'Component/Icons';
import { isArabic } from 'Util/App';

import { SHARE_POPUP_ID } from './SharePopup.config';
import './SharePopup.style';

export const mapDispatchToProps = (dispatch) => ({
    showSuccessNotification: (message) => dispatch(showNotification('success', message)),
    showErrorNotification: (error) => dispatch(showNotification('error', error[0].message)),
});

class SharePopup extends PureComponent {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        showShareOverlay: PropTypes.func.isRequired,
        hideShareOverlay: PropTypes.func.isRequired,
        showSuccessNotification: PropTypes.func.isRequired,
        showErrorNotification: PropTypes.func.isRequired,
    };

    copyToClipboard = async () => {
        const { showSuccessNotification, showErrorNotification } = this.props;
        try {
            await navigator.clipboard.writeText(window.location.href);
            showSuccessNotification(__('Link copied to clipboard'));
        }
        catch(err) {
            console.error(err);
            showErrorNotification(__('Something went wrong! Please, try again!'));
        }
    };


    renderMap = [
        {
            title: "WhatsApp",
            icon: <WhatsApp />,
            handleClick: (text, title, url, image) => window.open(`https://api.whatsapp.com/send?text=${url}`, '_blank'),
            render: true,
        },
        {
            title: "Facebook",
            icon: <Facebook />,
            handleClick: (text, title, url, image) => {
                if(FB) {
                    FB.ui({
                        method: 'share',
                        href: url,
                    });
                }
                else {
                    window.open(`https://www.facebook.com/sharer/sharer.php?${url}`, '_blank');
                }
            },
            render: true,
        },
        {
            title: "Copy Link",
            icon: <Link />,
            handleClick: this.copyToClipboard,
            render: !!navigator?.clipboard,
        },
        {
            title: "Mail",
            icon: <Email />,
            handleClick: (text, title, url, image) => window.open(`mailto:?&&subject=${title}&cc=&bcc=&body=${text} ${url}`),
            render: true,
        },
        {
            title: "Pinterest",
            icon: <Pinterest />,
            handleClick: (text, title, url, image) => window.open(`https://pinterest.com/pin/create/button?url=${url}&media=${image}&description=${text}`, '_blank'),
            render: true,
        }
    ];

    renderShareButtons = () => {
        const { text="", title="", url = window.location.href, image="" } = this.props;
        return (
            this.renderMap.filter(({render})=> render).map(({title, icon, handleClick}) => (
                <button key={title} onClick={() => handleClick(text, title, url, image)}>
                    { icon }
                </button>
            ))
        );
    }


    componentDidMount() {
        const { hideShareOverlay } = this.props;
        document.addEventListener('click', hideShareOverlay, true);
    }

    componentWillUnmount() {
        const { hideShareOverlay } = this.props;
        document.removeEventListener('click', hideShareOverlay, true);
    }

    render() {
        const { hideShareOverlay, open } = this.props;
        return (
            <Overlay
                id={ SHARE_POPUP_ID }
                mix={ {
                    block: 'Overlay',
                    mods: {
                        isArabic: isArabic()
                    } 
                }}
                onHide={ hideShareOverlay }
                open={ open }
                isRenderInPortal={false}
            >
                <h3>{ __( "SHARE" ) }</h3>
                <div block="Overlay" elem="ButtonsContainer">
                    { this.renderShareButtons() }
                </div>
            </Overlay>
        );
    }
}

export default connect(null, mapDispatchToProps)(SharePopup);
