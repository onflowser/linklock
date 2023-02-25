import styled from "styled-components";
import { PrimaryButton } from "./PrimaryButton";
import { useState } from "react";
import { MarkdownPreview } from "./MarkdownPreview";
import { FlowAbstractNameInfo } from "@membership/domains";
import { MembershipCheckout, useGetMembershipDefinition } from "@membership/client";
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
  const {data: membershipDefinition} = useGetMembershipDefinition(address);

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

      <DetailsCard>
        <LeftDetails>
          {nameInfo?.description && (
            <div>
              <h4>About</h4>
              <MarkdownPreview source={nameInfo.description} />
            </div>
          )}
        </LeftDetails>
        <RightDetails>
          {membershipDefinition ? (
            <div>
              <PrimaryButton
                isLoading={false}
                onClick={onSubmit}
                style={{ width: "100%", maxWidth: "unset" }}
              >
                Buy Membership
              </PrimaryButton>
            </div>
          ) : (
            <div>
              No membership found
            </div>
          )}
        </RightDetails>
      </DetailsCard>
    </Container>
  );
}

const Container = styled.div`
  margin-bottom: 100px;
  
  .profile-photo-main-wrapper h3 {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .profile-photo-main-wrapper a {
    display: block;
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

const DetailsCard =  styled(Shadow)`
  display: flex;
  max-width: 800px;
  margin: auto;
`;

const LeftDetails = styled.div`
  flex: 1;
`;

const RightDetails = styled.div`
  flex: 1;
`;
