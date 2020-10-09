/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';

import {
    FieldInput as SourceFieldInput
} from 'SourceComponent/FieldInput/FieldInput.component';

export class FieldInput extends SourceFieldInput {
    static propTypes = {
        formRef: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.shape({ current: PropTypes.instanceOf(Element) })
        ])
    };

    static defaultProps = {
        formRef: () => {}
    };

    render() {
        const {
            formRef,
            ...validProps
        } = this.props;

        // if (this.fieldRef.current) {
        //     if (this.fieldRef.current.checked) {
        //         console.log('Im checked', formRef);
        //     }
        // }

        return (
            <input
              ref={ formRef }
              { ...validProps }
            />
        );
    }
}

export default FieldInput;
