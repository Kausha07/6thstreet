import {
    initialState as sourceInitialState,
    MetaReducer as sourceMetaReducer,
    updateEveryTime as sourceUpdateEveryTime
} from 'SourceStore/Meta/Meta.reducer';

export const updateEveryTime = [
    ...sourceUpdateEveryTime,
    'hreflangs'
];

export const initialState = {
    ...sourceInitialState,
    hreflangs: []
};

export const MetaReducer = (
    state = initialState,
    action
) => sourceMetaReducer(state, action);

export default MetaReducer;
