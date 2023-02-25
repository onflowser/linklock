import { Header } from './shared/header/Header';
import { Stepper } from './shared/stepper/Stepper';
import './steps.scss';
import './StepOnePreview.scss';
import { MembershipBox } from './shared/membership-box/MembershipBox';
import { Button } from './shared/button/Button';

export interface StepOnePreviewProps {
    onClick: any;
}


export function StepOnePreview({onClick}: StepOnePreviewProps) {
    return (
        <div className='step-container'>
            <Header></Header>
            <Stepper step={2} stepTitle={'Membership Preview'}></Stepper>

            {/* MEMBERSHIP CONTENT */}
            <div className={'membership-box-wrapper'}>
                <div className={'inner-wrapper'}>
                    <MembershipBox coins={'1 FLOW'} name={'Jane Doe'}
                                   thumb={'https://www.visme.co/wp-content/uploads/2021/06/Thumbnail-maker-share.jpg'}
                                   membershipName={'Membership name'} duration={'1 Month'}
                                   usd={'12.99 USD'}></MembershipBox>
                </div>
            </div>

            {/* WALLET CONTENT */}
            <div className={'wallet-wrapper'}>
                <span>Wallet: 0X123B…C45d</span>
                <span>Disconnect</span>
            </div>

            {/* NAVIGATION CONTENT */}
            <div className={'button-wrapper'}>
                <Button onClick={onClick}>REDEEM</Button>
            </div>
        </div>
    );
}
