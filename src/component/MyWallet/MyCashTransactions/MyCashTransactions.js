import { OrderPlaced } from "../HelperComponents/HelperComponents";
import "./MyCashTransactions.style.scss";

export default function MyCashTransactions() {
  const MyCashTransactionsData = [1, 2, 3, 4, 5, 6, 7];
  return (
    <>
      <div> MyCashTransactions</div>
      {MyCashTransactionsData.map((transaction) => (
        <>
          <OrderPlaced />
          <hr className="HoriRow" />
        </>
      ))}
    </>
  );
}
