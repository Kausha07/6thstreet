import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Image from 'Component/Image';
import { ReturnItemType, ReturnResolutionType } from 'Type/API';

import { formatPrice } from '../../../packages/algolia-sdk/app/utils/filters';

import './MyAccountReturnCreateItem.style';

export class MyAccountReturnCreateItem extends PureComponent {
    static propTypes = {
        isSelected: PropTypes.bool.isRequired,
        onResolutionChange: PropTypes.func.isRequired,
        onReasonChange: PropTypes.func.isRequired,
        reasonOptions: PropTypes.array.isRequired,
        onClick: PropTypes.func.isRequired,
        resolutions: PropTypes.arrayOf(ReturnResolutionType).isRequired,
        item: ReturnItemType.isRequired,
        displayDiscountPercentage: PropTypes.bool.isRequired,
        reasonId: PropTypes.string
    };

    static defaultProps = {
        fixedPrice: false,
        displayDiscountPercentage: true
    };

    renderResolutions() {
        const {
            item: { item_id },
            isSelected,
            onResolutionChange,
            resolutions
        } = this.props;
        if (!isSelected) {
            return null;
        }

        return (
            <Field
                type="select"
                id={`${item_id}_resolution`}
                name={`${item_id}_resolution`}
                placeholder={__('Select a resolution')}
                mix={{ block: 'MyAccountReturnCreateItem', elem: 'Resolutions' }}
                onChange={onResolutionChange}
                selectOptions={resolutions}
            />
        );
    }

    renderReasons() {
        const {
            item: { item_id },
            isSelected,
            onReasonChange,
            reasonOptions
        } = this.props;

        if (!isSelected) {
            return null;
        }

        return (
            <Field
                type="select"
                id={`${item_id}_reason`}
                name={`${item_id}_reason`}
                placeholder={__('Select a reason')}
                mix={{ block: 'MyAccountReturnCreateItem', elem: 'Reasons' }}
                onChange={onReasonChange}
                selectOptions={reasonOptions}
            />
        );
    }

    renderImage() {
        const { item: { thumbnail } } = this.props;

        return (
            <Image lazyLoad={true}
                src={thumbnail}
                mix={{ block: 'MyAccountReturnCreateItem', elem: 'Image' }}
            />
        );
    }

    renderField(type) {
        const { item: { item_id, is_returnable } } = this.props;
        const { onClick } = this.props;
        return (
            <Field
                id={item_id}
                name={item_id}
                value={item_id}
                mix={{ block: 'MyAccountReturnCreateItem', elem: 'Checkbox' }}
                type="checkbox"
                onClick={onClick}
                defaultChecked={false}
                disabled={type === "RETURN" && !is_returnable}
            />
        );
    }

    renderDetails() {
        const {
            displayDiscountPercentage,
            item: {
                name,
                color,
                row_total,
                discount_percent,
                discount_amount,
                size: sizeField,
                qty_shipped,
                product_options: { info_buyRequest: { qty } }
            }
        } = this.props;
        const size = typeof sizeField === 'string' ? sizeField : (sizeField || {}).value;
        return (
            <div block="MyAccountReturnCreateItem" elem="Details">
                <h2>{name}</h2>
                <div block="MyAccountReturnCreateItem" elem="DetailsOptions">
                    {!!color && (
                        <p>
                            {__('Color: ')}
                            <span>{color}</span>
                        </p>
                    )}
                    {!!qty_shipped && (
                        <p>
                            {__('Qty: ')}
                            <span>{+qty_shipped}</span>
                        </p>
                    )}
                    {!!size && (
                        <p>
                            {__('Size: ')}
                            <span>{size}</span>
                        </p>
                    )}
                </div>
                <p block="MyAccountReturnCreateItem" elem="Price">
                    <span
                        block="MyAccountReturnCreateItem"
                        elem="PriceRegular"
                        mods={{ isDiscount: (!!(+discount_amount) && !!(+discount_percent)) }}
                    >
                        {`${formatPrice(+row_total)}`}
                    </span>
                    {(!!(+discount_amount) && !!(+discount_percent)) && (
                        <>
                            {
                                displayDiscountPercentage &&
                                <span block="MyAccountReturnCreateItem" elem="PriceDiscountPercent">
                                    {`(-${+discount_percent}%)`}
                                </span>
                            }
                            <span block="MyAccountReturnCreateItem" elem="PriceDiscount">
                                {`${formatPrice(+row_total - +discount_amount)}`}
                            </span>
                        </>
                    )}
                </p>
            </div>
        );
    }

    render() {
        const { isSelected } = this.props;
        return (
            <div block="MyAccountReturnCreateItem">
                <div block="MyAccountReturnCreateItem" elem="Content">
                    {this.renderField({
                        type: 'RETURN'
                    })}
                    {this.renderImage()}
                    {this.renderDetails()}
                </div>
                {isSelected && (
                    <div block="MyAccountReturnCreateItem" elem="Resolution">
                        {/* { this.renderResolutions() } */}
                        {this.renderReasons()}
                    </div>
                )}
            </div>
        );
    }
}

export default MyAccountReturnCreateItem;
