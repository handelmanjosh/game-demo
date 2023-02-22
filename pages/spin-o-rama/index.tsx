import { NextPage } from "next";
import { useState, useEffect, useRef, Fragment } from "react";
import Head from "next/head";
import { Chart, PieController, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";



function addTicketString(t: number): string {
    let s = t.toString();
    let result = "";
    for (let i of s) {
        result += i + "\n";
    }
    return result;
}
const ticketValues = [2, 5, 1, 100, 2, 5, 1, 25, 2, 5, 1, 10, 250, 10, 1, 50];
const wheelSections = new Map<number, string>();
for (let t of ticketValues) {
    wheelSections.set(t, addTicketString(t)); //might not work
}
const dataset = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]; //add more values to make more sectors in chart
const sectorDegree = 360 / dataset.length;
const degreesArray: number[] = [];
for (let i = 0; i < dataset.length; i++) {
    degreesArray.push(360 - (i * sectorDegree + sectorDegree / 2));
}
//all values must be the same, this controls the sizing of the sectors

//blue #0000FF
const WHEEL_GREEN = "#7CC43C";
const WHEEL_YELLOW = "#f8bc00";
const WHEEL_RED = "#FF4461";
const WHEEL_BLUE = "#4169e1";
const WHEEL_JACKPOT = "#b36b00";

//
const datacolor = [WHEEL_RED, WHEEL_GREEN, WHEEL_BLUE, WHEEL_YELLOW, WHEEL_RED, WHEEL_GREEN, WHEEL_BLUE, WHEEL_YELLOW, WHEEL_RED, WHEEL_GREEN, WHEEL_BLUE, WHEEL_YELLOW, WHEEL_JACKPOT, WHEEL_GREEN, WHEEL_BLUE, WHEEL_YELLOW];
// const datacolor = [WHEEL_RED, WHEEL_GREEN, "#000099", WHEEL_YELLOW, WHEEL_RED, WHEEL_GREEN, "#000099", WHEEL_RED, "#b30000", "#1f7a1f", "#000099", "#b3b300", "#b36b00", "#1f7a1f", "#000099", "#b3b300"]; // sector background color
const databordercolor = ["00000", "00000", "00000", "00000", "00000", "00000",
    "00000", "00000", "00000", "00000", "00000", "00000", "00000", "00000", "00000", "00000"]; // sector border color
