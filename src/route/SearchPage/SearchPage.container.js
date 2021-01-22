// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
    mapDispatchToProps,
    mapStateToProps,
    PLPContainer
} from 'Route/PLP/PLP.container';
import { getCountriesForSelect } from 'Util/API/endpoint/Config/Config.format';

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

    setMetaData() {
        const {
            setMeta, country, config, options: { q } = {}
        } = this.props;

        if (!q) {
            return;
        }

        const countryList = getCountriesForSelect(config);
        const { label: countryName = '' } = countryList.find((obj) => obj.id === country) || {};

        setMeta({
            title: __('Search results for %s. Online shopping in %s | 6thStreet', q, countryName),
            keywords: __('%s online shopping', q),
            description: __(
                // eslint-disable-next-line max-len
                'Buy %s. Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet.', q
            )
        });
    }

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
