import { Modal } from "./Modal";
import ReactModal from "react-modal";
import styled from "styled-components";
import { useFlowTeaAmount } from "../../common/use-flow-tea-amount";
import { PrimaryButton } from "../PrimaryButton";
import { Spacing } from "../Spacing";
import { theme } from "../../common/theme";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Props = ReactModal.Props & {
  flowTeaAmount: number;
  onConfirm: (flowAmount: number) => void;
};

const COUNTDOWN_FROM_VALUE = 10;

export function ConfirmTransactionModal(props: Props) {
  const { flowAmount, usdAmount, flowUsdPrice, refresh } = useFlowTeaAmount(
    props.flowTeaAmount
  );
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM_VALUE);

  function onRefresh() {
    refresh();
    setCountdown(COUNTDOWN_FROM_VALUE);
    toast.success("FLOW price data refreshed!");
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdown]);

  return (
    <Modal
      onAfterOpen={onRefresh}
      style={{
        content: {
          padding: 100,
          backgroundColor: "#F7F7F7",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }}
      {...props}
    >
      <Image src="/images/confirm-transaction.png" alt="" />

      <Spacing height="xl" />

      <Title>Confirm the transaction</Title>
      <Subtitle>Bellow FLOW amount will be sent.</Subtitle>

      <Spacing height="xl" />

      <Amount>
        {flowAmount} FLOW ({usdAmount}$)
      </Amount>
      <Subtitle>1 FLOW = {flowUsdPrice}$</Subtitle>

      <Spacing height="xl" />

      {countdown === 0 ? (
        <Button onClick={onRefresh} style={{ background: theme.colors.orange }}>
          Refresh
        </Button>
      ) : (
        <Button onClick={() => props.onConfirm(flowAmount)}>
          Confirm {countdown}
        </Button>
      )}
    </Modal>
  );
}

const Image = styled.img`
  max-width: 300px;
`;

const Title = styled.h2`
  margin-bottom: 0.2em;
`;

const Amount = styled.b`
  font-size: 26px;
  margin: 10px 0 0.2em;
`;

const Subtitle = styled.span`
  font-size: 12px;
  color: ${theme.colors.darkGrey};
`;

const Button = styled(PrimaryButton)`
  width: 100%;
`;
