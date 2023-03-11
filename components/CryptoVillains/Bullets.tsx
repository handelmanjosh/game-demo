import { BasicController } from "./BasicController";
import CheckCollision from "./CheckCollision";
import Enemy from "./Enemy";
import Player from "./Player";

export class Bullet {
    x: number;
    y: number;
    exists: number;
    width: number;
    height: number;
    velocity: number[];
    color: string | null;
    img: HTMLImageElement | null;
    damage: number;
    constructor(x: number, y: number, velocity: number[],
        color: string | null, imgSrc: string | null, width: number, height: number,
        damage: number, lives: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.color = color;
        this.exists = lives;
        let img;
        if (imgSrc) {
            img = document.createElement("img");
            img.src = imgSrc;
        } else {
            img = null;
        }
        this.img = img;
        this.damage = damage;
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.move();
        if (this.color) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.img!, this.x, this.y, this.width, this.height);
        }
    }
    move() {
        this.x += this.velocity[0];
        this.y += this.velocity[1];
    }
}
export class BasicBullet extends Bullet {
    constructor(x: number, y: number, width: number) {
        super(x + (width / 2) - 12.5, y, [0, -10], null, "/shooter-elements/bitcoin.png", 25, 25, 2, 1);
    }
}
export class StrongBullet extends Bullet {
    constructor(x: number, y: number, width: number) {
        super(x + (width / 2) - 20, y, [0, -25], null, "/shooter-elements/eth.png", 40, 40, 30, 1);
    }
}
export class HeavyBullet extends Bullet {
    constructor(x: number, y: number, width: number) {
        super(x + (width / 2) - 75, y, [0, -2.5], null, "/shooter-elements/dogecoin.png", 150, 150, 100, 5);
    }

}
export class MachineBullet extends Bullet {
    constructor(x: number, y: number, width: number) {
        super(x + (width / 2) - 10, y, [0, -15], null, "/shooter-elements/solana.png", 20, 20, 1, 1);
    }
}
export class HomingBullet extends Bullet {
    target!: Enemy;
    enemyController: BasicController<Enemy>;
    constructor(x: number, y: number, width: number, enemyController: BasicController<Enemy>) {
        super(x + (width / 2) - 40, y, [0, -10], null, "/shooter-elements/tesla.png", 80, 80, 10, 5);
        this.enemyController = enemyController;
        this.getTarget();
    }
    getTarget() {
        this.enemyController.EnemyList.forEach(enemy => {
            if (this.target == null) {
                this.target = enemy;
            } else {
                if (enemy.health > this.target.health) {
                    this.target = enemy;
                }
            }
        });
    }
    move() {
        if (this.enemyController.EnemyList.length == 0) {
            this.y -= 10;
            return;
        }
        if (this.target == null || this.target.health <= 0) this.getTarget();
        let xDist = this.target.x + (this.target.width / 2) - this.x;
        let yDist = this.target.y + (this.target.height / 2) - this.y;
        if (Math.abs(xDist) < 10) {
            this.x = this.target.x;
        } else {
            this.x += xDist / 15;
        }
        if (Math.abs(yDist) < 10) {
            this.y = this.target.y;
        } else {
            this.y += yDist / 15;
        }
    }
}

export class SBFBullet extends Bullet {
    constructor(x: number, y: number, width: number, velocity: number[]) {
        super(x + (width / 2) - 12.5, y, velocity, null, "/shooter-elements/ftx_token.png", 25, 25, 50, 1);
    }
}
export class BasicEnemyBullet extends Bullet {
    constructor(x: number, y: number, width: number) {
        super(x + (width / 2) - 2.5, y, [0, 15], "red", null, 5, 5, 1, 1);
    }
}
export class HeavyEnemyBullet extends Bullet {
    constructor(x: number, y: number, width: number) {
        super(x + (width / 2) - 5, y, [0, 5], "orange", null, 10, 10, 10, 1);
    }
}


