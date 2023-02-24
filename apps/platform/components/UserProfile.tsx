import { useFcl } from "../common/user-context";
import styled, { css } from "styled-components";
import { PrimaryButton } from "./PrimaryButton";
import Switch from "react-switch";
import { colors } from "../common/theme";
import { HTMLAttributes, useState } from "react";
import { toast } from "react-hot-toast";
import { useUserInfo } from "../common/use-user-info";
import Link from "next/link";
import { TextArea } from "./inputs/Input";
import { MarkdownPreview } from "./MarkdownPreview";
import { ConfirmTransactionModal } from "./modals/ConfirmTransactionModal";

/**
 * @param userId Can either be a handle or account address.
 */
export default function UserProfile({
  userId,
}: {
  userId: string | undefined;
}) {
  const { isSendingDonation, donateFlow } = useFcl();
  const { address, isSelf, info, infoError, donations, donationsError } =
    useUserInfo(userId);
  const [recurring, setRecurring] = useState(false);
  const [flowTeaAmount, setFlowTeaAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [showConfirmTxModal, setConfirmTxModal] = useState(false);

  function resetValues() {
    setRecurring(false);
    setFlowTeaAmount(0);
    setMessage("");
  }

  async function onConfirmTx() {
    setConfirmTxModal(false);
    if (!address) {
      return;
    }
    try {
      await donateFlow(message, flowTeaAmount, recurring, address);
      resetValues();
      toast.success(`You successfully donated ${flowTeaAmount}FLOW!`);
    } catch (e) {
      console.error(e);
      toast.error("Donation failed!");
    }
  }

  async function onSubmit() {
    if (!flowTeaAmount) {
      toast.error("Select FLOW amount!");
      return;
    }
    setConfirmTxModal(true);
  }

  if (infoError) {
    return (
      <Container>
        <div className="dark-background-profile" />
        {/* TODO: display user friendly errors */}
        {/* @ts-ignore */}
        <pre style={{ margin: 20 }}>{infoError.toString()}</pre>
      </Container>
    );
  }

  return (
    <Container>
      <ConfirmTransactionModal
        isOpen={showConfirmTxModal}
        flowTeaAmount={flowTeaAmount}
        shouldCloseOnOverlayClick
        onConfirm={onConfirmTx}
        onRequestClose={() => setConfirmTxModal(false)}
      />

      <div className="dark-background-profile" />

      <div className="profile-photo-main-wrapper">
        <img src="/images/profile-photo-main.svg" alt="" />
        <h3 className="profile-name">{info?.name}</h3>
        <a
          target="_blank"
          href={`https://flowscan.org/account/${address}`}
          rel="noreferrer"
        >
          {address || "-"}
        </a>
        {info?.websiteUrl && (
          <a target="_blank" href={info?.websiteUrl} rel="noreferrer">
            {formatWebsiteUrl(info?.websiteUrl)}
          </a>
        )}
      </div>

      <div
        className="profile-content-wrapper"
        style={{ maxWidth: isSelf ? 800 : 1200 }}
      >
        <div className="bio-and-transactions">
          {info?.description && (
            <Shadow className="bio-profile">
              <h5>About {info?.name}</h5>
              <MarkdownPreview source={info?.description} />
            </Shadow>
          )}

          <TransactionStatsContainer>
            <TransactionStats
              style={{ marginRight: 10 }}
              icon="🏆"
              title="Received donations"
              value={donations?.to?.length ?? 0}
            />
            <TransactionStats
              style={{ marginLeft: 10 }}
              icon="💎"
              title="Sent donations"
              value={donations?.from?.length ?? 0}
            />
          </TransactionStatsContainer>

          {donations?.to.length > 0 ? (
            donations.to.map((donation: any) => (
              <Transaction
                key={donation.id}
                teaCount={donation.amount}
                fromAddress={donation.from}
              />
            ))
          ) : donationsError ? (
            <div>Could not retrieve user donations.</div>
          ) : null}
        </div>
        {!isSelf && (
          <Shadow className="buy-flow-tea-form">
            <h5>Buy {info?.name} a FLOW Tea</h5>
            <ChooseFlowAmount
              onChange={setFlowTeaAmount}
              value={flowTeaAmount}
            />
            <RepeatPaymentSwitch
              style={{ marginTop: 50 }}
              checked={recurring}
              onChange={(checked) => setRecurring(!!checked)}
            />
            <TextArea
              placeholder="Enter your message ..."
              onInput={(e) => setMessage(e.currentTarget.value)}
            />
            <PrimaryButton
              isLoading={isSendingDonation}
              onClick={onSubmit}
              style={{ width: "100%", maxWidth: "unset" }}
            >
              Support {flowTeaAmount || "X"} FLOW
            </PrimaryButton>
          </Shadow>
        )}
      </div>
    </Container>
  );
}

function RepeatPaymentSwitch({
  onChange,
  checked,
  style,
  ...props
}: {
  onChange: (checked: boolean) => void;
  checked: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        ...style,
      }}
      {...props}
    >
      <div>
        <b style={{ margin: 0 }}>Repeat this payment every month</b>
        <p style={{ fontSize: 12, margin: 0 }}>
          Don&apos;t worry, you will get an email to confirm it every month.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flex: 1,
        }}
      >
        <Switch
          uncheckedIcon={false}
          checkedIcon={false}
          checked={checked}
          onColor={colors.pink}
          onHandleColor={colors.white}
          offColor="#dfdfe1"
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function formatWebsiteUrl(value: string) {
  return value.replace(/https?:\/\//, "");
}

function ChooseFlowAmount({
  onChange,
  value,
  amounts = [1, 3, 10],
}: {
  onChange: (value: number) => void;
  value: number;
  amounts?: number[];
}) {
  const [isCustom, setIsCustom] = useState(false);
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <img src="/images/flow-tea-cup.svg" alt="" />
        <X>X</X>
      </div>
      <div
        style={{ flex: 3, display: "flex", justifyContent: "space-between" }}
      >
        {amounts.map((flowAmount) => (
          <FlowAmountButton
            key={flowAmount}
            active={!isCustom && flowAmount === value}
            onClick={() => {
              onChange(flowAmount);
              setIsCustom(false);
            }}
          >
            {flowAmount}
          </FlowAmountButton>
        ))}
        <CustomFlowAmountInput
          active={isCustom}
          placeholder="X"
          type="number"
          onClick={() => setIsCustom(true)}
          onInput={(e) => onChange(e.currentTarget.valueAsNumber)}
        />
      </div>
    </div>
  );
}

