import type { NextPage } from "next";
import Image from "next/image";
import styled, { css } from "styled-components";
import { Children, useState } from "react";
import { theme } from "../common/theme";
import { useFcl } from "../common/user-context";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

// components
import RoundLink from "../components/RoundLink";

// resources
import blobImage from "../public/images/blob.svg";
import teaCupImage from "../public/images/flow-tea-cup.png";
import heartImage from "../public/images/heart.png";
import clapHands from "../public/images/clap-hands.png";
import freeIcon from "../public/images/free.png";
import flowIcon from "../public/images/flow.png";
import recurringPaymentIcon from "../public/images/recurring-payment.png";
import teaImage from "../public/images/big-cup.svg";
import MetaTags from "../components/MetaTags";

// --LANDING--SECTION--
/* BIG INPUT */
const BigNameInputWrapper = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 10rem;
  opacity: 1;

  display: flex;
  direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0.8rem 0.8rem 2rem;

  &:focus-within {
    outline: auto;
  }

  max-width: 96vw;

  box-sizing: border-box;
`;
const BigInputText = styled.div`
  text-align: left;
  font-weight: bold;
  font-size: 1.3rem;
  line-height: 2rem;

  letter-spacing: 0px;
  color: ${(props) => props.theme.colors.mainDark};
  opacity: 1;

  @media only screen and (max-width: 700px) {
    display: none;
  }
`;
const BigInputInput = styled.input`
  color: ${(props) => props.theme.colors.mainDark};
  border: none;
  font-size: 1.3rem;
  line-height: 2rem;
  font-weight: bold;
  letter-spacing: 0px;
  padding: 0;
  flex-grow: 1;

  //padding: 0 0.5rem;

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
      <BigInputText>buymeaflowtea.com/</BigInputText>
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
  font-size: 20px;
  color: ${theme.colors.white};
  text-align: center;
  padding-bottom: 3rem;
  opacity: 0.9;
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
  padding: 3rem;
  margin: 0;
  color: ${theme.colors.white};

  @media only screen and (max-width: 1300px) {
    font-size: 3rem;
    line-height: 5rem;
  }
`;
const LandingSection = styled.div`
  background-color: #e5e5f7;
  background-image: url("/images/landing-gradient.webp");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  height: calc(100vh - ${theme.layout.navbar_height});
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

  color: ${(props) => props.theme.colors.primary};
`;

const BigHeading = styled.h1`
  font-weight: 900;
  font-size: 4rem;
  line-height: 84px;
  margin: 0;

  @media only screen and (max-width: 500px) {
    line-height: 5rem;
  }
`;

const BoldNormal = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: bold;
  padding-bottom: 2rem;
  padding-top: 3rem;
`;
const NormalText = styled.div`
  font-size: 1.5rem;
  font-weight: medium;
  line-height: 2rem;
  padding-bottom: 2rem;
`;
const BlobImageWrapper = styled.div`
  height: 100%;
  max-width: 35rem;
  aspect-ratio: 382.823/409.499;
  position: relative;
`;
const TeaCupsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 3rem;

  @media only screen and (max-width: 1200px) {
    position: initial;
    margin: 3rem 0;
  }
`;
const TeaCupRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const TeaCup = styled.div`
  position: relative;
  width: 5rem;
  height: 5rem;
  margin-right: 0.7rem;
`;
const HeartImage = styled.div`
  position: relative;
  width: 5rem;
  height: 5rem;
  margin-right: 0.7rem;
  transform: scale(0.75);
