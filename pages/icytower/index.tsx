import { NextPage } from "next";
import { useState, useEffect, useRef, Fragment } from "react";
import React from "react";
import Board from "../../components/tower/Board";
import GameButton from "../../components/GameButton";


const cols = 8;
const rows = 12;
const length = rows * cols;
let coloredTiles = 5;
let towerLevel = 0;
let ticketsWon = 0;
let blockNum = 0;
let canPlay = false;
let timeDelta = (t: number) => t / 1.45; //maybe add ternary to control super small ms values

//make victory screen component that displays the amount of tickets won by the user
const Tower: NextPage = () => {
    const [ticketCount, setTicketCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [hasClicked, setHasClicked] = useState<boolean>(false);
    const [moveInterval, setMoveInterval] = useState(0);
    const [stuff, setStuff] = useState({
        direction: -1,
        currentMaxIndex: length,
        currentMinIndex: length - cols,
        currentMaxInRow: cols,
        currentMinInRow: cols - coloredTiles,
        currentRow: stringArrayFromTo(length - cols, length),
        speed: 1000,
    });
    const [gameOver, setGameOver] = useState<boolean>(false);
    function stringArrayFromTo(from: number, to: number): string[] {
        let result = [];
        for (let i = from; i < to; i++) {
            result.push(i.toString());
        }
        return result;
    }
    async function stopMovement() {
        if (hasClicked == true || canPlay == false) {
            return;
        }
        setHasClicked(true);
        for (let item of stuff.currentRow) {
            let tempItem = parseInt(item) + cols;
            if (tempItem < length) {
                let itemBelow = tempItem.toString();
                let elem1 = document.getElementById(item)!;
                let elem2 = document.getElementById(itemBelow)!;
                if (elem1.style.backgroundImage != "" && elem2.style.backgroundImage == "") {
                    elem1.style.backgroundImage = "";
                    elem1.style.border = "";
                    coloredTiles--;
                }
            }
        }
        if (coloredTiles == 0) { //unsuccessful attempt

            console.log("You reached level: " + towerLevel);
            ticketsWon = 0;
            towerLevel = 0;
            clearInterval(moveInterval);
            setGameOver(true);

            //set done playing
            //give user rewards
        } else {
            clearInterval(moveInterval);
            towerLevel++;

            if (towerLevel == 11) {
                blockNum = 3;
            } else if (towerLevel >= 8) {
                blockNum = 2;
            } else if (towerLevel >= 5) {
                blockNum = 1;
            } else {
                blockNum = 0;
            }
            if (towerLevel == rows) {
                ticketsWon += 5;
                setTicketCount(ticketCount + ticketsWon);
                //TODO: credit tickets on frontend using ticketsWon or TOWER_LEVEL_TICKETS_MAP
                towerLevel = 0;
                setGameOver(true);
            } else {
                if (stuff.currentMinIndex < 32) {
                    ticketsWon += 3;
                } else if (stuff.currentMinIndex < 56) {
                    ticketsWon += 2;
                } else {
                    ticketsWon++;
                }
                stuff.currentMaxIndex = stuff.currentMaxIndex - cols;
                stuff.currentMinIndex = stuff.currentMinIndex - cols;
                //stuff.currentMaxInRow = 8 
                //removing this makes it more random

                stuff.currentMinInRow = stuff.currentMaxInRow - coloredTiles;
                stuff.currentRow = stringArrayFromTo(stuff.currentMinIndex, stuff.currentMaxIndex);
                stuff.speed = timeDelta(stuff.speed);
                let temp = setInterval(moveTiles, stuff.speed);
                //@ts-ignore
                setMoveInterval(temp);
            }

        }
    }
    async function playGame() {

        //debit balance
        setIsPlaying(true);
        //TODO: add loading state, handle/catch error response



        let temp = setInterval(moveTiles, stuff.speed);
        //@ts-ignore
        setMoveInterval(temp);
        setTimeout(() => {
            canPlay = true;
        }, 2000);

    }
    function playAgain() {
        for (let i = 0; i < length; i++) {
            let id = i.toString();
            let elem = document.getElementById(id)!;
            elem.style.backgroundImage = "";
            elem.style.border = "";
        }
        coloredTiles = 5;
        setGameOver(false);
        setIsPlaying(false);
        resetStuff();
        canPlay = false;
        towerLevel = 0;
        ticketsWon = 0;
        blockNum = 0;
    }
    async function endGame() {
        clearInterval(moveInterval);
        setTicketCount(ticketCount + ticketsWon);
        setGameOver(true);
        for (let i = stuff.currentMinIndex; i < stuff.currentMaxIndex; i++) {
            let elem = document.getElementById(i.toString())!;
            elem.style.backgroundImage = "";
            elem.style.border = "";
        }
        //TODO: increment ticket balance on frontend using ticketsWon or TOWER_LEVEL_TICKETS_MAP
        towerLevel = 0;
    }
    function resetStuff() {
        stuff.direction = -1;
        stuff.currentMaxIndex = length;
        stuff.currentMinIndex = length - cols;
        stuff.currentMaxInRow = cols;
        stuff.currentMinInRow = cols - coloredTiles;
        stuff.currentRow = stringArrayFromTo(length - cols, length);
        stuff.speed = 1000;
    }
    function moveTiles() {
        let count = 0;
        for (let id of stuff.currentRow) {
            if (count >= stuff.currentMinInRow && count < stuff.currentMaxInRow) {
                let element = document.getElementById(id)!;
                element.style.backgroundImage = `url("/tower_block${blockNum}.png")`;
                element.style.border = "none";
            } else {
                let element = document.getElementById(id)!;
                element.style.backgroundImage = "";
                element.style.border = "";
            }
            count++;
        }
        setHasClicked(false);
        if (stuff.currentMinInRow == 0) {
            stuff.direction *= -1;
        }
        stuff.currentMinInRow += stuff.direction;
        stuff.currentMaxInRow += stuff.direction;
        if (stuff.currentMaxInRow == cols) {
            stuff.direction *= -1;
        }
    }
    return (
        <>
            <div>
                <div className="flex flex-col items-center mt-4">
                    <div className="w-full flex flex-row justify-center">
                        <div className=" mr-1 flex flex-col gap-1 ">
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start"> <img src="/BoletoFive.png" /> </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start">  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start">   </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start"> <img src="/BoletoThree.png" />  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start">   </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start">   </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start"> <img src="/BoletoTwo.png" />  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start">   </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start">  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start">   </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start"> </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start"> <img src="/Boleto.png" /> </div>
                        </div>
                        <div className=" relative place-self-center w-fit h-fit grid grid-cols-1 place-items-center items-center">
                            <div className="place-self-center w-fit h-fit flex flex-col gap-1 "> {/* top padding may have to change on small screens */}
                                <Board width={cols} height={rows} />
                                <div className="h-2"></div>
                                    {isPlaying ?
                                        gameOver ?
                                            <GameButton onClick={playAgain} message="Play Again?"  />
                                            :
                                            <div className="flex flex-col">
                                                <GameButton onClick={stopMovement} message="Stack Cubes"  />
                                                <div className="flex flex-row py-2 w-full">
                                                    {ticketsWon == 0 ? <></> :
                                                        <>
                                                            <div className="flex items-center justify-center font-press-start w-full "> <img className="w-10 h-10 mr-2" src="/Boleto.png" />  {"+" + (ticketsWon ?? 0)}</div>
                                                            <GameButton onClick={endGame} message="Cash Out" color="green"  />
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        :
                                        <GameButton onClick={!isPlaying ? playGame : () => null}  />
                                }
                            </div>
                            {/* <GamePopUp currentPath={towerPath}>
                                <div> Welcome to Mushroom Party&apos;s tower game! </div>
                                <p>How to Play:</p>
                                <ul>
                                    <li> 1. do stuff</li>
                                    <li> 2. do more stuff</li>
                                    <li> 3. do even more stuff</li>
                                </ul>
                            </GamePopUp>
                            {gameOver ?
                            
                                <GamePopUp currentPath={towerPath} buttonMessage="Ok">
                                    <div className="flex flex-row gap-2">
                                        <span className={`font-press-start text-2xl p-2 ${ticketsWon < 1 ? " text-red-500 " : ""} `}>{"+" + ticketsWon} </span>
                                        <img className="w-10 h-10" src="/Boleto.png" />
                                    </div>
                                </GamePopUp> :
                            <></>} */}
                        </div>
                        <div className=" flex flex-col gap-1 ml-1">
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 12 ? "+5" : ""} </p>  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 11 ? "+3" : ""} </p>  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 10 ? "+3" : ""} </p> </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 9 ? "+3" : ""} </p>  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 8 ? "+2" : ""} </p>  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 7 ? "+2" : ""} </p>  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 6 ? "+2" : ""} </p>  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 5 ? "+1" : ""} </p>  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 4 ? "+1" : ""} </p> </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 3 ? "+1" : ""} </p> </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p> {towerLevel >= 2 ? "+1" : ""} </p>  </div>
                            <div className=" w-7 h-7 md:w-10 md:h-10 flex items-center font-press-start text-xs md:text-base"> <p>{towerLevel >= 1 ? "+1" : ""}</p> </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Tower;
