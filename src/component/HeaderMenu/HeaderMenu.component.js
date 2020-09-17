import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import Menu from 'Component/Menu';

import './HeaderMenu.style';

class HeaderMenu extends PureComponent {
    static propTypes = {
        location: PropTypes.object.isRequired
    };

    state = {
        isExpanded: false,
        prevLocation: ''
    };

    static getDerivedStateFromProps(props, state) {
        const { location } = props;
        const { prevLocation } = state;

        if (location !== prevLocation) {
            return {
                isExpanded: false,
                prevLocation: location
            };
        }

        return null;
    }

    onCategoriesClick = () => {
        // Toggle dropdown
        this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
    };

    renderMenu() {
        const { isExpanded } = this.state;

        return (
            <Menu isExpanded={ isExpanded } />
        );
    }

    renderCategoriesButton() {
        const { isExpanded } = this.state;

        return (
            <button
              block="HeaderMenu"
              elem="Button"
              mods={ { isExpanded } }
              onClick={ this.onCategoriesClick }
            >
               <label htmlFor="Categories">{ __('Categories') }</label>
            </button>
        );
    }

    render() {
        return (
            <div block="HeaderMenu">
                { this.renderCategoriesButton() }
                { this.renderMenu() }
            </div>
        );
    }
}

export default withRouter(HeaderMenu);
