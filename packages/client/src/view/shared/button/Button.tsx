import './Button.scss';

export interface ButtonProps {
    children: any;
    onClick?: any;
    disabled?: boolean
}

export function Button({children, onClick, disabled}: ButtonProps) {
    return (
        <button className={'button'} disabled={disabled} onClick={onClick}>{children}</button>
    );
}
