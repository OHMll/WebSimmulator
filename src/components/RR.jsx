export default function RR(input, timeQuantum = 3) {
  // คัดลอกข้อมูลจาก input เพื่อลดการแก้ไขข้อมูลต้นฉบับ
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

  // เริ่มจากเวลาที่มีการมาถึงเร็วที่สุด
  let time = Math.min(...processes.map((p) => p.arrival));

  // สร้างอาเรย์เพื่อติดตามกระบวนการที่ถูกเพิ่มลงใน ready queue
  let inQueue = new Array(n).fill(false);
  let readyQueue = [];
  let completed = 0;

  // ทำต่อไปจนกว่ากระบวนการทั้งหมดจะเสร็จ
  while (completed < n) {
    // เพิ่มกระบวนการที่มาถึงใหม่ลงใน ready queue
    for (let i = 0; i < n; i++) {
      if (
        processes[i].arrival <= time &&
        processes[i].remainingTime > 0 &&
        !inQueue[i]
      ) {
        readyQueue.push(i);
        inQueue[i] = true;
      }
    }

    // ถ้า ready queue ว่าง ให้ขยับเวลาไปยังเวลาที่มาถึงถัดไป
    if (readyQueue.length === 0) {
      // ค้นหากระบวนการถัดไปที่จะมาถึง
      let nextArrival = Infinity;
      for (let i = 0; i < n; i++) {
        if (processes[i].remainingTime > 0 && processes[i].arrival > time) {
          nextArrival = Math.min(nextArrival, processes[i].arrival);
        }
      }

      if (nextArrival === Infinity) break; // ไม่มีกระบวนการให้ทำต่อ
      time = nextArrival;
      continue;
    }

    // ดึงกระบวนการถัดไปจาก ready queue
    let currentProcessIdx = readyQueue.shift();
    let currentProcess = processes[currentProcessIdx];

    // กำหนดเวลาการทำงานใน quantum นี้
    let executeTime = Math.min(timeQuantum, currentProcess.remainingTime);

    // เพิ่มลงใน Gantt chart
    ganttChart.push({
      pid: currentProcess.pid,
      start: time,
      end: time + executeTime,
    });

    // ปรับเวลาและเวลาที่เหลือของกระบวนการ
    time += executeTime;
    currentProcess.remainingTime -= executeTime;

    // ตรวจสอบว่ากระบวนการเสร็จแล้วหรือยัง
    if (currentProcess.remainingTime === 0) {
      // กระบวนการเสร็จแล้ว
      completed++;
      completionTime[currentProcessIdx] = time;
      turnaroundTime[currentProcessIdx] =
        completionTime[currentProcessIdx] - currentProcess.arrival;
      waitingTime[currentProcessIdx] =
        turnaroundTime[currentProcessIdx] - currentProcess.burst;
      inQueue[currentProcessIdx] = false; // ทำเครื่องหมายว่าไม่อยู่ใน queue
    } else {
      // กระบวนการยังมีเวลาเหลือ ตรวจสอบกระบวนการที่มาถึงใหม่
      for (let i = 0; i < n; i++) {
        if (
          processes[i].arrival <= time &&
          processes[i].remainingTime > 0 &&
          !inQueue[i]
        ) {
          readyQueue.push(i);
          inQueue[i] = true;
        }
      }

      // เพิ่มกระบวนการปัจจุบันกลับไปที่ ready queue
      readyQueue.push(currentProcessIdx);
      // inQueue[currentProcessIdx] ยังคงเป็น true เพราะกระบวนการกลับเข้า queue
    }
  }

  // จัดรูปแบบข้อมูลสำหรับส่งกลับ
  let context = ganttChart.map((entry) => {
    let duration = entry.end - entry.start;
    return {
      pid: entry.pid,
      start: entry.start,
      duration,
    };
  });

  return [waitingTime, turnaroundTime, context];
}
