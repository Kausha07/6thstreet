import "./PasswordChangeSuccessPage.style.scss";
import confirmIcon from "./IconsAndImages/confirm.png";

export default function PasswordChangeSuccessPage() {
  return (
    <div className="SuccessPageContainer">
      <div className="successIcon">
        <img src={confirmIcon} alt="Password-Changed" />
      </div>
      <div>
        <h2 className="SuccessHeading">
          {__("Password successfully changed!")}
        </h2>
        <p className="SuccessSubHeading">
          {__(
            "You can now use the new password to access your 6thStreet account."
          )}
        </p>
        <div className="ThankYouBlock">
          <p className="ThankYouText">{__("Thank you")}</p>
        </div>
      </div>
    </div>
  );
}
