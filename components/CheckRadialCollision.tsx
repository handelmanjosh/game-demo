
type Collideable = {
    x: number;
    y: number;
    width: number;
    height: number;
    cantCollide?: boolean;
};

const CheckRadialCollision = (collider: Collideable, collidee: Collideable, onCollision: () => any) => {
    if (collidee.cantCollide || collider.cantCollide) return;
    if (collidee === collider) return;
    let d = distance([collider.x, collider.y], [collidee.x, collidee.y]);
    let colliderR = collider.height / 2;
    let collideeR = collidee.height / 2;
    if (d < colliderR || d < collideeR) {
        onCollision();
    }
};
const distance = (a: number[], b: number[]) => { return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2); };
export default CheckRadialCollision;

