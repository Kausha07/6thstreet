// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
    mapDispatchToProps,
    mapStateToProps,
    PLPContainer
} from 'Route/PLP/PLP.container';

import SearchPage from './SearchPage.component';

export class SearchPageContainer extends PLPContainer {
    render() {
        return (
            <SearchPage
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SearchPageContainer)
);
