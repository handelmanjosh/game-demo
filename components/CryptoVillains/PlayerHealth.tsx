
type Props = {
    health: number;
    maxHealth: number;
};

export default function PlayerHealth({ health, maxHealth }: Props) {
    let percentage = (health / maxHealth) * 100;
    if (percentage < 0) percentage = 0;
    return (
        <>
            <div className="bg-gray-300 mt-2 h-8 w-full rounded-full overflow-hidden relative">
                <div className="bg-green-500 h-full w-full" style={{ width: `${percentage}%` }} />
            </div>
        </>
    );
}