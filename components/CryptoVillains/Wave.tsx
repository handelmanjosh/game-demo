import { BasicController } from "./BasicController";
import { BasicEnemyBullet, Bullet, HeavyEnemyBullet, SBFBullet } from "./Bullets";
import CheckCollision from "./CheckCollision";
import Enemy, { HighLevelEnemy } from "./Enemy";
import Player from "./Player";

export default function Wave(enemyList: ((a: CanvasRenderingContext2D, b: HTMLCanvasElement, c: Player, d: number, e: number, f?: BasicController<Enemy>) => Enemy)[],
    enemyController: BasicController<Enemy>, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player, positions: number[][]) {
    let count = 0;
    enemyList.forEach(enemyConstructor => {
        enemyController.add(enemyConstructor(ctx, canvas, player, positions[count][0], positions[count][1], enemyController));
        count++;
    });
}

function lineHorizontal(startPos: number[], canvas: HTMLCanvasElement): number[][] {
    //find vertical middle of canvas, reflect across middle of canvas
    let middle = canvas.width / 2;
    return [startPos, [reflect(startPos[0], middle), startPos[1]]];
}
function lineVertical(startPos: number[], canvas: HTMLCanvasElement): number[][] {
    let middle = canvas.height / 2;
    return [startPos, [startPos[0], reflect(startPos[1], middle)]];
}
function reflect(a: number, middle: number): number {
    return a + ((middle - a) * 2);
}
function reflectX(a: number[], canvas: HTMLCanvasElement): number[] {
    return [reflect(a[0], canvas.width / 2), a[1]];
}
function reflectY(a: number[], canvas: HTMLCanvasElement): number[] {
    return [a[0], reflect(a[1], canvas.height / 2)];
}
function reflectDiagonal(a: number[], canvas: HTMLCanvasElement): number[] {
    return [reflect(a[0], canvas.width / 2), reflect(a[1], canvas.height / 2)];
}
function diagonal(startPos: number[], canvas: HTMLCanvasElement): number[][] {
    //find vertical and horizontal middle of canvas, reflect across both
    return [startPos, reflectDiagonal(startPos, canvas)];
}
function horizontalCross(startPos: number[], canvas: HTMLCanvasElement) {
    let pos2 = reflectY(startPos, canvas);
    let pos3 = reflectDiagonal(pos2, canvas);
    let pos4 = reflectY(pos3, canvas);
    return [startPos, pos2, pos3, pos4];
}
function verticalCross(startPos: number[], canvas: HTMLCanvasElement) {
    let pos2 = reflectX(startPos, canvas);
    let pos3 = reflectDiagonal(pos2, canvas);
    let pos4 = reflectX(pos3, canvas);
    return [startPos, pos2, pos3, pos4];
}
function corner(startPos: number[], canvas: HTMLCanvasElement, f1: (a: number[], canvas: HTMLCanvasElement) => number[], f2: (a: number[], canvas: HTMLCanvasElement) => number[]): number[][] {
    let pos2 = f1(startPos, canvas);
    let pos3 = f2(pos2, canvas);
    return [startPos, pos2, pos3, pos2];
}
function topCorner(startPos: number[], canvas: HTMLCanvasElement): number[][] {
    return corner(startPos, canvas, reflectX, reflectY);
}
function bottomCorner(startPos: number[], canvas: HTMLCanvasElement): number[][] {
    return corner(startPos, canvas, reflectY, reflectX);
}
function topTriangle(startPos: number[], canvas: HTMLCanvasElement): number[][] {
    let s = topCorner(startPos, canvas);
    s.splice(s.length - 1, 1);
    return s;
}
function bottomTriangle(startPos: number[], canvas: HTMLCanvasElement): number[][] {
    let s = bottomCorner(startPos, canvas);
    s.splice(s.length - 1, 1);
    return s;
}

