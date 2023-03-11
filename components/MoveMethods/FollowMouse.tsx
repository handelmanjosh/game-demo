import { useEffect, useState } from "react";

type FollowMouseProps = {
    target: () => { width: number, height: number, x: number, y: number, vx: number, vy: number; vMax: number; };
    canvasId: string;
};
//adjust for player being in center
export default function FollowMouse({ target, canvasId }: FollowMouseProps) {
    useEffect(() => {
        document.addEventListener("mousemove", mouseWrapper);
        document.addEventListener("touchmove", touchWrapper, { passive: false });
    }, []);
    const touchWrapper = (event: TouchEvent) => {
        event.preventDefault();
        updateMousePosition(event.touches[0].clientX, event.touches[0].clientY);
    };
    const mouseWrapper = (event: MouseEvent) => {
        updateMousePosition(event.x, event.y);
    };
    const updateMousePosition = (x: number, y: number) => {
        let canvas = document.getElementById(canvasId).getBoundingClientRect();
        let player = target();
        let playerPos = [canvas.x + canvas.width / 2, canvas.y + canvas.height / 2];

        let xDiff = x - playerPos[0];
        let yDiff = y - playerPos[1];
        let maxDiff = player.width * 3;

        let rx = xDiff / maxDiff;
        let ry = yDiff / maxDiff;

        if (rx > 1) rx = 1;
        if (rx < -1) rx = -1;
        if (ry > 1) ry = 1;
        if (ry < -1) ry = -1;

        player.vx = player.vMax * rx;
        player.vy = player.vMax * ry;
    };
    return (
        <>
        </>
    );
}