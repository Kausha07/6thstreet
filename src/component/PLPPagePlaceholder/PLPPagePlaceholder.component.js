import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import './PLPPagePlaceholder.style';

class PLPPagePlaceholder extends PureComponent {
    static propTypes = {
        onVisibilityChange: PropTypes.func.isRequired
    };

    renderPlaceholder = (_, index) => (
        <div
          block="PLPPagePlaceholder"
          elem="Section"
          key={ index }
        />
    );

    renderPlaceholders() {
        return Array.from({ length: 12 }, this.renderPlaceholder);
    }

    render() {
        const { onVisibilityChange } = this.props;

        return (
            <VisibilitySensor
              delayedCall
              partialVisibility={ ['top', 'bottom'] }
              minTopValue="1"
              onChange={ onVisibilityChange }
            >
                <div block="PLPPagePlaceholder">
                    { this.renderPlaceholders() }
                </div>
            </VisibilitySensor>
        );
    }
}

export default PLPPagePlaceholder;
