import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import DynamicContent from 'Component/DynamicContent';
import LoginBlockContainer from 'Component/LoginBlock';
import { DynamicContent as DynamicContentType } from 'Util/API/endpoint/StaticFiles/StaticFiles.type';

import './HomePage.style';

class HomePage extends PureComponent {
    static propTypes = {
        dynamicContent: DynamicContentType.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    componentDidUpdate() {
        const DynamicContent = document.getElementsByClassName('DynamicContent')[0];

        if (DynamicContent) {
            const { children = [] } = DynamicContent;
            const { href } = location;
            console.log(href);
            if (children) {
                // eslint-disable-next-line
                for (let i=0; i < children.length; i++) {
                    if (children[i].nodeName === 'HR') {
                        children[i].style.backgroundColor = '#EFEFEF';
                        children[i].style.height = '1px';
                    } else if (
                        children[i].className === 'DynamicContentBanner'
                        && children[i].children[0]
                        && children[i].children[0].href !== `${href}#`
                    ) {
                        children[i].style.maxHeight = `${children[i].dataset.maxHeight}px`;
                        children[i].style.maxWidth = `${children[i].dataset.maxWidth}px`;
                        children[i].style.display = 'inline-block';
                    }
                }
            }
        }
    }

    renderDynamicContent() {
        const { dynamicContent } = this.props;

        return (
            <DynamicContent
              content={ dynamicContent }
            />
        );
    }

    renderLoginBlock() {
        return (<LoginBlockContainer />);
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