`;
// --Hey--You--Section--

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
  line-height: 1.5rem;
  font-weight: medium;
  letter-spacing: 0px;
  color: white;
`;
const BenefitBody = styled.div`
  flex-grow: 1;
`;
const BenefitContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-bottom: 1.5rem;

  @media only screen and (max-width: 1200px) {
    padding-bottom: 2.5rem;
  }

  &:first-child {
    padding-top: 3rem;
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
      <Image src={icon} layout="fill" />
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
  background: ${(props) => props.theme.colors.darkViolet};
  padding: 1rem 1rem 1rem 0;
  align-items: center;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 9px 12px 1px rgba(0, 0, 0, 0.14),
    0 3px 16px 2px rgba(0, 0, 0, 0.12), 0 5px 6px -3px rgba(0, 0, 0, 0.2);
  width: 18rem;
  z-index: 2;
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
  z-index: 2;
  position: absolute;
`;
const TeaImage = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;
const TeaImageWrapper = styled.div`
  position: absolute;
  height: 25rem;
  width: 18.02rem;
  bottom: -2.2rem;
  right: 0;
`;
const HWorkLeftColumn = styled(Column)`
  flex: 1;
  padding-right: 10rem;
  box-sizing: border-box;
  @media only screen and (max-width: 1200px) {
    padding-right: 0;
  }
`;
const HWorkRightColumn = styled(Column)`
  flex: 1;
  @media only screen and (max-width: 1200px) {
    padding-top: 3rem;
    width: 30rem;
  }
`;
// --How--does--it--work--section--

const Home: NextPage = () => {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const { isLoggedIn, isRegistered, isHandleAvailable } = useFcl();
  const isExistingUser = isLoggedIn && isRegistered;

  async function onGoToProfile() {
    const handleAvailable = await isHandleAvailable(handle).catch((e) => {
      toast.error("Failed to fetch project info!");
    });
    if (isExistingUser) {
      if (!handleAvailable) {
        await router.push(`/${handle}`);
      } else {
        toast.error("Project not found, try a different handle!");
      }
      return;
    }
    if (!handle) {
      toast.error("Please enter a handle!");
      return;
    }
    if (handleAvailable) {
      return router.push(`/settings?handle=${handle}`);
    } else {
      toast.error("This handle is already taken!");
    }
  }

  return (
    <>
      <MetaTags title="FlowTea ☕️" />
      <LandingSection>
        <CenterTitleBox>
          <MainHeading>Let your appreciators buy you a Flow tea.</MainHeading>
          <Subtitle>
            Start getting founds for your project(s) in FLOW crypto currency.
            Create your profile and share it to your appreciators. It is easy,
            free and quick!
          </Subtitle>
          <BigInput
            value={handle}
            onChange={setHandle}
            placeholder={
              isExistingUser ? "project handle" : "your unique handle"
            }
            linkTitle={isExistingUser ? "Search" : "Create your page"}
            linkHref=""
            onClick={onGoToProfile}
          />
        </CenterTitleBox>
      </LandingSection>
      <Section
        bgcolor={theme.colors.lightViolet}
        color={theme.colors.secondary}
      >
        <Column>
          <SmallRedText>WHAT IS FlowTea?</SmallRedText>
          <BigHeading>HEY YOU!</BigHeading>
          <BoldNormal>
            You have built something really awesome or designed something really
            beautiful!
          </BoldNormal>
          <NormalText>
            Wouldn’t be nice if everyone, who appreciate your work, would buy
            you a tea? Now they can! They are not your <s>customers</s>, they
            are your appreciators 💜
          </NormalText>
        </Column>
        <HeyYouBlobColumn>
          <BlobImageWrapper>
            <Image src={blobImage} layout="fill" />
            <TeaCupsWrapper>
              <div>
                {[...Array(5)].map((_, i) => (
                  <TeaCupRow key={`_tea_cup_row_${i}`}>
                    {[...Array(4)].map((__, j) =>
                      i == 4 - j ? (
                        <HeartImage key={`_heart_${i}${j}`}>
                          <Image src={heartImage} layout="fill" />
                        </HeartImage>
                      ) : (
                        <TeaCup key={`_tea_cup_${i}${j}`}>
                          <Image src={teaCupImage} layout="fill" />
                        </TeaCup>
                      )
                    )}
                  </TeaCupRow>
                ))}
              </div>
            </TeaCupsWrapper>
          </BlobImageWrapper>
        </HeyYouBlobColumn>
      </Section>
      <Section bgcolor={theme.colors.secondary} color={theme.colors.white}>
        <BenefitLeftColumn>
          <SmallRedText>BUY ME A FLOW TEA.</SmallRedText>
          <BigHeading style={{ color: "white" }}>AMAZING BENEFITS</BigHeading>
          <SmallSquare color={theme.colors.primary} />
          <NormalText style={{ color: "white" }}>
            You are working hard, and you have a passion for what you do.
            Wouldn’t it be nice to get some appreciation and even Flow tokens
            for your project? FlowTea was designed for amazing people who are
            building awesome projects and for awesome people, who appreciate
            amazing projects.
          </NormalText>
        </BenefitLeftColumn>
        <ColumnCenterWrapper style={{ flex: 0.9 }}>
          <BenefitRightColumn>
            <BenefitCard
              icon={clapHands}
              title={"Get paid from your appreciators"}
              body={
                "Share your link or widget with your community and your appreciators can support you directly!"
              }
            />
            <BenefitCard
              icon={freeIcon}
              title={"It is FREE!"}
              body={
                "There is no membership you would have to pay! There is only 5% fee on the transaction, you know, for our tea."
              }
            />
            <BenefitCard
              icon={flowIcon}
              title={"Get paid in FLOW"}
              body={
                "You will get your FLOW tokens directly on your FLOW address. Isn’t that awesome?"
              }
            />
            <BenefitCard
              icon={recurringPaymentIcon}
              title={"Recurring Payments"}
              body={
                "Your appreciators can support you or your project monthly! With the Recurring Payment possibility, the same amount of Flow tokens can be transferred each month!"
              }
            />
          </BenefitRightColumn>
        </ColumnCenterWrapper>
      </Section>
      <Section color={theme.colors.white} bgcolor={theme.colors.darkViolet}>
        <HWorkLeftColumn>
          <SmallRedText style={{ color: theme.colors.white }}>
            4 SIMPLE STEPS.
          </SmallRedText>
          <BigHeading style={{ color: theme.colors.darkBlue }}>
            HOW DOES IT WORK?
          </BigHeading>
          <SmallSquare color={theme.colors.darkBlue} />
          <NormalText>
            It could not be easier! Create your profile, add your FLOW address
            and share your link or the widget. When you will get the support
            from your appreciator, the amount will be send on your FLOW address.
          </NormalText>
        </HWorkLeftColumn>
        <HWorkRightColumn>
          <StepsWrapper>
            <Steps>
              <Step num={1} text={"Create your page"} />
              <Step num={2} text={"Connect your wallet"} />
              <Step num={3} text={"Share your link"} />
              <Step num={4} text={"Get your FLOW tokens"} />
            </Steps>
            <TeaImageWrapper>
              <TeaImage>
                <Image src={teaImage} layout="fill" />
              </TeaImage>
            </TeaImageWrapper>
          </StepsWrapper>
        </HWorkRightColumn>
      </Section>
    </>
  );
};

export default Home;
