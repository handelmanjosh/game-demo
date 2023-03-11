import CheckRadialCollision from "../CheckRadialCollision";

export default class Player {
    width: number;
    height: number;
    maxY: number;
    maxX: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    vMax: number;
    mass: number;
    health: number;
    angle!: number;
    spacePressed!: boolean;
    singleTouch: boolean;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    img: HTMLImageElement;
    shipNum: number;
    canMove: boolean;
    dead: boolean;
    tickets: number;
    tick: number;
    BulletList: PlayerBullet[];
    constructor(width: number, vMax: number, maxX: number, maxY: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.width = width;
        this.height = width * 1.5;
        this.maxX = maxX;
        this.maxY = maxY;
        this.mass = 10000;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.health = 1;
        this.vy = 0;
        this.vx = 0;
        this.vMax = vMax;
        this.canvas = canvas;
        this.ctx = ctx;
        this.canMove = true;
        this.dead = false;
        this.singleTouch = false;
        this.shipNum = 0;
        this.tick = 0;
        this.tickets = 0;
        const img = document.createElement("img");
        img.src = `/spaceships/ship1.png`;
        this.img = img;
        this.BulletList = [];
        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
        document.addEventListener("mousemove", this.mouseWrapper);
        document.addEventListener("touchmove", this.touchWrapper, { passive: false });
        document.addEventListener("mousedown", this.startShoot);
        document.addEventListener("mouseup", this.endShoot);
        document.addEventListener("touchstart", this.startTouch);
        document.addEventListener("touchend", this.endShoot);
    }
    draw(x: number, y: number, asteroidController: { AsteroidList: { x: number, y: number, width: number, height: number; health: number; takeDamage: (a: { vy: number, vx: number, mass: number; }) => any; }[]; }) {
        if (this.dead) return;
        let collideables = asteroidController.AsteroidList;
        this.move();
        this.updateAngle();
        let count = 0;
        for (let collideable of collideables) {
            CheckRadialCollision(this, collideable, () => {
                collideable.takeDamage(this);
                this.health--;
            });
        }
        //draw bullets
        this.BulletList.forEach(bullet => {
            if (bullet.x < 0 || bullet.y < 0 || bullet.x > this.maxX || bullet.y > this.maxY) {
                this.BulletList.splice(count, 1);
            } else {
                for (let collideable of collideables) {
                    CheckRadialCollision(bullet, collideable, () => {
                        collideable.takeDamage(bullet);
                    });
                }
                bullet.draw();
            }
            count++;
        });

        //draw player at correct angle
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(this.angle);
        this.ctx.drawImage(this.img, -1 * this.width / 2, -1 * this.height / 2, this.width, this.height);
        this.ctx.restore();

        //draw circle around player
        this.ctx.beginPath();
        this.ctx.strokeStyle = "green";
        this.ctx.lineWidth = .5;
        this.ctx.arc(x, y, this.width * 3, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.checkHealth();
    }
    move() {
        if (!this.canMove) return;
        if (this.tick % 10 == 0) {
            this.img.src = `/spaceships/ship${this.shipNum}.png`;
            this.shipNum = (this.shipNum + 1) % 2;
        }
        this.tick++;
        this.x += this.vx;
        this.y += this.vy;

        //new code

        if (this.spacePressed) this.shoot();
        //max width and max height
        if (this.y < 0) this.y = 0;
        if (this.x < 0) this.x = 0;
        if (this.x > this.maxX) this.x = this.maxX;
        if (this.y > this.maxY) this.y = this.maxY;
    }
    updateAngle() {
        if (this.vy == 0 && this.vx == 0) return;
        const to_radians = Math.PI / 180;
        const to_degrees = 180 / Math.PI;

        let tempAngle = Math.abs(Math.atan(this.vy / this.vx));
        tempAngle = tempAngle * to_degrees;

        if (this.vx > 0 && this.vy > 0) {
            this.angle = (90 + tempAngle) * to_radians;
        } else if (this.vx < 0 && this.vy > 0) {
            this.angle = (270 - tempAngle) * to_radians;
        } else if (this.vx < 0 && this.vy < 0) {
            this.angle = (270 + tempAngle) * to_radians;
        } else if (this.vx > 0 && this.vy < 0) {
            this.angle = (90 - tempAngle) * to_radians;
        } else {
            if (this.vx == 0) {
                if (this.vy > 0) {
                    this.angle = Math.PI;
                } else {
                    this.angle = 0;
                }
            } else if (this.vy == 0) {
                if (this.vx > 0) {
                    this.angle = Math.PI / 2;
                } else {
                    this.angle = Math.PI * 3 / 2;
                }
            } else {
                console.error("oh poop");
            }
        }
    }
    shoot() {
        this.BulletList.push(new PlayerBullet(this.x, this.y, this.angle, this.ctx));
    }
    keydown = (event: KeyboardEvent) => {
        if (event.key === " ") {
            this.spacePressed = true;
        }
    };
    keyup = (event: KeyboardEvent) => {
        if (event.key === " ") {
            this.spacePressed = false;
        }
    };
    touchWrapper = (event: TouchEvent) => {
        event.preventDefault();
        this.updatePosition(event.touches[0].clientX, event.touches[0].clientY);
    };
    mouseWrapper = (event: MouseEvent) => {
        this.updatePosition(event.x, event.y);
    };
    updatePosition = (x: number, y: number) => {

        let canvas = this.canvas.getBoundingClientRect();
        let playerPos = [canvas.x + this.x, canvas.y + this.y];

        let xDiff = x - playerPos[0];
        let yDiff = y - playerPos[1];
        let maxDiff = this.width * 3;

        let rx = xDiff / maxDiff;
        let ry = yDiff / maxDiff;

        if (rx > 1) rx = 1;
        if (rx < -1) rx = -1;
        if (ry > 1) ry = 1;
        if (ry < -1) ry = -1;

        this.vx = this.vMax * rx;
        this.vy = this.vMax * ry;
    };
    startTouch = () => {
        if (this.singleTouch) {
            this.startShoot();
        } else {
            this.singleTouch = true;
            setTimeout(() => {
                this.singleTouch = false;
            }, 250);
        }
    };
    checkHealth() {
        if (this.health < 1 && this.canMove) {
            this.canMove = false;
            this.angle = 0;
            this.height = this.width;
            this.img.src = "/explosions/explosion0.png";
            let timeInterval = 100;
            setTimeout(() => {
                this.img.src = "/explosions/explosion1.png";
                setTimeout(() => {
                    this.img.src = "/explosions/explosion2.png";
                    setTimeout(() => {
                        this.img.src = "/explosions/explosion3.png";
                        setTimeout(() => {
                            this.img.src = "/explosions/explosion4.png";
                            setTimeout(() => {
                                this.dead = true;
                            }, timeInterval);
                        }, timeInterval);
                    }, timeInterval);
                }, timeInterval);
            }, timeInterval);
        }
    }
    startShoot = () => { this.spacePressed = true; };
    endShoot = () => { this.spacePressed = false; };
}
class PlayerBullet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    health: number;
    width: number;
    height: number;
    mass: number;
    img: HTMLImageElement;
    ctx: CanvasRenderingContext2D;
    constructor(x: number, y: number, angle: number, ctx: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        let vMax = 20;
        this.vx = Math.sin(angle) * vMax;
        this.vy = -1 * Math.cos(angle) * vMax;
        this.health = 1;
        this.width = 10;
        this.mass = 1000;
        this.height = 3;
        this.img = document.createElement("img");
        this.img.src = "/spaceships/laser-bolt.png";
        this.ctx = ctx;
    }
    draw() {
        this.move();
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.width);
    }
    move() {
        this.x += this.vx;
        this.y += this.vy;
    }
}
