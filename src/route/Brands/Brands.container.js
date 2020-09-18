import { PureComponent } from 'react';

import { groupByName } from 'Util/API/endpoint/Brands/Brands.endpoint';
import Algolia from 'Util/API/provider/Algolia';

// import PropTypes from 'prop-types';
import Brands from './Brands.component';

class BrandsContainer extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    state = {
        brands: {},
        isLoading: true
    };

    constructor(props) {
        super(props);

        this.requestBrands();
    }

    async requestBrands() {
        const brands = await Algolia.getBrands('kids'); // one of women, men, kids

        this.setState({
            brands: groupByName(brands),
            isLoading: false
        });
    }

    containerProps = () => {
        const { brands, isLoading } = this.state;

        return {
            brands,
            isLoading
        };
    };

    render() {
        return (
            <Brands
              { ...this.containerProps() }
            />
        );
    }
}

export default BrandsContainer;
