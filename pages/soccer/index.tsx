import { NextPage } from "next";
import { useState, useEffect, useRef, Fragment } from "react";
import { PlayButton } from "../../components/soccer/PlayButton";
import ResultsStreak, { SoccerResult } from "../../components/soccer/ResultsStreak";




const Soccer2: NextPage = () => {
    const [balance, setBalance] = useState(0);
    const [selectedEntryPrice, setSelectedEntryPrice] = useState(0.05); //amount used for select price buttons
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [result, setResult] = useState<boolean | null>(null);
    const [ballImageSource, setBallImageSource] = useState<'/gold-balls/ball-gold' | '/balls/ball'>('/balls/ball');
    const [recentResults, setRecentResults] = useState<SoccerResult[]>([]); //used to get most recent results

    async function startPlay(choice: 'left' | 'right' | 'center') {
        setIsPlaying(true);
        let gameResult;
        gameResult = { playerPick: choice, isWinner: true, goaliePick: "left" } //make random later
        //creates game in backend and gets game result (including goalie pick)
        const houseChoice = gameResult.goaliePick.toLowerCase() as "left" | "center" | "right";
        animate(choice, houseChoice, gameResult);
        //plays the game

        const recentResult: SoccerResult = {
            myPick: gameResult?.playerPick,
            abbreviation: gameResult?.isWinner ? "G" : "S",
        }; //gets value picked by player and whether they won or not
        const recentResultsCopy = recentResults;
        recentResultsCopy.push(recentResult); //adds the recent result to the list of recent results
        setRecentResults(recentResultsCopy);
    }

    function data(): any {
        let goalieDelta = [];
        goalieDelta[1] = 0;
        // @ts-ignore
        const ballContainerRect = document.getElementById('field').getBoundingClientRect();
        // @ts-ignore
        const xDelta = .25 * document.getElementById('goal').getBoundingClientRect().width; //y position to move (could be 0)
        let yDelta = -1 * ballContainerRect.height * .35;

        let ballDelta = [];
        const ops = [-1, 0, 1];
        for (let i = 0; i < 3; i++) {
            ballDelta.push([xDelta * ops[i], yDelta]);
        }
        let goalieFinal = { 'left': ballDelta[0][0], 'center': ballDelta[1][0], 'right': ballDelta[2][0] };
        let ballFinal = { 'left': ballDelta[0], 'center': ballDelta[1], 'right': ballDelta[2] };
        const result = [goalieFinal, ballFinal];
        return result;
    }
    function animate(playerChoice: "left" | "right" | "center", houseChoice: "left" | "right" | "center", gameResult: any) {
        //get important variables
        //@ts-ignore
        const fieldRect = document.getElementById('field').getBoundingClientRect();
        const goalie = document.getElementById('goalie') as HTMLElement;
        const ball = document.getElementById('ball') as HTMLElement;
        const ballRect = ball.getBoundingClientRect();
        const goalieRect = goalie.getBoundingClientRect();
        let ballLeft = ballRect.left - fieldRect.left; //this is determined by the fucking screen for some retarded ass reason
        let ballTop = ballRect.top - fieldRect.top;
        let goalieLeft = goalieRect.left - fieldRect.left;
        let ballSize: number;
        if (window.innerWidth < 768) {
            ballSize = 8;
        } else {
            ballSize = 4;
        }
        //define array of available positions for both ball and goalie
        const maxSize = ballSize + 6;
        const animationPositions = data();
        const ballPositions = animationPositions[1];
        const goaliePositions = animationPositions[0];

        //define house choice based on altered odds

        let ballMove = ballPositions[playerChoice];


        let step = 0;
        let steps = 100; //total time of animation in ms: steps * (delay of setInterval) 


        let sizeFunction = (x: number) => x + 1;
        let sizeDelta = (maxSize - ballSize) / (steps / 2);
        let secondaryDelta = 2 / (steps / 2);
        let sizeDeltaListTemp = [];
        for (let i = -1; i < 1; i = i + secondaryDelta) {
            sizeDeltaListTemp.push(sizeFunction(i) * sizeDelta);
        }


        let sizeDeltaList: number[] = [];
        for (let item of sizeDeltaListTemp) {
            sizeDeltaList.push(item);
        }
        let sizeDeltaListTemp2 = sizeDeltaListTemp.reverse();
        for (let item2 of sizeDeltaListTemp2) {
            sizeDeltaList.push(-1 * item2);
        }
        sizeDeltaList = sizeDeltaList.slice(1, sizeDeltaList.length - 1);



        //define incremental deltas
        let goalieMove = goaliePositions[houseChoice] / steps;
        let ballXDelta = ballMove[0] / steps;
        let ballYDelta = ballMove[1] / steps;

        //generate xpos and ypos arrays
        let ballXPosArray: number[] = [];
        let ballYPosArray: number[] = [];
        for (let i = 1; i < steps + 1; i++) {
            ballXPosArray.push(ballLeft + ballXDelta * i);
            ballYPosArray.push(ballTop + ballYDelta * i);
        }

        //modify xpos array to align with curvature
        let xSkew = .1 * fieldRect.width; //in px
        let xSkewStep = xSkew / (steps / 2);
        let xSkewArray = [];
        for (let i = 1; i < (steps / 2) + 1; i++) {
            xSkewArray.push(i * xSkewStep);
        }
        const xSkewArrayFinal: number[] = [];
        for (let item of xSkewArray) {
            xSkewArrayFinal.push(item);
        }
        xSkewArray.reverse();
        for (let item of xSkewArray) {
            xSkewArrayFinal.push(item);
        }

        //define frame
        const randomIntForCenterSkew = Math.random();
        let animateFrame = setInterval(frame, 2);
        let imageNumber = 0;
        function frame() {
            if (step == steps) {
                clearInterval(animateFrame);
                animateText(gameResult.isWinner, fieldRect);
            } else {
                if (step % 20 == 0) {
                    ball.style.transform = `rotate(${step / steps * 360}deg)`;
                    imageNumber++;
                }
                if (playerChoice == 'left') {
                    ballLeft = ballXPosArray[step] - xSkewArrayFinal[step];
                } else if (playerChoice == 'center') {
                    if (randomIntForCenterSkew < 0.5) {
                        ballLeft = ballXPosArray[step] + xSkewArrayFinal[step];
                    } else {
                        ballLeft = ballXPosArray[step] - xSkewArrayFinal[step];
                    }
                } else {
                    ballLeft = ballXPosArray[step] + xSkewArrayFinal[step];
                }
                ballTop = ballYPosArray[step];
                goalieLeft = goalieLeft + goalieMove;
                ballSize = ballSize + sizeDeltaList[step];
                ball.style.width = ballSize + 'vw';
                ball.style.height = ballSize + 'vw';
                ball.style.top = ballTop + 'px';
                ball.style.left = ballLeft + 'px';
                goalie.style.left = goalieLeft + 'px';
                step++;
            }
        }
    }
    function animateText(status: boolean, fieldRect: DOMRect) {
        const textbox = document.getElementById('resultText') as HTMLElement;
        if (status == true) {
            //change balance here
            textbox.innerHTML = "GOOOOOOOOOOOOOAL";
            textbox.style.color = "#cccc00";
        } else {
            textbox.innerHTML = "SAVE";
            textbox.style.color = "#ff0000";
        }
        const interval = setInterval(frame, 10);
        let steps = 100; //total time (ms) = (steps * interval)
        let step = 0;
        function frame() {
            if (step == steps) {
                clearInterval(interval);
                setIsFinished(true);
            } else {
                step++;
            }
        }

    }
    function resetPosition() {
        const ball = document.getElementById('ball') as HTMLElement;
        const goalie = document.getElementById('goalie') as HTMLElement;
        ball.style.left = ""; //this is not an error, the code checker is wrong. Everything runs
        ball.style.top = "";
        goalie.style.left = ""; //it simply clears the inline styles set during the animations
    }
    function reMatch() {
        console.log(result);
        setResult(null);
        setIsPlaying(false);
        setIsFinished(false);
        resetPosition();
    }
    return (
        <>
            <div>
                <div className="w-full grid grid-cols-1 place-items-center items-center">
                    <div className="h-[50vh] md:h-[70vh] lg:h-[100vh] w-full lg:w-[75%] flex flex-row justify-center">
                        {!isPlaying ?
                            <div className="relative w-full h-full grid grid-cols-1 max-w-[1280px] max-h-[1280px]" id="field">
                                <img src="/soccerField.jpg" className="absolute w-full h-full"></img>
                                <div className="absolute h-[8%] w-full top-[20%] grid grid-cols-10 place-items-center items-center place-self-center">
                                    <img src="/logo1.jpg" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                    <img src="/logo2.jpg" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                    <img src="/logo3.jpg" className="col-start-9 w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                    <img src="/logo4.jpg" className="col-start-10 w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                </div>
                                <div className="absolute grid grid-cols-3 place-items-center items-center top-[10%] left-[25%] w-[50%] h-[20%]" id="goal">
                                    <PlayButton disable={isPlaying || balance < selectedEntryPrice /*fix this after testing!! should be || */} startPlay={startPlay} id="button1" choice="left" />
                                    <PlayButton disable={isPlaying || balance < selectedEntryPrice} startPlay={startPlay} id="button2" choice="center" />
                                    <PlayButton disable={isPlaying || balance < selectedEntryPrice} startPlay={startPlay} id="button3" choice="right" />
                                </div>
                                <div className="absolute place-self-center bottom-[70%] h-[20%] w-[20%]" id='goalie'>
                                    <img src="/Keepa_1.svg" className="w-full h-full"></img>
                                </div>
                                <div></div>
                                <div className="absolute bg-contain place-self-center top-[55%] md:top-[53.5%] lg:top-[52%] w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw]" id='ball' style={{ backgroundImage: `url("${ballImageSource}0.png")` }}> </div>
                            </div>
                            : isFinished ?
                                <div className="relative w-full h-full grid grid-cols-1 max-w-[1280px] max-h-[1280px]" id="field">
                                    <img src="/soccerField.jpg" className="absolute w-full h-full"></img>
                                    <div className="absolute h-[8%] w-full top-[20%] grid grid-cols-10 place-items-center items-center place-self-center">
                                        <img src="/logo1.jpg" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                        <img src="/logo2.jpg" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                        <img src="/logo3.jpg" className="col-start-9 w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                        <img src="/logo4.jpg" className="col-start-10 w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                    </div>
                                    <div className="absolute grid grid-cols-1 place-items-center items-center top-[10%] left-[25%] w-[50%] h-[20%]" id="goal">
                                        <button onClick={reMatch}>
                                            PLAY AGAIN
                                        </button>
                                    </div>
                                    <div className="absolute place-self-center bottom-[70%] h-[20%] w-[20%]" id='goalie'>
                                        <img src="/Keepa_1.svg" className="w-full h-full object-bottom"></img>
                                    </div>
                                    <div> </div>
                                    <div className="absolute bg-contain place-self-center top-[55%] md:top-[53.5%] lg:top-[52%] w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] " id='ball' style={{ backgroundImage: `url("${ballImageSource}0.png")` }}> </div>
                                </div>

                                :
                                <div className="relative w-full h-full grid grid-cols-1 max-w-[1280px] max-h-[1280px]" id="field">
                                    <img src="/soccerField.jpg" className="absolute w-full h-full"></img>
                                    <div className="absolute h-[8%] w-full top-[20%] grid grid-cols-10 place-items-center items-center place-self-center">
                                        <img src="/logo1.jpg" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                        <img src="/logo2.jpg" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                        <img src="/logo3.jpg" className="col-start-9 w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                        <img src="/logo4.jpg" className="col-start-10 w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]" />
                                    </div>
                                    <div className="absolute grid grid-cols-3 place-items-center items-center top-[10%] left-[25%] w-[50%] h-[20%]" id="goal"></div>
                                    <div className="absolute place-self-center bottom-[70%] h-[20%] w-[20%]" id='goalie'>
                                        <img src="/Keepa_1.svg" className="w-full h-full object-bottom"></img>
                                    </div>
                                    <div className="absolute w-fit h-fit font-press-start place-self-center text-xl md:text-3xl lg:text-4xl" id="resultText"> </div>
                                    <div className="absolute bg-contain place-self-center top-[55%] md:top-[53.5%] lg:top-[52%] w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] " id='ball' style={{ backgroundImage: `url("${ballImageSource}0.png")` }}> </div>
                                </div>
                        }
                    </div>
                </div>
                {/* FAQ */}
                <div id="faq" className="text-white text-2xl md:text-3xl tracking-wider text-center mt-20 mb-5 pt-10 xl:mb-5 xl:mt-24">Frequently Asked Questions</div>
                <div className="mx-auto w-11/12 lg:w-8/12">
                </div>
                <div className="pb-10"></div>
            </div>
        </>
    );
};

export default Soccer2;
