import { getStore } from "Store";
import CDN from "../../provider/CDN";

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

  const templateParams =
    {
      $LOCALE: locale,
      $GENDER: gender,
      ...TemplateParamsOverride,
    } || {};

  const template = staticFiles[key];

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
    const res = await CDN.get(pathname);
    if (res.data) {
      return res.data;
    } else if (res === "Something Went Wrong") {
      throw new Error(res);
    } else if (res === "هناك خطأ ما!") {
      throw new Error(res);
    }

    return res;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
