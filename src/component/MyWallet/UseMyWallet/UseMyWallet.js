import Field from "Component/Field";
import { useDispatch, connect } from "react-redux";
import { useState } from "react";
import MyWalletDispatcher from 'Store/MyWallet/MyWallet.dispatcher';
import "./UseMyWallet.style.scss";

export const mapStateToProps = ({
    StoreCreditReducer: {
        storeCredit,
        isLoading
    },
    Cart: {
        cartTotals
    }
}) => ({
    storeCredit,
    isLoading,
    cartTotals
});

export const mapDispatchToProps = (dispatch) => ({
    toggleMyWallet: (apply) => MyWalletDispatcher.toggleMyWallet(dispatch, apply),
});

export  function UseMyWallet(props) {
    const [ isWalletBalanceApplied, setIsWalletBalanceApplied] = useState(false);
    const {toggleMyWallet } = props;
    const checkboxId = "My_wallet_applied";
    const handleCheckboxChange = () => {
        toggleMyWallet(true);
        setIsWalletBalanceApplied(!isWalletBalanceApplied);
    };
  return (
    <>
      {/* <div className="UseMyWallet">
        <div>
          <div className="Heading">My Cash</div>
          <div className="SubHeading">
            Eligible to use <span className="boldAmount">AED 37 </span> of
            <span className="boldAmount"> AED 47</span>
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
      </div> */}
      <div className="UseMyWallet">
        <div>
          <div className="Heading">My Rewards</div>
          <div className="SubHeading">
            Eligible to use <span className="boldAmount">AED 37 </span> of
            <span className="boldAmount"> AED 47</span>
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