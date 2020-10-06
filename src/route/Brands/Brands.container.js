import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import { HistoryType, LocationType } from 'Type/Common';
import { groupByName } from 'Util/API/endpoint/Brands/Brands.format';
import Algolia from 'Util/API/provider/Algolia';
import { getQueryParam, setQueryParams } from 'Util/Url';

import Brands from './Brands.component';
import { TYPES_ARRAY } from './Brands.config';

class BrandsContainer extends PureComponent {
    static propTypes = {
        history: HistoryType.isRequired,
        location: LocationType.isRequired
    };

    state = {
        brands: {},
        isLoading: true
    };

    containerFunctions = {
        changeBrandType: this.changeBrandType.bind(this)
    };

    componentDidMount() {
        const brandUrlParam = getQueryParam('type', location);
        const brandType = TYPES_ARRAY.includes(brandUrlParam) ? brandUrlParam
            : '';

        this.requestBrands(brandType);
    }

    changeBrandType(brandUrlParam) {
        const { location, history } = this.props;
        const brandType = TYPES_ARRAY.includes(brandUrlParam) ? brandUrlParam
            : '';

        setQueryParams({ type: brandType }, location, history);
        this.requestBrands(brandType);
    }

    requestBrands(brandType = '') {
        this.setState({ isLoading: true });

        this._brandRequest = Algolia.getBrands(brandType).then((data) => {
            this.setState({
                brands: groupByName(data),
                isLoading: false
            });
        }).catch((error) => console.error(error));
    }

    containerProps = () => {
        const { brands, isLoading } = this.state;

        return {
            brands,
            isLoading,
            type: getQueryParam('type', location)
        };
    };

    render() {
        return (
            <Brands
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default withRouter(BrandsContainer);