const TransactionStatsContainer = styled.div`
  display: flex;
  margin-bottom: 50px;
`;

function TransactionStats({
  icon,
  title,
  value,
  style,
  ...props
}: {
  icon: string;
  title: string;
  value: number;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Shadow style={{ flex: 1, ...style }} {...props}>
      <h4 style={{ textAlign: "center", fontSize: "20px" }}>
        {icon}
        <br />
      </h4>
      <b
        style={{ textAlign: "center", display: "block", fontWeight: "normal" }}
      >
        {title}
      </b>
      <h4 style={{ textAlign: "center", fontSize: "20px" }}>{value}</h4>
    </Shadow>
  );
}

const X = styled.span`
  color: ${({ theme }) => theme.colors.darkViolet};
  font-size: 25px;
  font-weight: bold;
`;

const Button = css`
  border: 1px solid ${({ theme }) => theme.colors.darkViolet};
  border-radius: 3px;
  width: 76px;
  height: 68px;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
`;

const FlowAmountButton = styled.button<{ active: boolean }>`
  ${({ active, theme }) =>
    active
      ? `
      background: ${theme.colors.darkViolet};
      color: white;
  `
      : `
      background: white;
      color: ${theme.colors.darkViolet};
  `}
  ${Button}
`;

const CustomFlowAmountInput = styled.input<{ active: boolean }>`
  ${({ active, theme }) =>
    active
      ? `
      background: ${theme.colors.darkViolet};
      color: white;
      ::placeholder {
        color: white;
      }
  `
      : `
      background: white;
      color: ${theme.colors.darkViolet};
  `}
  ${Button};
  height: unset;

  ::placeholder {
    opacity: 0.3;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

function Transaction({
  teaCount,
  fromAddress,
}: {
  teaCount: number;
  fromAddress: string;
}) {
  return (
    <Shadow className="transactions-profil-details">
      <div className="tea-count">
        <img src="/images/flow-tea-cup.svg" alt="" />
        <h4>x</h4>
        <h4 className="tea-count-number">{teaCount}</h4>
      </div>
      <h6 className="address-id">
        Appreciated by {` `}
        <Link href={`/${fromAddress}`}>{fromAddress}</Link>
      </h6>
    </Shadow>
  );
}

const Container = styled.div`
  .profile-photo-main-wrapper h3 {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .profile-photo-main-wrapper a {
    display: block;
  }

  .profile-content-wrapper {
    max-width: 1200px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0 auto 100px;
  }

  .profile-content-wrapper > *:first-child {
    margin-right: 30px;
  }

  .profile-content-wrapper h5 {
    font-size: 24px;
    color: var(--main-dark-color);
    font-weight: 700;
  }

  .bio-and-transactions {
    flex: 1;
  }

  .bio-profile {
    padding: 50px 30px 50px 30px;
    margin-bottom: 50px;
  }

  .bio-profile h5 {
    margin-top: 0;
  }

  .bio-profile p {
    margin: 0;
  }

  .bio-link {
    color: var(--secondary-color);
    text-decoration: none;
    font-weight: 500;
  }

  .transactions-profil-details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 20px;
  }

  .tea-count {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    max-width: 80px;
    width: 100%;
    * {
      color: var(--dark-violet-color);
    }
  }

  .tea-count img {
    max-width: 30px;
    width: 100%;
  }

  .address-id {
    color: var(--placeholder-text-color);
    font-size: 12px;
    letter-spacing: 0.05em;
    margin-left: 20px;
  }

  .buy-flow-tea-form {
    padding: 50px 30px 50px 30px;
    flex: 1;
  }

  .buy-flow-tea-form h5 {
    margin-top: 0;
  }

  .profile-photo-main-wrapper {
    text-align: center;
    margin: -80px auto 60px;
  }

  .profile-photo-main-wrapper img {
    max-width: 150px;
    width: 100%;
    margin-bottom: 20px;
  }
`;

const Shadow = styled.div`
  border-radius: 20px;
  padding: 15px 50px 15px 50px;
  background: #f6f6f6;
  box-shadow: 20px 20px 40px #d1d1d164, -20px -20px 60px #ffffff;
`;
