export default function RR(input, timeQuantum = 3) {
    let processes = input.map(([pid, arrival, burst]) => ({
      pid,
      arrival,
      burst,
      remainingTime: burst,
    }));
  
    let n = processes.length;
    let waitingTime = new Array(n).fill(0);
    let turnaroundTime = new Array(n).fill(0);
    let completionTime = new Array(n).fill(0);
    let ganttChart = [];
  
    let time = Math.min(...processes.map((p) => p.arrival));
    let readyQueue = [];
  
    while (true) {
      // เพิ่ม process ที่มาถึงแล้วเข้า ready queue
      processes.forEach((process, i) => {
        if (
          process.arrival <= time &&
          process.remainingTime > 0 &&
          !readyQueue.includes(i)
        ) {
          readyQueue.push(i);
        }
      });
  
      if (readyQueue.length === 0) {
        // ถ้าไม่มี process ในคิว ให้ข้ามไปยังเวลาที่ process ถัดไปมาถึง
        let nextArrival = Math.min(
          ...processes.filter((p) => p.remainingTime > 0).map((p) => p.arrival),
          time
        );
        time = Math.max(time, nextArrival);
        if (nextArrival === time) break; // ทุก process เสร็จหมดแล้ว
        continue;
      }
  
      // ดึง process ออกจากคิว
      let currentProcessIdx = readyQueue.shift();
      let currentProcess = processes[currentProcessIdx];
  
      // กำหนดเวลาที่จะ execute
      let executeTime = Math.min(timeQuantum, currentProcess.remainingTime);
      ganttChart.push({
        pid: currentProcess.pid,
        start: time,
        end: time + executeTime,
      });
  
      // อัปเดตค่าเวลาที่เหลือ
      currentProcess.remainingTime -= executeTime;
      time += executeTime;
  
      // ถ้า process ยังไม่เสร็จ ใส่กลับเข้า ready queue
      if (currentProcess.remainingTime > 0) {
        readyQueue.push(currentProcessIdx);
      } else {
        // คำนวณ Completion Time, Turnaround Time และ Waiting Time
        completionTime[currentProcessIdx] = time;
        turnaroundTime[currentProcessIdx] =
          completionTime[currentProcessIdx] - currentProcess.arrival;
        waitingTime[currentProcessIdx] =
          turnaroundTime[currentProcessIdx] - currentProcess.burst;
      }
    }
  
    let context = ganttChart.map((entry, i) => {
      let duration =
        i === ganttChart.length - 1
          ? entry.end - entry.start
          : ganttChart[i + 1].start - entry.start;
      return { pid: entry.pid, start: entry.start, duration };
    });
  
    return [ waitingTime, turnaroundTime, context ];
  }