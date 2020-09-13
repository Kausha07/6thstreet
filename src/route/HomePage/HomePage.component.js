import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import DynamicContent from 'Component/DynamicContent';
import { DynamicContent as DynamicContentType } from 'Util/API/endpoint/StaticFiles/StaticFiles.type';

import './HomePage.style';

class HomePage extends PureComponent {
    static propTypes = {
        dynamicContent: DynamicContentType.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderDynamicContent() {
        const { dynamicContent } = this.props;

        return (
            <DynamicContent
              content={ dynamicContent }
            />
        );
    }

    renderLoading() {
        return 'loading ...';
    }

    renderContent() {
        const { isLoading } = this.props;

        if (isLoading) {
            return this.renderLoading();
        }

        return this.renderDynamicContent();
    }

    render() {
        return (
            <main block="HomePage">
                { this.renderContent() }
            </main>
        );
    }
}

export default HomePage;
