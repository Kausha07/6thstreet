import { OrderPlaced } from "../HelperComponents/HelperComponents";
import "./AllTransactions.style.scss";

export default function AllTransactions() {
  const AllTransactionsData = [1, 2, 3, 4, 5, 6, 7];
  return (
    <>
      <div> AllTransactions</div>
      {AllTransactionsData.map((transaction) => (
        <>
          <OrderPlaced />
          <hr className="HoriRow" />
        </>
      ))}
    </>
  );
}
