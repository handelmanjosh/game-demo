import React, { BlockquoteHTMLAttributes } from 'react';
import { TOWER_LEVEL_INC_MAP } from '../../constants';
type Props = {
    showLabel: boolean;
    imgUrl?: string;
};

function CoolRow({ showLabel }: Props) {
    return (
        <div className=" flex items-center font-press-start"> <img src="/BoletoFive.png" /> <p> {showLabel ? `"+" ${3}` : ""} </p>    </div>
    );
}

export default CoolRow;
