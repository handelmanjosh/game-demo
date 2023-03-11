import { timeStamp } from "console";
import { BulletController, BasicController } from "./BasicController";
import { Bullet } from "./Bullets";
import Player from "./Player";

export default class Enemy {
    x: number;
    y: number;
    width: number;
    height: number;
    pathIndex: number;
    color: string;
    img: HTMLImageElement;
    health: number;
    dmgSrc: string;
    imgSrc: string;
    path: number[][];
    speed: number;
    bulletType: any;
    bulletController: BulletController;
    canShoot: boolean;
    shootDelay: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    constructor(x: number, y: number, width: number, height: number, path: number[][],
        color: string | null, imgSrc: string | null, health: number, dmgSrc: string | null,
        speed: number, bulletType: new (x: number, y: number, width: number, velocity?: number[], player?: Player) => Bullet, ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement, player: Player, shootDelay: number) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = width;
        this.player = player;
        this.height = height;
        this.path = path;
        this.pathIndex = 0;
        this.color = color;
        this.health = health;
        this.dmgSrc = dmgSrc;
        this.imgSrc = imgSrc;
        this.speed = speed;
        this.bulletType = bulletType;
        this.canShoot = true;
        this.shootDelay = shootDelay;
        let controller: BasicController<Player> = new BasicController<Player>();
        controller.add(player);
        this.bulletController = new BulletController(ctx, canvas, controller);
        let img;
        if (imgSrc) {
            if (!dmgSrc) throw new Error("dmgSrc must be specified if imgSrc is!");
            img = document.createElement("img");
            img.src = imgSrc;
        } else {
            img = null;
        }
        this.img = img;
    }
    draw(ctx: any) {
        this.move();
        if (this.color) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        this.bulletController.draw(ctx);
    }
    move() {
        if (this.canShoot == true) {
            this.shoot();
            this.canShoot = false;
            setTimeout(() => {
                this.canShoot = true;
            }, this.shootDelay);
        }

        if (this.path.length == 0) return;
        let destination = this.path[this.pathIndex % this.path.length];
        destination = [destination[0] - (this.width / 2), destination[1] - (this.height / 2)];
        if (this.x == destination[0] && this.y == destination[1]) {
            this.pathIndex++;
        } else {
            let xDiff = destination[0] - this.x;
            let yDiff = destination[1] - this.y;
            if (Math.abs(xDiff) <= this.speed) {
                this.x = destination[0];
            } else if (xDiff < 0) {
                this.x -= this.speed;
            } else {
                this.x += this.speed;
            }
            if (Math.abs(yDiff) <= this.speed) {
                this.y = destination[1];
            } else if (yDiff < 0) {
                this.y -= this.speed;
            } else {
                this.y += this.speed;
            }
        }
    }
    takeDamage(bullet: Bullet) {
        this.health -= bullet.damage;
        this.img.src = this.dmgSrc;
        setTimeout(() => {
            this.img.src = this.imgSrc;
        }, 50);
    }
    shoot() {
        let bullet = new this.bulletType(this.x, this.y + this.height, this.width);
        this.bulletController.add(bullet);
    }
}

export class HighLevelEnemy extends Enemy {
    enemyController: BasicController<Enemy>;
    enemyType: any;
    constructor(x: number, y: number, width: number, height: number, path: number[][],
        color: string | null, imgSrc: string | null, health: number, dmgSrc: string | null,
        speed: number, bulletType: new (x: number, y: number, width: number, velocity?: number[], player?: Player) => Bullet, ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement, player: Player, shootDelay: number, enemyController: BasicController<Enemy>, enemyType: new (x: number, y: number,
            canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, target: Player) => Enemy) {
        super(x, y, width, height, path, color, imgSrc, health, dmgSrc, speed, bulletType,
            ctx, canvas, player, shootDelay);
        this.enemyController = enemyController;
        this.enemyType = enemyType;
    }
    shoot() {
        let spawnedEnemy = new this.enemyType(this.x + (this.width / 2), this.y + this.height, this.canvas, this.ctx, this.player);
        this.enemyController.add(spawnedEnemy);
    }
}
