import { size } from "lodash";

interface PlayButtonProps {
    startPlay?: (choice: 'left' | 'center' | 'right') => void;
    disable: boolean;
    choice: 'left' | 'center' | 'right';
    result?: boolean;
    id: string;
}

export function PlayButton({ startPlay, disable, choice, id }: PlayButtonProps) {
    return (
        <div className={`relative place-self-center items-center z-10`}>
            <button
                disabled={disable}
                type="button"
                id={id}
                className="relative bg-transparent cursor-pointer group outline-offset-8 hover:brightness-[110%]"
                onClick={() => startPlay(choice)}
            >
                {/* <img src={`/icon-${choice}.png`} alt={choice}/> */}

                <span className="absolute top-0 left-0 w-full h-full bg-[#b0b0b0] rounded-full"> </span>
                <span className="block relative  rounded-full bg-[#e8e4e4] translate-y-[-1px] group-hover:translate-y-[-1px] group-active:translate-y-[-1px] md:translate-y-[-3px] md:group-hover:translate-y-[-2px] md:group-active:translate-y-[-1px] transition-transform border-2 border-gray-900 border-opacity-20">
                    <img src={`/target.png`} className=" w-[10vw] h-[10vw] md:w-[7vw] md:h-[7vw] lg:w-[7vw] lg:h-[7vw] xl:w-[5vw] xl:h-[5vw]" />
                </span>
            </button>
        </div>
    );
};