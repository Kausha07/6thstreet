import PropTypes from 'prop-types';

export const Price = PropTypes.arrayOf(
    PropTypes.objectOf(
        PropTypes.shape({
            // TODO: implement all
            '6s_base_price': PropTypes.number,
            '6s_special_price': PropTypes.number
        })
    )
);

// eslint-disable-next-line import/prefer-default-export
export const Product = PropTypes.shape({
    brand_name: PropTypes.string,
    name: PropTypes.string,
    sku: PropTypes.string,
    thumbnail_url: PropTypes.string,
    price: Price
});

export const Products = PropTypes.arrayOf(Product);
