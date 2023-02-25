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
import { SizedBox } from "@membership/client/src/core/SizedBox";
import { Avatar } from "./Avatar";
import { ExternalLink } from "./ExternalLink";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export type UserProfileProps = {
  address: string;
  nameInfo: FlowAbstractNameInfo | undefined;
};

export default function UserProfile({ nameInfo, address }: UserProfileProps) {
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
          <Carousel
            showArrows={true}
            showStatus={false}
            onChange={console.log}
            onClickItem={console.log}
            onClickThumb={console.log}
          >
            {membershipDefinitions?.map((definition) => (
              <div style={{ height: 200, marginLeft: 20, marginRight: 20 }}>
                <span>{definition.name}</span>
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
              </div>
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
  padding: 15px 50px 15px 50px;
  background: #f6f6f6;
  box-shadow: 20px 20px 40px #d1d1d164, -20px -20px 60px #ffffff;
`;

const DetailsCard = styled(Shadow)`
  display: flex;
  max-width: 1000px;
  margin: auto;
`;

const LeftDetails = styled.div`
  flex: 1;
`;

const RightDetails = styled.div`
  flex: 1;
`;
