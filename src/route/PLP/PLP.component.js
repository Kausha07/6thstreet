/* eslint-disable max-len */
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
        filters: Filters.isRequired,
        options: PropTypes.object.isRequired
    };

    componentDidUpdate() {
        this.updateBreadcrumbs();
        this.updateHeaderState();
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    updateHeaderState() {
        const { changeHeaderState } = this.props;

        changeHeaderState({
            name: DEFAULT_STATE_NAME,
            isHiddenOnMobile: true
        });
    }

    updateBreadcrumbs() {
        const { options: { categories_without_path, q } } = this.props;
        const breadcrumbLevels = window.location.pathname.split('.html')[0]
            .substring(1)
            .split('/');

        console.log(breadcrumbLevels, categories_without_path);
        if (q) {
            const {
                updateBreadcrumbs, setGender
            } = this.props;

            if (breadcrumbLevels.length === 1) {
                const breadcrumbs = [
                    {
                        url: `/${breadcrumbLevels[0]}.html?q=${breadcrumbLevels[0]}`,
                        name: __(breadcrumbLevels[0].replace(/-/g, ' '))
                    },
                    {
                        url: '/',
                        name: __('Home')
                    }
                ];

                updateBreadcrumbs(breadcrumbs);
            } else {
                // const selectedSubcategories = breadcrumbLevels[2] ? breadcrumbLevels[2] : 0;
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

                // eslint-disable-next-line no-magic-numbers
                const breadcrumbs = breadcrumbLevels.length === 3 ? [
                    {
                        url: '/',
                        name: __(breadcrumbLevels[2].replace(/-/g, ' '))
                    },
                    breadcrumbsMapped[1],
                    breadcrumbsMapped[0],
                    {
                        url: '/',
                        name: __('Home')
                    }
                ] : [
                    breadcrumbsMapped[1],
                    breadcrumbsMapped[0],
                    {
                        url: '/',
                        name: __('Home')
                    }
                ];

                updateBreadcrumbs(breadcrumbs);
            }
        }
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
