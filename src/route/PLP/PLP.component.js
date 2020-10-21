/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ContentWrapper from 'Component/ContentWrapper/ContentWrapper.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import PLPDetails from 'Component/PLPDetails';
import PLPFilters from 'Component/PLPFilters';
import PLPPages from 'Component/PLPPages';
import { Filters } from 'Util/API/endpoint/Product/Product.type';

import './PLP.style';

export class PLP extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        setGender: PropTypes.func.isRequired,
        filters: Filters.isRequired
    };

    componentDidMount() {
        this.updateBreadcrumbs();
        this.updateHeaderState();
    }

    updateHeaderState() {
        const { changeHeaderState } = this.props;

        changeHeaderState({
            name: DEFAULT_STATE_NAME,
            isHiddenOnMobile: true
        });
    }

    updateBreadcrumbs() {
        const breadcrumbLevels = window.location.pathname.split('.html')[0]
            .substring(1)
            .split('/');
        const {
            updateBreadcrumbs, setGender
        } = this.props;

        const breadcrumbsMapped = breadcrumbLevels.reduce((acc, breadcrumbLevel) => {
            switch (breadcrumbLevel) {
            case breadcrumbLevels[0]:
                acc.push({
                    url: '/',
                    name: breadcrumbLevel,
                    onClick: setGender
                });
                break;
            case breadcrumbLevels[1]:
                acc.push({
                    url: `/${breadcrumbLevels[0]}/${breadcrumbLevel}.html?q=${breadcrumbLevels[0]}+${breadcrumbLevel}`,
                    name: breadcrumbLevel
                });
                break;
            default:
                acc.push({ name: breadcrumbLevel, url: '/' });
            }

            return acc;
        }, []);

        const breadcrumbs = [
            breadcrumbsMapped[1],
            breadcrumbsMapped[0],
            {
                url: '/',
                name: __('Home')
            }
        ];

        updateBreadcrumbs(breadcrumbs);
    }

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
