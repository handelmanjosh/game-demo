type SpaceButtonProps = {
    text: string;
    ondown?: () => any;
    onup: () => any;
    color?: string;
};
let bg;
let border;
export default function SpaceButton({ text, ondown, onup, color }: SpaceButtonProps) {
    if (color == "green") {
        bg = "bg-green-600";
        border = "border-green-600";
    } else if (color === "yellow") {
        bg = "bg-yellow-400";
        border = "border-yellow-400";
    } else {
        bg = "bg-white";
        border = "border-white";
    }
    return (
        <div className={`relative flex items-center justify-center`}>
            <button className="relative bg-transparent cursor-pointer group outline-offset-8 hover:brightness-[110%]"
                onPointerDown={ondown}
                onPointerUp={onup}
            >
                <span className="absolute top-0 left-0 w-full h-full bg-black rounded-md md:rounded-xl translate-y-[2px] group-hover:translate-y-[3px] group-active:translate-y-[1px] transition-transform"></span>
                <span className={`absolute top-0 left-0 w-full h-full ${bg} rounded-md md:rounded-xl`}></span>
                <span className={`block relative p-2 md:py-5 md:px-10 rounded-md md:rounded-xl bg-black translate-y-[-8px] group-hover:translate-y-[-7px] group-active:translate-y-[-2px] transition-transform border-2 ${border} `}>
                    <p className="text-xs md:text-sm text-white font-press-start"> {text} </p>
                </span>
            </button>
        </div>
    );
}