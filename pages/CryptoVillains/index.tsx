import { NextPage } from "next";
import { useState, useEffect, useRef, Fragment } from "react";
import Head from "next/head";
import Player from "../../components/CryptoVillains/Player";
import Enemy from "../../components/CryptoVillains/Enemy";
import BulletSelector from "../../components/CryptoVillains/BulletSelector";
import { BulletController, BasicController } from "../../components/CryptoVillains/BasicController";
import Wave, { CZ, CelsiusToken, DoKwon, FTXExchange, FTXToken, LUNAToken, SBF, TerraToken } from "../../components/CryptoVillains/Wave";
import PlayerHealth from "../../components/CryptoVillains/PlayerHealth";

let canvas: any;
let ctx: any;
let player: Player;
let playerBullets: BulletController;
let enemies: BasicController<Enemy>;
const width = 600;
const height = 600;
const wave1 = [FTXToken, FTXToken, FTXToken, FTXToken, FTXToken, FTXToken, FTXToken, FTXToken, FTXToken];
const wave1Positions = [[100, 100], [150, 100], [200, 100], [250, 100], [300, 100], [350, 100], [400, 100], [450, 100], [500, 100]];
const wave2 = [CZ];
const wave2Positions = [[100, 100]];
const wave3 = [CelsiusToken, CelsiusToken, CelsiusToken, CelsiusToken, CelsiusToken, CelsiusToken, CelsiusToken, CelsiusToken, CelsiusToken];
const wave3Positions = [[100, 100], [150, 100], [200, 100], [250, 100], [300, 100], [350, 100], [400, 100], [450, 100], [500, 100]];
const wave4 = [CZ];
const wave4Positions = [[100, 100]];
const wave5 = [DoKwon];
const wave5Positions = [[100, 100]];
const wave6 = [CZ];
const wave6Positions = [[100, 100]];
const wave7 = [TerraToken, TerraToken, TerraToken, TerraToken, TerraToken, TerraToken, TerraToken, TerraToken, TerraToken];
const wave7Positions = [[100, 100], [150, 100], [200, 100], [250, 100], [300, 100], [350, 100], [400, 100], [450, 100], [500, 100]];
const wave8 = [FTXExchange, FTXExchange];
const wave8Positions = [[0, 0], [0, 500]];
const wave9 = [CZ];
const wave9Positions = [[100, 100]];
const wave10 = [SBF];
const wave10Positions = [[100, 100]];
const waves = [[wave1, wave1Positions], [wave2, wave2Positions], [wave3, wave3Positions], [wave4, wave4Positions], [wave5, wave5Positions], [wave6, wave6Positions], [wave7, wave7Positions], [wave8, wave8Positions], [wave9, wave9Positions], [wave10, wave10Positions]];
let waveIndex = -1;
const CryptoVillains: NextPage = () => {
    const [balance, setBalance] = useState(null);
    const [ticketCount, setTicketCount] = useState(null);
    const [selectedBullet, setSelectedBullet] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [playerHealth, setPlayerHealth] = useState<number>(0);
    const [bulletsUnlocked, setBulletsUnlocked] = useState<boolean[]>([true, false, false, false, false]);
    useEffect(() => {
        waveIndex = -1;
        canvas = document.getElementById("gameField");
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        enemies = new BasicController<Enemy>();
        playerBullets = new BulletController(ctx, canvas, enemies);
        player = new Player(width / 2, 550, 10, canvas, playerBullets, ctx, enemies, bulletsUnlocked);
        gameLoop();
        document.addEventListener("click", function (e) {
            player.shoot();
        });
        document.addEventListener("mousedown", function (e) {
            document.addEventListener("mousemove", moveTo);
            document.addEventListener("mouseup", stopReportingMousePosition);
        });
    }, []);
    useEffect(() => {
        player.selectedBullet = selectedBullet;
    }, [selectedBullet]);
    function stopReportingMousePosition() {
        document.removeEventListener("mousemove", moveTo);
    }
    function moveTo(e: MouseEvent) {
        let canvasRect = player.canvas.getBoundingClientRect();
        player.x = e.clientX - canvasRect.left - (player.width / 2);
        if (player.x < 0) player.x = 0;
        if (player.x > player.canvas.width) player.x = player.canvas.width;
    }
    async function gameLoop() {
        if (!document.getElementById("gameField")) return;
        resetCanvas();
        playerBullets.draw(ctx);
        enemies.draw(ctx);
        player.draw(ctx);
        setPlayerHealth(player.health);
        if (enemies.EnemyList.length == 0) {
            makeWave();
        }
        requestAnimationFrame(gameLoop);
    }
    function makeWave() {
        waveIndex++;
        if (waveIndex >= waves.length) return;
        //@ts-ignore
        Wave(waves[waveIndex][0], enemies, ctx, canvas, player, waves[waveIndex][1]);
    }
    async function resetCanvas() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return (
        <>
            <div className="flex flex-row justify-center  ">
                <div className="mr-2 flex flex-col justify-center  w-[50px]"></div>
                <div className="flex flex-col justify-center">
                    <div style={{ width: width, height: height }}>
                        <canvas className="bg-black" id="gameField"></canvas>
                    </div>
                    <PlayerHealth health={playerHealth} maxHealth={300} />
                </div>
                <div className="ml-2 py-3 flex flex-col-reverse gap-1 w-[50px]">
                    {bulletsUnlocked[0] ? <BulletSelector startSelected={true} imgName="/shooter-elements/bitcoin.png" selectButton={"z"} others={"xcvb"} onSelect={() => setSelectedBullet(1)} /> : <></>}
                    {bulletsUnlocked[1] ? <BulletSelector imgName="/shooter-elements/eth.png" selectButton={"x"} others={"zcvb"} onSelect={() => setSelectedBullet(2)} /> : <></>}
                    {bulletsUnlocked[2] ? <BulletSelector imgName="/shooter-elements/solana.png" selectButton={"c"} others={"zxvb"} onSelect={() => setSelectedBullet(3)} /> : <></>}
                    {bulletsUnlocked[3] ? <BulletSelector imgName="/shooter-elements/dogecoin.png" selectButton={"v"} others={"zxcb"} onSelect={() => setSelectedBullet(4)} /> : <></>}
                    {bulletsUnlocked[4] ? <BulletSelector imgName="/shooter-elements/tesla.png" selectButton={"b"} others={"zxcv"} onSelect={() => setSelectedBullet(5)} /> : <></>}
                </div>
            </div>
        </>
    );
};
export default CryptoVillains;