export default class Player {
    x: number;
    y: number;
    speed: number;
    width: number;
    height: number;
    defaultWidth: number;
    defaultSpeed: number;
    rightPressed: boolean;
    leftPressed: boolean;
    canvas: HTMLCanvasElement;
    img: HTMLImageElement;
    constructor(x: number, y: number, speed: number, canvas: HTMLCanvasElement) {
        this.width = canvas.width / 8;
        this.defaultWidth = this.width;
        this.x = (canvas.width / 2) - (this.width / 2);
        this.y = (canvas.height / 12) * 11;
        this.speed = speed;
        this.defaultSpeed = speed;
        this.height = canvas.width / 25;
        this.canvas = canvas;
        const img = document.createElement("img");
        img.src = "/Paddle.png";
        this.img = img;
        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
        document.addEventListener("mousemove", this.mousePosition);
        // document.addEventListener("mousedown", () => {
        //     document.addEventListener("mousemove", this.mousePosition);
        // });
        // document.addEventListener("mouseup", () => {
        //     document.removeEventListener("mousemove", this.mousePosition);
        // });
        document.addEventListener("touchmove", this.touchPosition, { passive: false });
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.move();
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > this.canvas.height) this.y = this.canvas.height - this.height;
        if (this.x + this.width > this.canvas.width) this.x = this.canvas.width - this.width;
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
    };

    keyup = (e: any) => {
        e.preventDefault();
        if (e.code === "ArrowLeft") {
            this.leftPressed = false;
        }
        if (e.code === "ArrowRight") {
            this.rightPressed = false;
        }
    };
    touchPosition = (e: TouchEvent) => {
        e.preventDefault();
        this.setPosition(e.touches[0].clientX);
    };
    mousePosition = (e: MouseEvent) => {
        this.setPosition(e.clientX);
    };
    setPosition = (p: number) => {
        let canvasRect = this.canvas.getBoundingClientRect();
        let x = p - canvasRect.left - (this.width / 2);
        if (x < 0) {
            this.x = 0;
        } else if (x > this.canvas.width - this.width) {
            this.x = this.canvas.width - this.width;
        } else {
            this.x = x;
        }
    };
    decreaseWidth() {
        let width = this.width / 2;
        if (!(width < this.defaultWidth)) {
            this.width = width;
            this.x += width / 2;
        }
    }
    decreaseSpeed() {
        let speed = this.speed / 2;
        if (!(speed < this.defaultSpeed)) {
            this.speed = speed;
        }
    }
}