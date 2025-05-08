import mergeSort from "./Mergesort";

export default function mlfq(input, t1 = 5, t2 = 10, t3 = 20) {
    let processData = input.map(([name, arrivalTime, burstTime]) => ({
        name,
        arrivalTime,
        burstTime,
    }));

    let levelQueues = [[], [], []];
    let timeQuantums = [t1, t2, t3];
    processData = mergeSort(processData, "arrivalTime");


    let currentTime = 0;
    let processIndex = 0;
    let remainingTime = {};
    let finishedTime = {};
    let queueEnterTime = {}; // สำหรับ aging
    let ganttChart = [];

    processData.forEach(({ name, burstTime }) => {
        remainingTime[name] = burstTime;
    });

    const promotionThreshold = 30; // เวลารอสูงสุดก่อน promote

    while (processIndex < processData.length || levelQueues.some(queue => queue.length > 0)) {
        // ใส่ process ใหม่เข้าคิวแรกตาม arrivalTime
        while (processIndex < processData.length && processData[processIndex].arrivalTime <= currentTime) {
            let p = processData[processIndex];
            levelQueues[0].push(p);
            queueEnterTime[p.name] = currentTime; // บันทึกเวลาเข้า queue
            processIndex++;
        }

        // Aging: promote process ที่รอเกิน threshold
        for (let lvl = levelQueues.length - 1; lvl > 0; lvl--) {
            levelQueues[lvl] = levelQueues[lvl].filter(process => {
                let name = process.name;
                if (currentTime - (queueEnterTime[name] ?? 0) >= promotionThreshold) {
                    levelQueues[lvl - 1].push(process);
                    queueEnterTime[name] = currentTime; // reset เวลาเข้า queue
                    return false; // เอาออกจาก queue เดิม
                }
                return true;
            });
        }

        // วนหาคิวที่มี process พร้อมทำงาน
        for (let level = 0; level < levelQueues.length; level++) {
            if (levelQueues[level].length > 0) {
                let process = levelQueues[level].shift();
                let { name, arrivalTime, burstTime } = process;

                let timeToRun = Math.min(remainingTime[name], timeQuantums[level]);
                ganttChart.push({ pid: name, start: currentTime, duration: timeToRun });

                remainingTime[name] -= timeToRun;
                currentTime += timeToRun;

                if (remainingTime[name] === 0) {
                    finishedTime[name] = currentTime;
                } else {
                    if (level + 1 < levelQueues.length) {
                        levelQueues[level + 1].push({ name, arrivalTime: 0, burstTime: remainingTime[name] });
                        queueEnterTime[name] = currentTime; // เมื่อเข้า queue ถัดไป
                    } else {
                        levelQueues[level].push({ name, arrivalTime: 0, burstTime: remainingTime[name] });
                        queueEnterTime[name] = currentTime; // อยู่คิวเดิมก็อัปเดต
                    }
                }
                break;
            }
        }

        // ถ้าทุกคิวว่าง รอจนกว่า process ใหม่จะมา
        if (levelQueues.every(queue => queue.length === 0)) {
            if (processIndex < processData.length) {
                let nextProcessTime = processData[processIndex].arrivalTime;
                currentTime = Math.max(currentTime + 1, nextProcessTime);
            } else {
                currentTime++;
            }
        }
    }

    let newProcessData = processData.map(process => {
        let { name } = process;
        if (finishedTime[name]) {
            return [...Object.values(process), finishedTime[name]];
        }
        return process;
    });

    let waitingTimes = [];
    let turnaroundTimes = [];

    newProcessData.forEach(process => {
        let waitingTime = process[3] - process[1] - process[2];
        let turnaroundTime = process[3] - process[1];
        waitingTimes.push(waitingTime);
        turnaroundTimes.push(turnaroundTime);
    });

    return [ waitingTimes, turnaroundTimes, ganttChart ];
}