import CheckRadialCollision from "../CheckRadialCollision";
import Player from "./Player";

export class TicketController {
    TicketList: TicketObject[];
    ctx: CanvasRenderingContext2D;
    maxX: number;
    maxY: number;
    player: Player;
    constructor(ctx: CanvasRenderingContext2D, maxX: number, maxY: number, player: Player) {
        this.ctx = ctx;
        this.TicketList = [];
        this.maxX = maxX;
        this.maxY = maxY;
        this.player = player;
    }
    genTicket(o: { vMax: number, widthMax: number, widthMin: number, n: number; }) {
        let vMax = o.vMax, widthMax = o.widthMax, widthMin = o.widthMin, n = o.n;
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
            let sign = (Math.random() < 0.5) ? -1 : 1;
            let angleDelta = sign * Math.PI / 25 * Math.random();
            let ticket = new TicketObject(x, y, vx, vy, width, angleDelta, this.ctx);
            this.TicketList.push(ticket);
        }
    }
    draw() {
        let count = 0;
        this.TicketList.forEach(ticket => {
            if (ticket.x < -50 || ticket.x > this.maxX + 50 || ticket.y < -50 || ticket.y > this.maxY + 50 || ticket.dead) {
                this.TicketList.splice(count, 1);
            } else {
                this.TicketList.forEach(ticket => {
                    CheckRadialCollision(ticket, this.player, () => {
                        ticket.collide(this.player);
                    });
                });
                ticket.draw();
            }
            count++;
        });
    }
}
const genSign = (): number => {
    let sign: number = Math.random() < .5 ? -1 : 1;
    return sign;
};
const randomBetween = (a: number, b: number): number => {
    return a + Math.random() * (b - a);
};
class TicketObject {
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    angle: number;
    angleDelta: number;
    img: HTMLImageElement;
    dead: boolean;
    ctx: CanvasRenderingContext2D;
    constructor(x: number, y: number, vx: number, vy: number, width: number, angleDelta: number, ctx: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = width;
        this.height = width;
        this.angle = 0;
        this.angleDelta = angleDelta;
        this.ctx = ctx;
        this.dead = false;
        const img = document.createElement("img");
        img.src = `/Boleto.png`;
        this.img = img;
    }
    move() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.angleDelta;
    }
    draw() {
        this.move();
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.drawImage(this.img, -1 * this.width / 2, -1 * this.height / 2, this.width, this.height);
        this.ctx.restore();
    }
    collide(player: Player) {
        this.dead = true;
        player.tickets++;
    }
}