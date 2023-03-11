
interface PlayButtonProps {
    startPlay?: () => any;
    disable: boolean;
    result?: boolean;
}

export function PlayButton({ startPlay, disable }: PlayButtonProps) {
    return (
        <div className={`relative place-self-center items-center z-10`}>
            <button
                disabled={disable}
                type="button"
                className="relative bg-transparent cursor-pointer group outline-offset-8 hover:brightness-[110%]"
                onClick={() => startPlay!()}
            >
                {/* <img src={`/icon-${choice}.png`} alt={choice}/> */}
                <span className="absolute top-0 left-0 w-full h-full bg-gray-800 rounded-full translate-y-[2px] group-hover:translate-y-[3px] group-active:translate-y-[1px] transition-transform"></span>
                <span className="absolute top-0 left-0 w-full h-full bg-[#54009e] rounded-full"> </span>
                <span className="block relative  rounded-full bg-[#7b00ff] translate-y-[-8px] group-hover:translate-y-[-7px] group-active:translate-y-[-2px] transition-transform border-2 border-gray-900 border-opacity-20">
                    <p className="font-press-start text-xs md:text-lg lg:text-xl p-2 md:p-4 lg:p-6 "> SPIN </p>
                </span>
            </button>
        </div>
    );
};