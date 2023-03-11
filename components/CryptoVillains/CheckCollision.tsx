type Collideable = {
    x: number;
    y: number;
    width: number;
    height: number;
    exists?: number;
};

export default function CheckCollision(collider: Collideable, collidee: Collideable, onCollision: (...args: any) => any) {
    try {
        if (collider.exists! <= 0) {
            return;
        }
    } catch (e) {

    }
    if (collider == undefined) console.log("collider");
    if (collidee == undefined) console.log("collidee");
    if (collider.x + collider.width > collidee.x &&
        collider.x < collidee.x + collidee.width &&
        collider.y + collider.height > collidee.y &&
        collider.y < collidee.y + collidee.height) {
        onCollision();
    }
}