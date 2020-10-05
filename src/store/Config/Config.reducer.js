import {
    ConfigReducer as sourceConfigReducer,
    filterStoreConfig,
    initialState as SourceInitialState,
    MAX_HEIGHT,
    MAX_WIDTH
} from 'SourceStore/Config/Config.reducer';

import countries from './countries.json';

export {
    MAX_WIDTH,
    MAX_HEIGHT,
    filterStoreConfig
};

export const initialState = {
    ...SourceInitialState,
    countries
};
export const ConfigReducer = (
    state = initialState,
    action
) => sourceConfigReducer(state, action);

export default ConfigReducer;
