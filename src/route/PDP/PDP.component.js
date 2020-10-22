/* eslint-disable fp/no-let */
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import PDPDetailsSection from 'Component/PDPDetailsSection';
import PDPMainSection from 'Component/PDPMainSection';
import { Product } from 'Util/API/endpoint/Product/Product.type';
import { getBreadcrumbs } from 'Util/Breadcrumbs/Breadcrubms';

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
        productBreadcrumbs: [],
        subcategory: []
    };

    componentDidUpdate() {
        const { product, categories } = this.props;
        const { firstLoad } = this.state;

        if (Object.keys(product).length !== 0 && firstLoad && categories.length !== 0) {
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
            setGender
        } = this.props;
        const categoriesLastLevel = categories[Object.keys(categories)[Object.keys(categories).length - 1]][0]
            .split(' /// ');

        const breadcrumbsMapped = getBreadcrumbs(categoriesLastLevel, setGender);

        // TODO: RENAME IT!
        const test = breadcrumbsMapped.reduce((acc, item) => {
            acc.unshift(item);

            return acc;
        }, []);

        const breadcrumbs = [
            {
                url: '',
                name: __(name)
            },
            ...test,
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
