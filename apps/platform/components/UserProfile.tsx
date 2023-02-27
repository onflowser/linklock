import styled from "styled-components";
import { PrimaryButton } from "./PrimaryButton";
import React, { useState } from "react";
import { MarkdownPreview } from "./MarkdownPreview";
import { FlowAbstractNameInfo } from "@membership/domains";
import {
  MembershipCheckout,
  MembershipDefinitionCard,
  UnstyledButton,
  useFlow,
  SizedBox,
  useGetMembershipDefinitionsByAdmin,
} from "@membership/react";
import { formatWebsiteUrl } from "../common/utils";
import { Avatar } from "./Avatar";
import { ExternalLink } from "./ExternalLink";
import { useRouter } from "next/router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export type UserProfileProps = {
  address: string;
  nameInfo: FlowAbstractNameInfo | undefined;
};

export default function UserProfile({ nameInfo, address }: UserProfileProps) {
  const router = useRouter();
  const { currentUser } = useFlow();
  const [openMembershipCheckout, setOpenMembershipCheckout] = useState(false);
  const [selectedMembershipId, setSelectedMembershipId] = useState<number>();
  const { data: membershipDefinitions } =
    useGetMembershipDefinitionsByAdmin(address);

  return (
    <Container>
      {selectedMembershipId !== undefined && (
        <MembershipCheckout
          membershipDefinitionId={selectedMembershipId}
          adminAddress={address}
          isOpenModal={openMembershipCheckout}
          onRequestClose={() => {
            setOpenMembershipCheckout(false);
            setSelectedMembershipId(undefined);
          }}
        />
      )}

      <SizedBox backgroundColor="var(--main-dark-color)" height={200} />

      <ProfileWrapper>
        <Avatar address={address} imageUrl={nameInfo?.avatar} />
        <ProfileName>{nameInfo?.name ?? "Unknown"}</ProfileName>
        <ExternalLink href={`https://flowscan.org/account/${address}`}>
          {address}
        </ExternalLink>
        {nameInfo?.websiteUrl && (
          <ExternalLink href={nameInfo.websiteUrl}>
            {formatWebsiteUrl(nameInfo.websiteUrl)}
          </ExternalLink>
        )}
      </ProfileWrapper>

      <DetailsCard style={{ maxWidth: nameInfo?.description ? 1000 : 500 }}>
        {nameInfo?.description && (
          <LeftDetails>
            <div>
              <h4>About</h4>
              <MarkdownPreview source={nameInfo.description} />
            </div>
          </LeftDetails>
        )}
        {/* TODO: Fix this to work without specifying width */}
        <RightDetails style={{ width: nameInfo?.description ? "50%" : "100%" }}>
          {currentUser && (
            <CreateMembershipButton
              title="Create new membership"
              onClick={() =>
                router.push(`/${currentUser.address}/membership/new`)
              }
            >
              +
            </CreateMembershipButton>
          )}
          {membershipDefinitions?.length === 0 && (
            <div>
              <b>No available memberships</b>
              <p>This user has no membership programs.</p>
            </div>
          )}
          <Slider dots>
            {membershipDefinitions?.map((definition) => (
              <>
                {/* TODO: Add edit membership definition logic */}
                <CustomMembershipDefinitionCard
                  membershipDefinition={definition}
                />
                <SizedBox height={40} />
                <PrimaryButton
                  isLoading={false}
                  onClick={() => {
                    setSelectedMembershipId(+definition.id);
                    setOpenMembershipCheckout(true);
                  }}
                  style={{ width: "100%", maxWidth: "unset" }}
                >
                  Buy Membership
                </PrimaryButton>
              </>
            ))}
          </Slider>
        </RightDetails>
      </DetailsCard>
    </Container>
  );
}

const Container = styled.div`
  margin-bottom: 100px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -100px;
  margin-bottom: 50px;
`;

const ProfileName = styled.h3`
  margin-top: 10px;
  margin-bottom: 5px;
`;

const Shadow = styled.div`
  border-radius: 20px;
  background: #f6f6f6;
  box-shadow: 20px 20px 40px #d1d1d164, -20px -20px 60px #ffffff;
`;

const DetailsCard = styled(Shadow)`
  padding: 50px;
  display: flex;
  margin: auto;
  position: relative;
  &:before {
    content: " ";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border-radius: 20px;
    height: 100%;
    opacity: 0.8;
    background-image: url("/images/background.jpg");
    background-repeat: no-repeat;
    background-position: 50% 0;
    background-size: cover;
  }
`;

const CreateMembershipButton = styled(UnstyledButton)`
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 30px;
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 50%;
  color: white;
  background: var(--main-dark-color) !important;
`;

const CustomMembershipDefinitionCard = styled(MembershipDefinitionCard)`
  min-height: 300px;
`;

const LeftDetails = styled.div`
  flex: 1;
  z-index: 1;
`;

const RightDetails = styled.div`
  flex: 1;
  z-index: 1;
`;
