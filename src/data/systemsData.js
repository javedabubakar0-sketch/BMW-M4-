export const ENGINEERING_SYSTEMS = [
  {
    id: 'body',
    code: '01 / EXTERIOR',
    title: 'BODY ARCHITECTURE',
    headline: 'SHAPED WITH PURPOSE.',
    desc: 'Ultra-high-strength dry carbon fiber and lightweight aluminum composite panels engineered to minimize mass and optimize airflow across the high-speed profile.',
    specs: [
      { label: 'MATERIAL', value: 'Autoclave Pre-Preg Carbon' },
      { label: 'WEIGHT SAVING', value: '-38.4 kg vs Standard Sheetmetal' },
      { label: 'AERODYNAMIC PROFILE', value: 'Cd 0.31 High-Downforce' },
      { label: 'COATING', value: 'Self-Healing Nano Ceramic Clear' }
    ],
    hotspot: { x: 42, y: 22 }, // Upper roof & carbon hood area
    phaseRange: [0.09, 0.18]
  },
  {
    id: 'aerodynamics',
    code: '02 / AERO',
    title: 'AERODYNAMIC INTEGRATION',
    headline: 'AIR BECOMES CONTROL.',
    desc: 'Functional front splitter, side air curtains, sculpted underfloor venturi tunnels, and a carbon rear diffuser generating 340 kg of net downforce at 250 km/h.',
    specs: [
      { label: 'FRONT DOWNFORCE', value: '140 kg @ 250 km/h' },
      { label: 'REAR DOWNFORCE', value: '200 kg @ 250 km/h' },
      { label: 'ACTIVE ELEMENTS', value: 'Variable Underbody Flaps' },
      { label: 'VENTURI TUNNEL', value: 'Ground-Effect Carbon Channel' }
    ],
    hotspot: { x: 18, y: 72 }, // Front splitter area
    phaseRange: [0.18, 0.27]
  },
  {
    id: 'wheels',
    code: '03 / ROTATIONAL',
    title: 'FORGED WHEEL ASSEMBLY',
    headline: 'ROTATIONAL PRECISION.',
    desc: 'Staggered 20-inch front and 21-inch rear forged aerospace aluminum wheels designed with hollow-pocket spokes for lowest unsprung rotational inertia.',
    specs: [
      { label: 'DIMENSIONS', value: '20x10.0J Front / 21x11.5J Rear' },
      { label: 'CONSTRUCTION', value: '6061-T6 Forged Billet' },
      { label: 'TIRE SPEC', value: 'Michelin Pilot Sport Cup 2' },
      { label: 'FASTENERS', value: 'Grade 5 Titanium Lug Nuts' }
    ],
    hotspot: { x: 50, y: 80 }, // Front wheel
    phaseRange: [0.27, 0.36]
  },
  {
    id: 'brakes',
    code: '04 / BRAKING',
    title: 'CARBON-CERAMIC BRAKING',
    headline: 'CONTROL, ON DEMAND.',
    desc: '410mm front and 390mm rear cross-drilled carbon silicon carbide matrix discs with 6-piston aluminum monobloc calipers delivering relentless fade-free deceleration.',
    specs: [
      { label: 'ROTOR TYPE', value: 'Ventilated Carbon Ceramic Matrix' },
      { label: 'CALIPER', value: '6-Piston Front / 4-Piston Rear' },
      { label: 'OPERATING TEMP', value: 'Fade-Free up to 1,000°C' },
      { label: '100-0 KM/H', value: '30.2 meters stopping distance' }
    ],
    hotspot: { x: 23, y: 61 }, // Brake rotor assembly
    phaseRange: [0.27, 0.36]
  },
  {
    id: 'suspension',
    code: '05 / SUSPENSION',
    title: 'ADAPTIVE GEOMETRY',
    headline: 'WHERE MACHINE MEETS ROAD.',
    desc: 'Double-wishbone front and multi-link rear suspension with inverted monotube dampers, active magneto-rheological valves, and forged aluminum control arms.',
    specs: [
      { label: 'ARCHITECTURE', value: 'Double Wishbone / Multi-Link' },
      { label: 'DAMPING', value: 'MagneRide 4.0 Active Valves' },
      { label: 'ANTI-ROLL', value: '48V Active Roll Stabilization' },
      { label: 'BUSHINGS', value: 'Spherical Metallic Uniballs' }
    ],
    hotspot: { x: 44, y: 68 }, // Front suspension strut
    phaseRange: [0.36, 0.45]
  },
  {
    id: 'chassis',
    code: '06 / STRUCTURE',
    title: 'CHASSIS ARCHITECTURE',
    headline: 'STRENGTH, WITHOUT EXCESS.',
    desc: 'High-rigidity modular platform with structural carbon core, cast aluminum front shock towers, and an integrated rear subframe offering 42,000 Nm/deg torsional stiffness.',
    specs: [
      { label: 'TORSIONAL RIGIDITY', value: '42,000 Nm / degree' },
      { label: 'FRAME MATERIAL', value: 'Extruded Aluminum & Carbon Core' },
      { label: 'CRASH STRUCTURE', value: 'Front Ingot Crash Box' },
      { label: 'WEIGHT BALANCE', value: '50.2% Front / 49.8% Rear' }
    ],
    hotspot: { x: 62, y: 67 }, // Chassis center floor
    phaseRange: [0.45, 0.54]
  },
  {
    id: 'powertrain',
    code: '07 / POWERTRAIN',
    title: 'TWIN-TURBOCHARGED INLINE-6',
    headline: 'THE HEART OF THE MACHINE.',
    desc: '3.0-liter dry-sump inline-six cylinder engine with twin mono-scroll turbochargers, forged lightweight crankshaft, 350-bar direct injection, producing 550 hp and 650 Nm.',
    specs: [
      { label: 'DISPLACEMENT', value: '2,993 cc Inline-6' },
      { label: 'ASPIRATION', value: 'Twin Mono-Scroll Turbochargers' },
      { label: 'MAX POWER', value: '550 hp @ 6,250 RPM' },
      { label: 'MAX TORQUE', value: '650 Nm @ 2,750 - 5,500 RPM' },
      { label: '0-100 KM/H', value: '3.6 seconds' },
      { label: 'TOP SPEED', value: '307 km/h (electronically limited)' }
    ],
    hotspot: { x: 33, y: 52 }, // Engine block
    phaseRange: [0.54, 0.63]
  },
  {
    id: 'cooling',
    code: '08 / COOLING',
    title: 'THERMAL MANAGEMENT',
    headline: 'OPTIMIZED HEAT FLUX.',
    desc: 'High-capacity low-temperature radiator system, remote oil coolers, and charge-air water-to-air intercoolers designed to sustain maximum track attack temperatures.',
    specs: [
      { label: 'RADIATOR CORE', value: 'High-Flow Aluminum Matrix' },
      { label: 'INTERCOOLING', value: 'Twin Indirect Water-to-Air' },
      { label: 'ENGINE OIL COOLER', value: 'Dedicated Front Duct Cooler' },
      { label: 'TRANSMISSION COOLING', value: 'Thermostatic Fluid Exchanger' }
    ],
    hotspot: { x: 19, y: 77 }, // Front radiator/intercooler
    phaseRange: [0.63, 0.72]
  },
  {
    id: 'transmission',
    code: '09 / DRIVETRAIN',
    title: '8-SPEED DUAL-CLUTCH',
    headline: 'LIGHTNING-FAST ENGAGEMENT.',
    desc: 'Paddle-actuated 8-speed dual-clutch transmission with integrated electronic limited-slip differential (e-LSD) shifting cogs in less than 80 milliseconds.',
    specs: [
      { label: 'TYPE', value: '8-Speed Wet Dual-Clutch (DCT)' },
      { label: 'SHIFT TIME', value: '< 80 milliseconds in Track Mode' },
      { label: 'DIFFERENTIAL', value: 'Active Electro-Hydraulic e-LSD' },
      { label: 'DRIVESHAFT', value: 'One-Piece Carbon Fiber Tube' }
    ],
    hotspot: { x: 41, y: 56 }, // Transmission bellhousing
    phaseRange: [0.63, 0.72]
  },
  {
    id: 'exhaust',
    code: '10 / ACOUSTICS',
    title: 'TITANIUM EXHAUST SYSTEM',
    headline: 'RESONANT SYMPHONY.',
    desc: 'Bespoke lightweight titanium and Inconel quad-pipe exhaust with variable electronic butterfly valves that sculpt the inline-six acoustic note from silent cruise to howling race tone.',
    specs: [
      { label: 'MATERIAL', value: 'Grade 2 Titanium & Inconel 625' },
      { label: 'WEIGHT', value: '11.8 kg (42% lighter than steel)' },
      { label: 'VALVE CONTROL', value: 'Dual Electronic Actuators' },
      { label: 'TIPS', value: 'Quad 102mm Matte Carbon Sleeved' }
    ],
    hotspot: { x: 86, y: 49 }, // Exhaust tips & pipes
    phaseRange: [0.63, 0.72]
  },
  {
    id: 'cockpit',
    code: '11 / INTERIOR',
    title: 'DRIVER-CENTRIC CELL',
    headline: 'BUILT AROUND THE DRIVER.',
    desc: 'Carbon monocoque racing bucket seats trimmed in perforated Alcantara, flat-bottom carbon steering wheel with M-Mode switches, and twin high-resolution curved displays.',
    specs: [
      { label: 'SEATS', value: 'Carbon Shell Lightweight Buckets' },
      { label: 'TRIM', value: 'Black Nappa Leather & Alcantara' },
      { label: 'DISPLAYS', value: 'Curved OLED High-Luminance' },
      { label: 'TELEMETRY', value: 'Real-time G-force & Lap Timer' }
    ],
    hotspot: { x: 58, y: 42 }, // Cockpit seat & cabin
    phaseRange: [0.72, 0.81]
  }
];