//simple  enemies are just functions, complex ones are classes
export function SBF(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player, x: number, y: number): Enemy {
    return new SBFEnemy(x, y, canvas, ctx, player);
}
export function TerraToken(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player, x: number, y: number): Enemy {
    return new Enemy(x, -10, canvas.width / 15, canvas.width / 15, horizontalCross([x, y], canvas), null, "/shooter-elements/terra_token.png", 5, "/shooter-elements/terra_token_red.png", 10, BasicEnemyBullet, ctx, canvas, player, 300);
}
export function FTXToken(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player, x: number, y: number): Enemy {
    return new Enemy(x, -10, canvas.width / 12, canvas.width / 12, bottomTriangle([x, y], canvas), null, "/shooter-elements/ftx_token.png", 5, "/shooter-elements/ftx_token_red.png", 4, BasicEnemyBullet, ctx, canvas, player, 500);
}
export function CelsiusToken(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player, x: number, y: number): Enemy {
    return new Enemy(x, -10, canvas.width / 10, canvas.width / 10, topCorner([x, y], canvas), null, "/shooter-elements/celsius_token.png", 50, "/shooter-elements/celsius_token_red.png", 1, HeavyEnemyBullet, ctx, canvas, player, 1000);
}
export function LUNAToken(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player, x: number, y: number): Enemy {
    return new LUNAEnemy(x, y, canvas, ctx, player);
}
export function DoKwon(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player, x: number, y: number, enemyController: BasicController<Enemy>) {
    return new DoKwonEnemy(x, y, canvas, ctx, player, enemyController);
}
export function CZ(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player, x: number, y: number): Enemy {
    return new CZEnemy(x, y, canvas, ctx, player);
}
export function FTXExchange(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player, x: number, y: number, enemyController: BasicController<Enemy>) {
    return new FTXExchangeEnemy(x, y, canvas, ctx, player, enemyController);
}
class FTXTokenEnemy extends Enemy {
    destination!: number[];
    constructor(x: number, y: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, player: Player) {
        super(x, y, canvas.width / 12, canvas.width / 12, bottomTriangle([x, y], canvas), null, "/shooter-elements/ftx_token.png", 5, "/shooter-elements/ftx_token_red.png", 4, BasicEnemyBullet, ctx, canvas, player, 500);
        this.newDestination();
    }
    newDestination() {
        this.destination = [this.canvas.width * Math.random(), this.canvas.height * Math.random()];
    }
    move() {
        if (this.canShoot == true) {
            this.shoot();
            this.canShoot = false;
            setTimeout(() => {
                this.canShoot = true;
            }, this.shootDelay);
        }
        let destination = this.destination;
        if (this.x == destination[0] && this.y == destination[1]) {
            this.newDestination();
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
}
class SBFEnemy extends Enemy {
    constructor(x: number, y: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, player: Player) {
        //@ts-ignore
        super(x, -10, canvas.width / 5, canvas.width / 5, verticalCross([x, y], canvas), null,"/shooter-elements/sbf_face.png", 200, "/shooter-elements/sbf_face_red.png", 1, SBFBullet, ctx, canvas, player, 200);
    }
    shoot() {
        let velocityArray = [[-5, 15], [0, 15], [5, 15]];
        for (let i = 0; i < 3; i++) {
            let bullet = new this.bulletType(this.x, this.y + this.height, this.width, velocityArray[i]);
            this.bulletController.add(bullet);
        }
        if (this.img.src !== "/shooter-elements/sbf_mouth.png") {
            this.img.src = "/shooter-elements/sbf_mouth.png";
            setTimeout(() => {
                this.img.src = this.imgSrc;
            }, 300);
        }


    }
}
class DoKwonEnemy extends HighLevelEnemy {
    constructor(x: number, y: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, player: Player, enemyController: BasicController<Enemy>) {
        //@ts-ignore
        super(x, y, canvas.width / 5, canvas.width / 5, lineHorizontal([x, y], canvas), null, "/shooter-elements/dokwon.png", 200, "/shooter-elements/dokwon_red.png", 1, null, ctx, canvas, player, 1000, enemyController, LUNAEnemy);
    }
}
class FTXExchangeEnemy extends HighLevelEnemy {
    constructor(x: number, y: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, player: Player, enemyController: BasicController<Enemy>) {
        //@ts-ignore
        super(x, y, canvas.width / 5, canvas.width / 5, null, null, "/shooter-elements/ftx_exchange.png", 200, "/shooter-elements/ftx_exchange_red.png", 1, null, ctx, canvas, player, 4000, enemyController, FTXTokenEnemy);
    }
    move() {
        if (this.canShoot == true) {
            this.shoot();
            this.canShoot = false;
            setTimeout(() => {
                this.canShoot = true;
            }, this.shootDelay);
        }
    }
}

class LUNAEnemy extends Enemy {
    target: Player;
    damage: number;
    constructor(x: number, y: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, player: Player) {
        //@ts-ignore
        super(x, y, canvas.width / 10, canvas.width / 10, null, null, "/shooter-elements/luna_token.png", 30, "/shooter-elements/luna_token_red.png", 1, null, ctx, canvas, player, 1000);
        this.target = player;
        this.damage = 50;
    }
    move() {
        CheckCollision(this, this.target, () => {
            this.target.damage(this.damage);
            this.health = 0;
        });
        if (this.target == null || this.target.health <= 0) return;
        let xDist = this.target.x + (this.target.width / 2) - this.x;
        let yDist = this.target.y + (this.target.height / 2) - this.y;
        if (Math.abs(xDist) < 1) {
            this.x = this.target.x;
        } else {
            this.x += xDist / 100;
        }
        if (Math.abs(yDist) < 1) {
            this.y = this.target.y;
        } else {
            this.y += yDist / 100;
        }
    }
    shoot() {
        return;
    }
}
class CZEnemy extends Enemy {
    destination!: number[];
    constructor(x: number, y: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, player: Player) {
        //@ts-ignore
        super(x, -10, canvas.width / 20, canvas.width / 20, verticalCross([x, y], canvas), null, "/shooter-elements/cz.png", 1, "/shooter-elements/cz.png", 20, null, ctx, canvas, player, 300);
        this.newDestination();
    }
    shoot() {
        return;
    }
    move() {
        let destination = this.destination;
        if (this.x == destination[0] && this.y == destination[1]) {
            this.newDestination();
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
    takeDamage() {
        this.player.upgradeBullet();
        this.health--;
    }
    newDestination() {
        this.destination = [this.canvas.width * Math.random(), this.canvas.height * Math.random()];
    }
}

// function Caroline(): Enemy {

// }