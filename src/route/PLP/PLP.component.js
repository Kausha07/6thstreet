/* eslint-disable fp/no-let */
import { PureComponent } from 'react';

import ContentWrapper from 'Component/ContentWrapper/ContentWrapper.component';
import PLPDetails from 'Component/PLPDetails';
import PLPFilters from 'Component/PLPFilters';
import PLPPages from 'Component/PLPPages';

import './PLP.style';

export class PLP extends PureComponent {
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
