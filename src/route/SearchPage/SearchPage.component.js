// import PropTypes from 'prop-types';
// import { PureComponent } from 'react';

import { PLP } from 'Route/PLP/PLP.component';

import './SearchPage.style';

class SearchPage extends PLP {
    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;

        updateBreadcrumbs([
            { name: __('Catalog'), url: '' },
            { name: __('Home'), url: '/' }
        ]);
    }
}

export default SearchPage;
