const topics = [
  {
    id: 1,
    color: "#E2B03A",
    title: "Introduction to Operating Systems",
    description: "An Operating System (OS) is a software that acts as an intermediary between users and computer hardware. It manages hardware resources and provides services for application programs.",
    content: `
              **Computer System Structure
  Consists of hardware, operating system, application programs, and users.

  **GOALS OF AN OPERATING SYSTEM
  1. Ease of use
  2. Efficiency
  3. Resource sharing  

  **TYPES OF OPERATING SYSTEMS
  Batch Systems
  TimeSharing Systems
  Distributed Systems
  RealTime Systems   
  **OS Components
  Process Management
  Memory Management
  Storage Management
  I/O System Management
  Protection and Security
        
 **Operating System Services
  Include program execution, I/O operations, file system manipulation, communication,and error detection.
        
**System Calls
  Interface between user programs and the OS to request services.
        
**OS Structure
  Includes monolithic, layered, microkernel, modular designs, and virtual machines.
        
Operating Systems play a crucial role in controlling all activities and resources in a computer system.
        `

  },
  {
    id: 2,
    color: "#55A972",
    title: "Processes and Threads",
    description: "Covers the concepts of processes, threads, and how they are managed.",
    content: `
**Process
  A process is a program in execution. It includes the program code, current activity, stack, heap, and data section.     
**Process State
  New
  Ready
  Running
  Waiting
  Terminated     
**Process Control Block (PCB)
  Contains information about the process such as process state, program counter, CPU registers, memory limits, and more.   
**Context Switching
  The act of saving the state of one process and loading the state of another. It enables multitasking but incurs overhead.     
**Threads
  Threads are lightweight subprocesses. They share code, data, and OS resources but have their own execution context.      
**Multithreading
  Increases responsiveness
  Efficient resource sharing
  Improves performance on multicore systems      
**User vs. Kernel Threads
  User Threads: Managed by userlevel libraries.
  Kernel Threads: Managed by the operating system.      
**Benefits of Threads
  Faster context switch
  Lower overhead compared to full processes
  Easier interthread communication
        `
  }
  ,
  {
    id: 3,
    color: "#D97B41",
    title: "Process Scheduling",
    description: "Covers CPU scheduling algorithms and criteria to optimize process execution.",
    content: `
**CPU Scheduler
  Picks a process from the ready queue for execution.
**Triggered when a process
  Switches from running to waiting.
  Switches from running to ready.
  Switches from waiting to ready.
  Terminates.     
**Preemptive vs NonPreemptive Scheduling
  Preemptive: Allows interruption of the current process.
  NonPreemptive: Runs to completion or blocking.     
**Dispatcher
  Manages context switching and starts the selected process.
  Dispatch latency: Time taken for this switch.      
**Scheduling Criteria
  CPU Utilization: Keep the CPU busy.
  Throughput: Processes completed per time unit.
  Turnaround Time: From submission to completion.
  Time: Time spent in ready queue.
  Response Time: Time from request to first response.      
**Scheduling Algorithms
  FCFS (FirstCome, FirstServed): Simple, but may cause long waits.
  SJF (Shortest Job First): Optimal average wait time; can be preemptive.
  Priority Scheduling: Based on priority, may starve lowpriority processes (use aging).
  Round Robin: Timesharing with fixed time quantum.
  Multilevel Queue: Separate queues for types; no movement.
  Multilevel Feedback Queue: Processes can move between queues; adaptive.      
**Thread Scheduling
  PCS (Process Contention Scope): Userlevel threads compete.
  SCS (System Contention Scope): Kernellevel threads compete.     
**Multiprocessor Scheduling
  Load balancing between CPUs.
  Asymmetric: One processor decides.
  Symmetric: Each processor schedules itself.      
**RealTime Scheduling
  Hard realtime: Must meet deadlines.
  Soft realtime: Tries to meet deadlines, not strict.
      `
  }

  ,
  {
    id: 4,
    color: "#5C78E6",
    title: "Concurrency Control",
    description: "Covers synchronization, race conditions, critical sections, and deadlock handling in multiprogramming environments.",
    content: `
**Concurrency
  Concurrent processes may share resources, leading to complex interactions and potential data inconsistency.
**Race Condition
  Occurs when multiple processes access shared data and the final result depends on the execution order.     
**Critical Section & Mutual Exclusion
  Critical section is where shared resources are accessed.
  Only one process should be in its critical section at a time.     
**Synchronization Methods
  Hardware: Disable Interrupts, TestandSet, CompareandSwap
  Software: Semaphores (wait/signal), Monitors  
**Classic Problems
  ProducerConsumer
  ReadersWriters
  Dining Philosophers     
**Deadlock
  A state where processes wait indefinitely for resources held by each other.     
**Deadlock Handling
  Prevention: Avoid one or more of the necessary conditions.
  Avoidance: Use algorithms like Banker's Algorithm to stay in safe state.
  Detection & Recovery: Detect cycles in waitfor graph and resolve by aborting or preempting processes.
      `
  }
  ,
  {
  id: 5,
  color: "#CE6FA8",
  title: "Memory Management",
  description: "Covers memory allocation, partitioning, address translation, segmentation, paging, and page table structures in operating systems.",
  content: `
**Responsibilities of Memory Management
  Allocates and deallocates memory to processes
  Tracks free and used space
  Protects process memory and manages swapping
  Minimizes fragmentation
**Memory Partitioning
  Fixed: Predefined blocks (simple but wasteful)
  Dynamic: Flexible sizing, but may cause external fragmentation
**Allocation Algorithms
  First-fit, Best-fit, Worst-fit, Next-fit
  Buddy system: Power-of-two blocks, supports merging (e.g., Linux)
**MMU & Address Translation
  Translates logical to physical addresses
  Supports base/limit registers, paging, segmentation
**Segmentation
  Divides memory into logical parts (code, stack, data)
  Each segment uses base + limit
  Address format: <segment #, offset>
**Paging
  Divides memory into fixed-size pages/frames
  Eliminates external fragmentation
  Uses page tables (with optional TLB)
**Page Table Structures
  Hierarchical: multi-level for large space
  Hashed: fast lookup
  Inverted: saves space using one table
**Paged Segmentation
  Combines both: segments split into pages
  Example: Intel IA-32
**Real-World Architectures
  Intel IA-32: segmentation + paging (4KB/4MB)
  ARMv8: multilevel paging
  Linux: 4-level paging for 64-bit systems
  `
}

  ,
  {
    id: 6,
    color: "#E85463",
    title: "Virtual Memory",
    description: "Virtual memory allows execution of processes not completely in main memory.",
    content: `
**Definition
  Virtual memory is a memory management technique that provides an “illusion” of a very large main memory, enabling execution of large programs by loading only required parts into physical memory.
**Demand Paging
  Only loads pages into memory when needed.
  Uses a page table to keep track of mappings.
  Page fault occurs when a page is not in memory.
**Page Replacement
  When memory is full, old pages are replaced using algorithms:
    FIFO (FirstInFirstOut)
    Optimal
    LRU (Least Recently Used)
    Clock
**Page Fault Rate
  Affects system performance.
  Lower page fault rate = better performance.
**Thrashing
  Occurs when system spends more time paging than executing.
  Caused by insufficient memory and high degree of multiprogramming.
**Frame Allocation
  Fixed or variable allocation strategies.
  Global vs Local replacement policies.
**Working Set Model
  Tracks the active set of pages in use.
  Helps reduce thrashing by allocating adequate frames.
**Advanced Topics
  Prepaging: preloading pages to reduce faults.
  Page Size: affects fragmentation and table size.
  Shared Pages: allows code sharing between processes (e.g., text editor).

Virtual memory improves resource utilization, process isolation, and execution efficiency.
`

  },
 {
  id: 7,
  color: "#8D6EEC",
  title: "Security Foundation",
  description: "An overview of core security principles, threats, and defenses, including encryption, authentication, network and organizational protection, and best practices for building a secure computing environment.",
  content: `
**Security Principles
  Protects data and systems through the CIA Triad:
    Confidentiality: Keep data private.
    Integrity: Ensure data is accurate.
     Availability: Keep systems accessible.
**Threats and Attacks
  Includes malware, phishing, DoS, MitM, and web-based attacks like SQL injection and XSS.
**Security Controls
  Preventive: e.g., firewalls, encryption
  Detective: e.g., IDS, monitoring
  Corrective: e.g., backups, recovery
**Encryption
  Symmetric: Same key (fast)
  Asymmetric: Public/private key (secure)
  Hashing: Ensures data integrity
**Authentication & Authorization
  Authentication: Identity check
  Authorization: Access control
  MFA enhances protection
**Network Security
  Firewalls, VPNs, IDS/IPS, and segmentation prevent intrusion and contain breaches.
**Organizational Security
  Policies, training, response plans, and audits help build security culture.
**Secure Software Development
  Apply secure coding, validation, and OWASP practices from early SDLC stages.
**Physical Security
  Protect hardware with locks, surveillance, and environmental controls.

Security is a continuous process that combines people, technology, and policy for long-term protection.
  `
},
  {
  id: 8,
  title: "I/O Systems",
  color: "#6BA33D",
  description: "Covers hardware, DMA, kernel I/O subsystems, and performance optimizations.",
  content: `
**I/O Hardware
  Devices include storage, communication, and input devices
  Interfaces include PCIe, SATA, Fibre Channel
  Device controllers use data, status, and control registers
**Polling vs Interrupts
  Polling: CPU waits for device readiness
  Interrupts: Device notifies CPU when ready — more efficient
**Direct Memory Access (DMA)
  Transfers data between device and memory without CPU
  Improves performance, especially for large data
**Application I/O Interface
  System calls abstract device behavior
  Differs by access (sequential/random), mode (sync/async), and type
**Device Types
  Block: Disks
  Character: Keyboard
  Network: via sockets
**Nonblocking & Asynchronous I/O
  Blocking: Waits for operation to complete
  Nonblocking: Returns immediately
  Asynchronous: Process continues, notified when done
**Vectored I/O
  Reads or writes multiple buffers in one system call
  Improves performance and reduces overhead
**Kernel I/O Subsystem
  Manages scheduling, buffering, caching, spooling
  Handles device reservation and error detection
**I/O Protection & System Calls
  All I/O must use privileged system calls for safety
**Kernel Data Structures
  Tracks open files, buffers, devices, and system messages
**Power Management
  Controls device power states using ACPI or platform-specific methods
**Transforming I/O Requests
  Steps: locate device → resolve name → buffer → deliver to process
**Streams
  Provides full-duplex user-device communication
  Uses queue-based modular message passing
**Performance Considerations
  Reduce context switches and interrupts
  Use DMA and efficient drivers for better throughput
`
}
,
];
export default topics;