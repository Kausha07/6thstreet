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
    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;

        updateBreadcrumbs([
            { name: __('Catalog'), url: '' },
            { name: __('Home'), url: '/' }
        ]);
    }

    containerProps = () => {
        const { options, pages, isLoading } = this.props;

        return { options, pages, isLoading };
    };

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
