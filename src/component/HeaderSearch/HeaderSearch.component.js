import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';
import SearchSuggestion from 'Component/SearchSuggestion';
import { isArabic } from 'Util/App';

import './HeaderSearch.style';

class HeaderSearch extends PureComponent {
    static propTypes = {
        search: PropTypes.string,
        onSearchChange: PropTypes.func.isRequired,
        onSearchSubmit: PropTypes.func.isRequired
    };

    static defaultProps = {
        search: ''
    };

    state = {
        isArabic: isArabic()
    };

    renderField() {
        const {
            search,
            onSearchChange,
            onSearchSubmit
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
