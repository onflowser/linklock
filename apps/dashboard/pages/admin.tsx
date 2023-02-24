import { useState } from "react";
import { FlowService, useFlow } from "@membership/client";

const flowService = new FlowService();

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [expirationIntervalInDays, setExpirationIntervalInDays] =
    useState<number>();
  const { currentUser } = useFlow();
  const [flowPrice, setFlowPrice] = useState<number>();

  function onSubmit() {
    if (!name || !expirationIntervalInDays || !flowPrice) {
      return alert("Incomplete info");
    }
    const expirationIntervalInMilliseconds =
      expirationIntervalInDays * 24 * 60 * 60 * 1000;
    flowService
      .sendDefineMembershipTransaction({
        name,
        expirationInterval: expirationIntervalInMilliseconds,
        flowPrice,
      })
      .then(() => {
        alert("Success");
      })
      .catch((e) => {
        alert(`Error: ${e}`);
      });
  }

  return (
    <div>
      <h3>Create membership</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Expiration in days"
        type="number"
        value={expirationIntervalInDays}
        onChange={(e) => setExpirationIntervalInDays(e.target.valueAsNumber)}
      />
      <input
        placeholder="Flow price"
        type="number"
        value={flowPrice}
        onChange={(e) => setFlowPrice(e.target.valueAsNumber)}
      />
      <button onClick={onSubmit}>Create</button>
    </div>
  );
}
