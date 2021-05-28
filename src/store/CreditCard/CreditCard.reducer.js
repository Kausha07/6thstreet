import {
    SET_SAVED_CARDS,
    SET_SAVED_CARDS_LOADING
} from './CreditCard.action';

export const getInitialState = () => ({
    savedCards: [],
    loadingSavedCards: false
});

export const CreditCardReducer = (state = getInitialState(), action) => {
    const { type } = action;

    switch (type) {
        case SET_SAVED_CARDS:
            const { savedCards } = action;

            return {
                ...state,
                savedCards
            };
        case SET_SAVED_CARDS_LOADING:
            const { loading: loadingSavedCards } = action;

            return {
                ...state,
                loadingSavedCards
            };

        default:
            return state;
    }
};

export default CreditCardReducer;
