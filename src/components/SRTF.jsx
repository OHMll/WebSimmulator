export default function srtf(input) {
    let processes = input.map(([pid, arrival, burst]) => ({
        pid,
        arrival,
        burst
    }));

    let n = processes.length;
    let remainingTime = processes.map(process => process.burst);
    let currentTime = 0;
    let completed = 0;
    let waitingTime = new Array(n).fill(0);
    let turnaroundTime = new Array(n).fill(0);
    let ganttChart = [];

    while (completed < n) {
        let available = [];
        for (let i = 0; i < n; i++) {
            if (processes[i].arrival <= currentTime && remainingTime[i] > 0) {
                available.push(i);
            }
        }

        if (available.length > 0) {
            let processInQueue = available.reduce((minIdx, i) => {
                return remainingTime[i] < remainingTime[minIdx] ? i : minIdx;
            }, available[0]);

            if (ganttChart.length === 0 || ganttChart[ganttChart.length - 1].pid !== processes[processInQueue].pid) {
                ganttChart.push({ pid: processes[processInQueue].pid, start: currentTime, duration: 0 });
            }

            remainingTime[processInQueue] -= 1;
            currentTime += 1;
            ganttChart[ganttChart.length - 1].duration += 1;

            if (remainingTime[processInQueue] === 0) {
                completed += 1;
                let finishTime = currentTime;
                turnaroundTime[processInQueue] = finishTime - processes[processInQueue].arrival;
                waitingTime[processInQueue] = turnaroundTime[processInQueue] - processes[processInQueue].burst;
            }
        } else {
            currentTime += 1;
        }
    }

    return [ waitingTime, turnaroundTime, ganttChart ];
}