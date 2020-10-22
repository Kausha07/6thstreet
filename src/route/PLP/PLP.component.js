/* eslint-disable fp/no-let */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ContentWrapper from 'Component/ContentWrapper/ContentWrapper.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import PLPDetails from 'Component/PLPDetails';
import PLPFilters from 'Component/PLPFilters';
import PLPPages from 'Component/PLPPages';
import { getBreadcrumbs } from 'Util/Breadcrumbs/Breadcrubms';

import './PLP.style';

export class PLP extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        setGender: PropTypes.func.isRequired,
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
        const { options: { categories_without_path, q: query } } = this.props;
        const breadcrumbLevels = location.pathname.split('.html')[0]
            .substring(1)
            .split('/');

        console.log(location);
        console.log(breadcrumbLevels, categories_without_path);
        if (query) {
            const {
                updateBreadcrumbs, setGender
            } = this.props;

            const breadcrumbsMapped = getBreadcrumbs(breadcrumbLevels, setGender);

            // TODO: RENAME IT!
            const test = breadcrumbsMapped.reduce((acc, item) => {
                acc.unshift(item);

                return acc;
            }, []);

            const breadcrumbs = [
                ...test,
                {
                    url: '/',
                    name: __('Home')
                }
            ];

            updateBreadcrumbs(breadcrumbs);
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
