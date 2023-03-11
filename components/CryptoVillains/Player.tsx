import { BasicBullet, Bullet, HeavyBullet, HomingBullet, MachineBullet, StrongBullet } from "./Bullets";
import { BulletController, BasicController } from "./BasicController";
import Enemy from "./Enemy";


export default class Player {
    x: number;
    y: number;
    speed: number;
    width: number;
    height: number;
    rightPressed: boolean;
    leftPressed: boolean;
    spacePressed: boolean;
    canvas: HTMLCanvasElement;
    BulletController: BulletController;
    ctx: CanvasRenderingContext2D;
    selectedBullet: 1 | 2 | 3 | 4 | 5;
    canShoot: boolean;
    enemyController: BasicController<Enemy>;
    health: number;
    maxHealth: number;
    canRegen: number;
    bulletsUnlocked: boolean[];
    constructor(x: number, y: number, speed: number, canvas: HTMLCanvasElement,
        BulletController: BulletController, ctx: CanvasRenderingContext2D, enemyController: BasicController<Enemy>, bulletsUnlocked: boolean[]) {
        this.BulletController = BulletController;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.height = 50;
        this.canvas = canvas;
        this.width = 50;
        this.selectedBullet = 1;
        this.canShoot = true;
        this.enemyController = enemyController;
        this.health = 300;
        this.maxHealth = this.health;
        this.canRegen = 0;
        this.bulletsUnlocked = bulletsUnlocked;
        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
    }
    draw(ctx: CanvasRenderingContext2D) {
        if (this.health < 1) {
            this.canShoot = false;
            return;
        }
        if (this.canRegen >= 0) {
            if (this.health < this.maxHealth) {
                this.health++;
            }
        }
        this.move();
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    moveLeft() {
        this.x -= this.speed;
    }
    moveRight() {
        this.x += this.speed;
    }
    move() {
        if (this.rightPressed) {
            this.moveRight();
        }
        if (this.leftPressed) {
            this.moveLeft();
        }
        if (this.spacePressed) {
            this.shoot();
        }
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.y > this.canvas.height - this.height) this.y = this.canvas.height - this.height;
        if (this.x > this.canvas.width - this.width) this.x = this.canvas.width - this.width;
    }

    shoot() {
        if (this.canShoot) {
            if (this.selectedBullet == 1) {
                this.BulletController.add(new BasicBullet(this.x, this.y, this.width));
                this.canShoot = false;
                setTimeout(() => { this.canShoot = true; }, 100);
            } else if (this.selectedBullet == 2) {
                this.BulletController.add(new StrongBullet(this.x, this.y, this.width));
                this.canShoot = false;
                setTimeout(() => { this.canShoot = true; }, 500);
            } else if (this.selectedBullet == 3) {
                this.BulletController.add(new MachineBullet(this.x, this.y, this.width));
            } else if (this.selectedBullet == 4) {
                this.BulletController.add(new HeavyBullet(this.x, this.y, this.width));
                this.canShoot = false;
                setTimeout(() => { this.canShoot = true; }, 2000);
            } else if (this.selectedBullet == 5) {
                this.BulletController.add(new HomingBullet(this.x, this.y, this.width, this.enemyController));
                this.canShoot = false;
                setTimeout(() => { this.canShoot = true; }, 1000);
            } else {
                throw new Error("Invalid bullet type");
            }
        }


    }
    keydown = (e: any) => {
        if (e.code === "ArrowLeft") {
            e.preventDefault();
            this.leftPressed = true;
        }
        if (e.code === "ArrowRight") {
            e.preventDefault();
            this.rightPressed = true;
        }
        if (e.code === "Space") {
            e.preventDefault();
            this.spacePressed = true;
        }
    };
    keyup = (e: any) => {
        e.preventDefault();
        if (e.code === "ArrowLeft") {
            this.leftPressed = false;
        }
        if (e.code === "ArrowRight") {
            this.rightPressed = false;
        }
        if (e.code === "Space") {
            this.spacePressed = false;
        }
    };
    takeDamage(bullet: Bullet) {
        this.damage(bullet.damage);
    }
    damage(damage: number) {
        this.health -= damage;
        if (this.canRegen > -10) {
            this.canRegen--;
            setTimeout(() => {
                this.canRegen++;
            }, 5000);
        }
        // this.img.src = this.dmgSrc;
        // setTimeout(() => {
        //     this.img.src = this.imgSrc;
        // }, 50);
    }
    upgradeBullet() {
        for (let i = 0; i < this.bulletsUnlocked.length; i++) {
            let b = this.bulletsUnlocked[i];
            if (!b) {
                this.bulletsUnlocked[i] = true;
                break;
            }
        }
        this.health -= 10;
    }
}