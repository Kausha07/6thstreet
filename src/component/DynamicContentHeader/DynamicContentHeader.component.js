import cx from 'classnames';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import './DynamicContentHeader.style';

class DynamicContentHeader extends PureComponent {
    static propTypes = {

    };

    render() {
        if (this.props.header.title_color) {
            const titleStyle = {
                color: this.props.header.title_color
            };
        }

        return (
            <div block="DynamicContentHeader">
                <h1 block={ cx('foo', { baz: true }) } style={ this.props.header.title_color && titleStyle }>{ this.props.header.title }</h1>
                <p block="">{ this.props.header.subtitle }</p>
                <a href={this.props.header.button_link} block="">{this.props.header.button_label}</a>

            </div>
        );
    }
}

export default DynamicContentHeader;
