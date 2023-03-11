import { NextPage } from "next";
import { useState, useEffect, useRef, Fragment } from "react";
import Head from "next/head";
import Player from "../../components/brick/Player";
import Ball from "../../components/brick/Ball";
import BrickController, { Brick } from "../../components/brick/BrickController";
import BallController from "../../components/brick/BallController";
import PowerUpController, { PowerUp } from "../../components/brick/PowerUpController";
import BrickButton from "../../components/brick/BrickButton";
import GameButton from "../../components/GameButton";



let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let player: Player;
let ball: Ball;
let brickController: BrickController;
let ballController: BallController;
let powerUpController: PowerUpController;
let backgroundImage: HTMLImageElement;
let tickets: number = 0;
let lives: number = 1;
let newLife = false;
let newLifeCounter = 0;
let canShoot2: boolean;
const BrickBreaker: NextPage = () => {
    const [balance, setBalance] = useState(null);
    const [ticketCount, setTicketCount] = useState(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [canShoot, setCanShoot] = useState<boolean>(false);
    const [ticketsWon, setTicketsWon] = useState<number>(0);
    useEffect(() => {
        canvas = document.getElementById("gameField") as HTMLCanvasElement;
        ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        if (window.innerWidth < 768) {
            canvas.width = 300;
            canvas.height = 300;
        } else {
            canvas.width = 600; //width
            canvas.height = 600;
        }
        player = new Player(0, 0, canvas.width / 60, canvas); // x and y do not matter
        ballController = new BallController(ctx, canvas.height, canvas, canvas.width / 60);
        brickController = new BrickController(50, ctx, canvas.width / 10, canvas.width / 15, canvas, powerUp);
        powerUpController = new PowerUpController(player, canvas);
        backgroundImage = document.createElement("img");
        backgroundImage.src = "/bricks/background.png";
        gameLoop();
    }, []);
    function powerUp(brick: Brick) {

        let powerUp = Math.random() * 100;
        if (powerUp > 70) {
            if (powerUp > 97) {
                makePowerUp(brick, () => {
                    for (let i = 0; i < 3; i++) {
                        ball = new Ball(canvas, player, canvas.width / 100, "/bricks/dogecoin.png");
                        ball.genVelocity();
                        ballController.add(ball);
                    }
                }, "/bricks/dogecoin.png");
            } else if (powerUp > 85) {
                makePowerUp(brick, () => {
                    player.width *= 2;
                    player.x -= player.width / 2;
                    setTimeout(() => {
                        player.decreaseWidth();
                    }, 10000);
                }, "/bricks/eth.png");
            } else if (powerUp > 75) {
                makePowerUp(brick, () => {
                    ballController.BallList.forEach(ball => {
                        if (ball.img.src.includes("brick_ball.png")) {
                            ball.damage += 1;
                            ball.img.src = "/bricks/bitcoin.png";
                            setTimeout(() => {
                                ball.decreaseDamage();
                                ball.img.src = "/balls/brick_ball.png";
                            }, 10000);
                        }
                    });
                }, "/bricks/bitcoin.png");
            } else {
                makePowerUp(brick, () => {
                    lives++;
                    newLife = true;
                    newLifeCounter = 60;
                }, "/bricks/solana.png");
            }
        } else {
            if (powerUp > 60) {
                makePowerUp(brick, () => {
                    //tickets increased here when the user picks up the ticket power up
                    tickets++;
                }, "/Boleto.png");
                //ticket powerup
            }
        }
        //this is where the brick tickets are added to the in game counter
        tickets += brick.ticketsContained;
    }
    function makePowerUp(brick: Brick, f: () => any, imgSrc: string) {
        powerUpController.add(new PowerUp(brick.x + (brick.width / 2) - (canvas.width / 40), brick.y, canvas.width / 20, canvas.width / 20, f, ctx, imgSrc));
    }
    async function play() {
        //the player pressed the play button to start a new game. Remove 1 credit. 
        setTicketsWon(0);
        setCanShoot(false);
        canShoot2 = false;
        tickets = 0;
        lives = 1; //should be 1
        setIsPlaying(true);
        ballController = new BallController(ctx, canvas.height, canvas, canvas.width / 60);
        brickController = new BrickController(50, ctx, canvas.width / 10, canvas.width / 15, canvas, powerUp);
        powerUpController = new PowerUpController(player, canvas);
        ballController.startMove();
    }

    async function gameLoop() {
        if (!document.getElementById("gameField")) return;
        resetCanvas();
        let leftOffset = 0;
        if (canvas.width == 600) {
            ctx.font = "12px 'Press Start 2P'";
            leftOffset = 48;
        } else {
            ctx.font = "6px 'Press Start 2P'";
            leftOffset = 24;
        }
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        let text = `Lives: ${lives}`;
        ctx.fillText(text, canvas.width - leftOffset, canvas.height - 1);
        player.draw(ctx);
        lives = ballController.draw(lives);
        brickController.draw(ballController);
        powerUpController.draw();
        if (newLife) {
            if (newLifeCounter < 0) {
                newLife = false;
            }
            if (canvas.width == 600) {
                ctx.font = "24px 'Press Start 2P'";
            } else {
                ctx.font = "12px 'Press Start 2P'";
            }
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            let text = "+1 Life";
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
            newLifeCounter--;
        }
        if (ballController.BallList.length == 0) {
            if (lives == 0) {
                //the player lost. No tickets :(
                setIsPlaying(false);
                canShoot2 = false;
            } else {
                setCanShoot(true);
                canShoot2 = true;
            }
            powerUpController.PowerUpList = [];
        }
        if (canShoot2) {
            let img = document.createElement("img");
            img.src = "/balls/brick_ball.png";
            let radius = canvas.width / 60;
            ctx.drawImage(img, player.x + (player.width / 2) - radius, player.y - 2 * radius, 2 * radius, 2 * radius);
        }
        if (brickController.BrickList.length == 0) {
            //the player won, so credit them with their tickets
            setIsPlaying(false);
            powerUpController.PowerUpList = [];
            ballController.BallList = [];
        }
        if (ticketsWon != tickets) {
            setTicketsWon(tickets);
        }
        requestAnimationFrame(gameLoop);
    }
    async function resetCanvas() {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
    const shoot = () => {
        if (!canShoot) return;
        setCanShoot(false);
        canShoot2 = false;
        ballController.add(new Ball(canvas, player, canvas.width / 100));
        ballController.initBasicBall();
    };
    const endGame = () => {
        //the player has cashed out. Credit them with their tickets
        setIsPlaying(false);
        ballController.BallList = [];
        powerUpController.PowerUpList = [];
        //credit player with their tickets here
    };
    return (
        <>
            <div>
                <Head>
                    <title>Brick Breaker | Mushroom Party</title>
                    {/* <meta name="twitter:card" content="summary_large_image"></meta>
<meta name="twitter:site" content="@joinmushroom"></meta> */}
                    <meta property="og:title" content="BrickBreaker | Mushroom Party" />
                    {/* <meta property="og:site_name" content="Mushroom Party" /> */}
                    <meta
                        property="og:description"
                        content="Smash the competition!"
                    />
                    <meta
                        property="og:image"
                        content="/Ro_Head.png"
                    />
                    <meta property="og:image:width" content="856" />
                    <meta property="og:image:height" content="428" />
                </Head> {/* this defines head info */}
                <div className="flex flex-col items-center">
                    <div className="relative flex flex-col items-center justify-center">
                        <canvas className="rounded-sm md:rounded-lg z-20" id="gameField">
                        </canvas>
                        <div className="flex flex-row gap-3 mt-8">
                            {isPlaying ?
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="flex flex-row py-2 gap-4 w-full">
                                        <div className="flex items-center justify-center font-press-start w-full "> <img className="w-10 h-10 mr-2" src="/Boleto.png" />  {"+" + (ticketsWon ?? 0)}</div>
                                        {<GameButton disabled={ticketsWon > 0 ? false : true} onClick={endGame} message="Cash Out" color="green" />}
                                    </div>
                                    {canShoot ? <GameButton onClick={shoot} message="Launch!" /> : <></>}
                                </div>
                                : <GameButton message="Click to Play" onClick={play}  />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default BrickBreaker;

