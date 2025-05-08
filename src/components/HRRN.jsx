export default function Hrrn(input) {
    input = input.map(p => p.slice(0, -1));
    let processes = input.map(p => [p[0], p[1], p[2]]);
  
    let waitingTimes = [];
    let turnaroundTimes = [];
    let executionOrder = [];
    let currentTime = processes[0][1];
  
    while (true) {
        let availableProcesses = processes.filter(p => p[1] <= currentTime && p.length < 4);
        
        if (availableProcesses.length === 0) {
            if (currentTime - processes[0][1] > 100) break;
            currentTime++;
            continue;
        }
        
        let hrrnValues = availableProcesses.map(p => {
            let responseRatio = (p[2] + (currentTime - p[1])) / p[2];
            return { responseRatio, process: p };
        });
        
        let nextProcess = hrrnValues.reduce((max, p) => p.responseRatio > max.responseRatio ? p : max, hrrnValues[0]).process;
        
        executionOrder.push({ pid: nextProcess[0], start: currentTime, duration: nextProcess[2] });
        
        currentTime += nextProcess[2];
        let waitingTime = currentTime - nextProcess[1] - nextProcess[2];
        let turnaroundTime = currentTime - nextProcess[1];
        
        waitingTimes.push(waitingTime);
        turnaroundTimes.push(turnaroundTime);
        
        let index = processes.findIndex(p => p[0] === nextProcess[0]);
        processes[index] = [...nextProcess, waitingTime, turnaroundTime];
        
        if (processes.every(p => p.length === 4)) break;
    }
    
    return [ waitingTimes, turnaroundTimes, executionOrder ];
  }