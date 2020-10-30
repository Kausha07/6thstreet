import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';
import SearchSuggestion from 'Component/SearchSuggestion';
import { isArabic } from 'Util/App';

import Clear from './icons/close-black.png';
import searchPng from './icons/search-black.png';

import './HeaderSearch.style';

class HeaderSearch extends PureComponent {
    static propTypes = {
        search: PropTypes.string,
        onSearchChange: PropTypes.func.isRequired,
        onSearchSubmit: PropTypes.func.isRequired,
        onSearchClean: PropTypes.func.isRequired,
        isVisible: PropTypes.bool
    };

    static defaultProps = {
        search: '',
        isVisible: true
    };

    state = {
        isArabic: isArabic()
    };

    renderField() {
        const {
            search,
            onSearchChange,
            onSearchSubmit,
            isVisible,
            onSearchClean
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
                <button
                  block="HeaderSearch"
                  elem="SubmitBtn"
                  type="submit"
                >
                    <img src={ searchPng } alt="search" />
                </button>
                <button
                  block="HeaderSearch"
                  elem="Clear"
                  onClick={ onSearchClean }
                  type="button"
                  mods={ {
                      type: 'searchClear',
                      isVisible
                  } }
                  aria-label="Clear search"
                >
                    <img src={ Clear } alt="Clear button" />
                </button>
            </Form>
        );
    }

    renderSuggestion() {
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
                    { this.renderSuggestion() }
                </div>
            </>
        );
    }
}

export default HeaderSearch;
