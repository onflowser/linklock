import styled from "styled-components";
import { PrimaryButton } from "./PrimaryButton";
import React, { useState } from "react";
import { MarkdownPreview } from "./MarkdownPreview";
import { FlowAbstractNameInfo } from "@membership/domains";
import {
  MembershipCheckout,
  useGetMembershipDefinitionsByAdmin,
} from "@membership/client";
import { formatWebsiteUrl } from "../common/utils";
import { SizedBox } from "@membership/client/src/view/shared/SizedBox";
import { Avatar } from "./Avatar";
import { ExternalLink } from "./ExternalLink";
import { Carousel } from "react-responsive-carousel";
import { useRouter } from "next/router";
import { MembershipDefinitionCard, UnstyledButton } from "@membership/client";

export type UserProfileProps = {
  address: string;
  nameInfo: FlowAbstractNameInfo | undefined;
};

export default function UserProfile({ nameInfo, address }: UserProfileProps) {
  const router = useRouter();
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
          onCloseModal={() => {
            setOpenMembershipCheckout(false);
            setSelectedMembershipId(undefined);
          }}
        />
      )}

      <SizedBox backgroundColor="var(--main-dark-color)" height={200} />

      <ProfileWrapper>
        <Avatar imageUrl={nameInfo?.avatar} />
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
        <RightDetails>
          <Carousel
            showArrows={false}
            showStatus={false}
            onChange={console.log}
            onClickItem={console.log}
            onClickThumb={console.log}
          >
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
          </Carousel>
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
  height: 500px;
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
  display: flex;
  flex-direction: column;
`;
