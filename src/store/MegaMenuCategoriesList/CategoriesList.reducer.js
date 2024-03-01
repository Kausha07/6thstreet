import { SET_MEGAMENU_CATEGORIES_LIST } from './CategoriesList.action';

export const getInitialState = () => ({
    isLoading: true,
    categories: []
});

const CategoriesListReducer = (state = getInitialState(), action) => {
    const { type, categories } = action;

    switch (type) {
    case SET_MEGAMENU_CATEGORIES_LIST:
        console.log("test kiran reducer",categories);
        return {
            ...state,
            isLoading: false,
            categories
        };

    default:
        return state;
    }
};

export default CategoriesListReducer;
