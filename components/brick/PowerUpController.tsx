import CheckCollision from "./CheckCollision";
import Player from "./Player";

export default class PowerUpController {
    PowerUpList: PowerUp[];
    player: Player;
    canvasRect: any;
    constructor(player: Player, canvas: HTMLCanvasElement) {
        this.PowerUpList = [];
        this.player = player;
        this.canvasRect = canvas.getBoundingClientRect();
    }
    add(powerUp: PowerUp) {
        this.PowerUpList.push(powerUp);
    }
    draw() {
        this.PowerUpList.forEach(powerUp => {
            powerUp.draw(this.player);
            if (powerUp.exists == false || powerUp.y > this.canvasRect.height) {
                this.PowerUpList.splice(this.PowerUpList.indexOf(powerUp), 1);
            }
        });
    }
}

export class PowerUp {
    effect: () => any;
    x: number;
    y: number;
    speed: number;
    width: number;
    height: number;
    exists: boolean;
    ctx: CanvasRenderingContext2D;
    img: HTMLImageElement;
    constructor(x: number, y: number, width: number, height: number, effect: () => any, ctx: CanvasRenderingContext2D, imgSrc: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.effect = effect;
        this.speed = 1;
        this.exists = true;
        this.ctx = ctx;
        this.img = document.createElement("img");
        this.img.src = imgSrc;
    }
    move(player: Player) {
        this.y += this.speed;
        CheckCollision(this, player, () => {
            this.effect();
            this.exists = false;
        });
    }
    draw(player: Player) {
        this.move(player);
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}