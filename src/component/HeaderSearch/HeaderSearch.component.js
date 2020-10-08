import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import SearchSuggestion from 'Component/SearchSuggestion';

import './HeaderSearch.style';

class HeaderSearch extends PureComponent {
    static propTypes = {
        search: PropTypes.string,
        onSearchChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        search: ''
    };

    renderField() {
        const {
            search,
            onSearchChange
        } = this.props;

        return (
            <Field
              id="search-field"
              name="search"
              type="text"
              placeholder={ __('What are you looking for?') }
              onChange={ onSearchChange }
              value={ search }
            />
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
        return (
            <div block="HeaderSearch">
                { this.renderField() }
                { this.renderSuggestions() }
            </div>
        );
    }
}

export default HeaderSearch;
