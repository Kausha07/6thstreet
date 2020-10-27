/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';
import { ClubApparelMember } from 'Util/API/endpoint/ClubApparel/ClubApparel.type';
import { isArabic } from 'Util/App';

import ClubApparelLogoAR from './images/ca-trans-ar-logo.png';
import ClubApparelLogoEN from './images/ca-trans-logo.png';
import Benefits from './images/club_apparel_benefits@2x.png';
import Redemption from './images/club_apparel_redemption_value@2x.png';
import TierBenefits from './images/club_apparel_tier_benefits@2x.png';
import { TIER_DATA } from './MyAccountClubApparel.config';

import './MyAccountClubApparel.style';

class MyAccountClubApparel extends PureComponent {
    static propTypes = {
        linkAccount: PropTypes.func.isRequired,
        verifyOtp: PropTypes.func.isRequired,
        clubApparelMember: ClubApparelMember
    };

    static defaultProps = {
        clubApparelMember: {}
    };

    state = {
        isArabic: isArabic(),
        isEarnExpanded: false,
        isAboutExpanded: false
    };

    onAboutClick = () => {
        this.setState(({ isAboutExpanded }) => ({ isAboutExpanded: !isAboutExpanded }));
    };

    onEarnClick = () => {
        this.setState(({ isEarnExpanded }) => ({ isEarnExpanded: !isEarnExpanded }));
    };

    renderLinkAccount() {
        const { linkAccount } = this.props;

        return (
            <Form
              onSubmitSuccess={ linkAccount }
            >
                <Field
                  type="text"
                  placeholder="00000000"
                  id="phone"
                  name="phone"
                  validation={ ['notEmpty'] }
                />
                <button
                  block="Button"
                  type="submit"
                >
                    { __('Link Account') }
                </button>
            </Form>
        );
    }

    renderVerifyOtp() {
        const { verifyOtp } = this.props;

        return (
            <Form
              onSubmitSuccess={ verifyOtp }
            >
                <Field
                  type="text"
                  placeholder="00000"
                  id="otp"
                  name="otp"
                  validation={ ['notEmpty'] }
                />
                <button
                  block="Button"
                  type="submit"
                >
                    { __('Verify number') }
                </button>
            </Form>
        );
    }

    renderLinkedMember() {
        const {
            clubApparelMember: {
                caPoints,
                currency,
                memberDetails: {
                    memberTier,
                    mobileNumber
                }
            }
        } = this.props;
        const { img } = TIER_DATA[memberTier];
        const number = mobileNumber.startsWith('00')
            ? `+${mobileNumber.slice(2).replace(/^(.{3})(.*)$/, '$1 $2')}`
            : mobileNumber.replace(/^(.{3})(.*)$/, '$1 $2');

        return (
            <div block="MyAccountClubApparel" elem="MemberData">
                <div block="MyAccountClubApparel" elem="Reward">
                    <div block="MyAccountClubApparel" elem="Points">
                        <p>Rewards Worth</p>
                        <span block="MyAccountClubApparel" elem="PointsCAP">{ caPoints }</span>
                        <span block="MyAccountClubApparel" elem="PointsCurrency">{ currency }</span>
                    </div>
                    <div block="MyAccountClubApparel" elem="Tier">
                        <img
                          block="MyAccountClubApparel"
                          elem="TierImage"
                          src={ img }
                          alt="Tier"
                        />
                    </div>
                </div>
                <p block="MyAccountClubApparel" elem="Redemption">
                    { __('Please complete your profile on ') }
                    <span>{ __('Club Apparel App') }</span>
                    { __(' to UNLOCK redemption.') }
                </p>
                <p block="MyAccountClubApparel" elem="Number">
                    { __('Phone Number: ') }
                    <span>{ number }</span>
                </p>
                <button block="MyAccountClubApparel" elem="ChangeButton">
                    { __('change to another club apparel account') }
                </button>
            </div>
        );
    }

    renderLinkForm() {
        return (
            <div block="MyAccountClubApparel" elem="LinkForm">
                { this.renderLinkAccount() }
                { this.renderVerifyOtp() }
            </div>
        );
    }

