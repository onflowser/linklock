import type { NextPage } from "next";
import Image, { StaticImageData } from "next/image";
import styled from "styled-components";
import { useState } from "react";
import { theme } from "../common/theme";
import { useRouter } from "next/router";

// components
import RoundLink from "../components/RoundLink";

// resources
import colorfulLogo from "../public/images/logos/colorful_logo.svg";
import clapHands from "../public/images/clap-hands.svg";
import freeIcon from "../public/images/free.svg";
import flowIcon from "../public/images/flow.svg";
import membershipIcon from "../public/images/membership.svg";
import MetaTags from "../components/MetaTags";

// --LANDING--SECTION--
/* BIG INPUT */
const BigNameInputWrapper = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 10rem;
  opacity: 1;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0.8rem 0.8rem 2rem;

  &:focus-within {
    outline: auto;
  }

  max-width: 96vw;

  box-sizing: border-box;
`;
const BigInputInput = styled.input`
  min-width: 300px;
  color: ${(props) => props.theme.colors.mainDark};
  border: none;
  font-size: 1.3rem;
  line-height: 2rem;
  font-weight: bold;
  letter-spacing: 0px;
  padding: 0;
  flex-grow: 1;

  &::placeholder {
    font-size: 1.3rem;
    line-height: 2rem;
    font-weight: bold;

    letter-spacing: 0px;
    color: ${(props) => props.theme.colors.mainDark};
    opacity: 0.22;
    padding: 0 0.5rem;
  }

  &:focus {
    outline: none;
  }
`;
const BigInputButtonWrapper = styled.div`
  align-self: end;
`;
const BigInput = ({
  placeholder,
  linkHref,
  linkTitle,
  value,
  onChange,
  onClick,
}: {
  placeholder: string;
  linkHref: string;
  linkTitle: string;
  value: string;
  onChange: (value: string) => void;
  onClick: () => void;
}) => {
  return (
    <BigNameInputWrapper>
      <BigInputInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(evt) => onChange(evt.target.value)}
      />
      <BigInputButtonWrapper>
        <RoundLink onClick={onClick} href={linkHref}>
          {linkTitle}
        </RoundLink>
      </BigInputButtonWrapper>
    </BigNameInputWrapper>
  );
};
/* BIG INPUT */

const Subtitle = styled.b`
  font-size: 22px;
  color: ${theme.colors.mainDark};
  line-height: 35px;
  text-align: center;
  padding: 3rem 0;
  opacity: 0.9;
  max-width: 85%;
`;

const Emphasised = styled.a`
  color: ${theme.colors.darkViolet};
`;

const CenterTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  @media only screen and (min-width: 850px) {
    width: 60vw;
    max-width: calc(${(props) => props.theme.layout.max_width} - 10rem);
  }
  z-index: 2;
`;

const MainHeading = styled.h1`
  font-size: 4rem;
  line-height: 6rem;
  font-weight: 800;
  opacity: 0.9;
  text-align: center;
  margin: 0;
  color: ${theme.colors.mainDark};

  @media only screen and (max-width: 1300px) {
    font-size: 3rem;
    line-height: 5rem;
  }
`;
const LandingSection = styled.div`
  background-color: #e5e5f7;
  background-image: url("/images/background.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  //height: calc(80vh - ${theme.layout.navbar_height});
  height: 700px;
  box-sizing: border-box;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
`;

// --LANDING--SECTION--
interface SectionContainerProps {
  color: string | undefined;
  bgcolor: string | undefined;
}

const SectionContainer = styled.section<SectionContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100vw;
  background: ${(props) => props.bgcolor};
  color: ${(props) => props.color};
`;

const SectionInner = styled.div`
  max-width: ${({ theme }) => theme.layout.max_width};
  padding: 10rem ${({ theme }) => theme.layout.mobile_padding};

  display: flex;
  flex-direction: row;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
  }
`;

type SectionPropType = {
  color: string | undefined;
  bgcolor?: string | undefined;
  children?: JSX.Element | JSX.Element[];
};
const Section = ({ color, children, bgcolor }: SectionPropType) => {
  return (
    <SectionContainer color={color} bgcolor={bgcolor}>
      <SectionInner>{children}</SectionInner>
    </SectionContainer>
  );
};

const BgSectionInner = styled.div`
  max-width: ${({ theme }) => theme.layout.max_width};
  padding: 3rem ${({ theme }) => theme.layout.mobile_padding};
  padding-top: 0;

  display: flex;
  flex-direction: row;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
  }
