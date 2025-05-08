const topics = [
  {
    id: 1,
    color: "#E2B03A",
    title: "Introduction to Operating Systems",
    description: "An Operating System (OS) is a software that acts as an intermediary between users and computer hardware. It manages hardware resources and provides services for application programs.",
    content: `
Computer System Structure:
  Consists of hardware, operating system, application programs, and users.
Goals of an Operating System:
  1. Ease of use
  2. Efficiency
  3. Resource sharing
        
Types of Operating Systems:
  Batch Systems
  TimeSharing Systems
  Distributed Systems
  RealTime Systems
        
OS Components:
  Process Management
  Memory Management
  Storage Management
  I/O System Management
  Protection and Security
        
Operating System Services:
  Include program execution, I/O operations, file system manipulation, communication, and error detection.
        
System Calls:
  Interface between user programs and the OS to request services.
        
OS Structure:
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
Process
  A process is a program in execution. It includes the program code, current activity, stack, heap, and data section.
      
Process State
  New
  Ready
  Running
  Waiting
  Terminated
      
Process Control Block (PCB)
  Contains information about the process such as process state, program counter, CPU registers, memory limits, and more.
      
Context Switching
  The act of saving the state of one process and loading the state of another. It enables multitasking but incurs overhead.
      
Threads
  Threads are lightweight subprocesses. They share code, data, and OS resources but have their own execution context.
      
Multithreading
  Increases responsiveness
  Efficient resource sharing
  Improves performance on multicore systems
      
User vs. Kernel Threads:
  User Threads: Managed by userlevel libraries.
  Kernel Threads: Managed by the operating system.
      
Benefits of Threads:
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
CPU Scheduler
Picks a process from the ready queue for execution.
Triggered when a process:
    • Switches from running to waiting.
    • Switches from running to ready.
    • Switches from waiting to ready.
    • Terminates.
      
Preemptive vs NonPreemptive Scheduling
Preemptive: Allows interruption of the current process.
NonPreemptive: Runs to completion or blocking.
      
Dispatcher
Manages context switching and starts the selected process.
Dispatch latency: Time taken for this switch.
      
Scheduling Criteria
CPU Utilization: Keep the CPU busy.
Throughput: Processes completed per time unit.
Turnaround Time: From submission to completion.
Waiting Time: Time spent in ready queue.
Response Time: Time from request to first response.
      
Scheduling Algorithms
FCFS (FirstCome, FirstServed): Simple, but may cause long waits.
SJF (Shortest Job First): Optimal average wait time; can be preemptive.
Priority Scheduling: Based on priority, may starve lowpriority processes (use aging).
Round Robin: Timesharing with fixed time quantum.
Multilevel Queue: Separate queues for types; no movement.
Multilevel Feedback Queue: Processes can move between queues; adaptive.
      
Thread Scheduling:
PCS (Process Contention Scope): Userlevel threads compete.
SCS (System Contention Scope): Kernellevel threads compete.
      
Multiprocessor Scheduling:
Load balancing between CPUs.
Asymmetric: One processor decides.
Symmetric: Each processor schedules itself.
      
RealTime Scheduling:
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
Concurrency
Concurrent processes may share resources, leading to complex interactions and potential data inconsistency.
      
Race Condition
Occurs when multiple processes access shared data and the final result depends on the execution order.
      
Critical Section & Mutual Exclusion
Critical section is where shared resources are accessed.
Only one process should be in its critical section at a time.
      
Synchronization Methods
Hardware: Disable Interrupts, TestandSet, CompareandSwap
Software: Semaphores (wait/signal), Monitors
      
Classic Problems
ProducerConsumer
ReadersWriters
Dining Philosophers
      
Deadlock
A state where processes wait indefinitely for resources held by each other.
      
Deadlock Handling
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
      🔹 Key Responsibilities of Memory Management:
       Allocating memory when processes are created and deallocating it after use
       Keeping track of used and free memory using data structures like memory maps and free lists
       Protecting memory access to prevent unauthorized access between processes
       Managing swapping between RAM and disk to optimize memory usage
       Minimizing fragmentation to maximize memory efficiency
      
      🔹 Dynamic Linking:
       Loads library modules (e.g., DLLs on Windows, .so on Linux) at runtime instead of compiletime
       Saves memory and allows easier updates
      
      🔹 Memory Partitioning:
       Fixed Partitioning: Predefined memory blocks; simple but causes internal fragmentation
       Dynamic Partitioning: Allocates based on process size; avoids internal fragmentation but causes external fragmentation, which may require compaction
      
      🔹 Memory Allocation Algorithms:
       Firstfit: Allocates the first suitable block
       Bestfit: Finds the smallest adequate block to reduce leftover memory
       Worstfit: Allocates from the largest block to leave bigger free blocks
       Nextfit: Continues search from the last allocated block
       Buddy System: Splits memory into poweroftwo sizes and merges them when free (used in Linux and Oracle DBMS)
      
      🔹 Address Relocation and MMU (Memory Management Unit):
       Translates logical (virtual) addresses to physical addresses
       Uses base and limit registers for simple protection
       MMU can support more advanced schemes like paging and segmentation
      
      🔹 Segmentation:
       Divides logical memory by program structure: code, stack, data, etc.
       Logical address = <segment number, offset>
       Uses a segment table containing base and limit for each segment
       Allows better mapping to human/programmer concepts
      
      🔹 Paging:
       Divides both physical and logical memory into equalsized blocks (frames/pages)
       Logical address = <page number, offset>
       Eliminates external fragmentation but may cause internal fragmentation
       Uses page tables to map pages to frames
       May involve TLB (Translation Lookaside Buffer) for faster lookup
      
      🔹 Page Table Structures:
       Hierarchical: Multilevel tables to manage large address spaces efficiently
       Hashed: Uses hashing for quicker page lookups
       Inverted: Single global table indexed by frame number (spaceefficient)
      
      🔹 Paged Segmentation:
       Combines benefits of both paging and segmentation
       Each segment is divided into pages: <segment ID, page number, offset>
       Used in systems like Intel IA32
      
      🔹 RealWorld Architectures:
       Intel x86 (IA32): Uses both segmentation and paging, supports 4 KB and 4 MB pages
       ARM (e.g., ARMv8A): Supports multilevel paging (up to 4 levels) with TLBs for both code and data
       Linux: Uses 4level paging for 64bit systems
      
      `
  }
  ,
  {
    id: 6,
    color: "#E85463",
    title: "Virtual Memory",
    description: "Virtual memory allows execution of processes not completely in main memory.",
    content: `
Definition:
  Virtual memory is a memory management technique that provides an “illusion” of a very large main memory, enabling execution of large programs by loading only required parts into physical memory.

Demand Paging:
  Only loads pages into memory when needed.
  Uses a page table to keep track of mappings.
  Page fault occurs when a page is not in memory.

Page Replacement:
  When memory is full, old pages are replaced using algorithms:
    FIFO (FirstInFirstOut)
    Optimal
    LRU (Least Recently Used)
    Clock

Page Fault Rate:
  Affects system performance.
  Lower page fault rate = better performance.

Thrashing:
  Occurs when system spends more time paging than executing.
  Caused by insufficient memory and high degree of multiprogramming.

Frame Allocation:
  Fixed or variable allocation strategies.
  Global vs Local replacement policies.

Working Set Model:
  Tracks the active set of pages in use.
  Helps reduce thrashing by allocating adequate frames.

Advanced Topics:
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
    description:"An overview of core security principles, threats, and defenses, including encryption, authentication, network and organizational protection, and best practices for building a secure computing environment.",
    content: `
Security Principles
  Security aims to protect data, systems, and networks from unauthorized access, disruption, or destruction.
The core CIA Triad includes:
  Confidentiality: Ensuring data is accessible only to authorized parties.
  Integrity: Guaranteeing data is accurate and unaltered.
  Availability: Making sure systems and data are accessible when needed.

Types of Threats and Attacks
  Malware: Malicious software such as viruses, worms, trojans, and ransomware that disrupt or damage systems.
  Phishing: Social engineering attack that tricks users into revealing sensitive information via fake emails or websites.
  Denial of Service (DoS): Overloading a system or network to make it unavailable to legitimate users.
  ManintheMiddle (MitM): Intercepts communication between two systems.
  SQL Injection & XSS: Exploiting vulnerabilities in web applications to gain unauthorized access or manipulate data.

Security Controls
  Preventive: Measures to stop attacks before they occur (e.g., firewalls, antivirus, encryption).
  Detective: Identify security incidents as they happen (e.g., intrusion detection systems, monitoring).
  Corrective: Mitigate damage and restore systems after an attack (e.g., backup and recovery plans).

Encryption and Cryptography
  Symmetric Encryption: Uses the same key to encrypt and decrypt data. Fast, but key distribution is challenging (e.g., AES).
  Asymmetric Encryption: Uses a public/private key pair. More secure for communication (e.g., RSA, ECC).
  Hashing: Converts data into a fixedlength value. Common in storing passwords and verifying data integrity (e.g., SHA256).
  Applications include HTTPS, VPN, secure email, and digital signatures.

Authentication and Authorization
  Authentication: Verifies user identity (passwords, biometrics, smart cards).
  Authorization: Grants access rights to resources based on identity and role.
  Use MultiFactor Authentication (MFA) for stronger security (e.g., something you know, have, and are).

Network Security
  Use firewalls to control traffic, VPNs to encrypt communications, and IDS/IPS to monitor or block attacks.
  Segmentation of networks (e.g., DMZ, internal LAN) helps contain breaches and limit lateral movement.

Organizational Security
  Implement security policies, access control guidelines, and employee training.
  Create incident response plans to react swiftly to breaches.
  Conduct risk assessments and audits regularly to maintain compliance and resilience.

Secure Software Development
  Integrate security from the early stages of the Software Development Life Cycle (SDLC).
  Use input validation, secure coding practices, and code reviews.
  Follow guidelines from OWASP Top 10 to avoid common web app vulnerabilities.

Physical Security
  Protect physical assets like servers and data centers.
  Use locks, badges, CCTV, and environmental controls (e.g., fire suppression systems).

Security is not a onetime setup but a continuous process involving technology, people, and policies. A holistic approach combining preventive, detective, and corrective strategies is essential for a resilient and secure environment.
    `
  },

];
export default topics;
// {
//   id: 4,
//   title: "Concurrency Control",
//   description: "Explores synchronization, race conditions, mutual exclusion, classic problems, and deadlock management in concurrent processing environments.",
//   content: `
// 🔹 What is Concurrency?
//  Concurrency occurs when multiple processes execute simultaneously and potentially share resources.
//  This leads to complex interactions and potential issues like race conditions and data inconsistency.

// 🔹 Race Conditions:
//  Occur when the final outcome of operations on shared data depends on the sequence of process execution.
//  Example: Concurrent increment and decrement of a shared counter without proper synchronization can lead to wrong results.

// 🔹 Critical Section & Mutual Exclusion:
//  A critical section is a part of the program where shared resources are accessed.
//  Only one process should be allowed in its critical section at a time to avoid conflicts.
//  Three key requirements:
//   1. Mutual Exclusion – Only one process at a time in the critical section.
//   2. Progress – If no process is in the critical section, the next one shouldn’t wait indefinitely.
//   3. Bounded Waiting – There should be a limit on how long a process waits to enter.

// 🔹 Synchronization Techniques:
//  Hardwarebased:
//    Disable Interrupts (not suitable for multiprocessors)
//    TestandSet, CompareandSwap (CAS): Atomic operations for locking
//  Softwarebased:
//    Peterson’s Algorithm: Works for two processes
//    Lamport’s Bakery Algorithm: Works for multiple processes
//    Semaphores: `wait()` and `signal()` functions to control access (binary or counting)
//    Monitors: Highlevel abstraction used in languages like Java with `synchronized` keyword

// 🔹 Classic Synchronization Problems:
// 1. ProducerConsumer (Bounded Buffer): Ensures producer doesn't overwrite and consumer doesn’t read empty buffer.
// 2. ReadersWriters Problem: Multiple readers can read, but writers need exclusive access.
// 3. Dining Philosophers Problem: Ensures deadlockfree resource allocation (forks).
// 4. Sleeping Barber Problem: Synchronizes barbers and customers in a waiting room.

// 🔹 Deadlock:
//  A situation where a set of processes are waiting indefinitely for resources held by each other.

// 🔹 Conditions for Deadlock:
// 1. Mutual Exclusion
// 2. Hold and Wait
// 3. No Preemption
// 4. Circular Wait

// 🔹 Deadlock Handling Techniques:
// 1. Prevention – Break one of the four necessary conditions.
// 2. Avoidance – Use algorithms like Banker’s Algorithm to stay in a "safe state".
// 3. Detection and Recovery – Detect cycles in waitfor graphs and take action (e.g., abort, rollback).
// 4. Ignore – The "ostrich algorithm", used in many realworld systems.

// 🔹 Banker's Algorithm:
//  Determines if the system is in a safe state before granting a resource request.
//  Requires maximum resource need of each process to be known in advance.
//  Avoids deadlock but not commonly implemented in modern systems due to complexity.

// `
// }
