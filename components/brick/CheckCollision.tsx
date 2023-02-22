
type Collideable = {
    width: number;
    height: number;
    x: number;
    y: number;
};


export default function CheckCollision(collider: Collideable, collidee: Collideable, onCollision: () => any) {
    if (collider.x + collider.width > collidee.x &&
        collider.x < collidee.x + collidee.width &&
        collider.y + collider.height > collidee.y &&
        collider.y < collidee.y + collidee.height) {
        onCollision();
    }
}