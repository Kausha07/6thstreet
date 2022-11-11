import "./Subscription.style.scss";

export default function Subscription() {
  return (
    <div>
      <div>
        <div>{__("Signup for new arrivals, offers and more!")}</div>
        <div>
          <input placeholder={__("ENTER YOUR EMAIL")} />
          <button className="submitBtn">{__("Submit")}</button>
        </div>
      </div>
    </div>
  );
}
