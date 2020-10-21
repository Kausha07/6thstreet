/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import PDPDetailsSection from 'Component/PDPDetailsSection';
import PDPMainSection from 'Component/PDPMainSection';
import { Product } from 'Util/API/endpoint/Product/Product.type';

// import WebUrlParser from 'Util/API/helper/WebUrlParser';
// import browserHistory from 'Util/History';
import './PDP.style';

class PDP extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        product: Product.isRequired,
        setGender: PropTypes.func.isRequired
    };

    state = {
        categoryLevels: {},
        firstLoad: true
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
        const { updateBreadcrumbs, product: { categories, name }, setGender } = this.props;
        const { categoryLevels } = this.state;
        console.log(categories, setGender, categoryLevels);
        const categoriesLastLevel = categories[Object.keys(categories)[Object.keys(categories).length - 1]][0]
            .split(' /// ');

        // categoriesLastLevel.map((categoryLevel) => {
        //     const { categoryLevels } = this.state;

        //     this.setState({
        //         categoryLevels: {
        //             ...categoryLevels,
        //             name: categoryLevel
        //         }
        //     });

        //     return categoryLevels;
        // });

        const breadcrumbsMapped = categoriesLastLevel.reduce((acc, categoryLevel) => {
            console.log(categoryLevel);
            switch (categoryLevel) {
            case categoriesLastLevel[0]:
                acc.push({ name: categoryLevel, url: '/' });
                break;
            case categoriesLastLevel[1]:
                // eslint-disable-next-line max-len
                acc.push({ name: categoryLevel, url: `/${categoriesLastLevel[0]}/${categoryLevel}.html?q=${categoriesLastLevel[0]}+${categoryLevel}` });
                break;
            case categoriesLastLevel[2]:
                acc.push({
                    name: categoryLevel,
                    url: `/${categoriesLastLevel[0]}/${categoriesLastLevel[1]}.html?q=${categoriesLastLevel[0]}+${categoriesLastLevel[1]}`
                });
                break;
            default:
                acc.push({ name: categoryLevel, url: '/' });
            }

            return acc;
        }, []);

        console.log(breadcrumbsMapped);
        this.setState({ categoryLevels: breadcrumbsMapped });
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
