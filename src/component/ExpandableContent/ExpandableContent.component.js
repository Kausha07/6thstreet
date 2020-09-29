import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { ChildrenType } from 'Type/Common';

import './ExpandableContent.style';

export class ExpandableContent extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        header: PropTypes.string.isRequired,
        children: ChildrenType.isRequired
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

    render() {
        const { header, children } = this.props;
        const { isOpen } = this.state;

        return (
            <div mix={ { block: 'ExpandableContent' } }>
                <div mix={ { block: 'ExpandableContent', elem: 'HeaderBlock' } }>
                    <span mix={ { block: 'ExpandableContent', elem: 'Header' } }>{ header }</span>
                    <div
                      mix={ { block: 'ExpandableContent', elem: 'Button', mods: { isOpen } } }
                      role="button"
                      aria-label="Open"
                      tabIndex={ 0 }
                      onClick={ this.handleClick }
                      onKeyDown={ this.handleClick }
                    />
                </div>
                <div mix={ { block: 'ExpandableContent', elem: 'Body', mods: { isOpen } } }>
                    { children }
                </div>
            </div>
        );
    }
}

export default ExpandableContent;
