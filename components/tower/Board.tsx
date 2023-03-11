import React from "react";
import Space from "./Space";


type Props = {
    height: number;
    width: number;
};

function Board({ height, width }: Props) {
    const rowStyle = "flex flex-row gap-1";
    let heightArray: number[] = [];
    for (let i = 0; i < height; i++) {
        heightArray.push(i);
    }
    let stuff: number[][] = [];
    let temp = [];
    for (let i = 0; i < height * width; i++) {
        temp.push(i);
        if ((i + 1) % width == 0) {
            stuff.push(temp);
            temp = [];
        }
    }
    return (
        <>
            {heightArray.map(i => (
                <div key={i} className={rowStyle}>
                    {stuff[i].map(ii => (
                        <Space key={ii} id={ii} />
                    ))}
                </div>
            )
            )}
        </>
    );
}

export default Board;