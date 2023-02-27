import { useState } from "react";
import {
  daysToSeconds,
  FlowService,
  useFlow,
  useGetMembershipDefinitionsByAdmin,
} from "../../../packages/react";

const flowService = new FlowService();

export default function AdminDashboard() {
  const { currentUser } = useFlow();
  const { data: membershipDefinitions, mutate: refetchMembershipDefinitions } =
    useGetMembershipDefinitionsByAdmin(currentUser?.address);
  const [name, setName] = useState("TestMembership");
  const [description, setDescription] = useState(
    "This membership is for testing."
  );
  const [thumbnail, setThumbnail] = useState(
    "https://media.tenor.com/MjdXh21SR6wAAAAC/screaming-cat.gif"
  );
  const [maxSupply, setMaxSupply] = useState<string>("1");
  const [expirationIntervalInDays, setExpirationIntervalInDays] =
    useState<string>("1");
  const [requirementPrice, setRequirementPrice] = useState<string>("1");
  const [requirementContractAddress, setRequirementContractAddress] =
    useState<string>("0xf3fcd2c1a78f5eee");
  const [requirementContractName, setRequirementContractName] =
    useState<string>("FlowRequirement");

  function onSubmit() {
    flowService
      .setupMembershipDefinitionCollection()
      .then(() => {
        flowService
          .createMembership({
            name,
            description,
            thumbnail,
            expirationInterval: String(
              daysToSeconds(+expirationIntervalInDays)
            ),
            maxSupply,
            requirement: {
              price: String(requirementPrice),
              contractAddress: requirementContractAddress,
              contractName: requirementContractName,
            },
          })
          .then((res) => {
            console.log(res);
            refetchMembershipDefinitions();
          })
          .catch((e) => {
            alert(`Error defining membership: ${e}`);
          });
      })
      .catch((e) =>
        alert(`Error setting up membership definition collection: ${e}`)
      );
  }

  return (
    <div>
      <h3>Existing memberships</h3>
      <pre>{JSON.stringify(membershipDefinitions, null, 4)}</pre>
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
          onChange={(e) => setExpirationIntervalInDays(e.target.value)}
        />
      </label>
      <br />
      <label>
        Max supply
        <input
          type="number"
          value={maxSupply}
          onChange={(e) => setMaxSupply(e.target.value)}
        />
      </label>
      <br />
      <label>
        Requirement price
        <input
          type="number"
          value={requirementPrice}
          onChange={(e) => setRequirementPrice(e.target.value)}
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