`;

const BgSectionContainer = styled.div`
  background-color: #e5e5f7;
  background-image: url("/images/background.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  // height: calc(65vh - ${theme.layout.navbar_height});
  height: 800px;
  box-sizing: border-box;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
`;
type BgSectionPropType = {
  children?: JSX.Element | JSX.Element[];
};
const BgSection = ({ children }: BgSectionPropType) => {
  return (
    <BgSectionContainer>
      <BgSectionInner>{children}</BgSectionInner>
    </BgSectionContainer>
  );
};

const Column = styled.div`
  flex: 1;
  height: 100%;
`;

const ColumnCenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const HeyYouBlobColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: end;
  @media only screen and (max-width: 1200px) {
    justify-content: center;
  }
`;

const SmallRedText = styled.div`
  font-weight: 900;
  font-size: 1.5rem;
  line-height: 35px;
  margin-bottom: 2rem;

  color: ${(props) => props.theme.colors.primary};
`;

const BigHeading = styled.h1`
  font-weight: 900;
  font-size: 4rem;
  line-height: 84px;
  margin: 0;
  opacity: 0.9;

  @media only screen and (max-width: 500px) {
    line-height: 5rem;
  }
`;

const BoldNormal = styled.div`
  font-size: 1.5rem;
  line-height: 2.4rem;
  font-weight: bold;
  padding-bottom: 2rem;
  padding-top: 3rem;
  opacity: 0.9;
`;
const NormalText = styled.div`
  font-size: 1.5rem;
  font-weight: normal;
  line-height: 2.2rem;
  padding-bottom: 2rem;
  opacity: 0.9;
`;
const BlobImageWrapper = styled.div`
  height: 110%;
  max-width: 35rem;
  aspect-ratio: 382.823/409.499;
  position: relative;
  margin-top: -50px;
`;

// --Benefits--
const SmallSquare = styled.div`
  width: 5rem;
  height: 0.9rem;
  margin: 1rem 0 2rem 0;
  background-color: ${(props) => props.color};
`;
const BenefitIcon = styled.div`
  margin: 0.25rem 1.1rem;
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;

  @media only screen and (max-width: 900px) {
    margin: 0 1.1rem;
    width: 2rem;
    height: 2rem;
  }
`;
const BenefitTitle = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: bold;
  padding-bottom: 1rem;
  color: white;
`;
const BenefitText = styled.div`
  font-size: 1rem;
  line-height: 1.6rem;
  font-weight: normal;
  letter-spacing: 0;
  color: white;
`;
const BenefitBody = styled.div`
  flex-grow: 1;
`;
const BenefitContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-bottom: 3rem;

  @media only screen and (max-width: 1200px) {
    padding-bottom: 2.5rem;
  }
`;
const BenefitRightColumn = styled(Column)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and (max-width: 1200px) {
    display: block;
  }
`;

const BenefitLeftColumn = styled(Column)`
  flex: 1.1;
  padding-right: 10rem;
  padding-top: 3rem;

  @media only screen and (max-width: 1200px) {
    padding-right: 0;
  }
`;

type BenefitProps = {
  icon: StaticImageData | any;
  title: string;
  body: string;
};
const BenefitCard = ({ icon, title, body }: BenefitProps) => (
  <BenefitContainer>
    <BenefitIcon>
      <Image alt="" src={icon} fill sizes="100vw" />
    </BenefitIcon>
    <BenefitBody>
      <BenefitTitle>{title}</BenefitTitle>
      <BenefitText>{body}</BenefitText>
    </BenefitBody>
  </BenefitContainer>
);
// --Benefits--

// --How--does--it--work--section--
const StepCard = styled.div`
  display: flex;
  flex-direction: row;
  padding: 2rem 1rem;
  align-items: center;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  position: relative;

  width: 20rem;
  z-index: 2;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: white;
    box-shadow: -15px 10px 20px #635e907e;
    border-radius: 0.5rem;
    opacity: 0.15;
    z-index: -1;
  }
`;
const StepNum = styled.div`
  font-size: 2.5rem;
  line-height: 4rem;
  width: 5rem;
  height: 4rem;
  text-align: center;
  flex-shrink: 0;
  font-weight: 600;
  color: white;
`;

const StepText = styled.div`
  flex-grow: 1;
  font-weight: bold;
  color: white;
  font-size: 20px;
`;
const Step = ({ num, text }: any) => {
  return (
    <StepCard>
      <StepNum>{num}</StepNum>
      <StepText>{text}</StepText>
    </StepCard>
  );
};
const StepsWrapper = styled.div`
  position: relative;
  height: 30rem;
  width: 100%;
