import mergeSort from "./Mergesort";

export default function mlfq(input, t1 = 5, t2 = 10, t3 = 20) {
  let processData = input.map(([name, arrivalTime, burstTime]) => ({
    name,
    arrivalTime,
    burstTime,
  }));

  processData = mergeSort(processData, "arrivalTime");

  let levelQueues = [[], [], []];
  let timeQuantums = [t1, t2, t3];

  let currentTime = 0;
  let processIndex = 0;
  let remainingTime = {};
  let finishedTime = {};
  let lastQueueLevel = {};
  let ganttChart = [];
  let lastExecutedProcess = null;
  let queueEnterTime = {}; // เก็บเวลาเข้าคิวล่าสุดของแต่ละ process (สำหรับ aging)
  const agingThreshold = 30;

  // เริ่มต้นค่า remaining time สำหรับทุก process
  processData.forEach(({ name, burstTime }) => {
    remainingTime[name] = burstTime;
    lastQueueLevel[name] = 0;
  });

  while (
    processIndex < processData.length ||
    levelQueues.some((queue) => queue.length > 0)
  ) {
    while (
      processIndex < processData.length &&
      processData[processIndex].arrivalTime <= currentTime
    ) {
      let p = processData[processIndex];
      levelQueues[0].push(p);
      queueEnterTime[p.name] = currentTime;
      processIndex++;
    }

    // ทำ aging ก่อนจะเลือกคิวถัดไป
    // ตรวจสอบ process ในทุกคิวจากล่างขึ้นบน (ระดับต่ำไประดับสูง)
    for (let level = levelQueues.length - 1; level > 0; level--) {
      levelQueues[level] = levelQueues[level].filter((process) => {
        if (
          queueEnterTime[process.name] &&
          currentTime - queueEnterTime[process.name] >= agingThreshold
        ) {
          levelQueues[level - 1].push(process);
          queueEnterTime[process.name] = currentTime; // รีเซ็ตเวลารอ
          lastQueueLevel[process.name] = level - 1;
          return false;
        }
        return true;
      });
    }

    // ตรวจสอบว่ามีคิวใดที่มี process พร้อมทำงาน
    let found = false;
    for (let level = 0; level < levelQueues.length && !found; level++) {
      if (levelQueues[level].length > 0) {
        let process = levelQueues[level].shift();
        let { name, burstTime } = process;
        let timeToRun = Math.min(remainingTime[name], timeQuantums[level]);

        if (lastExecutedProcess !== null && lastExecutedProcess !== name) {
        }
        lastExecutedProcess = name;

        ganttChart.push({ pid: name, start: currentTime, duration: timeToRun });

        remainingTime[name] -= timeToRun;
        currentTime += timeToRun;

        if (remainingTime[name] === 0) {
          finishedTime[name] = currentTime;
        } else {
          if (level + 1 < levelQueues.length) {
            levelQueues[level + 1].push({
              name,
              arrivalTime: process.arrivalTime,
              burstTime: remainingTime[name],
            });
            lastQueueLevel[name] = level + 1;
            queueEnterTime[name] = currentTime;
          } else {
            levelQueues[level].push({
              name,
              arrivalTime: process.arrivalTime,
              burstTime: remainingTime[name],
            });
          }
        }

        found = true;
      }
    }

    if (!found) {
      if (processIndex < processData.length) {
        currentTime = Math.max(
          currentTime,
          processData[processIndex].arrivalTime
        );
      } else {
        break;
      }
    }
  }

  let newProcessData = processData.map((process) => {
    let { name, arrivalTime, burstTime } = process;
    if (finishedTime[name]) {
      return [name, arrivalTime, burstTime, finishedTime[name]];
    }
    return [name, arrivalTime, burstTime, null];
  });

  let waitingTimes = [];
  let turnaroundTimes = [];

  newProcessData.forEach((process) => {
    let name = process[0];
    let arrivalTime = process[1];
    let burstTime = process[2];
    let completionTime = process[3];

    if (completionTime !== null) {
      let turnaroundTime = completionTime - arrivalTime;
      let waitingTime = turnaroundTime - burstTime;

      waitingTimes.push(waitingTime);
      turnaroundTimes.push(turnaroundTime);
    }
  });

  return [waitingTimes, turnaroundTimes, ganttChart];
}
