import BallController from "./BallController";
import CheckCollision from "./CheckCollision";

function negative(a: number): number {
    if (a > 0) {
        return a * -1;
    } else {
        return a;
    }
}
function positive(a: number): number {
    if (a > 0) {
        return a;
    } else {
        return a * -1;
    }
}
export default class BrickController {
    BrickList: Brick[];
    ctx: CanvasRenderingContext2D;
    constructor(n: number, ctx: CanvasRenderingContext2D, brickWidth: number, brickHeight: number, canvas: any, b: (a: any) => any) {
        this.ctx = ctx;
        this.BrickList = [];
        let currentX = 0;
        let currentY = 0;
        let row = 4;
        let ticketsContained = 3;
        for (let i = 0; i < n; i++) {
            let health = row;
            //let health = Math.floor(5 * Math.random());
            let tempBrick = new Brick(currentX, currentY, brickWidth, brickHeight, health, ticketsContained, b, canvas, this.BrickList);
            this.BrickList.push(tempBrick);
            currentX += brickWidth;
            if (currentX > canvas.width - brickWidth) {
                currentX = 0;
                row--;
                ticketsContained = (ticketsContained - 1 < 0) ? 0 : ticketsContained - 1;
                currentY += brickHeight;
            }
        }
    }
    draw(ballController: BallController) {
        let count = 0;
        this.BrickList.forEach(brick => {
            ballController.BallList.forEach(ball => {
                CheckCollision(ball, brick, () => {
                    if (brick.canBreak == true) brick.health -= ball.damage;
                    if (brick.health > -1) {
                        brick.img.src = "/bricks/brick" + brick.health + ".png";
                        brick.canBreak = false;
                        setTimeout(() => { brick.canBreak = true; }, 100);
                    }
                    let ballCenter = [ball.x + ball.radius, ball.y + ball.radius];
                    if (ballCenter[1] > brick.y + brick.height) {
                        ball.velocity = [ball.velocity[0], positive(ball.velocity[1])];
                    } else if (ballCenter[1] < brick.y) {
                        ball.velocity = [ball.velocity[0], negative(ball.velocity[1])];
                    } else if (ballCenter[0] < brick.x) {
                        ball.velocity = [negative(ball.velocity[0]), ball.velocity[1]];
                    } else if (ballCenter[0] > brick.x + brick.width) {
                        ball.velocity = [positive(ball.velocity[0]), ball.velocity[1]];
                    }
                });
                if (brick.health > -1) {
                    brick.draw(this.ctx);
                } else {
                    brick.break(brick);
                    this.BrickList.splice(count, 1);
                }
            });
            if (ballController.BallList.length == 0) {
                this.BrickList.forEach(brick => {
                    brick.draw(this.ctx);
                });
            }
            count++;
        });
    }
}
export class Brick {
    health: number;
    x: number;
    y: number;
    width: number;
    height: number;
    ticketsContained: number;
    canBreak: boolean;
    img: HTMLImageElement;
    canvas: HTMLCanvasElement;
    brickList: Brick[];
    break: (a: any) => null;
    constructor(x: number, y: number, width: number, height: number, health: number, tickets: number, b: (a: any) => any, canvas: HTMLCanvasElement, brickList: Brick[]) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health;
        this.ticketsContained = tickets;
        this.canBreak = true;
        this.brickList = brickList;
        this.canvas = canvas;
        this.break = b;
        const img = document.createElement("img");
        img.src = "/bricks/brick" + this.health + ".png";
        this.img = img;
    }
    draw(ctx: any) {
        if (this.health > -1) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}