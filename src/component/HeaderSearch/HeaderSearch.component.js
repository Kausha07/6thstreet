import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';

import './HeaderSearch.style';

// TODO: see if this is Algolia widget or not.
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

        // If there is no search (or search is by " " empty string)
        if (!search.trim()) {
            return null;
        }

        return `Suggestions for: ${ search }!`;
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
