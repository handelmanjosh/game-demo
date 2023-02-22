import React from 'react';

export type SoccerResult = {
    myPick: string;
    abbreviation: "G" | "S";
};

type Props = {
    recentResults: SoccerResult[];
};

function ResultsStreak({ recentResults }: Props) {

    return (
        <div className="flex flex-row gap-[4px] sm:gap-[5px]">
            {recentResults.map((result, index) => (
                <ResultCircle key={index} result={result} />
            ))}
        </div>
    );
}

export default ResultsStreak;


function ResultCircle({ result }: { result: SoccerResult; }) {
    const WLD = result.abbreviation;
    const choice = result.myPick;

    const circleColor = `${WLD == "G" ? "bg-green-500/30" : "bg-red-500/25"}`;
    // const imageUrl = `${choice == "rock" ? "/icon-rock.png" : choice == "paper" ? "/icon-paper.png" : "/icon-scissors.png"}`;
    const choiceLetter = `${choice == "right" ? "→" : choice == "left" ? "←" : "↑"}`;
    return (
        <div className='flex flex-col'>
            {/* <div>{result.myPick}</div> */}
            <div className={`flex justify-center items-center rounded-full p-[10px] h-[25px] w-[25px] sm:h-[35px] sm:w-[35px] ${circleColor}`}>
                <div className='text-sm'>{choiceLetter}</div>
                {/* <img src={imageUrl} className={"w-[15px]"} /> */}
            </div>
        </div>
    );
}