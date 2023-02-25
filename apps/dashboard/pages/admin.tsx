import { useState } from "react";
import { FlowService, useFlow } from "@membership/client";

const flowService = new FlowService();

export default function AdminDashboard() {
  const [name, setName] = useState("TestMembership");
  const [description, setDescription] = useState(
    "This membership is for testing."
  );
  const [thumbnail, setThumbnail] = useState(
    "https://media.tenor.com/MjdXh21SR6wAAAAC/screaming-cat.gif"
  );
  const [maxSupply, setMaxSupply] = useState<number>(1);
  const [expirationIntervalInDays, setExpirationIntervalInDays] =
    useState<number>(1);
  const [flowPrice, setFlowPrice] = useState<number>(1);

  function onSubmit() {
    const expirationIntervalInMilliseconds =
      expirationIntervalInDays * 24 * 60 * 60 * 1000;
    flowService
      .sendDefineMembershipTransaction({
        name,
        description,
        thumbnail,
        expirationInterval: expirationIntervalInMilliseconds,
        maxSupply,
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
      <label>
        Name
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Description
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <br />
      <label>
        Thumbnail
        <input
          placeholder="Thumbnail"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />
      </label>
      <br />
      <label>
        Expiration (in days)
        <input
          placeholder="Expiration in days"
          type="number"
          value={expirationIntervalInDays}
          onChange={(e) => setExpirationIntervalInDays(e.target.valueAsNumber)}
        />
      </label>
      <br />
      <label>
        Max supply
        <input
          placeholder="Max supply"
          type="number"
          value={maxSupply}
          onChange={(e) => setMaxSupply(e.target.valueAsNumber)}
        />
      </label>
      <br />
      <label>
        Flow price
        <input
          placeholder="Flow price"
          type="number"
          value={flowPrice}
          onChange={(e) => setFlowPrice(e.target.valueAsNumber)}
        />
      </label>
      <br />
      <button onClick={onSubmit}>Create</button>
    </div>
  );
}
