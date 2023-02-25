import { ExternalLink } from './shared/icons/ExternalLink';
import { Header } from './shared/header/Header';
import { Stepper } from './shared/stepper/Stepper';
import { Button } from './shared/button/Button';
import './StepThreeClaimed.scss';

export interface StepThreeClaimedProps {
    onClick: any;
    thumb: string;
    name: string;
}

export function StepThreeClaimed({onClick, thumb, name}: StepThreeClaimedProps) {


    return (
        <div className='step-container'>
            <Header></Header>
            <Stepper step={3} stepTitle={'Your membership'}></Stepper>
            <div className="wrapper">
                <div className={'inner-wrapper'}>
                    <div className={'membership-name'}>
                        <div>
                            <img src={thumb} alt={name}/>
                        </div>
                        <div>
                            <span>{name}</span>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <a href="#somewhere">view NFT
                                <ExternalLink></ExternalLink>
                            </a>
                        </div>
                    </div>
                </div>

                <Button onClick={onClick}>DONE</Button>
            </div>
        </div>
    );
}
