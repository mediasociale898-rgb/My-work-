import {
  DailyTask,
  DayPlan,
  NoteItem,
  QuizItem,
  ProjectItem,
  FileFolderItem,
  CodeProject,
  FocusSession,
  AppShortcut,
  IdeaItem,
  AppSettings,
} from '../types';

export const initialTasks: DailyTask[] = [
  {
    id: 'task-1',
    title: 'Finalize inverse kinematics solver for 4-DOF robotic manipulator',
    isMainTask: true,
    prioritySlot: 1,
    completed: false,
    channel: 'Robotics',
    estimatedMinutes: 60,
    actualMinutes: 45,
    notes: 'Implement closed-form geometric solution with singularity damping.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Review 4-layer impedance control routing on motor driver PCB',
    isMainTask: true,
    prioritySlot: 2,
    completed: true,
    channel: 'Electrical',
    estimatedMinutes: 45,
    actualMinutes: 40,
    notes: 'Verify 90-ohm differential USB trace spacing and return path ground vias.',
    createdAt: new Date().toISOString(),
    completedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Synthesize state-space lecture notes into recall flashcard deck',
    isMainTask: true,
    prioritySlot: 3,
    completed: false,
    channel: 'Mathematics',
    estimatedMinutes: 30,
    actualMinutes: 0,
    notes: 'Controllability Grammian and Cayley-Hamilton theorem derivations.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Calibrate optical flow sensor on test bench',
    isMainTask: false,
    completed: true,
    channel: 'Robotics',
    estimatedMinutes: 20,
    actualMinutes: 18,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Export KiCad gerbers and drill files for fabrication',
    isMainTask: false,
    completed: false,
    channel: 'Electrical',
    estimatedMinutes: 15,
    createdAt: new Date().toISOString(),
  },
];

export const initialDayPlan: DayPlan = {
  date: new Date().toISOString().split('T')[0],
  channel: 'Robotics',
  focusGoalMinutes: 180,
  reflectionNotes: 'Single channel target: Autonomous robotic actuation and control stability.',
};

export const initialNotes: NoteItem[] = [
  {
    id: 'note-1',
    title: 'State-Space Modeling & Controllability',
    folder: 'Education/Mathematics',
    tags: ['control-systems', 'linear-algebra', 'robotics'],
    isPinned: true,
    content: `# State-Space Modeling in Continuous Time

**State-Space Representation**: A mathematical model of a physical system as a set of input, output and first-order differential equations.

**State Vector (x)**: The minimal vector of variables that completely describes the internal dynamic state of the physical system at time t.

**Controllability**: A system is controllable if an input u(t) can transfer any initial state to any arbitrary final state in finite time.

**Cayley-Hamilton Theorem**: States that every square matrix satisfies its own characteristic equation: det(λI - A) = 0.

**Kalman Controllability Matrix (C)**: Given by [B, AB, A^2B, ..., A^(n-1)B]. The system is fully controllable if and only if rank(C) equals n.

**Observability**: A dual property indicating whether internal system states can be reconstructed purely from measured outputs y(t).`,
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-04T14:30:00Z',
  },
  {
    id: 'note-2',
    title: 'High-Speed PCB Differential Pairs & Impedance',
    folder: 'NTFY/Electrical',
    tags: ['kicad', 'pcb', 'hardware', 'rf'],
    isPinned: true,
    content: `# High-Speed PCB Layout Principles

**Characteristic Impedance (Z0)**: The ratio of voltage to current of a wave traveling along the transmission line without reflections.

**Differential Signaling**: A method where two complementary signals are transmitted over coupled conductors to reject common-mode noise.

**Return Current Path**: High frequency signal returns follow the path of least inductance directly underneath the trace in the reference plane.

**Ground Plane Slotting**: A catastrophic design flaw where reference ground planes are split beneath high-speed signals, creating massive EMI radiation.

**Via Stub Resonance**: An unterminated via barrel acts as an open resonant stub attenuating high-frequency signal edges. Back-drilling removes stubs.`,
    createdAt: '2026-10-28T09:15:00Z',
    updatedAt: '2026-11-03T18:00:00Z',
  },
  {
    id: 'note-3',
    title: 'BLDC Motor Field-Oriented Control (FOC)',
    folder: 'NTFY/Robotics',
    tags: ['motors', 'foc', 'actuators'],
    isPinned: false,
    content: `# Field-Oriented Control (FOC) Architecture

**Park Transform**: Converts two-axis stationary orthogonal stator currents (α, β) into rotating reference frame currents (d, q).

**Clarke Transform**: Converts three-phase balanced stator currents (a, b, c) into two-phase orthogonal stationary coordinates (α, β).

**Quadrature Current (Iq)**: The current component that directly generates electromagnetic motor torque.

**Direct Current (Id)**: The current component that produces magnetic flux alignment; held at zero for maximum torque-per-ampere in surface-mount PMSMs.

**Space Vector Modulation (SVPWM)**: An advanced switching technique synthesizing voltage vectors by distributing inverter states with reduced harmonic distortion.`,
    createdAt: '2026-10-25T11:20:00Z',
    updatedAt: '2026-11-02T16:45:00Z',
  },
];

