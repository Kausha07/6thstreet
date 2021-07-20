/* eslint-disable fp/no-let */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './ShareButton.style';
import { Share } from '../Icons';

class ShareButton extends PureComponent {
    static propTypes = {
        initiateShare: PropTypes.func.isRequired,
        children: PropTypes.node
    };

    static defaultProps = {
        children: null
    }

    render() {
        const { initiateShare, children, ...rest } = this.props;
        return (
            <button onClick={ initiateShare } { ...rest }>
                <Share block="Icon" />
                { children }
            </button>
        );
    }
}

export default ShareButton;
