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
  const [requirementPrice, setRequirementPrice] = useState<number>(1);
  const [requirementContractAddress, setRequirementContractAddress] =
    useState<string>("0xf3fcd2c1a78f5eee");
  const [requirementContractName, setRequirementContractName] =
    useState<string>("FlowRequirement");

  function onSubmit() {
    const expirationIntervalInMilliseconds =
      expirationIntervalInDays * 24 * 60 * 60 * 1000;
    flowService
      .sendDefineMembershipTransaction({
        name,
        description,
        thumbnail,
        expirationInterval: String(expirationIntervalInMilliseconds),
        maxSupply,
        requirement: {
          price: String(requirementPrice),
          contractAddress: requirementContractAddress,
          contractName: requirementContractName,
        },
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
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <label>
        Description
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <br />
      <label>
        Thumbnail
        <input
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />
      </label>
      <br />
      <label>
        Expiration (in days)
        <input
          type="number"
          value={expirationIntervalInDays}
          onChange={(e) => setExpirationIntervalInDays(e.target.valueAsNumber)}
        />
      </label>
      <br />
      <label>
        Max supply
        <input
          type="number"
          value={maxSupply}
          onChange={(e) => setMaxSupply(e.target.valueAsNumber)}
        />
      </label>
      <br />
      <label>
        Requirement price
        <input
          type="number"
          value={requirementPrice}
          onChange={(e) => setRequirementPrice(e.target.valueAsNumber)}
        />
      </label>
      <br />
      <label>
        Requirement contract address
        <input
          disabled
          value={requirementContractAddress}
          onChange={(e) => setRequirementContractAddress(e.target.value)}
        />
      </label>
      <br />
      <label>
        Requirement contract name
        <input
          disabled
          value={requirementContractName}
          onChange={(e) => setRequirementContractName(e.target.value)}
        />
      </label>
      <br />
      <button onClick={onSubmit}>Create</button>
    </div>
  );
}
