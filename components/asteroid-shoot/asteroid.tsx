import CheckRadialCollision from "../CheckRadialCollision";

export default class AsteroidController {
    AsteroidList: Asteroid[];
    ctx: CanvasRenderingContext2D;
    maxX: number;
    maxY: number;
    constructor(ctx: CanvasRenderingContext2D, maxX: number, maxY: number) {
        this.ctx = ctx;
        this.AsteroidList = [];
        this.maxX = maxX;
        this.maxY = maxY;
    }
    genAsteroid(vMax: number, widthMax: number, widthMin: number, n: number) {
        for (let i = 0; i < n; i++) {
            let vx = Math.random() * vMax * genSign();
            let vy = Math.random() * vMax * genSign();
            let xSide: number, ySide: number;
            if (vx < 0) {
                xSide = this.maxX + 50;
            } else {
                xSide = -50;
            }

            if (vy < 0) {
                ySide = this.maxY + 50;
            } else {
                ySide = -50;
            }

            let x: number, y: number;
            let random = Math.random() * 2;
            if (random < 1) {
                x = xSide;
                y = Math.random() * this.maxY;
            } else {
                x = Math.random() * this.maxX;
                y = ySide;
            }
            let width = randomBetween(widthMin, widthMax);
            let imageNum = Math.floor(4 * Math.random());
            let sign = (Math.random() < 0.5) ? -1 : 1;
            let angleDelta = sign * Math.PI / 25 * Math.random();
            let asteroid = new Asteroid(x, y, vx, vy, width, 1, imageNum, angleDelta, this.ctx);
            this.AsteroidList.push(asteroid);
        }
    }
    attack(x: number, y: number) {
        this.AsteroidList.forEach(asteroid => {
            CheckRadialCollision({ x: x, y: y, width: 1, height: 1 }, asteroid, () => {
                asteroid.health--;
            });
        });
    }
    draw() {
        let count = 0;
        let totalPoints = 0;
        this.AsteroidList.forEach(asteroid => {
            if (asteroid.x < -50 || asteroid.x > this.maxX + 50 || asteroid.y < -50 || asteroid.y > this.maxY + 50 || asteroid.dead) {
                this.AsteroidList.splice(count, 1);
                if (asteroid.dead) {
                    totalPoints += (asteroid.points ?? 0);
                }
            } else {
                this.AsteroidList.forEach(asteroid2 => {
                    CheckRadialCollision(asteroid, asteroid2, () => {
                        asteroid.collideAsteroid(asteroid2);
                    });
                });
                asteroid.draw();
            }
            count++;
        });
        return totalPoints;
    }

}
const genSign = (): number => {
    let sign: number = Math.random() < .5 ? -1 : 1;
    return sign;
};
const randomBetween = (a: number, b: number): number => {
    return a + Math.random() * (b - a);
};

class Asteroid {
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    mass: number;
    angle: number;
    angleDelta: number;
    health: number;
    canTakeDamage: boolean;
    canDraw: boolean;
    canMove: boolean;
    points: number;
    dead: boolean;
    text: string;
    cantDrawImage: boolean;
    cantCollide: boolean;
    img: HTMLImageElement;
    ctx: CanvasRenderingContext2D;
    constructor(x: number, y: number, vx: number, vy: number, width: number, health: number, imageNum: number, angleDelta: number, ctx: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = width;
        if (imageNum == 2) {
            this.height = width;
        } else {
            this.height = width * 1.5;
        }
        this.health = health;
        this.angle = 0;
        this.angleDelta = angleDelta;
        this.mass = health * width * width;
        this.canTakeDamage = true;
        this.canDraw = true;
        this.canMove = true;
        this.dead = false;
        this.cantCollide = false;
        this.ctx = ctx;

        const img = document.createElement("img");
        img.src = `/asteroids/asteroid${imageNum}.png`;
        this.img = img;
    }
    calculatePoints = () => {
        let combinedSpeed = hypotenuse(this.vx, this.vy);
        let area = Math.PI * this.width * this.height;
        return speedToPoints(combinedSpeed) + areaToPoints(area);
    };
    move() {
        if (this.canMove) {
            this.x += this.vx;
            this.y += this.vy;
            this.angle += this.angleDelta;
        }
    }
    draw() {
        this.move();
        if (this.canDraw) {
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.angle);
            this.ctx.drawImage(this.img, -1 * this.width / 2, -1 * this.height / 2, this.width, this.height);
            this.ctx.restore();
        } else {
            this.ctx.font = "24px 'Press Start 2P'";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(this.text, this.x, this.y);
        }
        this.checkHealth();
    }
    checkHealth() {
        if (this.health < 1 && this.canMove) {
            this.canMove = false;
            this.canTakeDamage = false;
            this.cantCollide = true;
            this.angle = 0;
            this.height = this.width;
            this.img.src = "/explosions/explosion0.png";
            let timeInterval = 100;
            this.points = Math.floor(this.calculatePoints());
            setTimeout(() => {
                this.img.src = "/explosions/explosion1.png";
                setTimeout(() => {
                    this.img.src = "/explosions/explosion2.png";
                    setTimeout(() => {
                        this.img.src = "/explosions/explosion3.png";
                        setTimeout(() => {
                            this.img.src = "/explosions/explosion4.png";
                            setTimeout(() => {
                                this.canDraw = false;
                                this.text = `+${this.points}`;
                                setTimeout(() => {
                                    this.dead = true;
                                }, timeInterval * 4);
                            }, timeInterval);
                        }, timeInterval);
                    }, timeInterval);
                }, timeInterval);
            }, timeInterval);
        }
    }
    collideAsteroid(asteroid: Asteroid) {
        if (!this.canTakeDamage || !asteroid.canTakeDamage) return;
        let momentumX = asteroid.mass * asteroid.vx;
        let momentumX2 = this.mass * this.vx;
        let momentumY = asteroid.mass * asteroid.vy;
        let momentumY2 = this.mass * this.vy;
        this.vx = momentumX / this.mass;
        this.vy = momentumY / this.mass;
        asteroid.vx = momentumX2 / asteroid.mass;
        asteroid.vy = momentumY2 / asteroid.mass;
    }
    takeDamage(object: { mass: number; vx: number, vy: number; }) {
        if (!this.canTakeDamage) return;
        this.health--;
        if (this.health > 0) {
            let momentumX = object.mass * object.vx;
            let momentumY = object.mass * object.vy;
            this.vx = momentumX / this.mass;
            this.vy = momentumY / this.mass;
        }
        //this.canDraw = false;
        this.canTakeDamage = false;
        setTimeout(() => {
            //this.canDraw = true;
            this.canTakeDamage = true;
        }, 50);
    }
}
const hypotenuse = (a: number, b: number) => {
    return Math.sqrt(a ** 2 + b ** 2);
};
const speedToPoints = (s: number) => (s ** 2) * 100;
const areaToPoints = (a: number) => {
    let raw = 1 / a * 100;
    return (raw > 1000) ? 1000 : raw;
};
