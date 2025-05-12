export default function Hrrn(input) {
  // ทำสำเนาของ input เพื่อไม่ให้เปลี่ยนแปลงข้อมูลต้นฉบับ
  const processes = input.map((p) => ({
    pid: p[0],
    arrivalTime: p[1],
    burstTime: p[2],
    completed: false,
  }));

  let waitingTimes = [];
  let turnaroundTimes = [];
  let executionOrder = [];

  // หาเวลาเริ่มต้นที่จะเริ่มทำงาน (เลือกเวลามาถึงที่เร็วที่สุด)
  let currentTime = Math.min(...processes.map((p) => p.arrivalTime));
  let contextSwitches = 0;

  // ทำงานไปเรื่อยๆ จนกว่าจะทำงานครบทุกกระบวนการ
  while (processes.some((p) => !p.completed)) {
    // หากระบวนการที่มาถึงแล้วและยังไม่เสร็จสิ้น
    let availableProcesses = processes.filter(
      (p) => p.arrivalTime <= currentTime && !p.completed
    );

    // ถ้าไม่มีกระบวนการใดพร้อมทำงาน ให้เลื่อนเวลาไปยังเวลามาถึงของกระบวนการถัดไป
    if (availableProcesses.length === 0) {
      const nextArrival = processes
        .filter((p) => !p.completed && p.arrivalTime > currentTime)
        .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);

      currentTime = nextArrival;
      continue;
    }

    // คำนวณค่า Response Ratio สำหรับทุกกระบวนการที่พร้อมทำงาน
    let hrrnValues = availableProcesses.map((p) => {
      // สูตร Response Ratio = (Waiting Time + Burst Time) / Burst Time
      const waitingTime = currentTime - p.arrivalTime;
      const responseRatio = (waitingTime + p.burstTime) / p.burstTime;
      return { responseRatio, process: p };
    });

    // เลือกกระบวนการที่มีค่า Response Ratio สูงที่สุด
    let selectedProcess = hrrnValues.reduce(
      (max, p) => (p.responseRatio > max.responseRatio ? p : max),
      hrrnValues[0]
    ).process;

    // เพิ่ม context switch ถ้าไม่ใช่กระบวนการแรก
    if (executionOrder.length > 0) {
      contextSwitches++;
    }

    // บันทึกลำดับการทำงาน
    executionOrder.push({
      pid: selectedProcess.pid,
      start: currentTime,
      duration: selectedProcess.burstTime,
    });

    // อัปเดตเวลาปัจจุบัน
    currentTime += selectedProcess.burstTime;

    // คำนวณเวลารอและเวลาตอบสนองรวม
    const waitingTime =
      currentTime - selectedProcess.arrivalTime - selectedProcess.burstTime;
    const turnaroundTime = currentTime - selectedProcess.arrivalTime;

    // เก็บข้อมูลเวลา
    waitingTimes.push(waitingTime);
    turnaroundTimes.push(turnaroundTime);

    // ทำเครื่องหมายว่ากระบวนการนี้เสร็จสิ้นแล้ว
    const index = processes.findIndex((p) => p.pid === selectedProcess.pid);
    processes[index].completed = true;
    processes[index].waitingTime = waitingTime;
    processes[index].turnaroundTime = turnaroundTime;
  }

  return [waitingTimes, turnaroundTimes, executionOrder];

}