export const initialQuizzes: QuizItem[] = [
  {
    id: 'quiz-1',
    title: 'State-Space & Controllability Mastery',
    noteId: 'note-1',
    folder: 'Education/Mathematics',
    totalAttempts: 3,
    lastAttemptScore: 85,
    lastAttemptDate: '2026-11-03T16:20:00Z',
    weakQuestionIds: ['q-kalman-matrix'],
    questions: [
      {
        id: 'q-state-vector',
        type: 'multiple-choice',
        question: 'Which of the following best defines the "State Vector (x)"?',
        options: [
          'The minimal vector of variables that completely describes the internal dynamic state of the physical system at time t.',
          'An abstract protocol that handles peripheral bus synchronization.',
          'A redundant process in engineering that is deprecated in modern architectures.',
          'The algebraic determinant of the actuator transfer function.',
        ],
        correctAnswer: 'The minimal vector of variables that completely describes the internal dynamic state of the physical system at time t.',
        explanation: 'The state vector captures all information necessary to predict future states given future inputs.',
      },
      {
        id: 'q-kalman-matrix',
        type: 'multiple-choice',
        question: 'What mathematical condition is required for full system controllability?',
        options: [
          'Rank of Kalman Matrix [B, AB, ... A^(n-1)B] must equal n (full row rank).',
          'The determinant of matrix A must be equal to zero.',
          'All eigenvalues of A must lie strictly on the imaginary axis.',
          'The output matrix C must be an identity diagonal matrix.',
        ],
        correctAnswer: 'Rank of Kalman Matrix [B, AB, ... A^(n-1)B] must equal n (full row rank).',
        explanation: 'Kalman controllability rank condition requires rank(C) = n.',
      },
      {
        id: 'q-tf-cayley',
        type: 'true-false',
        question: 'True or False: The Cayley-Hamilton Theorem states that every square matrix satisfies its own characteristic equation.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'det(λI - A) = 0 evaluated at A yields the zero matrix.',
      },
      {
        id: 'q-fc-observability',
        type: 'flashcard',
        question: 'What is the definition and core principle of "Observability"?',
        correctAnswer: 'A dual property indicating whether internal system states can be reconstructed purely from measured outputs y(t).',
        explanation: 'Dual of controllability; requires rank of observability matrix to equal n.',
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'High-Speed PCB Differential Routing Quiz',
    noteId: 'note-2',
    folder: 'NTFY/Electrical',
    totalAttempts: 1,
    lastAttemptScore: 60,
    lastAttemptDate: '2026-11-02T11:00:00Z',
    weakQuestionIds: ['q-ground-slot'],
    questions: [
      {
        id: 'q-ground-slot',
        type: 'multiple-choice',
        question: 'What is the primary danger of routing high-speed traces over a split in the ground reference plane?',
        options: [
          'Massive increase in loop inductance and catastrophic EMI radiation due to disrupted return current path.',
          'Thermal runaway of the copper trace causing board delamination.',
          'Immediate short circuit between power and ground rails.',
          'Reduction in trace capacitance below dielectric breakdown limits.',
        ],
        correctAnswer: 'Massive increase in loop inductance and catastrophic EMI radiation due to disrupted return current path.',
        explanation: 'High-frequency signals return directly under the trace. A plane split forces current into large loops, creating a loop antenna.',
      },
      {
        id: 'q-tf-stub',
        type: 'true-false',
        question: 'True or False: Unterminated via stubs have no impact on high-speed gigabit signals.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Unterminated via stubs act as quarter-wave resonant notch filters attenuating high frequency components.',
      },
      {
        id: 'q-fc-diff',
        type: 'flashcard',
        question: 'What is the primary reason for using Differential Signaling in modern buses?',
        correctAnswer: 'Transmitting complementary signals rejects common-mode electromagnetic noise and minimizes ground bounce.',
        explanation: 'Common mode noise affects both conductors equally and cancels at receiver.',
      },
    ],
  },
];

export const initialProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'ExoArm-4D Manipulator',
    category: 'Robotics',
    status: 'BUILDING',
    description: 'High-torque carbon-fiber 4-DOF robotic arm utilizing brushless planetary actuators with CAN bus telemetry.',
    objective: 'Achieve sub-millimeter positional repeatability with 1.8kg payload capacity.',
    nextAction: 'Calibrate joint 2 harmonic drive backlash and test compliance loop.',
    coverImage: '/public/assets/aistudio/90HGl33SdzvpXaBT6-G26mwiTxh2Rw6N4JcRb1wzdyG8c0s9X7cpkiO3ikgpv8IteoSkRMyu1IbHmNXuTj7vCCjm6bsh4RBnBafyyUjrXaM4Qi8AWioCune_76e9d999.jpg',
    progressPercent: 68,
    progressHistory: [
      { day: 'Mon', progress: 42 },
      { day: 'Tue', progress: 48 },
      { day: 'Wed', progress: 54 },
      { day: 'Thu', progress: 58 },
      { day: 'Fri', progress: 61 },
      { day: 'Sat', progress: 65 },
      { day: 'Sun', progress: 68 },
    ],
    lastModified: '2026-11-05T04:20:00Z',
    attachedFiles: [
      {
        id: 'f-1',
        name: 'exoarm_end_effector.stl',
        type: 'stl',
        size: 1420000,
        lastModified: '2026-11-04T12:00:00Z',
      },
      {
        id: 'f-2',
        name: 'motor_driver_foc_v2.kicad_pcb',
        type: 'kicad_pcb',
        size: 385000,
        lastModified: '2026-11-03T19:30:00Z',
      },
      {
        id: 'f-3',
        name: 'kinematics_solver.py',
        type: 'code',
        size: 14200,
        lastModified: '2026-11-05T04:00:00Z',
      },
    ],
    notesHistory: [
      { date: '2026-11-04', text: 'Printed 3D PETG wrist bracket; verified fit on dual NEMA-17 actuators.' },
      { date: '2026-11-02', text: 'Completed FOC tuning: Phase currents steady at 3.2A continuous without thermal throttling.' },
    ],
  },
  {
    id: 'proj-2',
    name: 'PulseSensor RF Telemetry Board',
    category: 'PCB Design',
    status: 'TESTING',
    description: 'Ultra-low-power BLE sensor node with differential bio-potential frontend and coin-cell power management.',
    objective: 'Transmit 250Hz sampled biosignals at < 1.8mA average current draw.',
    nextAction: 'Execute sleep current measurement with Nordic Power Profiler Kit.',
    progressPercent: 82,
    progressHistory: [
      { day: 'Mon', progress: 50 },
      { day: 'Tue', progress: 58 },
      { day: 'Wed', progress: 67 },
      { day: 'Thu', progress: 74 },
      { day: 'Fri', progress: 78 },
      { day: 'Sat', progress: 80 },
      { day: 'Sun', progress: 82 },
    ],
    lastModified: '2026-11-03T14:10:00Z',
    attachedFiles: [
      {
        id: 'f-4',
        name: 'pulsesensor_rf.kicad_pcb',
        type: 'kicad_pcb',
        size: 290000,
        lastModified: '2026-11-02T10:00:00Z',
      },
      {
        id: 'f-5',
        name: 'enclosure_top.stl',
        type: 'stl',
        size: 890000,
        lastModified: '2026-10-30T17:00:00Z',
      },
    ],
    notesHistory: [
      { date: '2026-11-01', text: 'Initial board bringup passed. LDO voltage rails 3.3V and 1.8V stable.' },
    ],
  },
  {
    id: 'proj-3',
    name: 'Quantum Optics Simulation Engine',
    category: 'Software',
    status: 'PLANNING',
    description: 'Numerical split-step Fourier simulation for non-linear optical pulse propagation in photonic crystals.',
    objective: 'Benchmark soliton stability with GVD and SPM dispersion parameters.',
    nextAction: 'Draft GPU CUDA kernel specification for 2D matrix FFT batching.',
    progressPercent: 25,
    progressHistory: [
      { day: 'Mon', progress: 10 },
      { day: 'Tue', progress: 12 },
      { day: 'Wed', progress: 15 },
      { day: 'Thu', progress: 18 },
      { day: 'Fri', progress: 20 },
      { day: 'Sat', progress: 22 },
      { day: 'Sun', progress: 25 },
    ],
    lastModified: '2026-10-24T18:00:00Z',
    attachedFiles: [
      {
        id: 'f-6',
        name: 'split_step_benchmark.cpp',
        type: 'code',
        size: 32000,
        lastModified: '2026-10-24T17:00:00Z',
      },
    ],
    notesHistory: [
      { date: '2026-10-24', text: 'Mathematical derivation completed in notes. Discretized grid size: 2048 points.' },
    ],
  },
  {
    id: 'proj-4',
    name: 'Hexapod Autonomous Navigator',
    category: 'Robotics',
    status: 'IDEA',
    description: '18-servo biomimetic hexapod robot with stereo depth perception and terrain-adaptive inverse kinematics.',
    objective: 'Traverse rough rocky inclines without slipping using force feedback legs.',
    nextAction: 'Model 3-DOF coxa-femur-tibia leg assembly in FreeCAD.',
    progressPercent: 10,
    progressHistory: [
      { day: 'Mon', progress: 4 },
      { day: 'Tue', progress: 5 },
      { day: 'Wed', progress: 6 },
      { day: 'Thu', progress: 8 },
      { day: 'Fri', progress: 8 },
      { day: 'Sat', progress: 9 },
      { day: 'Sun', progress: 10 },
    ],
    lastModified: '2026-10-18T10:00:00Z',
    attachedFiles: [],
    notesHistory: [],
  },
];

