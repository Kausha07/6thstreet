import PropTypes from 'prop-types';
import { PureComponent } from 'react';

// import DynamicContent from 'Component/DynamicContent';
import { CategoryData } from 'Util/API/endpoint/Categories/Categories.type';

import './MenuCategory.style';

class MenuCategory extends PureComponent {
    static propTypes = {
        data: CategoryData.isRequired,
        label: PropTypes.string.isRequired
        // TODO: implement design
        // design: Design.isRequired
    };

    renderDynamicContent() {
        const { data } = this.props;

        console.log(data);

        return 'dynamic content';

        // return (
        //     <DynamicContent
        //       content={ data }
        //     />
        // );
    }

    renderLabel() {
        const { label } = this.props;
        return label;
    }

    render() {
        return (
            <div block="MenuCategory">
                { this.renderLabel() }
                { this.renderDynamicContent() }
            </div>
        );
    }
}

export default MenuCategory;
