import GameCard from "@/components/GameCard";
import { useEffect, useState } from "react";

let ran = 0;
export default function Home() {
  const [mobile, setMobile] = useState<boolean>(false);
  useEffect(() => {

    if (window.innerWidth < 768 && ran == 0) {
      setMobile(true);
      alert("We've notices you're playing on a mobile device. Some games might not work properly. We recommend rotating your device and reloading or using a wider device")
    }
    ran++;
  }, [])
  return (
    <>
    <div className="flex flex-row justify-center items-center">
      <div className="flex flex-col gap-2 mt-3">
        <GameCard link="/asteroid-dodge" name="Asteroid Dodge" description="Dodge the asteorids to survive!" />
        <GameCard link="/asteroid-shoot" name="Asteroid Shoot" description="Shoot the asteorids to win points!" />
        <GameCard link="/space-fight" name="Space Fight" description="Multiplayer spaceship game" />
        <GameCard link="/brick" name="Brick" description="Classic BrickBreaker"/>
        <GameCard link="/icytower" name="Icy Tower" description="Stack the blocks to win!" />
        <GameCard link="/CryptoVillains" name="Crypto Villains" description="Crypto-Themed shooter game" />
        <GameCard link="/spin-o-rama" name="Spinner" description="Spin to win!" />
        <GameCard link="/soccer" name="Soccer" description="Basic soccer game" />
      </div>
    </div>
</>
  )
}
