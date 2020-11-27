import PropTypes from 'prop-types';
import { createRef, PureComponent } from 'react';

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
        isArabic: isArabic(),
        isClearVisible: false
    };

    searchRef = createRef();

    static getDerivedStateFromProps(props) {
        const { search } = props;

        return {
            isClearVisible: search !== ''
        };
    }

    onSubmit = () => {
        const { onSearchSubmit } = this.props;
        const {
            current: {
                form: {
                    children
                }
            }
        } = this.searchRef;

        const searchInput = children[0].children[0];
        const submitBtn = children[1];

        submitBtn.blur();
        searchInput.blur();
        onSearchSubmit();
    };

    renderField() {
        const {
            search,
            onSearchChange,
            isVisible,
            onSearchClean
        } = this.props;
        const { isClearVisible, isArabic } = this.state;

        return (
            <Form
              id="header-search"
              onSubmit={ this.onSubmit }
              ref={ this.searchRef }
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
                  mods={ { isArabic } }
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
                      isVisible,
                      isClearVisible
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
        // console.log(this.searchRef.current ? this.searchRef.current.children[0].children : null);

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
