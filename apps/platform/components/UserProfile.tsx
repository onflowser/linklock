import styled from "styled-components";
import { PrimaryButton } from "./PrimaryButton";
import { useState } from "react";
import { MarkdownPreview } from "./MarkdownPreview";
import { FlowAbstractNameInfo } from "@membership/domains";
import { MembershipCheckout } from "@membership/client";
import { formatWebsiteUrl } from "../common/utils";

export type UserProfileProps = {
  address: string;
  nameInfo: FlowAbstractNameInfo|undefined;
}

export default function UserProfile({
  nameInfo,
  address
}: UserProfileProps) {
  const [openMembershipCheckout, setOpenMembershipCheckout] = useState(false);

  async function onSubmit() {
    setOpenMembershipCheckout(true)
  }

  return (
    <Container>

      <MembershipCheckout communityAddress={address} isOpenModal={openMembershipCheckout} onCloseModal={() => setOpenMembershipCheckout(false)} />

      <div className="dark-background-profile" />

      <div className="profile-photo-main-wrapper">
        <img style={{borderRadius: '50%'}} src={nameInfo?.avatar ?? "/images/profile-photo-main.svg"} alt="" />
        <h3 className="profile-name">{nameInfo?.name ?? "Unknown"}</h3>
        <a
          target="_blank"
          href={`https://flowscan.org/account/${address}`}
          rel="noreferrer"
        >
          {address}
        </a>
        {nameInfo?.websiteUrl && (
          <a target="_blank" href={nameInfo.websiteUrl} rel="noreferrer">
            {formatWebsiteUrl(nameInfo.websiteUrl)}
          </a>
        )}
      </div>

      <div
        className="profile-content-wrapper"
        style={{ maxWidth: 800 }}
      >
        <div className="bio-and-transactions">
          {nameInfo?.description && (
            <Shadow className="bio-profile">
              <h5>About this user</h5>
              <MarkdownPreview source={nameInfo.description} />
            </Shadow>
          )}

        </div>
        <Shadow className="buy-flow-tea-form">
          <PrimaryButton
            isLoading={false}
            onClick={onSubmit}
            style={{ width: "100%", maxWidth: "unset" }}
          >
            Buy Membership
          </PrimaryButton>
        </Shadow>
      </div>
    </Container>
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
