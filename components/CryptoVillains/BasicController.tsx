import { Bullet } from "./Bullets";
import CheckCollision from "./CheckCollision";
import Enemy from "./Enemy";
import Player from "./Player";

export class BasicController<E extends { health: number, draw: (ctx: CanvasRenderingContext2D) => any; }> {
    EnemyList: E[];
    constructor() {
        this.EnemyList = [];
    }
    add(e: E) {
        this.EnemyList.push(e);
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.EnemyList.forEach(enemy => {
            if (enemy.health < 1) {
                this.EnemyList.splice(this.EnemyList.indexOf(enemy), 1);
            } else {
                enemy.draw(ctx);
            }

        });
    }
};

export class BulletController {
    BulletList: Bullet[];
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    enemyController: BasicController<Enemy | Player>;
    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, enemyController: BasicController<Enemy | Player>) {
        this.BulletList = [];
        this.ctx = ctx;
        this.canvas = canvas;
        this.enemyController = enemyController;
    }
    add(bullet: Bullet) {
        this.BulletList.push(bullet);
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.BulletList.forEach(bullet => {
            this.enemyController.EnemyList.forEach(enemy => {
                CheckCollision(bullet, enemy, () => {
                    enemy.takeDamage(bullet);
                    bullet.exists--;
                });
            });
            if (bullet.y < 0 || bullet.x < 0 || bullet.y > this.canvas.height || bullet.x > this.canvas.height || bullet.exists <= 0) {
                this.BulletList.splice(this.BulletList.indexOf(bullet), 1);
            } else {
                bullet.draw(ctx);
            }
        });
    }

}
