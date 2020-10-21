import { SearchOverlay } from '@scandipwa/scandipwa/src/component/SearchField/SearchField.component';
import PropTypes from 'prop-types';
import { PureComponent, Suspense } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import SearchSuggestion from 'Component/SearchSuggestion';
import { isArabic } from 'Util/App';

import './HeaderSearch.style';

class HeaderSearch extends PureComponent {
    static propTypes = {
        search: PropTypes.string,
        onSearchChange: PropTypes.func.isRequired,
        onSearchSubmit: PropTypes.func.isRequired,
        isVisible: PropTypes.bool,
        onClearSearchButtonClick: PropTypes.func.isRequired,
        searchCriteria: PropTypes.string
    };

    static defaultProps = {
        search: '',
        isVisible: true,
        searchCriteria: ''
    };

    state = {
        isArabic: isArabic()
    };

    clearSearch = () => {
        this.onClearSearchButtonClick(false);
    };

    onClearSearchButtonClick(isFocusOnSearchBar = true) {
        const { onClearSearchButtonClick } = this.props;
        if (isFocusOnSearchBar) {
            this.searchBarRef.current.focus();
        }
        onClearSearchButtonClick();
    }

    renderClearSearch() {
        const { isVisible } = this.props;

        return (
            <button
              block="Header"
              elem="Button"
              onClick={ this.onClearSearchButtonClick }
              mods={ {
                  type: 'searchClear',
                  isVisible
              } }
              aria-label="Clear search"
            />
        );
    }

    renderOverlayFallback() {
        return <Loader isLoading />;
    }

    renderField() {
        const {
            search,
            onSearchChange,
            onSearchSubmit,
            searchCriteria
        } = this.props;

        return (
            <Form
              id="header-search"
              onSubmit={ onSearchSubmit }
            >
                <Field
                  id="search-field"
                  name="search"
                  type="text"
                  placeholder={ __('What are you looking for?') }
                  onChange={ onSearchChange }
                  value={ search }
                />
                <Suspense fallback={ this.renderOverlayFallback() }>
                    <SearchOverlay clearSearch={ this.clearSearch } searchCriteria={ searchCriteria } />
                </Suspense>
            </Form>
        );
    }

    renderSuggestions() {
        const { search } = this.props;

        return (
            <SearchSuggestion
              search={ search }
            />
        );
    }

    render() {
        const { isArabic } = this.state;
        return (
            <>
            <div block="SearchBackground" mods={ { isArabic } } />
            <div block="HeaderSearch" mods={ { isArabic } }>
                { this.renderField() }
                { this.renderSuggestions() }
            </div>
            </>
        );
    }
}

export default HeaderSearch;
