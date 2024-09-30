import { BaseStation } from "./BaseStation";
import { BaseStationInput } from "./types/base-station";

const demoBaseStation = new BaseStation();

demoBaseStation.create([
    {
        storeName: "Fetch_Exam",
        state: { data: [] },
        storeActionMapObject: {
            dataLoading: { 
                type: "FETCH_DATA_LOADING", 
                freq: 5, 
            },
            dataRequest: { 
                type: "FETCH_DATA_REQUEST", 
                freq: 5, 
            },
            dataSuccess: { 
                type: "FETCH_DATA_SUCCESS", 
                freq: 3, 
            },
            dataFailure: {
                type: "FETCH_DATA_FAILURE",
                freq: 1,
            }
        }
    }
], {});

document.addEventListener("DOMContentLoaded", () => {
document.getElementById("getData")?.addEventListener("click", () => {
    const dataViewer = document.getElementById("dataViewer");

    demoBaseStation.reflectDesiredAction("Fetch_Exam", "FETCH_DATA_LOADING", () => {
        if (dataViewer) {
            dataViewer.innerHTML = "Loading...";
            console.log(dataViewer);
        }
    });

    demoBaseStation.reflectDesiredAction("Fetch_Exam", "FETCH_DATA_SUCCESS", (s, p) => {

        const demo = async () => {
            try {
                console.log("hello")
                const response = await fetch('https://api.ipify.org/?format=json');
                const data = await response.json();

                demoBaseStation.reflectDesiredAction("Fetch_Exam", "FETCH_DATA_REQUEST", (state) => {
                    const gtDt = data.ip;
                    dataViewer && (dataViewer.innerHTML = `${gtDt}`);
                    return { data: data.ip };
                });
            } 
            catch (error) {
                demoBaseStation.reflectDesiredAction("Fetch_Exam", "FETCH_DATA_FAILURE", () => {
                dataViewer && (dataViewer.innerHTML = `${error}`);
            });
        }}

        demo();
    })

    const d = demoBaseStation.reflectDesiredAction("Fetch_Exam", "FETCH_DATA_LOADING");
})
});