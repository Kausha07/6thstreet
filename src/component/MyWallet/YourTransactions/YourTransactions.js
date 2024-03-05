import AllTransactions from "../AllTransactions/AllTransactions";
import MyCashTransactions from "../MyCashTransactions/MyCashTransactions";
import RewardsTransactions from "../RewardsTransactions/RewardsTransactions";
import { useState } from "react";

export default function YourTransactions() {
  const [currentScreen, setCurrentScreen] = useState("all");
  return (
    <>
      <div>
        <div>
          <button onClick={() => setCurrentScreen("all")}>All</button>
          <button onClick={() => setCurrentScreen("my-cash")}>My Cash</button>
          <button onClick={() => setCurrentScreen("rewards")}>Rewards</button>
        </div>
      </div>
      <div>
        {/* {currentScreen === "all" && <AllTransactions />}
        {currentScreen === "my-cash" && <MyCashTransactions />}
        {currentScreen === "rewards" && <RewardsTransactions />} */}
      </div>
    </>
  );
}
