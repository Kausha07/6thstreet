// import PropTypes from 'prop-types';
import ContentWrapper from '@scandipwa/scandipwa/src/component/ContentWrapper/ContentWrapper.component';
import { PureComponent } from 'react';

import PLPDetails from 'Component/PLPDetails';
import PLPFilters from 'Component/PLPFilters';
import PLPPages from 'Component/PLPPages';

import './PLP.style';

class PLP extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    renderPLPDetails() {
        return (
            <PLPDetails />
        );
    }

    renderPLPFilters() {
        return (
            <PLPFilters />
        );
    }

    renderPLPPages() {
        return (
            <PLPPages />
        );
    }

    render() {
        return (
            <main block="PLP">
                <ContentWrapper
                  label={ __('Product List Page') }
                >
                { this.renderPLPDetails() }
                { this.renderPLPFilters() }
                { this.renderPLPPages() }
                </ContentWrapper>
            </main>
        );
    }
}

export default PLP;