const maxSpeed = 5;
const rotation = [100, 125, 145, 170, -170, -145, -125, -100, 280, 305, 325, 350, -350, -325, -305, -280]; //rotation of values 
let labels: string[] = [];
for (let i of ticketValues) {
    // @ts-ignore
    labels.push(wheelSections.get(i));
}
Chart.register(PieController);
Chart.register(ArcElement);
Chart.register(ChartDataLabels);
let spinner: Chart<"pie", number[], string>;
let degreesFunction = (d: number, i: number) => (d > maxSpeed || d < 0) ? d : d + i;
const Spinner: NextPage = () => {
    const [balance, setBalance] = useState(null);
    const [ticketCount, setTicketCount] = useState(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    useEffect(() => {
        let ctx = document.getElementById("spinner-canvas") as HTMLCanvasElement;
        let data = {
            plugins: [ChartDataLabels],
            labels: labels,
            //here is where you change the amount of tickets given
            datasets: [
                {
                    data: dataset,
                    backgroundColor: datacolor,
                    borderColor: databordercolor,
                    borderWidth: 3,
                }
            ],
        };
        //options
        let options = {
            responsive: true,
            rotation: 90,
            // @ts-ignore
            events: [],
            cutout: "20%",
            plugins: {
                legend: {
                    labels: {

                    },
                },
                datalabels: {
                    rotation: rotation,
                    color: "#ffffff",
                    clamp: true,
                    anchor: "center",
                    formatter: function (value: any, context: any) {
                        return context.chart.data.labels[context.dataIndex];
                    },
                    font: function (context: { chart: { width: any; }; }) {
                        var width = context.chart.width;
                        var size = Math.round(width / 32);
                        return {
                            weight: 'bold',
                            size: size,
                            family: "'Press Start 2P'"
                        };
                    },
                },
            },
            title: {
                display: false,
            },
            legend: {
                display: false,
            }
        };
        if(!spinner) {
                spinner = new Chart(ctx, {
                type: "pie",
                data: data,
                // @ts-ignore
                options: options,
            });
        }


    }, []);

    async function spin() {

        if (isPlaying) {
            return;
        }
        setIsPlaying(true);
        const spinner = document.getElementById("spinner") as HTMLElement;
        let degrees = 0;
        let done = false;
        let degreesDelta = 0;
        let increment = .01;
        const interval = setInterval(rotate, 2);
        let times = 0;
        let spinResult: any;

        spinResult = {ticketsWon: 5};
        done = true;


        function rotate() {
            spinner.style.transform = `rotate(${degrees}deg)`;
            degrees += degreesDelta;
            degreesDelta = degreesFunction(degreesDelta, increment);
            if (degreesDelta > 5) {
                times++;
                if (done) {
                    //instead of waiting for variable, it would wait for server response
                    degreesDelta = maxSpeed - .1;
                    increment *= -1;

                }
            }
            if (done && degreesDelta < .4 && increment == -.01) {
                //instead of simply clearing the interval, it would rotate to the degree
                //value of the specified prize recieved by the server
                clearInterval(interval);
                //let finalDegree = wheelSections.get();
                // console.log("Tickets won: " + spinResult.ticketsWon);
                let indexes: number[] = [];
                for (let i = 0; i < ticketValues.length; i++) {
                    if (ticketValues[i] == spinResult.ticketsWon) {
                        indexes.push(i); //of course this is wrong, have to account for dimensional analysis
                    }
                }
                let random = ~~(Math.random() * indexes.length);
                let finalDegreesToStop = degreesArray[indexes[random]];
                stopAtDegree(finalDegreesToStop, degrees, degreesDelta, spinResult.ticketsWon);
            }
        }
    }
    function stopAtDegree(stopDegree: number, currentDegree: number, currentSpeed: number, tickets: number) {
        const spinner = document.getElementById("spinner") as HTMLElement;
        currentDegree = currentDegree % 360;
        let diff = stopDegree - currentDegree;
        let moveAmount = 0;
        let rotatedDegrees = 0;
        if (diff > 0) {
            moveAmount = diff;
        } else {
            moveAmount = diff + 360;
        }
        let change = currentSpeed / moveAmount;
        const degreeChange = (d: number, i: number) => (d > .15) ? d - i : d;
        const interval = setInterval(rotate, 2);
        function rotate() {
            if (rotatedDegrees > moveAmount) {
                // console.log("rotated " + currentDegree % 360);
                setIsPlaying(false);
                clearInterval(interval);
            } else {
                rotatedDegrees += currentSpeed;
                spinner.style.transform = `rotate(${currentDegree + rotatedDegrees}deg)`;
                currentSpeed = degreeChange(currentSpeed, change);
            }
        }
    }
    return (
        <>
            <div >
                <Head>
                    <title>Spin-O-Rama | Mushroom Party</title>
                    {/* <meta name="twitter:card" content="summary_large_image"></meta>
<meta name="twitter:site" content="@joinmushroom"></meta> */}
                    <meta property="og:title" content="Spin-O-Rama | Mushroom Party" />
                    {/* <meta property="og:site_name" content="Mushroom Party" /> */}
                    <meta
                        property="og:description"
                        content="Take a spin to win arcade tickets faster than ever before."
                    />
                    <meta
                        property="og:image"
                        content="/Ro_Head.png"
                    />
                    <meta property="og:image:width" content="856" />
                    <meta property="og:image:height" content="428" />
                </Head> {/* this defines head info */}
                <div className="flex flex-row w-full justify-center">
                    <div className="w-[25px] md:w-[50px]"></div>
                    <div className="flex h-full w-full max-h-[400px] max-w-[400px]">
                        <div className="relative w-full" id="spinner">
                            <canvas id="spinner-canvas"> </canvas>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <img className="w-[25px] h-[25px] md:w-[50px] md:h-[50px]" src="/pointer.png" style={{ transform: `rotate(90deg)` }} />
                    </div>
                </div>
                <div className="flex flex-row justify-center w-full mt-2 md:mt-4">
                    <button onClick={spin} >
                        Spin to Win!
                    </button>
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

export default Spinner;


