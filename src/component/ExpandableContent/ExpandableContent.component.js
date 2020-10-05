import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { ChildrenType } from 'Type/Common';

import './ExpandableContent.style';

export class ExpandableContent extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        header: PropTypes.string.isRequired,
        children: ChildrenType.isRequired,
        isArabic: PropTypes.bool
    };

    static defaultProps = {
        isArabic: false
    };

    constructor(props) {
        super();
        const { isOpen } = props;
        this.state = { isOpen };
    }

    handleClick = () => {
        const { isOpen } = this.state;
        this.setState({ isOpen: !isOpen });
    };

    renderButton() {
        const { isOpen } = this.state;
        const { isArabic } = this.props;

        return (
            <div
              mix={ { block: 'ExpandableContent', elem: 'Button', mods: { isOpen, isArabic } } }
              role="button"
              aria-label="Open"
              tabIndex={ 0 }
              onClick={ this.handleClick }
              onKeyDown={ this.handleClick }
            />
        );
    }

    renderContent() {
        const { isOpen } = this.state;
        const { children, isArabic } = this.props;

        return (
            <div mix={ { block: 'ExpandableContent', elem: 'Body', mods: { isOpen, isArabic } } }>
                { children }
            </div>
        );
    }

    render() {
        const { header, isArabic } = this.props;
        const { isOpen } = this.state;

        return (
            <div mix={ { block: 'ExpandableContent' } }>
                <div mix={ { block: 'ExpandableContent', elem: 'HeaderBlock', mods: { isOpen, isArabic } } }>
                    <span mix={ { block: 'ExpandableContent', elem: 'Header', mods: { isArabic } } }>{ header }</span>
                    { this.renderButton() }
                </div>
                { this.renderContent() }
            </div>
        );
    }
}

export default ExpandableContent;
