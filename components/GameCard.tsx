import Link from "next/link";
type GameCardProps = {
    link: string;
    name: string;
    description: string;
}

export default function GameCard({ link, name, description }: GameCardProps) {
    return (
        <>
            <Link href={link}>
                <div className="flex flex-col items-start justify-start border-2 border-white rounded-md py-4 px-2 hover:-translate-x-1 hover:-translate-y-1">
                    <strong className="text-white"> {name} </strong>
                    <div className="text-white"> {description} </div>
                </div>
            </Link> 
        </>
    )
}