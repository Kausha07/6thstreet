import Field from "Component/Field";
import { useDispatch, connect } from "react-redux";
import { useState, useEffect } from "react";
import MyWalletDispatcher from "Store/MyWallet/MyWallet.dispatcher";
import "./UseMyWallet.style.scss";

export const mapStateToProps = ({
  MyWalletReducer: { myWallet, isLoading },
}) => ({
  isLoading,
  myWallet,
});

export const mapDispatchToProps = (dispatch) => ({
  toggleMyWallet: (apply) => MyWalletDispatcher.toggleMyWallet(dispatch, apply),
  getReward: () => MyWalletDispatcher.getReward(dispatch),
});

export function UseMyWallet(props) {
  const [isWalletBalanceApplied, setIsWalletBalanceApplied] = useState(false);
  const { toggleMyWallet, getReward, eligibleAmount, myWallet } = props;
  const checkboxId = "My_wallet_applied";
  const handleCheckboxChange = () => {
    toggleMyWallet(!isWalletBalanceApplied);
    setIsWalletBalanceApplied(() => !isWalletBalanceApplied);
  };

  useEffect(async () => {
    await getReward();
  }, []);

  return (
    <>
      <div className="UseMyWallet">
        <div>
          <div className="Heading">My Rewards</div>
          <div className="SubHeading">
            Eligible to use <span className="boldAmount"> {eligibleAmount} </span> of
            <span className="boldAmount"> {myWallet?.current_balance}</span>
          </div>
        </div>
        <div>
          <Field
            block="StoreCredit"
            elem="Toggle"
            type="toggle"
            id={checkboxId}
            name={checkboxId}
            value={checkboxId}
            checked={isWalletBalanceApplied}
            onClick={handleCheckboxChange}
          />
        </div>
      </div>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(UseMyWallet);
