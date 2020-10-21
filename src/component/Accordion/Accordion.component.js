import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { ChildrenType, MixType } from 'Type/Common';

import './Accordion.style';

export class Accordion extends PureComponent {
    static propTypes = {
        title: PropTypes.oneOf([
            PropTypes.string,
            PropTypes.element
        ]).isRequired,
        children: ChildrenType.isRequired,
        shortDescription: PropTypes.oneOf([
            PropTypes.string,
            PropTypes.element
        ]),
        mix: MixType
    };

    static defaultProps = {
        shortDescription: null,
        mix: null
    };

    state = {
        isExpanded: false
    };

    toggleAccordion = () => this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));

    renderHeading() {
        const { title } = this.props;
        const { isExpanded } = this.state;

        return (
            <div block="Accordion" elem="Heading">
                { typeof title === 'string' && <h3>{ title }</h3> }
                { typeof title !== 'string' && title }
                <button
                  block="Accordion"
                  elem="Expand"
                  mods={ { isExpanded } }
                  onClick={ this.toggleAccordion }
                >
                    +
                </button>
            </div>
        );
    }

    renderShortDescription() {
        const { shortDescription } = this.props;

        if (!shortDescription) {
            return null;
        }

        if (typeof shortDescription === 'string') {
            return <p block="Accordion" elem="ShortDescription">{ shortDescription }</p>;
        }

        return shortDescription;
    }

    render() {
        const { mix, children } = this.props;
        const { isExpanded } = this.state;

        return (
            <div block="Accordeon" mix={ mix }>
                { this.renderHeading() }
                { this.renderShortDescription() }
                { isExpanded && children }
            </div>
        );
    }
}

export default Accordion;
