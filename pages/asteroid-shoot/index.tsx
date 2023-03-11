import { NextPage } from "next";
import { useEffect, useState } from "react";
import AsteroidController from "../../components/asteroid-shoot/asteroid";
import SpaceButton from "../../components/SpaceButton";

let width: number, height: number;
let canvas: HTMLCanvasElement, canvasRect: any;
let ctx: CanvasRenderingContext2D;
let img: HTMLImageElement;
let asteroidController: AsteroidController;
let tick: number = 0;
let playing: boolean = false;
let points: number = 0;
let startTime: number;
let levelController = { delay: 60, vMax: 2, widthMax: 50, widthMin: 20, number: 1 };
const totalGameSeconds = 45;

let xPos: number, yPos: number;
const AsteroidShoot: NextPage = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [totalPoints, setTotalPoints] = useState<number>(0);
    useEffect(() => {
        if (window.innerWidth < 768) {
            width = height = 300;
        } else {
            width = height = 600;
        }
        canvas = document.getElementById("gameField") as HTMLCanvasElement;
        canvasRect = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        img = document.createElement("img");
        img.src = "/star_background.png";
        document.addEventListener("click", mouseShoot);
        document.addEventListener("mousemove", updatePos);
        document.addEventListener("touchstart", touchShoot);
        document.addEventListener("touchmove", touchUpdate);
        frame();
    }, []);
    const endGame = () => {
        playing = false;
        setIsPlaying(false);
    };
    const frame = () => {
        if (!document.getElementById("gameField")) return;
        resetCanvas();
        if (playing) {
            let currentTime: number = Date.now();
            let elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            let secondsLeft = totalGameSeconds - elapsedSeconds;
            if (secondsLeft < 0) endGame();
            ctx.font = "32px 'Press Start 2P'";
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.fillText(`${secondsLeft}`, canvas.width / 2, canvas.height);
            if (tick % levelController.delay == 0) {
                asteroidController.genAsteroid(levelController.vMax, levelController.widthMax, levelController.widthMin, levelController.number);
            }
            let newPoints = asteroidController.draw();
            points += newPoints;
            drawCrosshairs();
            tick++;
        }
        if (points != totalPoints) {
            setTotalPoints(points);
        }
        requestAnimationFrame(frame);
    };
    const resetCanvas = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    const play = () => {
        setIsPlaying(true);
        playing = true;
        asteroidController = new AsteroidController(ctx, width, height);
        startTime = Date.now();
    };
    const drawCrosshairs = () => {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, canvas.height);
        ctx.stroke();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(canvas.width, yPos);
        ctx.stroke();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(xPos, yPos, 15, 0, 2 * Math.PI);
        ctx.stroke();
    };
    const shoot = (x: number, y: number) => {
        if (!playing) return;
        x = x + window.scrollX - canvasRect.left, y = y + window.scrollY - canvasRect.top;
        asteroidController.attack(x, y);
    };

    const updatePos = (e: { clientX: number, clientY: number; }) => {
        let x = e.clientX + window.scrollX, y = e.clientY + window.scrollY;

        if (x > canvasRect.left + canvasRect.width) {
            xPos = canvas.width;
        } else if (x < canvasRect.left) {
            xPos = 0;
        } else {
            xPos = x - canvasRect.left;
        }
        if (y > canvasRect.top + canvasRect.height) {
            yPos = canvas.height;
        } else if (y < canvasRect.top) {
            yPos = 0;
        } else {
            yPos = y - canvasRect.top;
        }
    };
    const touchUpdate = (e: TouchEvent) => {
        updatePos({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    };
    const mouseShoot = (e: MouseEvent) => {
        shoot(e.clientX, e.clientY);
    };
    const touchShoot = (e: TouchEvent) => {
        let x = e.touches[0].clientX, y = e.touches[0].clientY;
        updatePos({ clientX: x, clientY: y });
        shoot(x, y);
    };
    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <div className="mt-6 flex flex-row justify-center items-center">
                    <canvas id="gameField" className={`${isPlaying ? "hover:cursor-none" : ""}`} style={{ width: width, height: height }} />
                </div>
                <div className="flex flex-col justify-center items-center mt-6">
                    <div className="flex flex-row justify-center items-center">
                        {isPlaying ? <p className="font-press-start"> {`Points: ${totalPoints}`} </p>
                            : <SpaceButton text="Play" onup={play} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AsteroidShoot;