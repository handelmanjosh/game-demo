import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Player from "../../components/space-fight/Player";
import FollowMouse from "../../components/MoveMethods/FollowMouse";
import AsteroidController from "../../components/space-fight/Asteroid";
import SpaceButton from "../../components/space-fight/SpaceButton";



let width: number, height: number;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let player: Player;
let gameObjectList: { x: number; y: number; width: number, height: number, health: number, takeDamage: (a: { vx: number, vy: number, mass: number; }) => any, draw: (x: number, y: number) => any; }[];
const maxX = 1000;
const maxY = 1000;
let backgroundImage: HTMLImageElement;
const SpaceFight: NextPage = () => {
    const [balance, setBalance] = useState(null);
    const [ticketCount, setTicketCount] = useState(null);
    useEffect(() => {
        gameObjectList = [];
        if (window.innerWidth < 768) {
            width = 300;
            height = 300;
        } else {
            width = 600;
            height = 600;
        }
        backgroundImage = document.createElement("img");
        backgroundImage.src = "/space_background.png";
        canvas = document.getElementById("gameField") as HTMLCanvasElement;
        ctx = canvas.getContext("2d")!;
        player = new Player(20, 20, 5, maxX, maxY, canvas, ctx);
        let asteroidController = new AsteroidController(10, maxX, maxY, ctx);
        asteroidController.unpack(gameObjectList);
        canvas.width = width;
        canvas.height = height;

        requestAnimationFrame(gameFrame);
    }, []);
    const clearCanvas = (currentCenter: number[]) => {
        let [x, y] = currentCenter;
        ctx.save();
        ctx.translate(-1 * x, -1 * y);
        ctx.drawImage(backgroundImage, 0, 0, 2 * maxX, 2 * maxY);
        ctx.strokeStyle = "red";
        ctx.strokeRect(canvas.width / 2, canvas.height / 2, maxX, maxY);
        ctx.restore();

    };
    const gameFrame = () => {
        if (!document.getElementById("gameField")) return;
        clearCanvas([player.x, player.y]);
        player.draw(canvas.width / 2, canvas.height / 2, gameObjectList);
        for (let object of gameObjectList) {
            if (object.health < 1) {
                gameObjectList.splice(gameObjectList.indexOf(object), 1);
            } else {
                let d = distance([player.x, player.y], [object.x, object.y]);
                let diagonal = distance([canvas.width / 2, canvas.height / 2], [0, 0]);
                if (d < diagonal) {
                    let adjX = (canvas.width / 2) + (object.x - player.x);
                    let adjY = (canvas.height / 2) + (object.y - player.y);
                    object.draw(adjX, adjY);
                }
            }
        }
        requestAnimationFrame(gameFrame);
    };
    const distance = (a: number[], b: number[]) => { return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2); };
    return (
        <>
            <div className="flex flex-col items-center">
                <div style={{ width: width, height: height }}>
                    <canvas className="bg-black" id="gameField"></canvas>
                </div>
            </div>
        </>
    );
};

export default SpaceFight;