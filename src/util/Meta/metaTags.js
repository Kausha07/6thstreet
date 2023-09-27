import { Helmet } from "react-helmet";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";

export const renderDynamicMetaTags = (imageUrl, alt) => {
  const pageLocation = new URL(window.location.href);
  const pageUrl = pageLocation.pathname
    ? `${pageLocation.origin}${pageLocation.pathname}`
    : pageLocation.origin;
  const locale = `${getLanguageFromUrl()}_${getCountryFromUrl()}`;

  return (
    <Helmet>
      {locale && <meta property="og:locale" content={locale} />}
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="6thStreet" />
      <meta
        property="og:image"
        content={
          imageUrl
            ? imageUrl
            : `${process.env.PUBLIC_URL}/assets/icons/social_icon.png`
        }
      />
      <meta
        property="og:image:secure_url"
        content={
          imageUrl
            ? imageUrl
            : `${process.env.PUBLIC_URL}/assets/icons/social_icon.png`
        }
      />
      <meta property="og:image:alt" content={alt ? alt : "6thStreet"} />
      {/* <!-- 600x315 Image for Facebook --> */}
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="314" />
      <meta property="fb:app_id" content="398555733971261" />
      <meta property="og:image:width" content="166" />
      <meta property="og:image:height" content="26" />
      {/* <!-- 180x110 Image for Linkedin --> */}
      <meta property="og:image:width" content="180" />
      <meta property="og:image:height" content="110" />
      {/* <!-- Twitter --> */}
      <meta
        property="twitter:card"
        content={
          imageUrl
            ? imageUrl
            : `${process.env.PUBLIC_URL}/assets/icons/social_icon.png`
        }
      />
      <meta name="twitter:site" content="@shop6thstreet " />
      <meta name="twitter:creator" content="@shop6thstreet " />
      <meta property="twitter:url" content={pageUrl} />
      <meta
        property="twitter:image"
        content={
          imageUrl
            ? imageUrl
            : `${process.env.PUBLIC_URL}/assets/icons/social_icon.png`
        }
      />
    </Helmet>
  );
};
