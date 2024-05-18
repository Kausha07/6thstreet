import CDN from '../../provider/CDN';
import MobileAPI from '../../provider/MobileAPI';
import { indexConfig } from './Config.format';

// eslint-disable-next-line import/prefer-default-export
export const getConfig = () => {
    const configFile = 'default.json';
    const directory = process.env.REACT_APP_REMOTE_CONFIG_DIR;
    return indexConfig(CDN.get(`${directory}/${configFile}`));
};

export const getSchema = (locale) => {
    const configFile = 'schema.json';
    const directory = process.env.REACT_APP_REMOTE_CONFIG_DIR;
    if (!!!locale) {
        return CDN.get(`${directory}/seo/${configFile}`);
    }
    return CDN.get(`${directory}/seo/${locale}/${configFile}`);
};

export const getCities = () => MobileAPI.get(
    '/cities',
) || {};

export const getBottomNavigationConfig = () => {
    const configFile = 'bottom_tab.json';
    const directory = process.env.REACT_APP_BOTTOM_NAVIGATION_CONFIG_DIR;
    return indexConfig(CDN.get(`${directory}/${configFile}`));
}

export const getABTestingConfig = () => {
  try {
    const configFile = "abtestConfig.json";
    const directory = process.env.REACT_APP_REMOTE_CONFIG_DIR;
    const abTestConfigResponse = CDN.get(`${directory}/${configFile}`);
    return abTestConfigResponse;
  } catch (error) {
    console.error("Error fetching homepage personalisation config file", error);
    return null;
  }
};
