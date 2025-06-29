export interface Shot {
    id: number;
    timestamp: number;
    duration: number;
    datapoints: ShotDatapoint;
    profile: ShortProfile;
    created_at: string;
    updated_at: string;
}

export interface ShotDatapoint {
    timeInShot: number[];
    pressure: number[];
    pumpFlow: number[];
    weightFlow: number[];
    temperature: number[];
    shotWeight: number[];
    waterPumped: number[];
    targetTemperature: number[];
    targetPumpFlow: number[];
    targetPressure: number[];
}
export interface ShortProfile {
    id: number;
    name: string;
    phases: {
        target: {
            end: number;
            curve: string;
            time: number;
        };
        stopConditions: {
            time: number;
            pressureAbove: number;
            waterPumpedInPhase: number;
        };
        type: string;
        skip: boolean;
        restriction: number;
    }[];
    globalStopConditions: {
        weight: number;
    };
    waterTemperature: number;
    recipe: {
        coffeeIn: number;
        ratio: number;
    };
}

// {
//     "id": 23,
//     "timestamp": 1748180909,
//     "duration": 383,
//     "datapoints": {
//         "timeInShot": [
//             1,
//             3,
//
//             382,
//             383
//         ],
//         "pressure": [
//             6,
//             6,
//             6,
//             6,
//             6,
//             6,
//             6,
//             7,
//             7,
//             8,
//             10,
//             11,
//
//             30,
//             30,
//             30
//         ],
//         "pumpFlow": [
//             0,
//             31,
//             31,
//             80,
//
//             9,
//             9,
//             9,
//             9
//         ],
//         "weightFlow": [
//             0,
//             0,
//             0,
//             0,
//
//             0,
//             0,
//             0,
//             0,
//             0,
//             0,
//             0
//         ],
//         "temperature": [
//             945,
//             945,
//             945,
//             945,
//             945,
//
//             960,
//             960,
//             960,
//             960,
//             960
//         ],
//         "shotWeight": [
//             0,
//             0,
//             0,
//             0,
//             0,
//             0,
//
//             349,
//             353,
//             353,
//             355,
//             355
//         ],
//         "waterPumped": [
//             0,
//             8,
//             8,
//             28,
//             49,
//             49,
//             72,
//             72,
//             94,
//             116,
//             116,
//             138,
//
//             601,
//             603,
//             603,
//             605,
//             607,
//             607,
//             610,
//             610
//         ],
//         "targetTemperature": [
//             950,
//             950,
//             950,
//             950,
//             950,
//             950,
//
//             950,
//             950
//         ],
//         "targetPumpFlow": [
//             90,
//             90,
//             90,
//             0,
//
//
//             30,
//             30,
//             30,
//
//             30,
//             30,
//             30
//         ],
//         "targetPressure": [
//             40,
//             40,
//             30,
//             30
//         ]
//     },
//     "profile": {
//         "id": 3,
//         "name": "Londinium",
//         "phases": [
//             {
//                 "target": {
//                     "end": 9,
//                     "curve": "INSTANT"
//                 },
//                 "stopConditions": {
//                     "time": 10000,
//                     "pressureAbove": 4,
//                     "waterPumpedInPhase": 65
//                 },
//                 "type": "FLOW",
//                 "skip": false,
//                 "restriction": 4
//             },
//             {
//                 "target": {
//                     "end": 0,
//                     "curve": "INSTANT"
//                 },
//                 "stopConditions": {
//                     "time": 10000,
//                     "pressureBelow": 0.7
//                 },
//                 "type": "FLOW",
//                 "skip": false
//             },
//             {
//                 "target": {
//                     "end": 9,
//                     "curve": "EASE_OUT",
//                     "time": 1000
//                 },
//                 "stopConditions": {
//                     "time": 1000
//                 },
//                 "type": "PRESSURE",
//                 "skip": false
//             },
//             {
//                 "target": {
//                     "end": 9,
//                     "curve": "INSTANT"
//                 },
//                 "stopConditions": {
//                     "time": 4000
//                 },
//                 "type": "PRESSURE",
//                 "skip": false,
//                 "restriction": 3
//             },
//             {
//                 "target": {
//                     "start": 9,
//                     "end": 3,
//                     "curve": "EASE_IN_OUT",
//                     "time": 20000
//                 },
//                 "stopConditions": {},
//                 "type": "PRESSURE",
//                 "skip": false,
//                 "restriction": 3
//             }
//         ],
//         "globalStopConditions": {
//             "weight": 36
//         },
//         "waterTemperature": 95,
//         "recipe": {
//             "coffeeIn": 20,
//             "ratio": 2
//         }
//     }
// }
