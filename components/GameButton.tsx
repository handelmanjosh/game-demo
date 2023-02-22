import React from 'react';

type Props = {
    onClick: () => void;
    message?: string;
    color?: string;
    disabled?: boolean;
};


function GameButton({ onClick, message, color, disabled }: Props) {
    let bgStyle = "";
    if (color == null) {
        bgStyle = " bg-[#a834eb]";
    } else {
        if (color == "green") {
            bgStyle = " bg-[#0d9424]";
        }
    }

    return (
        <button className={"py-2 px-4 active:brightness-75 w-full text-sm font-medium rounded " + bgStyle} onClick={onClick} disabled={disabled} >
            {message ?? "Play Now"}
        </button>
    );
}
export default GameButton;