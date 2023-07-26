/* eslint-disable fp/no-let */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import ShareIcon from "../MyAccountReferral/icons/share.png";
import './ShareButton.style';
import { Share } from '../Icons';
import Image from "Component/Image";

class ShareButton extends PureComponent {
    static propTypes = {
        initiateShare: PropTypes.func.isRequired,
        children: PropTypes.node
    };

    static defaultProps = {
        children: null
    }

    render() {
        const { initiateShare, openShareOverlay, children, ...rest } = this.props;
        return (
            <button
                onClick={ initiateShare }
                { ...rest }
                block="Share"
                mods={{
                    openShareOverlay: openShareOverlay
                }}
            >
                {this.props?.isReferral ? (
                    <Image lazyLoad={true} alt={"Share Icon"} src={ShareIcon} />
                ) : (
                    <Share block="Icon" />
                )} 
                { children }
            </button>
        );
    }
}

export default ShareButton;
