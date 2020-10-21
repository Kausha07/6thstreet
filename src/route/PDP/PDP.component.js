/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import PDPDetailsSection from 'Component/PDPDetailsSection';
import PDPMainSection from 'Component/PDPMainSection';
import { Product } from 'Util/API/endpoint/Product/Product.type';

// import browserHistory from 'Util/History';
import './PDP.style';

class PDP extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        product: Product.isRequired,
        setGender: PropTypes.func.isRequired,
        categories: PropTypes.array.isRequired
    };

    state = {
        firstLoad: true,
        productBreadcrumbs: []
    };

    componentDidUpdate() {
        const { product } = this.props;
        const { firstLoad } = this.state;

        if (Object.keys(product).length !== 0 && firstLoad) {
            this.updateBreadcrumbs();
            this.updateHeaderState();
        }
    }

    updateHeaderState() {
        const { changeHeaderState } = this.props;

        changeHeaderState({
            name: DEFAULT_STATE_NAME,
            isHiddenOnMobile: true
        });
    }

    updateBreadcrumbs() {
        const {
            updateBreadcrumbs,
            product: { categories, name },
            setGender,
            categories: menuCategories
        } = this.props;
        const categoriesLastLevel = categories[Object.keys(categories)[Object.keys(categories).length - 1]][0]
            .split(' /// ');

        const subcategory = menuCategories.reduce((acc, category) => {
            if (category.label === categoriesLastLevel[1]) {
                const activeSubcategory = category.data[2].items.reduce((acc, subcategory) => {
                    if (subcategory.label === categoriesLastLevel[2]) {
                        acc.push(subcategory);
                    }

                    return acc;
                }, []);

                acc.push(activeSubcategory[0]);
            }

            return acc;
        }, []);

        const breadcrumbsMapped = categoriesLastLevel.reduce((acc, categoryLevel) => {
            switch (categoryLevel) {
            case categoriesLastLevel[0]:
                acc.push({
                    url: '/',
                    name: categoryLevel,
                    onClick: setGender
                });
                break;
            case categoriesLastLevel[1]:
                acc.push({
                    url: `/${categoriesLastLevel[0]}/${categoryLevel}.html?q=${categoriesLastLevel[0]}+${categoryLevel}`,
                    name: categoryLevel
                });
                break;
            case categoriesLastLevel[2]:
                acc.push({
                    url: subcategory[0].link,
                    name: categoryLevel
                });
                break;
            default:
                acc.push({ name: categoryLevel, url: '/' });
            }

            return acc;
        }, []);

        const breadcrumbs = [
            {
                url: '',
                name: __(name)
            },
            breadcrumbsMapped[2],
            breadcrumbsMapped[1],
            breadcrumbsMapped[0],
            {
                url: '/',
                name: __('Home')
            }
        ];

        this.setState({ productBreadcrumbs: breadcrumbs });

        updateBreadcrumbs(breadcrumbs);
        this.setState({ firstLoad: false });
    }

    renderMainSection() {
        return (
            <PDPMainSection />
        );
    }

    renderDetailsSection() {
        return (
            <PDPDetailsSection />
        );
    }

    render() {
        console.log(this.state);
        return (
            <div block="PDP">
                { this.renderMainSection() }
                { this.renderDetailsSection() }
            </div>
        );
    }
}

export default PDP;
