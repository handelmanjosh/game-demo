
import CheckCollision from "./CheckCollision";
import Player from "./Player";

export default class Ball {
    x: number;
    y: number;
    radius: number;
    velocity: [number, number];
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    img: HTMLImageElement;
    v: number;
    damage: number;
    player: Player;
    constructor(canvas: HTMLCanvasElement, player: Player, startVelocity: number, imgSrc: string = "/balls/brick_ball.png") {
        this.radius = canvas.width / 60;
        this.canvas = canvas;
        this.player = player;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.x = player.x + player.width / 2 - (this.width / 2);
        this.y = player.y - this.height;
        this.velocity = [0, 0];
        this.damage = 1;
        const img = document.createElement("img");
        img.src = imgSrc;
        this.img = img;
        this.v = startVelocity;
    }
    startMove() {
        this.velocity = [this.v, -1 * this.v];
    }
    draw(ctx: any) {
        this.move(this.player);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    genVelocity() {
        let rand1 = Math.random();
        let vx = rand1 - .5 * this.v;
        this.velocity = [vx, -1 * this.v];
        console.log(this.velocity);
    }
    move(player: Player) {
        this.x = this.x + this.velocity[0];
        this.y = this.y + this.velocity[1];
        this.reconcileBounding();
        CheckCollision(this, player, () => {
            //percentage of position from middle times 10
            let ballX = this.x + this.radius / 2;
            let playerMiddle = player.x + player.width / 2;
            let playerHalf = player.width / 2;
            let v = ((ballX - playerMiddle) / playerHalf) * (this.canvas.width / 120); // * base velocity
            this.velocity = [v, Ball.negative(this.velocity[1])];
        });
    }
    static positive(a: number) {
        if (a > 0) {
            return a;
        } else {
            return a * -1;
        }
    }
    reconcileBounding() {
        if (this.x < 0) this.velocity = [Ball.positive(this.velocity[0]), this.velocity[1]];
        if (this.x + this.width > this.canvas.width) this.velocity = [Ball.negative(this.velocity[0]), this.velocity[1]];
        if (this.y < 0) this.velocity = [this.velocity[0], Ball.positive(this.velocity[1])];
        if (this.y + this.height > this.canvas.height) this.velocity = [this.velocity[0], Ball.negative(this.velocity[1])];
    }
    static negative(a: number) {
        if (a < 0) {
            return a;
        } else {
            return a * -1;
        }
    }
    increaseSpeed() {
        let hypotenuse = this.canvas.width / 240;
        console.log("increased");
        let angle = Math.atan(this.velocity[1] / this.velocity[0]);
        let yIncrease = Math.sin(angle) * hypotenuse;
        let xIncrease = Math.cos(angle) * hypotenuse;
        this.velocity = [magnify(this.velocity[0], xIncrease), magnify(this.velocity[1], yIncrease)];
        console.log(this.velocity);
    }

    decreaseDamage() {
        let damage = this.damage - 1;
        if (!(damage < 1)) {
            this.damage = damage;
        }
    }
}
const magnify = (n1: number, n2: number) => {
    n2 = Math.abs(n2);
    if (n1 < 0) {
        return n1 - n2;
    } else {
        return n1 + n2;
    }
};