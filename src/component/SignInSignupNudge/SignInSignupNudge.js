import "./SignInSignupNudge.style";

export default function SignInSignupNudge() {
  return (
    <div className="nudge-container">
      <div className="nudge-arrow-container">
        <div className="nudge-arrow">{/* this is nudge */}</div>
      </div>

      <div className="nudge-content">
        <button className="signin">{__("sign in")}</button>
        <div className="newCostomer">
          {__("New Customer?")}
          <span className="register">{__("Register")}</span>
        </div>
      </div>
    </div>
  );
}
