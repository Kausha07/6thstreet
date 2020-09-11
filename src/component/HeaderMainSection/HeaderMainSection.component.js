import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';

import './HeaderMainSection.style';

class HeaderMainSection extends NavigationAbstract {
    stateMap = {
        [DEFAULT_STATE_NAME]: {}
    };

    renderMap = {};

    render() {
        return (
            <div block="HeaderMainSection">
                { this.renderNavigationState() }
            </div>
        );
    }
}

export default HeaderMainSection;
