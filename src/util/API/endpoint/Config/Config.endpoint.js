import CDN from '../../provider/CDN';
import { indexConfig } from './Config.format';

// eslint-disable-next-line import/prefer-default-export
export const getConfig = () => {
    const configFile = 'default.json';
    const directory = process.env.REACT_APP_REMOTE_CONFIG_DIR;
    return indexConfig(CDN.get(`${directory}/${configFile}`));
};
