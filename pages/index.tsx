import GameCard from "@/components/GameCard";


export default function Home() {
  return (
    <>
    <div className="flex flex-row justify-center items-center">
      <div className="flex flex-col">
        <GameCard link="/asteroid-dodge" message="Asteroid Dodge" />
        <GameCard link="/asteroid-shoot" message="Asteroid Shoot" />
        <GameCard link="/brick" message="Brick" />
        <GameCard link="/spin-o-rama" message="Spin" />
        <GameCard link="/soccer" message="Soccer" />
      </div>
    </div>
</>
  )
}