    renderNotLinkedMember() {
        const { isArabic } = this.state;
        console.log(isArabic);

        return (
            <div block="MyAccountClubApparel" elem="MemberData">
                <div block="MyAccountClubApparel" elem="Cards">
                    <div block="MyAccountClubApparel" elem="Card">
                        <img src={ Benefits } alt="Loyalty" />
                        <h3>{ __('AVAIL LOYALTY BENEFITS ON 6THSTREET') }</h3>
                        <p>{ __('Get access and offers from your favourite international brands.') }</p>
                    </div>
                    <div block="MyAccountClubApparel" elem="Card">
                        <img src={ TierBenefits } alt="Tiers" />
                        <h3>{ __('TIERS BENEFIT') }</h3>
                        <p>{ __('Enjoy a tier-based rewards and benefits') }</p>
                    </div>
                    <div block="MyAccountClubApparel" elem="Card">
                        <img src={ Redemption } alt="Redemption" />
                        <h3>{ __('REDEMPTION VALUE') }</h3>
                        <p>
                            { __('1 Point = ') }
                            <strong>{ __('1 AED') }</strong>
                        </p>
                        <p
                          block="MyAccountClubApparel"
                          elem="Card"
                          mods={ { countrySpecific: true } }
                        >
                            { __('*Country specific') }
                        </p>
                    </div>
                </div>
                <p block="MyAccountClubApparel" elem="Number">
                    { __('Link your ') }
                    <span>{ __('Club Apparel') }</span>
                    { __(' account and start earning points.') }
                </p>
                <button block="MyAccountClubApparel" elem="ChangeButton">
                    { __('link your account') }
                </button>
            </div>
        );
    }

    renderAbout() {
        const { isAboutExpanded } = this.state;

        return (
            <div block="MyAccountClubApparel" elem="About" mods={ { isAboutExpanded } }>
                <p>
                    { __('Club Apparel is a mobile app - based loyalty program of Apparel Group which comprises of more than 75+ brands and 1750+ stores across GCC. Club Apparel members can now avail Loyalty Benefits on 6thStreet.com.') }
                </p>
                <p>
                    { __('Club Apparel members can collect and redeem points at any Apparel Group participating stores across GCC including 6thStreet.') }
                </p>
                <p>
                    { __('For more details, please refer to the FAQs on the Club Apparel Mobile App or view ') }
                    <a href="http://www.clubapparel.com/terms&amp;conditions.html">
                        { __('Club Apparel Terms and Conditions') }
                    </a>
                </p>
                <p>
                    { __('You can also view the ') }
                    <a href="http://www.clubapparel.com/privacy-policy.html">
                    { __('Club Apparel Privacy Policy') }
                    </a>
                    { __(' for any additional information.') }
                </p>
            </div>
        );
    }

    renderEarn() {
        const { isEarnExpanded } = this.state;

        return (
            <div block="MyAccountClubApparel" elem="Earn" mods={ { isEarnExpanded } }>
                <p>
                    { __('To be rewarded for 6thStreet purchases, you must have a 6thStreet account and you must be a Club Apparel Member. You need to link your Club Apparel account to your 6thStreet account. If you are not a Club Apparel member, you can download the Club Apparel App and Register from ') }
                    <a href="http://www.clubapparel.com/ca-rewards/rewards.html">
                        { __('here.') }
                    </a>
                </p>
                <p>
                    { __('Once the linking is completed, you can collect Club Apparel Points on your purchases on 6thStreet. Club Apparel points collected from the Stores can be used on 6thStreet and vice versa.') }
                </p>
                <p>
                    { __('Club Apparel Points are valid for one year from the date of purchase and a member can redeem the points at any time before the expiry period of one year.') }
                </p>
                <p>
                    { __('Your Club Apparel Membership Tier defines the amount of points you will collect on your purchase. To know more about the tiers, please refer to ') }
                    <a href="http://www.clubapparel.com/CA-Tiers-Info.html">
                        { __('Club Apparel Tiers') }
                    </a>
                    { __(' details.') }
                </p>
                <p>
                    { __('Club Apparel also provides special bonus points and brand points during promotions and events. To know more about the Special Points, please refer to ') }
                    <a href="http://www.clubapparel.com/brands-terms&amp;conditions.html">
                        { __('Club Apparel Special Points Terms and Conditions.') }
                    </a>
                </p>
            </div>
        );
    }

    render() {
        const { clubApparelMember } = this.props;
        const { isAboutExpanded, isEarnExpanded, isArabic } = this.state;

        return (
            <div block="MyAccountClubApparel">
                <div block="MyAccountClubApparel" elem="ClubApparelContainer">
                    <img
                      block="MyAccountClubApparel"
                      elem="MemberDataLogo"
                      src={ isArabic ? ClubApparelLogoAR : ClubApparelLogoEN }
                      alt="Logo icon"
                    />
                    { clubApparelMember ? this.renderLinkedMember() : this.renderNotLinkedMember() }
                </div>
                <div block="MyAccountClubApparel" elem="Buttons">
                    <button
                      block="MyAccountClubApparel"
                      elem="AboutButton"
                      mods={ { isAboutExpanded } }
                      onClick={ this.onAboutClick }
                    >
                        { __('About Club Apparel') }
                    </button>
                    { this.renderAbout() }
                    <button
                      block="MyAccountClubApparel"
                      elem="EarnButton"
                      mods={ { isEarnExpanded } }
                      onClick={ this.onEarnClick }
                    >
                        { __('Earn & Burn') }
                    </button>
                    { this.renderEarn() }
                </div>
            </div>
        );
    }
}

export default MyAccountClubApparel;
