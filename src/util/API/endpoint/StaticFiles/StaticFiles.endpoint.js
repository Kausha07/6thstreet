import { getStore } from "Store";
// import CDN from "../../provider/CDN";
import ThirdPartyAPI from "../../provider/ThirdPartyAPI";
import { getLocaleFromUrl } from "Util/Url/Url";
import { getConfig } from "Util/API/endpoint/Config/Config.endpoint";

// eslint-disable-next-line import/prefer-default-export
export const getStaticFile = async (key, TemplateParamsOverride = {}) => {
  if (!key) {
    throw new Error("Can not load static file, KEY is not specified.");
  }

  const {
    AppConfig: {
      config: { static_files: staticFiles },
    },
    AppState: { locale, gender },
  } = getStore().getState();
  const config = await getConfig();
  const { static_files: customConfig } = config;
  const customLocale = getLocaleFromUrl();

  const templateParams =
    {
      $LOCALE: locale ? locale : customLocale,
      $GENDER: gender,
      ...TemplateParamsOverride,
    } || {};

  const template = staticFiles ? staticFiles[key] : customConfig[key];

  if (!template) {
    throw new Error(
      `Can not load static file, template was not found for key ${key}.`
    );
  }

  // This replaces string in the template, i.e. `$LOCALE` to `locale` variable
  const url = Object.keys(templateParams).reduce(
    (acc, value) => acc.replace(value, templateParams[value]),
    template
  );

  const { pathname } = new URL(url);

  try {
    // replaced CDN to ThirdPartyAPI to bypass proxy
    const res = await ThirdPartyAPI.get(url);
    if (res.data) {
      return res.data;
    } else if (res === "Something Went Wrong") {
      throw new Error(res);
    } else if (res === "هناك خطأ ما!") {
      throw new Error(res);
    }

    return res;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