export const SCROLL_PHASES = [
  {
    index: 1,
    id: 'complete',
    eyebrow: 'PHASE 01 / COMPLETE MACHINE',
    headline: 'ONE FORM.\nMANY SYSTEMS.',
    desc: 'A seamless sculpture engineered for pure performance. Every surface balances low aerodynamic drag with aggressive downforce.',
    frameStart: 0,
    frameEnd: 25,
    accent: '#d4af37'
  },
  {
    index: 2,
    id: 'exterior',
    eyebrow: 'PHASE 02 / EXTERIOR DISASSEMBLY',
    headline: 'SHAPED WITH\nPURPOSE.',
    desc: 'Carbon fiber hood, doors, roof, and aerodynamic body panels separate from the core, revealing the intricate boundary layer management.',
    frameStart: 25,
    frameEnd: 65,
    accent: '#5bc0be'
  },
  {
    index: 3,
    id: 'aerodynamics',
    eyebrow: 'PHASE 03 / AERODYNAMICS',
    headline: 'AIR BECOMES\nCONTROL.',
    desc: 'Front splitter, sculpted brake duct curtains, and rear venturi tunnels harness turbulent air to pin the machine to the asphalt.',
    frameStart: 65,
    frameEnd: 110,
    accent: '#00d2ff'
  },
  {
    index: 4,
    id: 'wheels_brakes',
    eyebrow: 'PHASE 04 / ROTATIONAL DYNAMICS',
    headline: 'WHERE MACHINE\nMEETS ROAD.',
    desc: 'Forged lightweight monoblock wheels detach to expose 410mm ventilated carbon-ceramic rotors and 6-piston monobloc calipers.',
    frameStart: 110,
    frameEnd: 155,
    accent: '#f5c518'
  },
  {
    index: 5,
    id: 'structure',
    eyebrow: 'PHASE 05 / CHASSIS CORE',
    headline: 'STRENGTH,\nWITHOUT EXCESS.',
    desc: 'The structural carbon backbone and extruded aluminum subframes deliver 42,000 Nm/deg of torsional rigidity with uncompromising mass control.',
    frameStart: 155,
    frameEnd: 195,
    accent: '#7ec8e3'
  },
  {
    index: 6,
    id: 'powertrain',
    eyebrow: 'PHASE 06 / ENGINE',
    headline: 'THE HEART OF\nTHE MACHINE.',
    desc: 'The 550 hp twin-turbocharged inline-six sits low and far back in the front-mid chassis position for ideal 50:50 axle weight distribution.',
    frameStart: 195,
    frameEnd: 235,
    accent: '#ff2a2a'
  },
  {
    index: 7,
    id: 'cooling_exhaust',
    eyebrow: 'PHASE 07 / AUXILIARY SYSTEMS',
    headline: 'POWER NEEDS\nCONTROL.',
    desc: 'Twin water-to-air intercoolers, dry-sump oil circuits, and a featherweight quad-exit titanium exhaust system manage extreme thermodynamic loads.',
    frameStart: 235,
    frameEnd: 265,
    accent: '#ff8500'
  },
  {
    index: 8,
    id: 'interior',
    eyebrow: 'PHASE 08 / INTERIOR CELL',
    headline: 'BUILT AROUND\nTHE DRIVER.',
    desc: 'Lightweight carbon racing bucket seats, an ergonomic driver-focused cockpit, tactile anodized dials, and curved OLED telemetry.',
    frameStart: 265,
    frameEnd: 285,
    accent: '#e5b80b'
  },
  {
    index: 9,
    id: 'exploded',
    eyebrow: 'PHASE 09 / FULL EXPLODED MACHINE',
    headline: 'EVERY PART.\nONE PURPOSE.',
    desc: '300 components floating in precise harmony. Click any technical marker to inspect engineering specifications and component metallurgy.',
    frameStart: 285,
    frameEnd: 299,
    accent: '#00d2ff',
    enableInspection: true
  },
  {
    index: 10,
    id: 'reassembly',
    eyebrow: 'PHASE 10 / REASSEMBLY',
    headline: 'ENGINEERED\nAS ONE.',
    desc: 'Every mechanical, aerodynamic, and structural system docks back with millimeter tolerance. Ready for the track.',
    frameStart: 299,
    frameEnd: 1, // reverse or complete
    accent: '#5bc0be'
  },
  {
    index: 11,
    id: 'final_hero',
    eyebrow: 'PHASE 11 / FINALE',
    headline: 'READY.\nMAKE IT YOURS.',
    desc: 'Configure your bespoke Project V machine in our private design atelier.',
    frameStart: 0,
    frameEnd: 0,
    accent: '#e5b80b'
  }
];

export const TRACK_CHAPTERS = [
  { id: 'design', label: 'DESIGN', progress: 0.05 },
  { id: 'air', label: 'AIR', progress: 0.22 },
  { id: 'chassis', label: 'CHASSIS', progress: 0.45 },
  { id: 'power', label: 'POWER', progress: 0.62 },
  { id: 'cabin', label: 'CABIN', progress: 0.78 },
  { id: 'inspection', label: 'EXPLODED', progress: 0.90 },
  { id: 'complete', label: 'COMPLETE', progress: 1.0 }
];
