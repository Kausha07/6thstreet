import cx from 'classnames';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './DynamicContentHeader.style';

class DynamicContentHeader extends PureComponent {
    static propTypes = {

    };

    render() {
        if (this.props.title_color) {
            const titleStyle = {
                color: this.props.title_color
            };
        }

        return (
            <div block="DynamicContentHeader">
                <h1 block={ cx('foo', { baz: true }) } style={ this.props.title_color && titleStyle }>{ this.props.title }</h1>
                <h3 block="">{ this.props.subtitle }</h3>

            </div>
        );
    }
}

export default DynamicContentGrid;
