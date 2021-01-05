import { connect } from 'react-redux';

import {
    mapDispatchToProps,
    NewVersionPopupContainer as SourceNewVersionPopupContainer
} from 'SourceComponent/NewVersionPopup/NewVersionPopup.container';
import isMobile from 'Util/Mobile';

export class NewVersionPopupContainer extends SourceNewVersionPopupContainer {
    componentDidMount() {
        const { showPopup, goToPreviousHeaderState } = this.props;

        if ('serviceWorker' in navigator) {
            window.addEventListener('showNewVersionPopup', () => {
                showPopup({
                    title: __('New version available!')
                });

                if (isMobile.any()) {
                    goToPreviousHeaderState();
                }
            });
        }
    }
}

export default connect(null, mapDispatchToProps)(NewVersionPopupContainer);
