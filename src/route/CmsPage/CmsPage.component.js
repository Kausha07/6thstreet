import Html from "Component/Html";
import { CmsPage as SourceCmsPage } from "SourceRoute/CmsPage/CmsPage.component";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import "./CmsPage.extended.style";

export class CmsPage extends SourceCmsPage {
  state = {
    isArabic: isArabic(),
    isMobile: isMobile.any(),
  };

  renderTitle() {
    if (location.pathname.match(/faq/)) {
      return "FAQ";
    } else if (location.pathname.match(/shipping-policy/)) {
      return "Shipping Policy";
    } else {
      return "Return Policy";
    }
  }

  renderCloseButton() {
    const { isArabic } = this.state;
    const { history } = this.props;

    if (location.href.match(/source=mobileApp/)) {
      return null
    }
    return (
      <button
        elem="Button"
        block="MyAccountMobileHeader"
        onClick={() => history.goBack()}
        mods={{ isArabic }}
      />
    );
  }

  shouldUrlRewritesHaveNoPadding() {
    const UrlRewrites = document.getElementById("UrlRewrites");
    UrlRewrites.classList.add("noPadding");
  }
  renderContent() {
    const {
      isLoading,
      page: { content },
      location: { pathname = "" },
    } = this.props;
    const { isMobile } = this.state;

    if (isLoading) {
      return (
        <>
          <div block="CmsPage" elem="SectionPlaceholder" />
          <div block="CmsPage" elem="SectionPlaceholder" />
          <div block="CmsPage" elem="SectionPlaceholder" />
        </>
      );
    }

    if (!isLoading && !content) {
      return null;
    }

    const tws = document.createElement("html");
    tws.innerHTML = content;

    const textChild = tws.lastChild.firstChild.firstChild.firstChild;
    const result = String(textChild.innerHTML)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
    const cmsBlock = pathname.slice(1);
    const toggleArr = document.querySelectorAll(".faq-page-toggle") || [];

    if (toggleArr && toggleArr.length > 0) {
      toggleArr.forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
          const label = e.target.nextSibling;
          const fieldsetContainer = e.target.nextSibling.nextSibling;
          label.classList.toggle("open");
          fieldsetContainer.classList.toggle("open");
        });
      });
    }

    return (
      <div block={cmsBlock}>
        {this.shouldUrlRewritesHaveNoPadding()}
        {isMobile ? (
          <div block="MyAccountMobileHeader" elem="TabOptionHeader">
            {this.renderCloseButton()}
            <h1 block="MyAccountMobileHeader" elem="Heading">
              {this.renderTitle()}
            </h1>
          </div>
        ) : null}
        <Html content={result} />
      </div>
    );
  }
}
export default CmsPage;
