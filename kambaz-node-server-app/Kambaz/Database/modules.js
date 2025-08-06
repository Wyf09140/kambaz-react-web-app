const modules = [
  {
    "_id": "M101",
    "name": "Introduction to Rocket Propulsion",
    "description": "Basic principles of rocket propulsion and rocket engines.",
    "course": "RS101",
    "lessons": [
      {
        "_id": "L101",
        "name": "History of Rocketry",
        "description": "A brief history of rocketry and space exploration.",
        "module": "M101"
      },
      {
        "_id": "L102",
        "name": "Rocket Propulsion Fundamentals",
        "description": "Basic principles of rocket propulsion.",
        "module": "M101"
      },
      {
        "_id": "L103",
        "name": "Rocket Engine Types",
        "description": "Overview of different types of rocket engines.",
        "module": "M101"
      }
    ]
  },
  {
    "_id": "M102",
    "name": "Fuel and Combustion",
    "description": "Understanding rocket fuel, combustion processes, and efficiency.",
    "course": "RS101",
    "lessons": [
      {
        "_id": "L201",
        "name": "Rocket Fuel",
        "description": "Overview of different types of rocket fuels.",
        "module": "M102"
      },
      {
        "_id": "L202",
        "name": "Combustion Processes",
        "description": "Understanding combustion processes and efficiency.",
        "module": "M102"
      },
      {
        "_id": "L203",
        "name": "Combustion Instability",
        "description": "Understanding combustion instability and mitigation.",
        "module": "M102"
      }
    ]
  },
  {
    "_id": "M103",
    "name": "Nozzle Design",
    "description": "Principles of rocket nozzle design and performance optimization.",
    "course": "RS101",
    "lessons": [
      {
        "_id": "L301",
        "name": "Nozzle Design",
        "description": "Overview of different types of rocket nozzles.",
        "module": "M103"
      },
      {
        "_id": "L302",
        "name": "Nozzle Performance",
        "description": "Understanding nozzle performance and efficiency.",
        "module": "M103"
      },
      {
        "_id": "L303",
        "name": "Nozzle Optimization",
        "description": "Optimizing nozzle design for specific applications.",
        "module": "M103"
      }
    ]
  },
  {
    "_id": "M201",
    "name": "Fundamentals of Aerodynamics",
    "description": "Basic aerodynamic concepts and fluid dynamics principles.",
    "course": "RS102",
    "lessons": [
      {
        "_id": "L201A",
        "name": "Introduction to Fluid Dynamics",
        "description": "Fundamental concepts of fluid mechanics relevant to aerodynamics.",
        "module": "M201"
      },
      {
        "_id": "L201B",
        "name": "Airfoil Theory",
        "description": "Principles of airfoil lift and drag generation.",
        "module": "M201"
      },
      {
        "_id": "L201C",
        "name": "Aerodynamic Forces and Moments",
        "description": "Calculating and understanding forces and moments acting on aircraft.",
        "module": "M201"
      }
    ]
  },
  {
    "_id": "M202",
    "name": "Subsonic and Supersonic Flow",
    "description": "Understanding subsonic and supersonic aerodynamic behaviors.",
    "course": "RS102",
    "lessons": [
      {
        "_id": "L202A",
        "name": "Subsonic Flow Characteristics",
        "description": "Behavior of airflow at speeds below the speed of sound.",
        "module": "M202"
      },
      {
        "_id": "L202B",
        "name": "Supersonic Flow and Shockwaves",
        "description": "Aerodynamics at speeds exceeding the speed of sound, including shockwave formation.",
        "module": "M202"
      },
      {
        "_id": "L202C",
        "name": "Transonic Aerodynamics",
        "description": "Challenges and phenomena in the transonic flight regime.",
        "module": "M202"
      }
    ]
  },
  {
    "_id": "M203",
    "name": "Aerodynamic Heating",
    "description": "Study of aerodynamic heating and thermal protection systems.",
    "course": "RS102",
    "lessons": [
      {
        "_id": "L203A",
        "name": "Heat Transfer in High-Speed Flight",
        "description": "Principles of heat transfer at high aerodynamic speeds.",
        "module": "M203"
      },
      {
        "_id": "L203B",
        "name": "Thermal Protection Systems",
        "description": "Methods and materials for protecting spacecraft from extreme heat.",
        "module": "M203"
      },
      {
        "_id": "L203C",
        "name": "Re-entry Aerothermodynamics",
        "description": "Aerodynamic heating challenges during atmospheric re-entry.",
        "module": "M203"
      }
    ]
  },
  {
    "_id": "M301",
    "name": "Spacecraft Structural Design",
    "description": "Fundamentals of designing spacecraft structures and materials selection.",
    "course": "RS103",
    "lessons": [
      {
        "_id": "L301A",
        "name": "Spacecraft Structures",
        "description": "Overview of common spacecraft structural components and their functions.",
        "module": "M301"
      },
      {
        "_id": "L301B",
        "name": "Materials for Space Applications",
        "description": "Selection and properties of materials used in spacecraft construction.",
        "module": "M301"
      },
      {
        "_id": "L301C",
        "name": "Structural Load Analysis",
        "description": "Analyzing forces and stresses on spacecraft structures during launch and operation.",
        "module": "M301"
      }
    ]
  },
  {
    "_id": "M302",
    "name": "Orbital Mechanics",
    "description": "Understanding orbital dynamics and mission planning.",
    "course": "RS103",
    "lessons": [
      {
        "_id": "L302A",
        "name": "Kepler's Laws and Orbital Elements",
        "description": "Fundamental laws governing orbital motion and defining orbital paths.",
        "module": "M302"
      },
      {
        "_id": "L302B",
        "name": "Orbital Maneuvers",
        "description": "Techniques for changing spacecraft orbits and trajectories.",
        "module": "M302"
      },
      {
        "_id": "L302C",
        "name": "Mission Design and Trajectory Optimization",
        "description": "Planning spacecraft missions and optimizing their paths for efficiency.",
        "module": "M302"
      }
    ]
  },
  {
    "_id": "M303",
    "name": "Spacecraft Systems Engineering",
    "description": "Overview of spacecraft systems and subsystems engineering.",
    "course": "RS103",
    "lessons": [
      {
        "_id": "L303A",
        "name": "Spacecraft Power Systems",
        "description": "Design and operation of power generation and distribution systems for spacecraft.",
        "module": "M303"
      },
      {
        "_id": "L303B",
        "name": "Attitude Determination and Control",
        "description": "Methods for controlling a spacecraft's orientation in space.",
        "module": "M303"
      },
      {
        "_id": "L303C",
        "name": "Command and Data Handling",
        "description": "Systems for receiving commands and transmitting data to and from spacecraft.",
        "module": "M303"
      }
    ]
  },
  {
    "_id": "M401",
    "name": "Hydrocarbons and Functional Groups",
    "description": "Introduction to the basic building blocks of organic compounds.",
    "course": "RS104",
    "lessons": [
      {
        "_id": "L401A",
        "name": "Alkanes, Alkenes, and Alkynes",
        "description": "Structure and nomenclature of basic hydrocarbon families.",
        "module": "M401"
      },
      {
        "_id": "L401B",
        "name": "Aromatic Compounds",
        "description": "Introduction to benzene and other aromatic systems.",
        "module": "M401"
      },
      {
        "_id": "L401C",
        "name": "Common Functional Groups",
        "description": "Exploring alcohols, ethers, aldehydes, ketones, and carboxylic acids.",
        "module": "M401"
      }
    ]
  },
  {
    "_id": "M402",
    "name": "Organic Reactions and Mechanisms",
    "description": "Understanding how organic molecules react and the pathways they take.",
    "course": "RS104",
    "lessons": [
      {
        "_id": "L402A",
        "name": "Substitution Reactions",
        "description": "Nucleophilic substitution (SN1, SN2) and electrophilic aromatic substitution.",
        "module": "M402"
      },
      {
        "_id": "L402B",
        "name": "Elimination Reactions",
        "description": "E1 and E2 mechanisms and their applications.",
        "module": "M402"
      },
      {
        "_id": "L402C",
        "name": "Addition Reactions",
        "description": "Electrophilic and nucleophilic addition to alkenes and carbonyls.",
        "module": "M402"
      }
    ]
  },
  {
    "_id": "M403",
    "name": "Spectroscopy and Structure Determination",
    "description": "Techniques for identifying and characterizing organic compounds.",
    "course": "RS104",
    "lessons": [
      {
        "_id": "L403A",
        "name": "Infrared (IR) Spectroscopy",
        "description": "Using IR to identify functional groups.",
        "module": "M403"
      },
      {
        "_id": "L403B",
        "name": "Nuclear Magnetic Resonance (NMR) Spectroscopy",
        "description": "Principles of 1H and 13C NMR for structural elucidation.",
        "module": "M403"
      },
      {
        "_id": "L403C",
        "name": "Mass Spectrometry (MS)",
        "description": "Determining molecular weight and fragmentation patterns.",
        "module": "M403"
      }
    ]
  },
  {
    "_id": "M501",
    "name": "Coordination Chemistry",
    "description": "Study of metal complexes and their bonding.",
    "course": "RS105",
    "lessons": [
      {
        "_id": "L501A",
        "name": "Ligands and Coordination Numbers",
        "description": "Types of ligands and how they bind to metal centers.",
        "module": "M501"
      },
      {
        "_id": "L501B",
        "name": "Nomenclature and Isomerism",
        "description": "Naming conventions and different types of isomerism in coordination compounds.",
        "module": "M501"
      },
      {
        "_id": "L501C",
        "name": "Crystal Field Theory",
        "description": "Understanding electronic structure and properties of transition metal complexes.",
        "module": "M501"
      }
    ]
  },
  {
    "_id": "M502",
    "name": "Main Group and Transition Metal Chemistry",
    "description": "Properties and reactions of elements across the periodic table.",
    "course": "RS105",
    "lessons": [
      {
        "_id": "L502A",
        "name": "Chemistry of Main Group Elements",
        "description": "Survey of elements in the s and p blocks.",
        "module": "M502"
      },
      {
        "_id": "L502B",
        "name": "Transition Metals and Their Reactivity",
        "description": "Unique properties and catalytic roles of d-block elements.",
        "module": "M502"
      },
      {
        "_id": "L502C",
        "name": "Organometallic Chemistry Basics",
        "description": "Introduction to compounds with metal-carbon bonds.",
        "module": "M502"
      }
    ]
  },
  {
    "_id": "M503",
    "name": "Inorganic Materials and Applications",
    "description": "Real-world uses of inorganic compounds.",
    "course": "RS105",
    "lessons": [
      {
        "_id": "L503A",
        "name": "Solid State Chemistry",
        "description": "Structures and properties of inorganic solids.",
        "module": "M503"
      },
      {
        "_id": "L503B",
        "name": "Catalysis in Inorganic Chemistry",
        "description": "Role of inorganic compounds as catalysts in industrial processes.",
        "module": "M503"
      },
      {
        "_id": "L503C",
        "name": "Bioinorganic Chemistry",
        "description": "Metal ions in biological systems and their functions.",
        "module": "M503"
      }
    ]
  },
  {
    "_id": "M601",
    "name": "Chemical Thermodynamics",
    "description": "Energy transformations in chemical reactions.",
    "course": "RS106",
    "lessons": [
      {
        "_id": "L601A",
        "name": "First Law of Thermodynamics",
        "description": "Conservation of energy, enthalpy, and heat capacity.",
        "module": "M601"
      },
      {
        "_id": "L601B",
        "name": "Second and Third Laws of Thermodynamics",
        "description": "Entropy, spontaneity, and Gibbs free energy.",
        "module": "M601"
      },
      {
        "_id": "L601C",
        "name": "Chemical Equilibrium",
        "description": "Understanding equilibrium constants and reaction spontaneity.",
        "module": "M601"
      }
    ]
  },
  {
    "_id": "M602",
    "name": "Chemical Kinetics",
    "description": "Rates and mechanisms of chemical reactions.",
    "course": "RS106",
    "lessons": [
      {
        "_id": "L602A",
        "name": "Reaction Rates and Rate Laws",
        "description": "Defining reaction rates and determining rate laws experimentally.",
        "module": "M602"
      },
      {
        "_id": "L602B",
        "name": "Reaction Mechanisms and Transition State Theory",
        "description": "Understanding step-by-step pathways of reactions.",
        "module": "M602"
      },
      {
        "_id": "L602C",
        "name": "Catalysis and Enzyme Kinetics",
        "description": "How catalysts affect reaction rates and an introduction to enzyme kinetics.",
        "module": "M602"
      }
    ]
  },
  {
    "_id": "M603",
    "name": "Quantum Mechanics and Spectroscopy",
    "description": "The quantum nature of atoms and molecules and their interaction with light.",
    "course": "RS106",
    "lessons": [
      {
        "_id": "L603A",
        "name": "Introduction to Quantum Mechanics",
        "description": "Wave-particle duality, Schrödinger equation, and atomic orbitals.",
        "module": "M603"
      },
      {
        "_id": "L603B",
        "name": "Molecular Spectroscopy",
        "description": "Vibrational, rotational, and electronic spectroscopy.",
        "module": "M603"
      },
      {
        "_id": "L603C",
        "name": "Statistical Thermodynamics",
        "description": "Connecting microscopic properties to macroscopic thermodynamic behavior.",
        "module": "M603"
      }
    ]
  },
  {
    "_id": "M701",
    "name": "Elvish Languages: Sindarin and Quenya",
    "description": "A deep dive into the two primary Elvish languages.",
    "course": "RS107",
    "lessons": [
      {
        "_id": "L701A",
        "name": "Introduction to Quenya",
        "description": "Grammar, vocabulary, and common phrases of High Elvish.",
        "module": "M701"
      },
      {
        "_id": "L701B",
        "name": "Introduction to Sindarin",
        "description": "Grammar, vocabulary, and common phrases of Grey Elvish.",
        "module": "M701"
      },
      {
        "_id": "L701C",
        "name": "Elvish Writing Systems (Tengwar)",
        "description": "Learning to read and write in the elegant Tengwar script.",
        "module": "M701"
      }
    ]
  },
  {
    "_id": "M702",
    "name": "Dwarvish (Khuzdul) and Black Speech",
    "description": "Exploring the languages of Dwarves and the evil forces.",
    "course": "RS107",
    "lessons": [
      {
        "_id": "L702A",
        "name": "Khuzdul: The Secret Tongue",
        "description": "Overview of Dwarvish language, its structure, and limited known vocabulary.",
        "module": "M702"
      },
      {
        "_id": "L702B",
        "name": "Runes of the Dwarves (Cirth)",
        "description": "Understanding the angular Cirth script used by Dwarves.",
        "module": "M702"
      },
      {
        "_id": "L702C",
        "name": "The Black Speech of Mordor",
        "description": "Analysis of its grim origins and the infamous Ring-inscription.",
        "module": "M702"
      }
    ]
  },
  {
    "_id": "M703",
    "name": "Linguistic Lore of Middle-earth",
    "description": "The philological depth and influence of languages on Middle-earth's history.",
    "course": "RS107",
    "lessons": [
      {
        "_id": "L703A",
        "name": "Tolkien's Linguistic Genius",
        "description": "How J.R.R. Tolkien created his languages and their internal consistency.",
        "module": "M703"
      },
      {
        "_id": "L703B",
        "name": "Language and Culture in Middle-earth",
        "description": "The symbiotic relationship between the various tongues and their speakers' cultures.",
        "module": "M703"
      },
      {
        "_id": "L703C",
        "name": "The Evolution of Middle-earth Languages",
        "description": "Tracing the historical development and divergence of the different linguistic families.",
        "module": "M703"
      }
    ]
  },
  {
    "_id": "M801",
    "name": "The Councils and Alliances of the Free Peoples",
    "description": "Analyzing key diplomatic gatherings and pacts.",
    "course": "RS108",
    "lessons": [
      {
        "_id": "L801A",
        "name": "The Council of Elrond",
        "description": "In-depth study of the pivotal meeting and its diplomatic implications.",
        "module": "M801"
      },
      {
        "_id": "L801B",
        "name": "The Last Alliance of Elves and Men",
        "description": "Examining the formation and challenges of this grand alliance.",
        "module": "M801"
      },
      {
        "_id": "L801C",
        "name": "Relations Between Rivendell and Mirkwood",
        "description": "Exploring diplomatic ties between different Elvish factions.",
        "module": "M801"
      }
    ]
  },
  {
    "_id": "M802",
    "name": "Leadership, Wisdom, and Conflict Resolution",
    "description": "The role of key figures in shaping inter-species relations.",
    "course": "RS108",
    "lessons": [
      {
        "_id": "L802A",
        "name": "Gandalf's Diplomatic Role",
        "description": "Analyzing the Wizard's influence and strategies in fostering cooperation.",
        "module": "M802"
      },
      {
        "_id": "L802B",
        "name": "The Leadership of Aragorn and Théoden",
        "description": "Case studies on human leadership in times of crisis and alliance-building.",
        "module": "M802"
      },
      {
        "_id": "L802C",
        "name": "Resolving Disputes: Dwarves and Elves",
        "description": "Historical instances of conflict and reconciliation between these races.",
        "module": "M802"
      }
    ]
  },
  {
    "_id": "M803",
    "name": "War and Diplomacy in the Third Age",
    "description": "How alliances and conflicts shaped the fate of Middle-earth.",
    "course": "RS108",
    "lessons": [
      {
        "_id": "L803A",
        "name": "The War of the Ring: A Diplomatic Failure or Success?",
        "description": "Analyzing the grand strategies and inter-species coordination during the war.",
        "module": "M803"
      },
      {
        "_id": "L803B",
        "name": "Propaganda and Psychological Warfare",
        "description": "How different factions used information and fear in their campaigns.",
        "module": "M803"
      },
      {
        "_id": "L803C",
        "name": "Post-War Reconstruction and Relations",
        "description": "The impact of the war on future interactions between the races.",
        "module": "M803"
      }
    ]
  }
]
export default modules