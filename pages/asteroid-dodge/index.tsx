import { NextPage } from "next";
import { useEffect, useState } from "react";
import Player from "../../components/asteroid-dodge/Player";
import AsteroidController from "../../components/asteroid-dodge/Asteroid";
import { TicketController } from "../../components/asteroid-dodge/TicketController";
import SpaceButton from "../../components/SpaceButton";

const tickNextLevel = 2000;
let width: number, height: number;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let img: HTMLImageElement;
let player: Player;
let asteroidController: AsteroidController;
let ticketController: TicketController;
let tick: number = 0;
let tickets: number = 0;
let levelNum: number = 1;
let levelUp: boolean = false;
let hasWagered: boolean = false;
let levelController = { delay: 60, vMax: 4, widthMax: 50, widthMin: 20, healthMax: 2, number: 1 };
let ticketLevelController = { delay: 100, vMax: 5, widthMax: 50, widthMin: 50, n: 1 };
const widthIncrease = () => { levelController.widthMax += 10; };
const widthDecrease = () => {
    if (levelController.widthMin > 10) {
        levelController.widthMin -= 2;
    }
};
const delayDecrease = () => {
    if (levelController.delay > 5) {
        levelController.delay -= 5;
    }
    if (ticketLevelController.delay > 5) {
        ticketLevelController.delay -= 5;
    }
};
const healthIncrease = () => { levelController.healthMax++; };
const numberIncrease = () => { levelController.number++; ticketLevelController.n++; };
const resetDefaults = () => {
    levelController = { delay: 60, vMax: 4, widthMax: 50, widthMin: 20, healthMax: 2, number: 1 };
    ticketLevelController = { delay: 100, vMax: 5, widthMax: 50, widthMin: 50, n: 1 };
};
let maxX: number, maxY: number;
const AsteroidDodge: NextPage = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [totalTickets, setTotalTickets] = useState<number>(0);
    const [canWager, setCanWager] = useState<boolean>(false);
    const [wagerAmount, setWagerAmount] = useState<number>(0);
    useEffect(() => {
        if (window.innerWidth < 768) {
            width = height = 300;
            maxX = maxY = height;
        } else {
            width = height = 600;
            maxX = maxY = height;
        }
        canvas = document.getElementById("gameField") as HTMLCanvasElement;
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        img = document.createElement("img");
        img.src = "/star_background.png";
        frame();
    }, []);
    const frame = () => {
        if (!document.getElementById("gameField")) return;
        resetCanvas();
        if (levelUp) {
            ctx.font = "32px 'Press Start 2P'";
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.fillText(`Level ${levelNum}`, canvas.width / 2, canvas.height / 2);
        }
        if (!player?.dead) {
            if (tick % levelController.delay == 0) {
                asteroidController?.genAsteroid(levelController.vMax, levelController.widthMax, levelController.widthMin, levelController.healthMax, levelController.number);
            }
            if (tick % ticketLevelController.delay == 0) {
                ticketController?.genTicket(ticketLevelController);
            }
            if (tick % tickNextLevel == 0 && tick != 0 && !player?.dead) nextLevel();
            tick++;
        }
        player?.draw(player.x, player.y, asteroidController);
        ticketController?.draw();
        asteroidController?.draw();
        if (player?.dead) {
            if (hasWagered || tickets == 0) {
                endGame();
            } else {
                setCanWager(true);
            }
        }
        if (player && player.tickets != tickets) {
            tickets = player.tickets;
            setTotalTickets(player.tickets);
        }
        requestAnimationFrame(frame);
    };
    const resetCanvas = () => {
        ctx.drawImage(img, 0, 0, width, height);
    };
    const endGame = () => {
        if (hasWagered) {
            if (tickets > wagerAmount) {
                //player gets their tickets plus 2 * the wager
            } else {
                //player just gets their tickets from this round
            }
        } else {
            //credit player with tickets
        }
        setIsPlaying(false);
        setCanWager(false);
    };
    const makeWager = () => {
        //make a wager
        //deduct one credit from player
        setWagerAmount(player.tickets);
        resetCurrentTickets();
        setCanWager(false);
        respawn();
        hasWagered = true;
    };
    const nextLevel = () => {
        levelNum++;
        if (levelNum % 5 == 0) {
            numberIncrease();
        }
        levelUp = true;
        setTimeout(() => {
            levelUp = false;
        }, 1000);
        widthIncrease();
        widthDecrease();
        delayDecrease();
        healthIncrease();
    };
    const play = () => {
        resetGame();
        respawn();
    };
    const resetCurrentTickets = () => {
        tickets = 0;
        setTotalTickets(0);
    };
    const resetGame = () => {
        setIsPlaying(true);
        setCanWager(false);
        setWagerAmount(0);
        resetCurrentTickets();
        tick = 0;
        levelNum = 0;
        levelUp = false;
        hasWagered = false;
        resetDefaults();
    };
    const respawn = () => {
        player = new Player(30, 5, maxX, maxY, canvas, ctx);
        asteroidController = new AsteroidController(ctx, width, height);
        ticketController = new TicketController(ctx, width, height, player);
    };
    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <div className="mt-6 flex flex-row justify-center items-center">
                    <canvas id="gameField" style={{ width: width, height: height }} />
                </div>
                <div className="flex flex-col justify-center items-center mt-6">
                    <div className="flex flex-row justify-center items-center">
                        {!isPlaying ?
                            <SpaceButton onup={play} text="Click to Play!" />
                            : <p className="text-white font-press-start"> Tickets Won: {`${totalTickets}`} </p>}
                    </div>
                    <div className="flex flex-row gap-4 justify-center mt-6 items-center">
                        {isPlaying ? canWager ?
                            <>
                                <SpaceButton onup={makeWager} text="Wager Your Tickets..." color="yellow" />
                                <SpaceButton onup={endGame} text="Cash Out" color="green" />
                            </>
                            : wagerAmount > 0 ? <p className="text-white font-press-start"> Your Wager: {`${wagerAmount}`} </p> : <></> : <></>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AsteroidDodge;;