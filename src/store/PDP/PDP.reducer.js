// TODO update this import when renamed
import {
    SET_PDP_DATA,
    SET_PDP_GALLERY_IMAGE_INDEX,
    SET_PDP_LOADING
} from './PDP.action';

export const getInitialState = () => ({
    product: {},
    options: {},
    imageIndex: 0, // positive numbers - gallery, negative numbers - special cases, i.e. video = -1
    isLoading: true
});

export const PDPReducer = (state = getInitialState(), action) => {
    const { type } = action;

    switch (type) {
    case SET_PDP_DATA:
        const {
            response: {
                data: product = {},
                nbHits
            },
            options = {}
        } = action;

        return {
            ...state,
            imageIndex: 0,
            product,
            options,
            nbHits
        };

    case SET_PDP_GALLERY_IMAGE_INDEX:
        const { imageIndex } = action;

        return {
            ...state,
            imageIndex
        };

    case SET_PDP_LOADING:
        const { isLoading } = action;

        return {
            ...state,
            isLoading
        };

    default:
        return state;
    }
};

export default PDPReducer;
