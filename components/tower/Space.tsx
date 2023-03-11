import React, { useEffect, useState } from 'react';

interface Props {
    id: number;
}


function Space({ id }: Props) {
    const borderStyle = "border-dotted border-[1px] md:border-[2px] border-white";
    const spaceStyle = "h-7 w-7 md:h-10 md:w-10 bg-contain bg-no-repeat bg-transparent rounded-md md:rounded-lg " + borderStyle;
    return (
        <>
            <div className={spaceStyle} id={id.toString()}>
            </div>
        </>
    );
}

export default Space;