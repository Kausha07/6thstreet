import { OrderPlaced } from "../HelperComponents/HelperComponents";
import "./RewardsTransactions.style.scss";

export default function RewardsTransactions() {
  const RewardsTransactionsData = [1, 2, 3, 4, 5, 6, 7];
  return (
    <>
      <div> RewardsTransactions</div>
      {RewardsTransactionsData.map((transaction) => (
        <>
          <OrderPlaced />
          <hr className="HoriRow" />
        </>
      ))}
    </>
  );
}
