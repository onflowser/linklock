import { MembershipCheckout } from "@membership/client";
import { createRoot } from "react-dom/client";

const rootContainer = document.getElementsByTagName("body")[0];

const reactRoot = createRoot(rootContainer);

reactRoot.render(
  MembershipCheckout({
    adminAddress: "",
    isOpenModal: true,
    membershipDefinitionId: 0,
    onCloseModal: () => null,
  })
);
