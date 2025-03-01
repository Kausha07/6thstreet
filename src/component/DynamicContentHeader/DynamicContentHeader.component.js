import cx from 'classnames';
import PropTypes from 'prop-types';
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
import { PureComponent } from 'react';
import './DynamicContentHeader.style';

class DynamicContentHeader extends PureComponent {
    static propTypes = {

    };

    isTrendingWidgetexist = () => {
        const { type = "" } = this.props;
        const newTrendingWidget = ["vue_brands_for_you","vue_categories_for_you"];
        if(type !== "" && !newTrendingWidget.includes(type)) {
            return true;
        }else{
            return false;
        }
    }

    render() {
        let titleStyle = ""
        if (this.props?.header?.title_color) {
            titleStyle = {
                color: this.props.header.title_color
            };
        }

        if(isArabic() && isMobile.any() && !this.isTrendingWidgetexist()) {
            titleStyle = {
                ...titleStyle,
                textAlign: 'right',
            }
        }

        return (
            <div block="DynamicContentHeader">
               {this.props?.header?.title && <h1 block={ cx('foo', { baz: true }) } style={ (this.props?.header?.title_color || isArabic() && isMobile.any() && !this.isTrendingWidgetexist()) ? titleStyle : {} }>{ this.props?.header?.title }</h1>}
               {this.isTrendingWidgetexist() ? this.props?.header?.subtitle && <p block="">{ this.props?.header?.subtitle }</p> : ""}
               {this.isTrendingWidgetexist() ? this.props?.header?.button_link && <a href={this.props?.header?.button_link} block="">{this.props?.header?.button_label}</a> : ""}

            </div>
        );
    }
}

export default DynamicContentHeader;
