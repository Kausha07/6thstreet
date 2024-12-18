import './SomethingWentWrong.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ContentWrapper from 'Component/ContentWrapper';
import Link from 'Component/Link';
import {
    MOE_trackEvent,
    EVENT_MOE_OOOPS_SOMETHING_WENT_WRONG,
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";

export class SomethingWentWrong extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        errorDetails: PropTypes.shape({
            err: PropTypes.shape({

            }),
            info: PropTypes.shape({
                componentStack: PropTypes.string
            })
        }).isRequired
    };

    renderErrorDetails() {
        const { errorDetails: { err, info: { componentStack } = {} } } = this.props;
        const errorString = err.toString();

        MOE_trackEvent(EVENT_MOE_OOOPS_SOMETHING_WENT_WRONG, {
            country: getCountryFromUrl().toUpperCase(),
            language: getLanguageFromUrl().toUpperCase(),
            app6thstreet_platform: "Web",
            errorDetails : err?.message || "",
        });

        console.groupCollapsed('Suppressed error log:');
        console.error(errorString);
        console.groupEnd();

        if (process.env.NODE_ENV === 'production') {
            return null;
        }

        return (
            <div block="SomethingWentWrong" elem="Debug">
                { errorString }
                { componentStack }
            </div>
        );
    }

    render() {
        const { onClick } = this.props;

        return (
            <main block="SomethingWentWrong">
                <ContentWrapper label="Something went wrong on the page.">
                    <h1 block="SomethingWentWrong" elem="Heading">{ __('Ooops!!!') }</h1>
                    <h2 block="SomethingWentWrong" elem="SubHeading">{ __('Something went wrong!') }</h2>
                    <Link
                      to="/"
                      block="SomethingWentWrong"
                      elem="Button"
                      mix={ { block: 'Button' } }
                      onClick={ onClick }
                    >
                        { __('Back to homepage') }
                    </Link>
                    { this.renderErrorDetails() }
                </ContentWrapper>
            </main>
        );
    }
}

export default SomethingWentWrong;
