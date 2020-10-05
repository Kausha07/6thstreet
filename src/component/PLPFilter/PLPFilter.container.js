/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { Filter } from 'Util/API/endpoint/Product/Product.type';
import WebUrlParser from 'Util/API/helper/WebUrlParser';

import PLPFilter from './PLPFilter.component';

export const mapStateToProps = (_state) => ({});

export const mapDispatchToProps = (_dispatch) => ({
    toggleOverlayByKey: (key) => _dispatch(toggleOverlayByKey(key))
});

class PLPFilterContainer extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired
    };

    containerFunctions = {
        onSelect: this.onSelect.bind(this)
    };

    onSelect(value) {
        const { filter: { category } } = this.props;

        WebUrlParser.setParam(category, value);
    }

    containerProps = () => {
        const { filter } = this.props;

        return { filter };
    };

    render() {
        return (
            <PLPFilter
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLPFilterContainer);
