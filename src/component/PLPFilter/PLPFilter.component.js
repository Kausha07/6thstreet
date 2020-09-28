// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

// import Field from 'Component/Field';
import { Filter } from 'Util/API/endpoint/Product/Product.type';

import './PLPFilter.style';

class PLPFilter extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired
    //    onSelect: PropTypes.func.isRequired
    };

    myObj: { id: (string | string), label: (string | string), value: (string | string) };

    renderDropDownList() {
        // const { filter } = this.props;
        const { filter: { label } } = this.props;
        // const { label } = Filter;
        // eslint-disable-next-line no-console
        console.log(label);
        // eslint-disable-next-line no-console
        // const { filter: { label } } = this.props;z
        // const { filter: { data } } = this.props;
        // const { filter: { category } } = this.props;
        // const { onSelect } = this.props;
        //
        // // eslint-disable-next-line no-return-assign
        // const template = Object.keys(data).map((item) => (
        //     this.myObj = {
        //         label: data[item].label,
        //         id: data[item].facet_value,
        //         value: data[item].facet_value
        //     }
        // ));

        return (
            <div>
                Hello!
            </div>
        );
    }

    render() {
        return this.renderDropDownList();
    }
}

export default PLPFilter;