`;
const Steps = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const HWorkLeftColumn = styled(Column)`
  flex: 1;
  margin-top: 5rem;
  @media only screen and (max-width: 1200px) {
    padding-right: 0;
  }
`;
const HWorkRightColumn = styled(Column)`
  flex: 1;
  display: flex;
  max-width: 28rem;

  @media only screen and (max-width: 1200px) {
    padding-top: 3rem;
    width: 30rem;
  }
`;
// --How--does--it--work--section--

const Home: NextPage = () => {
  const router = useRouter();
  const [handle, setHandle] = useState("");

  async function goToAddress() {
    await router.push(`/${handle}`);
  }

  return (
    <>
      <MetaTags title="Supportify️" />
      <LandingSection>
        <CenterTitleBox>
          <MainHeading>
            Let your supporters become your active members.
          </MainHeading>
          <Subtitle>
            Create and distribute memberships using{" "}
            <Emphasised
              href="https://github.com/onflowser/linklock"
              target="_blank"
            >
              LinkLock
            </Emphasised>{" "}
            protocol.
          </Subtitle>
          <BigInput
            value={handle}
            onChange={setHandle}
            placeholder=".find / .fn domain or address"
            linkTitle="Search"
            linkHref=""
            onClick={goToAddress}
          />
        </CenterTitleBox>
      </LandingSection>
      <Section bgcolor={theme.colors.white} color={theme.colors.secondary}>
        <Column>
          <SmallRedText>WHAT IS Supportify?</SmallRedText>
          <BigHeading>HEY YOU!</BigHeading>
          <BoldNormal>
            You have built something really awesome or designed something really
            beautiful!
          </BoldNormal>
          <NormalText>
            You can now let your supporters to become active participants in
            your work by offering them a monthly membership. You give them
            access to exclusive content or community 💚
          </NormalText>
        </Column>
        <HeyYouBlobColumn>
          <BlobImageWrapper>
            <Image alt="" src={colorfulLogo} fill sizes="100vw" />
          </BlobImageWrapper>
        </HeyYouBlobColumn>
      </Section>
      <Section bgcolor={theme.colors.secondary} color={theme.colors.white}>
        <BenefitLeftColumn>
          <SmallRedText>Supportify.</SmallRedText>
          <BigHeading style={{ color: "white" }}>GREAT BENEFITS</BigHeading>
          <SmallSquare color={theme.colors.primary} />
          <NormalText style={{ color: "white" }}>
            You are working hard, and you have a passion for what you do.
            Wouldn’t it be nice to get some appreciation and even Flow tokens
            for your project? Supportify was designed for amazing people who are
            building awesome projects and for awesome people, who appreciate
            amazing projects.
          </NormalText>
        </BenefitLeftColumn>
        <ColumnCenterWrapper style={{ flex: 0.9 }}>
          <BenefitRightColumn>
            <BenefitCard
              icon={membershipIcon}
              title={"Membership programs"}
              body={
                "Manage and distribute membership programs to your audience or community."
              }
            />
            <BenefitCard
              icon={clapHands}
              title={"Content gating"}
              body={
                "Gate access to features or content using LinkLock protocol."
              }
            />
            <BenefitCard
              icon={flowIcon}
              title={"Get compensated for your work"}
              body={
                "Setup periodic subscriptions for your membership programs."
              }
            />
          </BenefitRightColumn>
        </ColumnCenterWrapper>
      </Section>
      <BgSection>
        <HWorkLeftColumn>
          <SmallRedText style={{ color: theme.colors.darkViolet }}>
            4 SIMPLE STEPS.
          </SmallRedText>
          <BigHeading style={{ color: theme.colors.darkViolet }}>
            HOW DOES <br />
            IT WORK?
          </BigHeading>
          <SmallSquare color={theme.colors.darkViolet} />
          <NormalText>
            It could not be easier! Create a membership with custom requirements
            though our dashboard. Then offer your membership to your supporters.
            Members will be awarded with a NFT, which will be added in their
            wallet.
          </NormalText>
        </HWorkLeftColumn>
        <HWorkRightColumn>
          <StepsWrapper>
            <Steps>
              <Step num={2} text={"Define membership requirements"} />
              <Step num={3} text={"Create & offer membership"} />
              <Step num={4} text={"Gate access to features or content"} />
            </Steps>
          </StepsWrapper>
        </HWorkRightColumn>
      </BgSection>
    </>
  );
};

export default Home;
