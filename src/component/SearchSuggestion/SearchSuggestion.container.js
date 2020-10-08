import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import SearchSuggestionDispatcher from 'Store/SearchSuggestions/SearchSuggestions.dispatcher';
import { getStaticFile } from 'Util/API/endpoint/StaticFiles/StaticFiles.endpoint';

import SearchSuggestion from './SearchSuggestion.component';

export const mapStateToProps = (state) => ({
    requestedSearch: state.SearchSuggestions.search,
    data: state.SearchSuggestions.data,
    gender: state.AppState.gender
});

export const mapDispatchToProps = (dispatch) => ({
    requestSearchSuggestions: (search) => {
        SearchSuggestionDispatcher.requestSearchSuggestions(search, dispatch);
    }
});

export class SearchSuggestionContainer extends PureComponent {
    static propTypes = {
        requestSearchSuggestions: PropTypes.func.isRequired,
        requestedSearch: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
        data: PropTypes.shape({
            brands: PropTypes.array,
            products: PropTypes.array
        }).isRequired
    };

    static getDerivedStateFromProps(props, state) {
        const { search } = props;
        const { prevSearch } = state;

        if (search !== prevSearch) {
            SearchSuggestionContainer.requestSearchSuggestions(props);
            return { prevSearch: search };
        }

        return null;
    }

    static requestSearchSuggestions(props) {
        const { search, requestSearchSuggestions } = props;

        if (!search) {
            return;
        }

        requestSearchSuggestions(search);
    }

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    constructor(props) {
        super(props);

        this.state = {
            prevSearch: props.search,
            trendingBrands: [],
            trendingTags: []
        };

        // TODO: please render this component only once. Otherwise it is x3 times the request

        SearchSuggestionContainer.requestSearchSuggestions(props);
        this.requestTrendingInformation();
    }

    async requestTrendingInformation() {
        const { gender } = this.props;

        try {
            const data = await Promise.all([
                getStaticFile('search_trending_brands'),
                getStaticFile('search_trending_tags')
            ]);

            this.setState({
                trendingBrands: data[0][gender],
                trendingTags: data[1][gender]
            });
        } catch (e) {
            console.log(e);
        }
    }

    containerProps = () => {
        const { trendingBrands, trendingTags } = this.state;
        const { search, data } = this.props;
        const { brands = [], products = [] } = data;

        const isEmpty = !search;
        const inNothingFound = (brands.length + products.length) === 0;

        return {
            brands,
            products,
            inNothingFound,
            isEmpty,
            isActive: true, // TODO: implement
            isLoading: this.getIsLoading(),
            trendingBrands,
            trendingTags
        };
    };

    getIsLoading() {
        const { requestedSearch, search } = this.props;

        if (!search) {
            return false;
        }

        return requestedSearch !== search;
    }

    render() {
        return (
            <SearchSuggestion
              { ...this.props }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSuggestionContainer);
