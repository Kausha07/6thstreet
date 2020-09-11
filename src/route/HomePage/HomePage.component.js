// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import DynamicContent from 'Component/DynamicContent';
import { DynamicContent as DynamicContentType } from 'Util/API/endpoint/StaticFiles/StaticFiles.type';

import './HomePage.style';

class HomePage extends PureComponent {
    static propTypes = {
        dynamicContent: DynamicContentType.isRequired
    };

    renderDynamicContent() {
        const { dynamicContent } = this.props;

        return (
            <DynamicContent
              content={ dynamicContent }
            />
        );
    }

    render() {
        return (
            <main block="HomePage">
                { this.renderDynamicContent() }
            </main>
        );
    }
}

export default HomePage;
