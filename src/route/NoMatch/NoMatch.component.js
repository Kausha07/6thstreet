/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import Image from "Component/Image";

import ContentWrapper from "Component/ContentWrapper";
import { TYPE_NOTFOUND } from "../UrlRewrites/UrlRewrites.config";
import { DEFAULT_STATE_NAME } from "Component/NavigationAbstract/NavigationAbstract.config";

import pageNotFound from "./images/pagenotfound.png";

import "./NoMatch.style.override";

export class NoMatch extends PureComponent {
  static propTypes = {
    updateBreadcrumbs: PropTypes.func.isRequired,
    cleanUpTransition: PropTypes.func.isRequired,
    changeHeaderState: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.updateBreadcrumbs();
    this.updateHeaderState();
    this.cleanUpTransition();
    window.pageType = TYPE_NOTFOUND;
  }

  componentWillUnmount() {
    window.pageType=undefined;
  }

  cleanUpTransition() {
    const { cleanUpTransition } = this.props;

    cleanUpTransition();
  }

  updateHeaderState() {
    const { changeHeaderState } = this.props;

    changeHeaderState({
      name: DEFAULT_STATE_NAME,
      isHiddenOnMobile: true,
    });
  }

  updateBreadcrumbs() {
    const { updateBreadcrumbs } = this.props;
    const breadcrumbs = [
      {
        url: "",
        name: __("Not Found"),
      },
      {
        url: "/",
        name: __("Home"),
      },
    ];

    updateBreadcrumbs(breadcrumbs);
  }

  render() {
    return (
      <main block="NoMatch" aria-label={__("Page not found")}>
        <ContentWrapper
          mix={{ block: "NoMatch" }}
          wrapperMix={{
            block: "NoMatch",
            elem: "Wrapper",
          }}
          label={__("Page Not Found Content")}
        >
          <div block="NoMatch">
            <div block="NoMatch-PageNotFound">
              <h4 block="PageNotFound-Title">
                {__("we are sorry!")}
                <span>{__("error 404!")}</span>
              </h4>
              <div block="PageNotFound">
                <Image lazyLoad={true} src={pageNotFound} alt="pageNotFound" />

              </div>
              <span block="PageNotFound-SubTitle">
                {__("this page could not be found :(")}
              </span>
              <p block="PageNotFound-Content">
                {__(
                  "Can't find what you need? Take a moment\nand do a search or start from our homepage"
                )}
              </p>
              <a block="PageNotFound-LinkHome" href="/">
                {__("back to homepage")}
              </a>
            </div>
          </div>
        </ContentWrapper>
      </main>
    );
  }
}

export default NoMatch;
