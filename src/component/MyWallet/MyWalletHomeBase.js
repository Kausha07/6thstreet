import { useState } from "react";
import MyWalletHome from "./MyWalletHome/MyWalletHome";
import YourTransactions from "./YourTransactions/YourTransactions";
import MyCashTransactions from "./MyCashTransactions/MyCashTransactions";

import RewardsTransactions from "./RewardsTransactions/RewardsTransactions";
import AllTransactions from "./AllTransactions/AllTransactions";
import {
  TransactionHeading,
  ExpiringSoon,
  EarnedCashReward,
  CollapsableComponent,
} from "./HelperComponents/HelperComponents";

import GoBackIcon from "./IconsAndImages/GoBackIcon.svg";

export default function MyWalletHomeBase() {
  const [currentScreen, setCurrentScreen] = useState("home");
  return (
    <>
      <CollapsableComponent />
      <EarnedCashReward />
      <div>
        {currentScreen === "home" && (
          <MyWalletHome setCurrentScreen={setCurrentScreen} />
        )}
      </div>
      <div>
        {currentScreen === "all" && (
          <>
            <TransactionHeading
              setCurrentScreen={setCurrentScreen}
              currentScreen={currentScreen}
            />
            <AllTransactions setCurrentScreen={setCurrentScreen} />
          </>
        )}
        {currentScreen === "my-cash" && (
          <>
            <TransactionHeading
              setCurrentScreen={setCurrentScreen}
              currentScreen={currentScreen}
            />
            <MyCashTransactions setCurrentScreen={setCurrentScreen} />
          </>
        )}
        {currentScreen === "rewards" && (
          <>
            <TransactionHeading
              setCurrentScreen={setCurrentScreen}
              currentScreen={currentScreen}
            />
            <ExpiringSoon />
            <RewardsTransactions setCurrentScreen={setCurrentScreen} />
          </>
        )}
      </div>
    </>
  );
}
