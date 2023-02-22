import Link from "next/link";
type GameCardProps = {
    link: string;
    message: string;
}

export default function GameCard({ link, message }: GameCardProps) {
    return (
        <>
            <Link href={link}>
                {message}
            </Link> 
        </>
    )
}