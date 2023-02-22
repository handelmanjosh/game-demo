import Ball from "./Ball";

export default class BallController {
    BallList: Ball[];
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    maxHeight: number;
    radius: number;
    constructor(ctx: CanvasRenderingContext2D, height: number, canvas: HTMLCanvasElement, radius: number) {
        this.BallList = [];
        this.ctx = ctx;
        this.canvas = canvas;
        this.maxHeight = height;
        this.radius = radius;
    }
    draw(lives: number): number {
        let count = 0;
        this.BallList.forEach(ball => {
            if (ball.y + ball.height >= this.maxHeight) {
                this.BallList.splice(count, 1);
                if (ball.img.src.includes("brick_ball.png") || ball.img.src.includes("bitcoin.png")) {
                    lives--;
                }
            } else {
                ball.draw(this.ctx);
            }
            count++;
        });
        // let startingX = this.canvas.width - this.radius * 2;
        // let y = this.canvas.height - this.radius * 2;
        // let printed = 0;
        // const img = document.createElement("img");
        // img.src = "/balls/brick_ball.png";
        // // for (let i = 0; i < lives - 1; i++) {
        // //     this.ctx.drawImage(img, startingX, y, this.radius * 2, this.radius * 2);
        // //     startingX -= (this.radius * 2);
        // //     printed++;
        // // }
        return lives;
    }
    add(ball: Ball) {
        this.BallList.push(ball);
    }
    startMove() {
        this.BallList.forEach(ball => {
            ball.startMove();
        });
    }
    initBasicBall = () => {
        this.BallList.forEach(ball => {
            if (ball.img.src.includes("/brick_ball.png")) {
                ball.startMove();
            }
        });
    };
}