export const initialFolders: FileFolderItem[] = [
  { id: 'fld-1', name: 'Mathematics', path: 'Education/Mathematics', size: 1250000, extension: 'dir', updatedAt: '2026-11-04', tags: ['education', 'math'] },
  { id: 'fld-2', name: 'Physics', path: 'Education/Physics', size: 840000, extension: 'dir', updatedAt: '2026-11-01', tags: ['education', 'physics'] },
  { id: 'fld-3', name: 'Programming', path: 'Education/Programming', size: 3400000, extension: 'dir', updatedAt: '2026-11-05', tags: ['education', 'code'] },
  { id: 'fld-4', name: 'Robotics', path: 'NTFY/Robotics', size: 8200000, extension: 'dir', updatedAt: '2026-11-05', tags: ['ntfy', 'robotics'] },
  { id: 'fld-5', name: 'Electrical', path: 'NTFY/Electrical', size: 6100000, extension: 'dir', updatedAt: '2026-11-04', tags: ['ntfy', 'pcb'] },
  { id: 'fld-6', name: 'Software', path: 'NTFY/Software', size: 4500000, extension: 'dir', updatedAt: '2026-11-02', tags: ['ntfy', 'software'] },
  { id: 'fld-7', name: 'Active', path: 'Projects/Active', size: 14000000, extension: 'dir', updatedAt: '2026-11-05', tags: ['projects'] },
  { id: 'fld-8', name: 'Unfinished', path: 'Projects/Unfinished', size: 9200000, extension: 'dir', updatedAt: '2026-11-03', tags: ['projects'] },
  { id: 'fld-9', name: 'Completed', path: 'Projects/Completed', size: 21000000, extension: 'dir', updatedAt: '2026-10-20', tags: ['projects'] },
  { id: 'fld-10', name: 'Research', path: 'Research', size: 5200000, extension: 'dir', updatedAt: '2026-11-02', tags: ['research'] },
  { id: 'fld-11', name: 'Ideas', path: 'Ideas', size: 310000, extension: 'dir', updatedAt: '2026-11-04', tags: ['ideas'] },
  { id: 'fld-12', name: 'Documents', path: 'Documents', size: 1800000, extension: 'dir', updatedAt: '2026-10-28', tags: ['docs'] },
  { id: 'fld-13', name: 'Media', path: 'Media', size: 42000000, extension: 'dir', updatedAt: '2026-11-01', tags: ['media'] },
  { id: 'fld-14', name: 'Archive', path: 'Archive', size: 58000000, extension: 'dir', updatedAt: '2026-09-15', tags: ['archive'] },
  // Sample stored files across folders
  { id: 'file-1', name: 'biped_foot_bracket.stl', path: 'Projects/Active', size: 1420000, extension: 'stl', updatedAt: '2026-11-04', tags: ['3d-cad', 'robotics'], content: 'BINARY_STL_DATA', fileCategory: '3d' },
  { id: 'file-2', name: 'motor_driver_foc.kicad_pcb', path: 'Projects/Active', size: 385000, extension: 'kicad_pcb', updatedAt: '2026-11-03', tags: ['kicad', 'pcb'], content: '(kicad_pcb (version 20240108) (generator kicad_pcb))', fileCategory: 'pcb' },
  { id: 'file-3', name: 'kinematics_quadcopter.cpp', path: 'Projects/Active', size: 24500, extension: 'cpp', updatedAt: '2026-11-06', tags: ['cpp', 'robotics'], content: '#include <iostream>\n#include <cmath>\n\nstruct Pose { double x, y, z, yaw; };\nint main() {\n    Pose target{1.5, 2.0, 3.2, 0.78};\n    std::cout << "Computed thrust vector: (" << target.x << ", " << target.y << ", " << target.z << ")\\n";\n    return 0;\n}', fileCategory: 'code' },
  { id: 'file-4', name: 'actuator_test_flight.mp4', path: 'Media', size: 14200000, extension: 'mp4', updatedAt: '2026-11-05', tags: ['video', 'test'], content: 'Actuator bench test video stream', fileCategory: 'video' },
  { id: 'file-5', name: 'circuit_microscope_capture.png', path: 'Media', size: 2400000, extension: 'png', updatedAt: '2026-11-04', tags: ['photo', 'inspection'], content: 'High magnification PCB inspection', mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', fileCategory: 'photo' },
  { id: 'file-6', name: 'Executive_Project_Summary.docx', path: 'Documents', size: 84000, extension: 'docx', updatedAt: '2026-11-05', tags: ['word', 'report'], content: 'EXECUTIVE PROJECT CHARTER · VERSION 1.0\n\n1. Executive Objectives:\nDeploy autonomous 4-DOF manipulator prototype with sub-millimeter positional repeatability.\n\n2. Milestones:\n- FOC Inverter PCB Revision 2 bringup: COMPLETED\n- Dynamic PID torque compliance loop: VALIDATED\n- Thermal throttling mitigation under continuous 3.2A: PASSED\n\nApproved by Engineering Lead.', fileCategory: 'document' },
  { id: 'file-7', name: 'pid_autotuning_simulation.py', path: 'Education/Programming', size: 18200, extension: 'py', updatedAt: '2026-11-03', tags: ['python', 'control'], content: '# Python 3 PID Simulation with Ziegler-Nichols Heuristic\nimport numpy as np\n\ndef simulate_step_response(kp=2.5, ki=0.8, kd=0.15):\n    dt = 0.01\n    time = np.linspace(0, 10, 1000)\n    state = 0.0\n    return len(time)\n\nprint("Simulation points evaluated:", simulate_step_response())', fileCategory: 'code' },
  { id: 'file-8', name: 'maxwell_equations_summary.pdf', path: 'Education/Physics', size: 420000, extension: 'pdf', updatedAt: '2026-11-01', tags: ['physics', 'electromagnetics'], content: 'Maxwell equations and wave propagation notes.', fileCategory: 'document' },
  { id: 'file-9', name: 'quadcopter_flight_telemetry.mp4', path: 'Projects/Active', size: 18400000, extension: 'mp4', updatedAt: '2026-11-06', tags: ['video', 'flight'], content: 'Quadcopter autonomous waypoint test flight video', fileCategory: 'video' },
  { id: 'file-10', name: 'chassis_stress_distribution.png', path: 'Projects/Active', size: 1950000, extension: 'png', updatedAt: '2026-11-05', tags: ['photo', 'fem'], content: 'Finite element analysis stress heatmap', mediaUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', fileCategory: 'photo' },
  { id: 'file-11', name: 'robotic_arm_calibration.mp4', path: 'NTFY/Robotics', size: 16500000, extension: 'mp4', updatedAt: '2026-11-04', tags: ['video', 'robotics'], content: 'Robotic arm 6-axis kinematic joint calibration run', fileCategory: 'video' },
  { id: 'file-12', name: 'motor_driver_thermal_profile.png', path: 'NTFY/Electrical', size: 1420000, extension: 'png', updatedAt: '2026-11-03', tags: ['photo', 'flir'], content: 'Infrared thermal profile under 45W continuous load', mediaUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80', fileCategory: 'photo' },
  { id: 'file-13', name: 'quantum_algorithm_demo.py', path: 'NTFY/Software', size: 21500, extension: 'py', updatedAt: '2026-11-05', tags: ['python', 'quantum'], content: '# Quantum Fourier Transform Simulation\nprint("Executing Quantum QFT register on 4 qubits")', fileCategory: 'code' },
  { id: 'file-14', name: 'Laboratory_Safety_Standard.docx', path: 'Projects/Active', size: 92000, extension: 'docx', updatedAt: '2026-11-02', tags: ['word', 'sop'], content: 'STANDARD OPERATING PROCEDURE · ROBOTICS LAB\n1. High-voltage interlock testing must precede brushless motor spin-up.\n2. Emergency e-stop pendant must remain within arm reach.', fileCategory: 'document' },
];

export const initialCodeProjects: CodeProject[] = [
  {
    id: 'code-1',
    name: 'Cosmic HUD Particle Field',
    html: `<div class="hud-container">
  <div class="hud-card">
    <div class="glow-orb"></div>
    <div class="badge">SYS OPERATIONAL</div>
    <h2>ROBOTICS TELEMETRY</h2>
    <div class="metrics">
      <div class="stat"><span class="lbl">JOINT 1</span><span class="val">42.8°</span></div>
      <div class="stat"><span class="lbl">TORQUE</span><span class="val">1.82 Nm</span></div>
      <div class="stat"><span class="lbl">VOLTAGE</span><span class="val">24.1 V</span></div>
    </div>
    <button id="pulseBtn">Pulse Actuators</button>
  </div>
</div>`,
    css: `body {
  margin: 0;
  background: #090b10;
  color: #e2e8f0;
  font-family: system-ui, -apple-system, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.hud-container {
  padding: 24px;
}
.hud-card {
  position: relative;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(56, 189, 248, 0.15);
  max-width: 380px;
}
.glow-orb {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 70px;
  height: 70px;
  background: radial-gradient(circle, #38bdf8 0%, #a855f7 100%);
  border-radius: 50%;
  filter: blur(18px);
  opacity: 0.6;
}
.badge {
  font-size: 11px;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 8px;
}
h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  letter-spacing: -0.02em;
}
.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}
.stat {
  background: rgba(255, 255, 255, 0.04);
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.lbl {
  display: block;
  font-size: 10px;
  color: #94a3b8;
  margin-bottom: 4px;
}
.val {
  font-weight: 700;
  font-size: 15px;
  color: #f8fafc;
}
button {
  width: 100%;
  background: linear-gradient(135deg, #0284c7, #7c3aed);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
}`,
    js: `document.getElementById('pulseBtn').addEventListener('click', () => {
  const stats = document.querySelectorAll('.val');
  stats.forEach(el => {
    el.style.color = '#38bdf8';
    setTimeout(() => { el.style.color = '#f8fafc'; }, 500);
  });
  console.log('Actuator pulse fired. CAN bus response ACK.');
});`,
    updatedAt: new Date().toISOString(),
  },
];

export const initialSavedApps: AppShortcut[] = [
  { id: 'app-1', name: 'GitHub', url: 'https://github.com', category: 'Code', icon: 'Code2', isFavorite: true, order: 1 },
  { id: 'app-2', name: 'Figma', url: 'https://figma.com', category: 'Design', icon: 'Palette', isFavorite: true, order: 2 },
  { id: 'app-3', name: 'Notion', url: 'https://notion.so', category: 'Knowledge', icon: 'BookOpen', isFavorite: true, order: 3 },
  { id: 'app-4', name: 'KiCad Docs', url: 'https://docs.kicad.org', category: 'Hardware', icon: 'Cpu', isFavorite: true, order: 4 },
  { id: 'app-5', name: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'Code', icon: 'Terminal', isFavorite: false, order: 5 },
  { id: 'app-6', name: 'ArXiv Physics', url: 'https://arxiv.org', category: 'Research', icon: 'FileText', isFavorite: true, order: 6 },
  { id: 'app-7', name: 'VS Code Web', url: 'https://vscode.dev', category: 'Code', icon: 'Laptop', isFavorite: true, order: 7 },
  { id: 'app-8', name: 'Linear', url: 'https://linear.app', category: 'Strategy', icon: 'Layers', isFavorite: false, order: 8 },
  { id: 'app-9', name: 'Desmos Calculator', url: 'https://desmos.com/calculator', category: 'Mathematics', icon: 'Calculator', isFavorite: false, order: 9 },
  { id: 'app-10', name: 'Wolfram Alpha', url: 'https://wolframalpha.com', category: 'Mathematics', icon: 'Sparkles', isFavorite: false, order: 10 },
  { id: 'app-11', name: 'DevDocs', url: 'https://devdocs.io', category: 'Reference', icon: 'Compass', isFavorite: false, order: 11 },
  { id: 'app-12', name: 'JLC PCB Viewer', url: 'https://cart.jlcpcb.com/quote', category: 'Hardware', icon: 'CheckCircle2', isFavorite: false, order: 12 },
];

export const initialFocusSessions: FocusSession[] = [
  {
    id: 'f-session-1',
    channel: 'Robotics',
    durationMinutes: 45,
    taskId: 'task-1',
    taskTitle: 'Inverse kinematics solver derivation',
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    soundscapeUsed: 'Cosmic Drone',
  },
  {
    id: 'f-session-2',
    channel: 'Electrical',
    durationMinutes: 40,
    taskId: 'task-2',
    taskTitle: 'Differential impedance routing',
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    soundscapeUsed: 'Rain Stream',
  },
  {
    id: 'f-session-3',
    channel: 'Robotics',
    durationMinutes: 25,
    taskId: 'task-4',
    taskTitle: 'Optical flow sensor bench test',
    completedAt: new Date(Date.now() - 5400000).toISOString(),
    soundscapeUsed: 'Binaural Theta',
  },
];

export const initialIdeas: IdeaItem[] = [
  {
    id: 'idea-1',
    title: 'Haptic Glove with Micro-Pneumatic Actuators',
    category: 'Robotics',
    description: 'Miniaturized valve manifold delivering tactile pressure feedback from robotic hand fingertip load cells.',
    stage: 'EVALUATING',
    votes: 8,
    createdAt: '2026-10-30T14:00:00Z',
  },
  {
    id: 'idea-2',
    title: 'Self-Compensating Differential Optical Probe',
    category: 'Electrical',
    description: 'Active optical isolated probe to measure gate-source Vgs voltages on high-side SiC/GaN half-bridge MOSFETs up to 100V/ns.',
    stage: 'READY_FOR_PROJECT',
    votes: 14,
    createdAt: '2026-11-01T09:30:00Z',
  },
  {
    id: 'idea-3',
    title: 'Local-First Markdown Graph Visualizer',
    category: 'Software',
    description: 'Interactive canvas network graph rendering bi-directional wiki links between local markdown notes in browser memory.',
    stage: 'RAW',
    votes: 5,
    createdAt: '2026-11-04T19:00:00Z',
  },
];

export const initialSettings: AppSettings = {
  theme: 'deep-charcoal',
  soundEnabled: true,
  defaultTimerMinutes: 25,
  enableEncryption: false,
  userName: 'Engineer',
};
