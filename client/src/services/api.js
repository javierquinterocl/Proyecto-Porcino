const STORAGE_KEY = 'porcino_app_data_v1';
const RESET_TOKENS_KEY = 'porcino_reset_tokens_v1';
const NETWORK_DELAY = 120;

const TEST_USER = {
  id: 1,
  code: 'USR-001',
  idCard: '900123456',
  firstName: 'Administrador',
  lastName: 'Porcino',
  email: 'demo@porcino.com',
  phone: '3001234567',
  role: 'ADMIN',
  password: 'demo123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const defaultSuppliers = [
  {
    id: 1,
    supplierId: 'SUP-001',
    name: 'Agroinsumos Porcinos',
    phone: '3205558899',
    email: 'contacto@agro-porcinos.co',
    cityId: '11001',
    stateId: '11',
    countryId: 'CO',
    nit: '901456789-1',
    address: 'Km 5 vía a Mosquera',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    supplierId: 'SUP-002',
    name: 'Laboratorios VetCare',
    phone: '3174446677',
    email: 'ventas@vetcare.com',
    cityId: '05001',
    stateId: '5',
    countryId: 'CO',
    nit: '900765432-5',
    address: 'Carrera 45 #32-11',
    createdAt: new Date().toISOString()
  }
];

const defaultProducts = [
  {
    id: 1,
    productId: 'ALIM-001',
    name: 'Concentrado Inicio Lechones',
    description: 'Alimento balanceado para lechones hasta 30 kg',
    unitPrice: 82000,
    stock: 120,
    productType: 'ALIMENTO',
    supplierId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    productId: 'VAC-010',
    name: 'Vacuna Circovirus Porcino',
    description: 'Dosis única para cerdos de engorde',
    unitPrice: 46000,
    stock: 80,
    productType: 'MEDICO',
    supplierId: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultPigs = [
  {
    id: 1,
    pigId: "CER-001",
    name: "Aurora",
    alias: "Aurora",
    breed: "Large White",
    birthDate: "2022-05-12",
    entryDate: "2022-08-01",
    origin: "GRANJA_PROPIA",
    status: "ACTIVE",
    location: "Sala Maternidad 1 - Jaula 4",
    fatherId: "VER-045",
    motherId: "CER-015",
    geneticLine: "Línea Aurora",
    generation: "F2",
    gender: "FEMALE",
    pigType: "REPRODUCTORA",
    weight: 190,
    averageDailyGain: 0.82,
    feedConsumption: 3.8,
    vaccinationsCount: 6,
    heatCycles: 3,
    litterCount: 2,
    parentId: null,
    notes: "Cerda líder del lote reproductor.",
    photos: [
      {
        id: "photo-aurora-inicial",
        url: "",
        description: "Ingreso a maternidad",
        takenAt: "2024-05-01"
      }
    ],
    reproductiveRecords: [
      {
        id: "rec-aurora-1",
        cycleNumber: 1,
        service: {
          date: "2023-09-01",
          type: "IAC",
          boarId: "VER-101",
          semenDose: "Dosis 101-A",
          inseminator: "Laura Gómez",
          servicesCount: 2
        },
        pregnancyCheck: {
          date: "2023-09-28",
          method: "Ultrasonido",
          result: "POSITIVO"
        },
        expectedFarrowDate: "2023-12-24",
        farrowing: {
          date: "2023-12-23",
          gestationLength: 113,
          type: "NORMAL",
          labourDurationHours: 4,
          observations: "Parto sin complicaciones."
        },
        litter: {
          totalBorn: 12,
          bornAlive: 11,
          stillborn: 1,
          mummies: 0,
          malformations: "",
          maleCount: 6,
          femaleCount: 5,
          birthWeightTotal: 15.8,
          piglets: [
            {
              id: "piglet-aurora-1",
              pigletId: 1,
              tagId: "LT-001-A",
              uniqueId: "AUR-P1-L01",
              sex: "MALE",
              birthWeight: 1.45,
              status: "VIVO",
              statusDate: "2023-12-23",
              weaningWeight: 7.2,
              observations: "",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2024-01-18T10:00:00.000Z"
            },
            {
              id: "piglet-aurora-2",
              pigletId: 2,
              tagId: "LT-001-B",
              uniqueId: "AUR-P1-L02",
              sex: "FEMALE",
              birthWeight: 1.38,
              status: "VIVO",
              statusDate: "2023-12-23",
              weaningWeight: 6.9,
              observations: "Requirió suplementación día 2.",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2024-01-18T10:00:00.000Z"
            },
            {
              id: "piglet-aurora-3",
              pigletId: 3,
              tagId: "LT-001-C",
              uniqueId: "AUR-P1-L03",
              sex: "MALE",
              birthWeight: 1.52,
              status: "VENDIDO",
              statusDate: "2024-03-15",
              statusDetail: "Vendido a granja La Esperanza",
              weaningWeight: 7.5,
              observations: "Excelente desarrollo",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2024-03-15T14:00:00.000Z"
            },
            {
              id: "piglet-aurora-4",
              pigletId: 4,
              tagId: "LT-001-D",
              uniqueId: "AUR-P1-L04",
              sex: "FEMALE",
              birthWeight: 1.41,
              status: "VIVO",
              statusDate: "2023-12-23",
              weaningWeight: 7.0,
              observations: "",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2024-01-18T10:00:00.000Z"
            },
            {
              id: "piglet-aurora-5",
              pigletId: 5,
              tagId: "LT-001-E",
              uniqueId: "AUR-P1-L05",
              sex: "MALE",
              birthWeight: 1.35,
              status: "VIVO",
              statusDate: "2023-12-23",
              weaningWeight: 6.8,
              observations: "",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2024-01-18T10:00:00.000Z"
            },
            {
              id: "piglet-aurora-6",
              pigletId: 6,
              tagId: "LT-001-F",
              uniqueId: "AUR-P1-L06",
              sex: "FEMALE",
              birthWeight: 0.65,
              status: "MUERTO",
              statusDate: "2023-12-28",
              statusDetail: "Muerte día 5 por hipotermia - bajo peso al nacer",
              weaningWeight: null,
              observations: "Bajo peso crítico al nacimiento (<0.7 kg)",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2023-12-28T08:00:00.000Z"
            },
            {
              id: "piglet-aurora-7",
              pigletId: 7,
              tagId: "LT-001-G",
              uniqueId: "AUR-P1-L07",
              sex: "MALE",
              birthWeight: 1.48,
              status: "VIVO",
              statusDate: "2023-12-23",
              weaningWeight: 7.3,
              observations: "",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2024-01-18T10:00:00.000Z"
            },
            {
              id: "piglet-aurora-8",
              pigletId: 8,
              tagId: "LT-001-H",
              uniqueId: "AUR-P1-L08",
              sex: "FEMALE",
              birthWeight: 1.39,
              status: "TRANSFERIDO",
              statusDate: "2023-12-24",
              statusDetail: "Transferido a cerda CER-019 por exceso de lechones",
              weaningWeight: 6.7,
              observations: "",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2024-01-18T10:00:00.000Z"
            },
            {
              id: "piglet-aurora-9",
              pigletId: 9,
              tagId: "LT-001-I",
              uniqueId: "AUR-P1-L09",
              sex: "MALE",
              birthWeight: 1.42,
              status: "VIVO",
              statusDate: "2023-12-23",
              weaningWeight: 7.1,
              observations: "",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2024-01-18T10:00:00.000Z"
            },
            {
              id: "piglet-aurora-10",
              pigletId: 10,
              tagId: "LT-001-J",
              uniqueId: "AUR-P1-L10",
              sex: "FEMALE",
              birthWeight: 1.37,
              status: "VIVO",
              statusDate: "2023-12-23",
              weaningWeight: 6.95,
              observations: "",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2024-01-18T10:00:00.000Z"
            },
            {
              id: "piglet-aurora-11",
              pigletId: 11,
              tagId: "LT-001-K",
              uniqueId: "AUR-P1-L11",
              sex: "MALE",
              birthWeight: 1.46,
              status: "VIVO",
              statusDate: "2023-12-23",
              weaningWeight: 7.15,
              observations: "",
              createdAt: "2023-12-23T09:00:00.000Z",
              updatedAt: "2024-01-18T10:00:00.000Z"
            }
          ]
        },
        lactation: {
          weaningDate: "2024-01-18",
          pigletsWeaned: 10,
          weaningWeightPerPiglet: 7.1,
          totalWeaningWeight: 71,
          durationDays: 26,
          mortalityNotes: "1 lechón muerto día 5 por hipotermia.",
          adoptionsNotes: "Recibió 1 lechón de CER-005.",
          sowBodyCondition: "3.0",
          postWeaningEstrusDate: "2024-01-24",
          idcDays: 6
        },
        productivityIssues: {
          abortions: "",
          repeats: "",
          anestrus: ""
        },
        notes: "Excelente comportamiento maternal.",
        createdAt: "2023-12-23T08:00:00.000Z",
        updatedAt: "2024-01-24T12:00:00.000Z"
      }
    ],
    createdAt: "2022-08-01T09:00:00.000Z",
    updatedAt: "2024-05-10T10:00:00.000Z"
  },
  {
    id: 2,
    pigId: "CER-004",
    name: "Estrella",
    alias: "Estrella",
    breed: "Landrace",
    birthDate: "2021-11-30",
    entryDate: "2022-02-15",
    origin: "COMPRADA",
    status: "ACTIVE",
    location: "Sala Gestación 2 - Corral 7",
    fatherId: "VER-077",
    motherId: "CER-040",
    geneticLine: "Landrace Elite",
    generation: "F3",
    gender: "FEMALE",
    pigType: "REPRODUCTORA",
    weight: 210,
    averageDailyGain: 0.88,
    feedConsumption: 4.0,
    vaccinationsCount: 7,
    heatCycles: 4,
    litterCount: 3,
    parentId: null,
    notes: "Reproductora estable con excelente prolificidad.",
    photos: [],
    reproductiveRecords: [
      {
        id: "rec-estrella-1",
        cycleNumber: 3,
        service: {
          date: "2024-02-10",
          type: "IAPC",
          boarId: "VER-205",
          semenDose: "Lote IAPC-205",
          inseminator: "Carlos Patiño",
          servicesCount: 2
        },
        pregnancyCheck: {
          date: "2024-03-07",
          method: "Detección de celo",
          result: "POSITIVO"
        },
        expectedFarrowDate: "2024-06-03",
        farrowing: {
          date: "",
          gestationLength: null,
          type: "",
          labourDurationHours: 0,
          observations: ""
        },
        litter: {
          totalBorn: 0,
          bornAlive: 0,
          stillborn: 0,
          mummies: 0,
          malformations: "",
          maleCount: 0,
          femaleCount: 0,
          birthWeightTotal: 0,
          piglets: []
        },
        lactation: {
          weaningDate: "",
          pigletsWeaned: 0,
          weaningWeightPerPiglet: 0,
          totalWeaningWeight: 0,
          durationDays: null,
          mortalityNotes: "",
          adoptionsNotes: "",
          sowBodyCondition: "",
          postWeaningEstrusDate: "",
          idcDays: null
        },
        productivityIssues: {
          abortions: "",
          repeats: "",
          anestrus: ""
        },
        notes: "",
        createdAt: "2024-02-10T14:00:00.000Z",
        updatedAt: "2024-03-07T10:00:00.000Z"
      },
      {
        id: "rec-estrella-0",
        cycleNumber: 2,
        service: {
          date: "2023-06-18",
          type: "MONTA_NATURAL",
          boarId: "VER-180",
          semenDose: "",
          inseminator: "José Martínez",
          servicesCount: 1
        },
        pregnancyCheck: {
          date: "2023-07-12",
          method: "Ultrasonido",
          result: "POSITIVO"
        },
        expectedFarrowDate: "2023-10-10",
        farrowing: {
          date: "2023-10-08",
          gestationLength: 112,
          type: "ASISTIDO",
          labourDurationHours: 6,
          observations: "Se aplicó oxitocina al final del parto."
        },
        litter: {
          totalBorn: 13,
          bornAlive: 12,
          stillborn: 1,
          mummies: 0,
          malformations: "",
          maleCount: 5,
          femaleCount: 7,
          birthWeightTotal: 17.3,
          piglets: [
            {
              id: "piglet-estrella-21",
              pigletId: 3,
              tagId: "LT-045-A",
              uniqueId: "EST-P2-L01",
              sex: "FEMALE",
              birthWeight: 1.32,
              status: "VIVO",
              statusDate: "2023-10-08",
              weaningWeight: 6.5,
              observations: "",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-11-04T09:00:00.000Z"
            },
            {
              id: "piglet-estrella-22",
              pigletId: 4,
              tagId: "LT-045-B",
              uniqueId: "EST-P2-L02",
              sex: "MALE",
              birthWeight: 1.44,
              status: "VIVO",
              statusDate: "2023-10-08",
              weaningWeight: 6.8,
              observations: "",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-11-04T09:00:00.000Z"
            },
            {
              id: "piglet-estrella-23",
              pigletId: 5,
              tagId: "LT-045-C",
              uniqueId: "EST-P2-L03",
              sex: "FEMALE",
              birthWeight: 1.38,
              status: "VIVO",
              statusDate: "2023-10-08",
              weaningWeight: 6.4,
              observations: "",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-11-04T09:00:00.000Z"
            },
            {
              id: "piglet-estrella-24",
              pigletId: 6,
              tagId: "LT-045-D",
              uniqueId: "EST-P2-L04",
              sex: "MALE",
              birthWeight: 1.29,
              status: "MUERTO",
              statusDate: "2023-10-15",
              statusDetail: "Muerte por diarrea neonatal día 7",
              weaningWeight: null,
              observations: "Se aplicó tratamiento antibiótico sin éxito",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-10-15T11:00:00.000Z"
            },
            {
              id: "piglet-estrella-25",
              pigletId: 7,
              tagId: "LT-045-E",
              uniqueId: "EST-P2-L05",
              sex: "FEMALE",
              birthWeight: 1.41,
              status: "VIVO",
              statusDate: "2023-10-08",
              weaningWeight: 6.6,
              observations: "",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-11-04T09:00:00.000Z"
            },
            {
              id: "piglet-estrella-26",
              pigletId: 8,
              tagId: "LT-045-F",
              uniqueId: "EST-P2-L06",
              sex: "MALE",
              birthWeight: 1.47,
              status: "VIVO",
              statusDate: "2023-10-08",
              weaningWeight: 6.9,
              observations: "",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-11-04T09:00:00.000Z"
            },
            {
              id: "piglet-estrella-27",
              pigletId: 9,
              tagId: "LT-045-G",
              uniqueId: "EST-P2-L07",
              sex: "FEMALE",
              birthWeight: 1.36,
              status: "VIVO",
              statusDate: "2023-10-08",
              weaningWeight: 6.3,
              observations: "",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-11-04T09:00:00.000Z"
            },
            {
              id: "piglet-estrella-28",
              pigletId: 10,
              tagId: "LT-045-H",
              uniqueId: "EST-P2-L08",
              sex: "MALE",
              birthWeight: 1.43,
              status: "VIVO",
              statusDate: "2023-10-08",
              weaningWeight: 6.7,
              observations: "",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-11-04T09:00:00.000Z"
            },
            {
              id: "piglet-estrella-29",
              pigletId: 11,
              tagId: "LT-045-I",
              uniqueId: "EST-P2-L09",
              sex: "FEMALE",
              birthWeight: 1.40,
              status: "VIVO",
              statusDate: "2023-10-08",
              weaningWeight: 6.5,
              observations: "",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-11-04T09:00:00.000Z"
            },
            {
              id: "piglet-estrella-30",
              pigletId: 12,
              tagId: "LT-045-J",
              uniqueId: "EST-P2-L10",
              sex: "MALE",
              birthWeight: 1.34,
              status: "VIVO",
              statusDate: "2023-10-08",
              weaningWeight: 6.4,
              observations: "",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-11-04T09:00:00.000Z"
            },
            {
              id: "piglet-estrella-31",
              pigletId: 13,
              tagId: "LT-045-K",
              uniqueId: "EST-P2-L11",
              sex: "FEMALE",
              birthWeight: 1.31,
              status: "VIVO",
              statusDate: "2023-10-08",
              weaningWeight: 6.2,
              observations: "",
              createdAt: "2023-10-08T07:00:00.000Z",
              updatedAt: "2023-11-04T09:00:00.000Z"
            }
          ]
        },
        lactation: {
          weaningDate: "2023-11-04",
          pigletsWeaned: 11,
          weaningWeightPerPiglet: 6.4,
          totalWeaningWeight: 70.4,
          durationDays: 27,
          mortalityNotes: "Se registró 1 muerte por diarrea neonatal.",
          adoptionsNotes: "",
          sowBodyCondition: "2.75",
          postWeaningEstrusDate: "2023-11-10",
          idcDays: 6
        },
        productivityIssues: {
          abortions: "",
          repeats: "",
          anestrus: ""
        },
        notes: "Buen desempeño general.",
        createdAt: "2023-10-08T07:00:00.000Z",
        updatedAt: "2023-11-10T10:00:00.000Z"
      }
    ],
    createdAt: "2022-02-15T09:00:00.000Z",
    updatedAt: "2024-04-02T11:00:00.000Z"
  },
  {
    id: 4,
    pigId: "CER-025",
    name: "Luna",
    alias: "Lunita",
    breed: "Duroc",
    birthDate: "2023-01-20",
    entryDate: "2023-04-10",
    origin: "INTERCAMBIO",
    status: "ACTIVE",
    location: "Sala Maternidad 2 - Jaula 8",
    fatherId: "VER-088",
    motherId: "CER-012",
    geneticLine: "Duroc Premium",
    generation: "F1",
    gender: "FEMALE",
    pigType: "REPRODUCTORA",
    weight: 195,
    averageDailyGain: 0.85,
    feedConsumption: 3.9,
    vaccinationsCount: 5,
    heatCycles: 2,
    litterCount: 2,
    parentId: null,
    notes: "Cerda con excelente temperamento y alta prolificidad.",
    photos: [],
    reproductiveRecords: [
      {
        id: "rec-luna-2",
        cycleNumber: 2,
        service: {
          date: "2024-05-15",
          type: "IAC",
          boarId: "VER-150",
          semenDose: "Dosis Duroc Elite 150-C",
          inseminator: "María Rodríguez",
          servicesCount: 2
        },
        pregnancyCheck: {
          date: "2024-06-10",
          method: "Ultrasonido",
          result: "POSITIVO"
        },
        expectedFarrowDate: "2024-09-06",
        farrowing: {
          date: "2024-09-07",
          gestationLength: 115,
          type: "NORMAL",
          labourDurationHours: 3.5,
          observations: "Parto nocturno sin intervención. Muy buena madre."
        },
        litter: {
          totalBorn: 14,
          bornAlive: 13,
          stillborn: 1,
          mummies: 0,
          malformations: "",
          maleCount: 7,
          femaleCount: 6,
          birthWeightTotal: 18.2,
          piglets: [
            {
              id: "piglet-luna-21",
              pigletId: 20,
              tagId: "LT-025-A",
              uniqueId: "LUN-P2-L01",
              sex: "MALE",
              birthWeight: 1.42,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.8,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-22",
              pigletId: 21,
              tagId: "LT-025-B",
              uniqueId: "LUN-P2-L02",
              sex: "FEMALE",
              birthWeight: 1.38,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.5,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-23",
              pigletId: 22,
              tagId: "LT-025-C",
              uniqueId: "LUN-P2-L03",
              sex: "MALE",
              birthWeight: 1.45,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 8.0,
              observations: "Lechón líder de la camada",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-24",
              pigletId: 23,
              tagId: "LT-025-D",
              uniqueId: "LUN-P2-L04",
              sex: "FEMALE",
              birthWeight: 1.40,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.6,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-25",
              pigletId: 24,
              tagId: "LT-025-E",
              uniqueId: "LUN-P2-L05",
              sex: "MALE",
              birthWeight: 1.36,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.4,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-26",
              pigletId: 25,
              tagId: "LT-025-F",
              uniqueId: "LUN-P2-L06",
              sex: "FEMALE",
              birthWeight: 1.33,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.2,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-27",
              pigletId: 26,
              tagId: "LT-025-G",
              uniqueId: "LUN-P2-L07",
              sex: "MALE",
              birthWeight: 1.44,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.7,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-28",
              pigletId: 27,
              tagId: "LT-025-H",
              uniqueId: "LUN-P2-L08",
              sex: "FEMALE",
              birthWeight: 1.39,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.3,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-29",
              pigletId: 28,
              tagId: "LT-025-I",
              uniqueId: "LUN-P2-L09",
              sex: "MALE",
              birthWeight: 1.41,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.6,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-30",
              pigletId: 29,
              tagId: "LT-025-J",
              uniqueId: "LUN-P2-L10",
              sex: "FEMALE",
              birthWeight: 1.37,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.1,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-31",
              pigletId: 30,
              tagId: "LT-025-K",
              uniqueId: "LUN-P2-L11",
              sex: "MALE",
              birthWeight: 1.43,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.5,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-32",
              pigletId: 31,
              tagId: "LT-025-L",
              uniqueId: "LUN-P2-L12",
              sex: "FEMALE",
              birthWeight: 1.35,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.0,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            },
            {
              id: "piglet-luna-33",
              pigletId: 32,
              tagId: "LT-025-M",
              uniqueId: "LUN-P2-L13",
              sex: "MALE",
              birthWeight: 1.39,
              status: "VIVO",
              statusDate: "2024-09-07",
              weaningWeight: 7.4,
              observations: "",
              createdAt: "2024-09-07T03:15:00.000Z",
              updatedAt: "2024-10-05T09:00:00.000Z"
            }
          ]
        },
        lactation: {
          weaningDate: "2024-10-05",
          pigletsWeaned: 13,
          weaningWeightPerPiglet: 7.5,
          totalWeaningWeight: 97.5,
          durationDays: 28,
          mortalityNotes: "Sin mortalidad en este ciclo.",
          adoptionsNotes: "",
          sowBodyCondition: "3.5",
          postWeaningEstrusDate: "2024-10-11",
          idcDays: 6
        },
        productivityIssues: {
          abortions: "",
          repeats: "",
          anestrus: ""
        },
        notes: "Excelente ciclo con 13 lechones destetados. La mejor camada hasta ahora.",
        createdAt: "2024-05-15T10:00:00.000Z",
        updatedAt: "2024-10-11T14:00:00.000Z"
      },
      {
        id: "rec-luna-1",
        cycleNumber: 1,
        service: {
          date: "2024-01-08",
          type: "IAC",
          boarId: "VER-120",
          semenDose: "Dosis 120-B",
          inseminator: "Laura Gómez",
          servicesCount: 2
        },
        pregnancyCheck: {
          date: "2024-02-02",
          method: "Ultrasonido",
          result: "POSITIVO"
        },
        expectedFarrowDate: "2024-05-01",
        farrowing: {
          date: "2024-05-02",
          gestationLength: 114,
          type: "NORMAL",
          labourDurationHours: 4,
          observations: "Primer parto exitoso."
        },
        litter: {
          totalBorn: 11,
          bornAlive: 10,
          stillborn: 0,
          mummies: 1,
          malformations: "",
          maleCount: 5,
          femaleCount: 5,
          birthWeightTotal: 14.5,
          piglets: [
            {
              id: "piglet-luna-11",
              pigletId: 14,
              tagId: "LT-025P1-A",
              uniqueId: "LUN-P1-L01",
              sex: "MALE",
              birthWeight: 1.48,
              status: "VIVO",
              statusDate: "2024-05-02",
              weaningWeight: 7.0,
              observations: "",
              createdAt: "2024-05-02T08:00:00.000Z",
              updatedAt: "2024-05-30T10:00:00.000Z"
            },
            {
              id: "piglet-luna-12",
              pigletId: 15,
              tagId: "LT-025P1-B",
              uniqueId: "LUN-P1-L02",
              sex: "FEMALE",
              birthWeight: 1.44,
              status: "VIVO",
              statusDate: "2024-05-02",
              weaningWeight: 6.8,
              observations: "",
              createdAt: "2024-05-02T08:00:00.000Z",
              updatedAt: "2024-05-30T10:00:00.000Z"
            },
            {
              id: "piglet-luna-13",
              pigletId: 16,
              tagId: "LT-025P1-C",
              uniqueId: "LUN-P1-L03",
              sex: "MALE",
              birthWeight: 1.39,
              status: "VIVO",
              statusDate: "2024-05-02",
              weaningWeight: 6.7,
              observations: "",
              createdAt: "2024-05-02T08:00:00.000Z",
              updatedAt: "2024-05-30T10:00:00.000Z"
            },
            {
              id: "piglet-luna-14",
              pigletId: 17,
              tagId: "LT-025P1-D",
              uniqueId: "LUN-P1-L04",
              sex: "FEMALE",
              birthWeight: 1.42,
              status: "VIVO",
              statusDate: "2024-05-02",
              weaningWeight: 6.9,
              observations: "",
              createdAt: "2024-05-02T08:00:00.000Z",
              updatedAt: "2024-05-30T10:00:00.000Z"
            },
            {
              id: "piglet-luna-15",
              pigletId: 18,
              tagId: "LT-025P1-E",
              uniqueId: "LUN-P1-L05",
              sex: "MALE",
              birthWeight: 1.50,
              status: "VIVO",
              statusDate: "2024-05-02",
              weaningWeight: 7.2,
              observations: "",
              createdAt: "2024-05-02T08:00:00.000Z",
              updatedAt: "2024-05-30T10:00:00.000Z"
            },
            {
              id: "piglet-luna-16",
              pigletId: 19,
              tagId: "LT-025P1-F",
              uniqueId: "LUN-P1-L06",
              sex: "FEMALE",
              birthWeight: 1.36,
              status: "VIVO",
              statusDate: "2024-05-02",
              weaningWeight: 6.6,
              observations: "",
              createdAt: "2024-05-02T08:00:00.000Z",
              updatedAt: "2024-05-30T10:00:00.000Z"
            },
            {
              id: "piglet-luna-17",
              pigletId: 20,
              tagId: "LT-025P1-G",
              uniqueId: "LUN-P1-L07",
              sex: "MALE",
              birthWeight: 1.47,
              status: "VIVO",
              statusDate: "2024-05-02",
              weaningWeight: 7.1,
              observations: "",
              createdAt: "2024-05-02T08:00:00.000Z",
              updatedAt: "2024-05-30T10:00:00.000Z"
            },
            {
              id: "piglet-luna-18",
              pigletId: 21,
              tagId: "LT-025P1-H",
              uniqueId: "LUN-P1-L08",
              sex: "FEMALE",
              birthWeight: 1.43,
              status: "VIVO",
              statusDate: "2024-05-02",
              weaningWeight: 6.9,
              observations: "",
              createdAt: "2024-05-02T08:00:00.000Z",
              updatedAt: "2024-05-30T10:00:00.000Z"
            },
            {
              id: "piglet-luna-19",
              pigletId: 22,
              tagId: "LT-025P1-I",
              uniqueId: "LUN-P1-L09",
              sex: "MALE",
              birthWeight: 1.41,
              status: "VIVO",
              statusDate: "2024-05-02",
              weaningWeight: 7.0,
              observations: "",
              createdAt: "2024-05-02T08:00:00.000Z",
              updatedAt: "2024-05-30T10:00:00.000Z"
            },
            {
              id: "piglet-luna-20",
              pigletId: 23,
              tagId: "LT-025P1-J",
              uniqueId: "LUN-P1-L10",
              sex: "FEMALE",
              birthWeight: 1.37,
              status: "VIVO",
              statusDate: "2024-05-02",
              weaningWeight: 6.8,
              observations: "",
              createdAt: "2024-05-02T08:00:00.000Z",
              updatedAt: "2024-05-30T10:00:00.000Z"
            }
          ]
        },
        lactation: {
          weaningDate: "2024-10-05",
          pigletsWeaned: 13,
          weaningWeightPerPiglet: 7.5,
          totalWeaningWeight: 97.5,
          durationDays: 28,
          mortalityNotes: "Sin mortalidad en este ciclo.",
          adoptionsNotes: "",
          sowBodyCondition: "3.5",
          postWeaningEstrusDate: "2024-10-11",
          idcDays: 6
        },
        productivityIssues: {
          abortions: "",
          repeats: "",
          anestrus: ""
        },
        notes: "Segundo parto excelente con 13 lechones destetados.",
        createdAt: "2024-05-15T10:00:00.000Z",
        updatedAt: "2024-10-11T14:00:00.000Z"
      }
    ],
    createdAt: "2023-04-10T09:00:00.000Z",
    updatedAt: "2024-10-11T14:00:00.000Z"
  }
];
const initialPigletCount = defaultPigs.reduce((total, sow) => {
  return total + (sow.reproductiveRecords || []).reduce((acc, record) => {
    return acc + (record.litter?.piglets?.length || 0);
  }, 0);
}, 0);


const defaultProductOutputs = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 6,
    notes: 'Distribución semanal a sala de maternidad.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultData = {
  version: 1,
  users: [TEST_USER],
  suppliers: defaultSuppliers,
  products: defaultProducts,
  pigs: defaultPigs,
  productOutputs: defaultProductOutputs,
  counters: {
    users: TEST_USER.id,
    suppliers: defaultSuppliers.length,
    products: defaultProducts.length,
    pigs: defaultPigs.length,
    productOutputs: defaultProductOutputs.length,
    piglets: initialPigletCount
  }

};

const clone = (value) => JSON.parse(JSON.stringify(value));

const generateId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id-${Math.random().toString(36).slice(2, 10)}`);

const ensureString = (value) => (value ?? '').toString().trim();

const ensureNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toISODate = (value) => {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : '';
};

const addDaysToDate = (value, days) => {
  const date = toDate(value);
  if (!date || !Number.isFinite(days)) return '';
  const copy = new Date(date.getTime());
  copy.setDate(copy.getDate() + Number(days));
  return copy.toISOString().slice(0, 10);
};

const diffInDays = (start, end) => {
  const startDate = toDate(start);
  const endDate = toDate(end);
  if (!startDate || !endDate) return null;
  const diff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  return Number.isNaN(diff) ? null : diff;
};

const findPigById = (pigs, id) => {
  const stringId = String(id);
  return pigs.find((item) => String(item.id) === stringId || String(item.pigId) === stringId);
};

const calculateExpectedFarrowDate = (serviceDate) => addDaysToDate(serviceDate, 114);

const normalizePhoto = (photo) => {
  if (!photo) {
    return {
      id: generateId(),
      url: '',
      label: '',
      capturedAt: ''
    };
  }

  return {
    id: photo.id || generateId(),
    url: ensureString(photo.url),
    label: ensureString(photo.label || photo.description),
    capturedAt: toISODate(photo.capturedAt || photo.takenAt)
  };
};

const normalizePiglet = (piglet) => {
  if (!piglet) {
    const now = new Date().toISOString();
    return {
      id: generateId(),
      referenceCycleId: null,
      uniqueId: '',
      sex: 'DESCONOCIDO',
      birthWeight: null,
      weaningWeight: null,
      status: 'VIVO',
      statusDate: '',
      statusDetail: '',
      notes: '',
      createdAt: now,
      updatedAt: now
    };
  }

  const created = piglet.createdAt || new Date().toISOString();
  const updated = piglet.updatedAt || created;

  return {
    id: piglet.id || generateId(),
    referenceCycleId: piglet.referenceCycleId || piglet.cycleId || null,
    uniqueId: ensureString(piglet.uniqueId || piglet.tagId || piglet.pigletId),
    tagId: ensureString(piglet.tagId || piglet.uniqueId || ''),
    pigletNumber: piglet.pigletNumber !== undefined
      ? Number(piglet.pigletNumber)
      : (piglet.pigletId !== undefined ? Number(piglet.pigletId) : null),
    sex: ensureString(piglet.sex || 'DESCONOCIDO').toUpperCase(),
    birthWeight: piglet.birthWeight !== undefined ? Number(piglet.birthWeight) : null,
    weaningWeight: piglet.weaningWeight !== undefined ? Number(piglet.weaningWeight) : null,
    status: ensureString(piglet.status || 'VIVO').toUpperCase(),
    statusDate: toISODate(piglet.statusDate),
    statusDetail: ensureString(piglet.statusDetail),
    notes: ensureString(piglet.notes || piglet.observations),
    createdAt: created,
    updatedAt: updated
  };
};

const normalizeReproductiveRecord = (record = {}) => {
  const now = new Date().toISOString();
  const serviceDate = toISODate(record.service?.date || record.serviceDate);
  const expectedFarrowDate = record.expectedFarrowDate || calculateExpectedFarrowDate(serviceDate);
  const actualFarrowDate = toISODate(record.farrowing?.date || record.farrowDate);
  const gestationLength = record.farrowing?.gestationLength ?? diffInDays(serviceDate, actualFarrowDate);

  const litterPiglets = Array.isArray(record.litter?.piglets)
    ? record.litter.piglets.map(normalizePiglet)
    : [];

  const birthWeights = litterPiglets
    .map((piglet) => Number(piglet.birthWeight))
    .filter((weight) => Number.isFinite(weight));

  const birthWeightTotal = record.litter?.birthWeightTotal ?? (birthWeights.length > 0
    ? Number(birthWeights.reduce((acc, value) => acc + value, 0).toFixed(2))
    : null);

  return {
    id: record.id || generateId(),
    cycleNumber: Number(record.cycleNumber) || null,
    service: {
      date: serviceDate,
      type: ensureString(record.service?.type || record.serviceType),
      boarId: ensureString(record.service?.boarId || record.boarId),
      semenDose: ensureString(record.service?.semenDose || record.semenDose),
      inseminator: ensureString(record.service?.inseminator || record.inseminator),
      servicesCount: Number(record.service?.servicesCount ?? record.servicesCount ?? 1)
    },
    pregnancyCheck: {
      date: toISODate(record.pregnancyCheck?.date || record.confirmationDate),
      method: ensureString(record.pregnancyCheck?.method || record.confirmationMethod),
      result: ensureString(record.pregnancyCheck?.result || record.pregnancyResult)
    },
    expectedFarrowDate,
    farrowing: {
      date: actualFarrowDate,
      gestationLength,
      type: ensureString(record.farrowing?.type || record.deliveryType || 'DESCONOCIDO').toUpperCase(),
      labourDurationHours: Number(record.farrowing?.labourDurationHours ?? record.deliveryDurationHours ?? 0),
      observations: ensureString(record.farrowing?.observations || record.deliveryNotes)
    },
    litter: {
      totalBorn: Number(record.litter?.totalBorn ?? record.totalBorn ?? 0),
      bornAlive: Number(record.litter?.bornAlive ?? record.bornAlive ?? 0),
      stillborn: Number(record.litter?.stillborn ?? record.stillborn ?? 0),
      mummies: Number(record.litter?.mummies ?? record.mummies ?? 0),
      malformations: ensureString(record.litter?.malformations || record.malformations || ''),
      maleCount: Number(record.litter?.maleCount ?? record.maleCount ?? 0),
      femaleCount: Number(record.litter?.femaleCount ?? record.femaleCount ?? 0),
      birthWeightTotal,
      piglets: litterPiglets
    },
    lactation: {
      weaningDate: toISODate(record.lactation?.weaningDate || record.weaningDate),
      pigletsWeaned: Number(record.lactation?.pigletsWeaned ?? record.weanedPiglets ?? 0),
      weaningWeightPerPiglet: record.lactation?.weaningWeightPerPiglet !== undefined
        ? Number(record.lactation.weaningWeightPerPiglet)
        : Number(record.weaningWeightPerPiglet ?? 0),
      totalWeaningWeight: record.lactation?.totalWeaningWeight !== undefined
        ? Number(record.lactation.totalWeaningWeight)
        : Number(record.totalWeaningWeight ?? 0),
      durationDays: Number(record.lactation?.durationDays ?? record.lactationDuration ?? diffInDays(record.farrowing?.date, record.lactation?.weaningDate) ?? 0),
      mortalityNotes: ensureString(record.lactation?.mortalityNotes || record.lactationMortalityNotes),
      adoptionsNotes: ensureString(record.lactation?.adoptionsNotes || record.adoptionsNotes),
      sowBodyCondition: ensureString(record.lactation?.sowBodyCondition || record.sowBodyCondition || ''),
      postWeaningEstrusDate: toISODate(record.lactation?.postWeaningEstrusDate),
      idcDays: Number(record.lactation?.idcDays ?? diffInDays(record.lactation?.weaningDate, record.lactation?.postWeaningEstrusDate) ?? 0)
    },
    productivityIssues: {
      abortions: ensureString(record.productivityIssues?.abortions || record.abortions || ''),
      repeats: ensureString(record.productivityIssues?.repeats || record.repeats || ''),
      anestrus: ensureString(record.productivityIssues?.anestrus || record.anestrus || '')
    },
    notes: ensureString(record.notes),
    createdAt: record.createdAt || now,
    updatedAt: record.updatedAt || now
  };
};

const normalizePig = (pig) => {
  if (!pig) return pig;

  const normalizedPig = {
    ...pig,
    alias: ensureString(pig.alias || pig.name || ''),
    entryDate: toISODate(pig.entryDate),
    origin: ensureString(pig.origin || ''),
    location: ensureString(pig.location || ''),
    fatherId: ensureString(pig.fatherId || ''),
    motherId: ensureString(pig.motherId || ''),
    geneticLine: ensureString(pig.geneticLine || ''),
    generation: ensureString(pig.generation || ''),
    status: ensureString(pig.status || 'ACTIVE').toUpperCase(),
    photos: Array.isArray(pig.photos) ? pig.photos.map(normalizePhoto) : [],
    reproductiveRecords: Array.isArray(pig.reproductiveRecords)
      ? pig.reproductiveRecords.map(normalizeReproductiveRecord)
      : [],
    piglets: Array.isArray(pig.piglets)
      ? pig.piglets.map(normalizePiglet)
      : []
  };

  if (!normalizedPig.createdAt) {
    normalizedPig.createdAt = new Date().toISOString();
  }
  normalizedPig.updatedAt = normalizedPig.updatedAt || normalizedPig.createdAt;

  // Mantener consistencia entre piglets planos y piglets por camada
  const pigletIds = new Set(normalizedPig.piglets.map((piglet) => piglet.id));
  normalizedPig.reproductiveRecords.forEach((record) => {
    record.litter.piglets.forEach((piglet) => {
      if (!pigletIds.has(piglet.id)) {
        pigletIds.add(piglet.id);
        normalizedPig.piglets.push(normalizePiglet({ ...piglet, referenceCycleId: record.id }));
      }
    });
  });

  normalizedPig.litterCount = normalizedPig.reproductiveRecords.length;

  return normalizedPig;
};


const getStorage = () => (typeof window !== 'undefined' ? window.localStorage : null);

const saveData = (data) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadData = () => {
  const storage = getStorage();
  if (!storage) {
    return clone(defaultData);
  }

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    storage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return clone(defaultData);
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...clone(defaultData),
      ...parsed,
      users: Array.isArray(parsed.users) ? parsed.users : clone(defaultData.users),
      suppliers: Array.isArray(parsed.suppliers) ? parsed.suppliers : clone(defaultData.suppliers),
      products: Array.isArray(parsed.products) ? parsed.products : clone(defaultData.products),
      pigs: Array.isArray(parsed.pigs) ? parsed.pigs : clone(defaultData.pigs),
      productOutputs: Array.isArray(parsed.productOutputs) ? parsed.productOutputs : clone(defaultData.productOutputs),
      counters: {
        ...clone(defaultData.counters),
        ...(parsed.counters || {})
      }
};
  } catch (error) {
    console.warn('No se pudo leer el almacenamiento local, se restauran valores iniciales.', error);
    storage.removeItem(STORAGE_KEY);
    storage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return clone(defaultData);
  }
};

const ensureArrays = (data) => {
  ['users', 'suppliers', 'products', 'pigs', 'productOutputs'].forEach((key) => {
    if (!Array.isArray(data[key])) {
      data[key] = clone(defaultData[key]);
    }
  });
};

const ensureCounters = (data) => {
  if (!data.counters || typeof data.counters !== 'object') {
    data.counters = clone(defaultData.counters);
  }

  ['users', 'suppliers', 'products', 'pigs', 'productOutputs'].forEach((key) => {
    const maxId = data[key].reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    if (!Number.isFinite(data.counters[key]) || data.counters[key] < maxId) {
      data.counters[key] = maxId;
    }
  });
  if (!Number.isFinite(data.counters.piglets)) {
    data.counters.piglets = initialPigletCount;
  }

  const pigletMaxId = data.pigs.reduce((max, sow) => {
    const records = Array.isArray(sow.reproductiveRecords) ? sow.reproductiveRecords : [];
    const recordMax = records.reduce((recordAcc, record) => {
      const piglets = record?.litter?.piglets || [];
      const pigletsMax = piglets.reduce((pigletAcc, piglet) => Math.max(pigletAcc, Number(piglet.pigletId) || 0), 0);
      return Math.max(recordAcc, pigletsMax);
    }, 0);
    return Math.max(max, recordMax);
  }, 0);

  if (!Number.isFinite(data.counters.piglets) || data.counters.piglets < pigletMaxId) {
    data.counters.piglets = pigletMaxId;
  }
};

const getNextId = (data, key) => {
  ensureCounters(data);
  const current = Number.isFinite(data.counters[key]) ? data.counters[key] : 0;
  const next = current + 1;
  data.counters[key] = next;
  return next;
};

const getDataSnapshot = () => {
  const data = loadData();
  ensureArrays(data);
  ensureCounters(data);

  const hasTestUser = data.users.some(
    (user) => user.email?.toLowerCase() === TEST_USER.email.toLowerCase()
  );

  let shouldPersist = false;

  if (!hasTestUser) {
    const id = getNextId(data, 'users');
    data.users.push({
      ...TEST_USER,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    shouldPersist = true;
  }

  if (shouldPersist) {
    saveData(data);
  }

  return data;
};

const updateData = (mutator) => {
  const data = getDataSnapshot();
  const result = mutator(data);
  saveData(data);
  return result;
};

const simulateNetwork = (payload, delay = NETWORK_DELAY) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(clone(payload)), delay);
  });

const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

const readResetTokens = () => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(RESET_TOKENS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('No se pudieron leer los tokens de restablecimiento.', error);
    storage.removeItem(RESET_TOKENS_KEY);
    return [];
  }
};

const saveResetTokens = (tokens) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
};

const generateResetToken = () =>
  `reset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const userService = {
  register: async (userData) => {
    const payload = updateData((data) => {
      const email = (userData.email || '').trim().toLowerCase();
      const code = (userData.code || '').trim();
      const idCard = (userData.idCard || '').trim();

      if (!email || !userData.password) {
        throw new Error('El correo y la contraseña son obligatorios');
      }

      if (data.users.some((user) => user.email.toLowerCase() === email)) {
        throw new Error('El correo electrónico ya está registrado');
      }

      if (code && data.users.some((user) => user.code === code)) {
        throw new Error('El código de usuario ya está registrado');
      }

      if (idCard && data.users.some((user) => user.idCard === idCard)) {
        throw new Error('El número de documento ya está registrado');
      }

      const id = getNextId(data, 'users');
      const now = new Date().toISOString();
      const newUser = {
        id,
        code,
        idCard,
        firstName: (userData.firstName || '').trim(),
        lastName: (userData.lastName || '').trim(),
        email,
        phone: (userData.phone || '').trim(),
        role: userData.role || 'PRACTICANTE',
        password: userData.password,
        createdAt: now,
        updatedAt: now
      };

      data.users.push(newUser);
      return sanitizeUser(newUser);
    });

    return simulateNetwork(payload);
  },

  getAllUsers: async () => {
    const data = getDataSnapshot();
    return simulateNetwork(data.users.map(sanitizeUser));
  },

  getUserById: async (id) => {
    const data = getDataSnapshot();
    const user = data.users.find((item) => item.id === Number(id));
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return simulateNetwork(sanitizeUser(user));
  },

  getUserByIdCard: async (idCard) => {
    const data = getDataSnapshot();
    const user = data.users.find((item) => item.idCard === idCard);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return simulateNetwork(sanitizeUser(user));
  },

  getUserByCode: async (code) => {
    const data = getDataSnapshot();
    const user = data.users.find((item) => item.code === code);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return simulateNetwork(sanitizeUser(user));
  },

  updateUser: async (id, userData) => {
    const payload = updateData((data) => {
      const user = data.users.find((item) => item.id === Number(id));
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const email = userData.email?.trim().toLowerCase();
      if (email && email !== user.email) {
        const duplicated = data.users.some(
          (item) => item.id !== user.id && item.email.toLowerCase() === email
        );
        if (duplicated) {
          throw new Error('El correo electrónico ya está registrado');
        }
        user.email = email;
      }

      if (userData.phone !== undefined) {
        user.phone = (userData.phone || '').trim();
      }
      if (userData.firstName !== undefined) {
        user.firstName = (userData.firstName || '').trim();
      }
      if (userData.lastName !== undefined) {
        user.lastName = (userData.lastName || '').trim();
      }

      user.updatedAt = new Date().toISOString();
      return sanitizeUser(user);
    });

    return simulateNetwork(payload);
  },

  updatePassword: async (id, passwordData) => {
    if (!passwordData?.password) {
      throw new Error('La nueva contraseña es obligatoria');
    }

    const payload = updateData((data) => {
      const user = data.users.find((item) => item.id === Number(id));
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      user.password = passwordData.password;
      user.updatedAt = new Date().toISOString();
      return { success: true };
    });

    return simulateNetwork(payload);
  },

  deleteUser: async (id) => {
    const payload = updateData((data) => {
      const index = data.users.findIndex((item) => item.id === Number(id));
      if (index === -1) {
        throw new Error('Usuario no encontrado');
      }
      const [removed] = data.users.splice(index, 1);
      return { success: true, removed: sanitizeUser(removed) };
    });

    return simulateNetwork(payload);
  },

  login: async (credentials) => {
    const email = (credentials.email || '').trim().toLowerCase();
    const data = getDataSnapshot();
    const user = data.users.find((item) => item.email.toLowerCase() === email);

    if (!user || user.password !== credentials.password) {
      throw new Error('Credenciales inválidas');
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    const storage = getStorage();
    if (storage) {
      storage.setItem('authToken', token);
      storage.setItem('user', JSON.stringify(sanitizeUser(user)));
    }

    return simulateNetwork({
      token,
      user: sanitizeUser(user)
    });
  },

  logout: async () => {
    const storage = getStorage();
    if (storage) {
      storage.removeItem('authToken');
      storage.removeItem('user');
    }
    return simulateNetwork({ success: true });
  },

  checkEmailAvailability: async (email) => {
    const data = getDataSnapshot();
    const exists = data.users.some(
      (user) => user.email.toLowerCase() === (email || '').trim().toLowerCase()
    );
    return simulateNetwork(!exists);
  },

  checkCodeAvailability: async (code) => {
    const data = getDataSnapshot();
    const exists = data.users.some((user) => user.code === (code || '').trim());
    return simulateNetwork(!exists);
  },

  checkIdCardAvailability: async (idCard) => {
    const data = getDataSnapshot();
    const exists = data.users.some((user) => user.idCard === (idCard || '').trim());
    return simulateNetwork(!exists);
  },

  requestPasswordReset: async (email) => {
    const data = getDataSnapshot();
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = data.users.find((item) => item.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw new Error('No se encontró un usuario con ese correo');
    }

    const tokens = readResetTokens().filter((token) => token.expiresAt > Date.now());
    const token = generateResetToken();
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hora

    tokens.push({ token, email: normalizedEmail, expiresAt });
    saveResetTokens(tokens);

    return simulateNetwork({ token, expiresAt, email: normalizedEmail });
  },

  validateResetToken: async (token) => {
    const tokens = readResetTokens().filter((entry) => entry.expiresAt > Date.now());
    const entry = tokens.find((item) => item.token === token);
    if (!entry) {
      throw new Error('Token inválido o expirado');
    }
    saveResetTokens(tokens);
    return simulateNetwork({ email: entry.email, expiresAt: entry.expiresAt });
  },

  resetPassword: async ({ token, password }) => {
    if (!token || !password) {
      throw new Error('Token y nueva contraseña son obligatorios');
    }

    const tokens = readResetTokens();
    const index = tokens.findIndex((item) => item.token === token);
    if (index === -1 || tokens[index].expiresAt <= Date.now()) {
      if (index !== -1) {
        tokens.splice(index, 1);
        saveResetTokens(tokens);
      }
      throw new Error('Token inválido o expirado');
    }

    const email = tokens[index].email;

    const payload = updateData((data) => {
      const user = data.users.find((item) => item.email.toLowerCase() === email);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      user.password = password;
      user.updatedAt = new Date().toISOString();
      return sanitizeUser(user);
    });

    tokens.splice(index, 1);
    saveResetTokens(tokens);

    return simulateNetwork(payload);
  }
};

export const productService = {
  createProduct: async (productData) => {
    const payload = updateData((data) => {
      const productId = (productData.productId || '').trim();
      const name = (productData.name || '').trim();

      if (!productId || !name) {
        throw new Error('El ID y el nombre del producto son obligatorios');
      }

      if (data.products.some((product) => product.productId === productId)) {
        throw new Error('El ID del producto ya está registrado');
      }

      if (data.products.some((product) => product.name.toLowerCase() === name.toLowerCase())) {
        throw new Error('El nombre del producto ya está registrado');
      }

      const id = getNextId(data, 'products');
      const now = new Date().toISOString();

      const newProduct = {
        id,
        productId,
        name,
        description: (productData.description || '').trim(),
        unitPrice: Number(productData.unitPrice) || 0,
        stock: Number(productData.stock) || 0,
        productType: (productData.productType || '').trim().toUpperCase(),
        supplierId: Number(productData.supplierId) || null,
        createdAt: now,
        updatedAt: now
      };

      data.products.push(newProduct);
      return newProduct;
    });

    return simulateNetwork(payload);
  },

  getAllProducts: async () => {
    const data = getDataSnapshot();
    return simulateNetwork(data.products);
  },

  getProductById: async (id) => {
    const data = getDataSnapshot();
    const product = data.products.find((item) => item.id === Number(id));
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return simulateNetwork(product);
  },

  updateProduct: async (id, productData) => {
    const payload = updateData((data) => {
      const product = data.products.find((item) => item.id === Number(id));
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      const newProductId = (productData.productId || '').trim();
      const newName = (productData.name || '').trim();

      if (!newProductId || !newName) {
        throw new Error('El ID y el nombre del producto son obligatorios');
      }

      const duplicateId = data.products.some(
        (item) => item.id !== product.id && item.productId === newProductId
      );
      if (duplicateId) {
        throw new Error('El ID del producto ya está registrado');
      }

      const duplicateName = data.products.some(
        (item) => item.id !== product.id && item.name.toLowerCase() === newName.toLowerCase()
      );
      if (duplicateName) {
        throw new Error('El nombre del producto ya está registrado');
      }

      product.productId = newProductId;
      product.name = newName;
      product.description = (productData.description || '').trim();
      product.unitPrice = Number(productData.unitPrice) || 0;
      product.stock = Number(productData.stock) || 0;
      product.productType = (productData.productType || '').trim().toUpperCase();
      product.supplierId = Number(productData.supplierId) || null;
      product.updatedAt = new Date().toISOString();

      return product;
    });

    return simulateNetwork(payload);
  },

  deleteProduct: async (id) => {
    const payload = updateData((data) => {
      const index = data.products.findIndex((item) => item.id === Number(id));
      if (index === -1) {
        throw new Error('Producto no encontrado');
      }
      data.products.splice(index, 1);
      return { success: true };
    });

    return simulateNetwork(payload);
  }
};

export const supplierService = {
  createSupplier: async (supplierData) => {
    const payload = updateData((data) => {
      const supplierId = (supplierData.supplierId || '').trim();
      const email = (supplierData.email || '').trim().toLowerCase();
      const nit = (supplierData.nit || '').trim();

      if (!supplierId || !supplierData.name) {
        throw new Error('El ID y el nombre del proveedor son obligatorios');
      }

      if (data.suppliers.some((supplier) => supplier.supplierId === supplierId)) {
        throw new Error('El ID del proveedor ya está registrado');
      }

      if (email && data.suppliers.some((supplier) => supplier.email?.toLowerCase() === email)) {
        throw new Error('El correo del proveedor ya está registrado');
      }

      if (nit && data.suppliers.some((supplier) => supplier.nit === nit)) {
        throw new Error('El NIT del proveedor ya está registrado');
      }

      const id = getNextId(data, 'suppliers');
      const now = new Date().toISOString();

      const newSupplier = {
        id,
        supplierId,
        name: (supplierData.name || '').trim(),
        phone: (supplierData.phone || '').trim(),
        email,
        cityId: (supplierData.cityId || '').trim(),
        stateId: (supplierData.stateId || '').trim(),
        countryId: (supplierData.countryId || '').trim(),
        nit,
        address: (supplierData.address || '').trim(),
        createdAt: now,
        updatedAt: now
      };

      data.suppliers.push(newSupplier);
      return newSupplier;
    });

    return simulateNetwork(payload);
  },

  getAllSuppliers: async () => {
    const data = getDataSnapshot();
    return simulateNetwork(data.suppliers);
  },

  getSupplierById: async (id) => {
    const data = getDataSnapshot();
    const supplier = data.suppliers.find((item) => item.id === Number(id));
    if (!supplier) {
      throw new Error('Proveedor no encontrado');
    }
    return simulateNetwork(supplier);
  },

  updateSupplier: async (id, supplierData) => {
    const payload = updateData((data) => {
      const supplier = data.suppliers.find((item) => item.id === Number(id));
      if (!supplier) {
        throw new Error('Proveedor no encontrado');
      }

      const newSupplierId = (supplierData.supplierId || '').trim();
      const newEmail = (supplierData.email || '').trim().toLowerCase();
      const newNit = (supplierData.nit || '').trim();

      if (!newSupplierId || !supplierData.name) {
        throw new Error('El ID y el nombre del proveedor son obligatorios');
      }

      const duplicateId = data.suppliers.some(
        (item) => item.id !== supplier.id && item.supplierId === newSupplierId
      );
      if (duplicateId) {
        throw new Error('El ID del proveedor ya está registrado');
      }

      const duplicateEmail = newEmail && data.suppliers.some(
        (item) => item.id !== supplier.id && item.email?.toLowerCase() === newEmail
      );
      if (duplicateEmail) {
        throw new Error('El correo del proveedor ya está registrado');
      }

      const duplicateNit = newNit && data.suppliers.some(
        (item) => item.id !== supplier.id && item.nit === newNit
      );
      if (duplicateNit) {
        throw new Error('El NIT del proveedor ya está registrado');
      }

      supplier.supplierId = newSupplierId;
      supplier.name = (supplierData.name || '').trim();
      supplier.phone = (supplierData.phone || '').trim();
      supplier.email = newEmail;
      supplier.cityId = (supplierData.cityId || '').trim();
      supplier.stateId = (supplierData.stateId || '').trim();
      supplier.countryId = (supplierData.countryId || '').trim();
      supplier.nit = newNit;
      supplier.address = (supplierData.address || '').trim();
      supplier.updatedAt = new Date().toISOString();

      return supplier;
    });

    return simulateNetwork(payload);
  },

  deleteSupplier: async (id) => {
    const payload = updateData((data) => {
      const index = data.suppliers.findIndex((item) => item.id === Number(id));
      if (index === -1) {
        throw new Error('Proveedor no encontrado');
      }
      data.suppliers.splice(index, 1);
      return { success: true };
    });

    return simulateNetwork(payload);
  }
};

export const pigService = {
  createPig: async (pigData) => {
    const payload = updateData((data) => {
      const pigId = (pigData.pigId || '').trim();
      const name = (pigData.name || '').trim();

      if (!pigId || !name) {
        throw new Error('El ID interno y el nombre del cerdo son obligatorios');
      }

      if (data.pigs.some((pig) => pig.pigId === pigId)) {
        throw new Error('El ID del cerdo ya está registrado');
      }

      const id = getNextId(data, 'pigs');
      const now = new Date().toISOString();

      const newPigRaw = {
        id,
        pigId,
        name,
        alias: pigData.alias ?? pigData.name ?? '',
        breed: (pigData.breed || '').trim(),
        entryDate: toISODate(pigData.entryDate) || '',
        origin: ensureString(pigData.origin || ''),
        location: ensureString(pigData.location || ''),
        fatherId: ensureString(pigData.fatherId || ''),
        motherId: ensureString(pigData.motherId || ''),
        geneticLine: ensureString(pigData.geneticLine || ''),
        generation: ensureString(pigData.generation || ''),
        birthDate: toISODate(pigData.birthDate) || '',
        gender: (pigData.gender || '').trim().toUpperCase(),
        pigType: (pigData.pigType || 'ENGORDE').trim().toUpperCase(),
        weight: Number(pigData.weight) || 0,
        averageDailyGain: Number(pigData.averageDailyGain ?? pigData.milkProduction ?? 0),
        feedConsumption: Number(pigData.feedConsumption ?? pigData.foodConsumption ?? 0),
        vaccinationsCount: Number(pigData.vaccinationsCount) || 0,
        heatCycles: Number(pigData.heatCycles ?? pigData.heatPeriods ?? 0),
        litterCount: Number(pigData.litterCount ?? pigData.offspringCount ?? 0),
        parentId: pigData.parentId || null,
        status: (pigData.status || 'ACTIVE').trim().toUpperCase(),
        notes: (pigData.notes || '').trim(),
        photos: Array.isArray(pigData.photos) ? pigData.photos.map(normalizePhoto) : [],
        reproductiveRecords: Array.isArray(pigData.reproductiveRecords)
          ? pigData.reproductiveRecords.map(normalizeReproductiveRecord)
          : [],
        piglets: Array.isArray(pigData.piglets) ? pigData.piglets.map(normalizePiglet) : [],
        createdAt: now,
        updatedAt: now
      };

      const newPig = normalizePig(newPigRaw);
      newPig.createdAt = now;
      newPig.updatedAt = now;

      data.pigs.push(newPig);
      return newPig;
    });

    return simulateNetwork(payload);
  },

  getAllPigs: async () => {
    const data = getDataSnapshot();
    return simulateNetwork(data.pigs.map(normalizePig));
  },

  getPigById: async (id) => {
    const data = getDataSnapshot();
    const pig = findPigById(data.pigs, id);
    if (!pig) {
      throw new Error('Cerdo no encontrado');
    }
    return simulateNetwork(normalizePig(pig));
  },

  updatePig: async (id, pigData) => {
    const payload = updateData((data) => {
      const pig = findPigById(data.pigs, id);
      if (!pig) {
        throw new Error('Cerdo no encontrado');
      }

      const newPigId = (pigData.pigId || '').trim();
      const newName = (pigData.name || '').trim();

      if (!newPigId || !newName) {
        throw new Error('El ID y el nombre del cerdo son obligatorios');
      }

      const duplicateId = data.pigs.some(
        (item) => item.id !== pig.id && item.pigId === newPigId
      );
      if (duplicateId) {
        throw new Error('El ID del cerdo ya está registrado');
      }

      pig.pigId = newPigId;
      pig.name = newName;
      if (pigData.alias !== undefined) pig.alias = ensureString(pigData.alias);
      if (pigData.breed !== undefined) pig.breed = (pigData.breed || '').trim();
      if (pigData.entryDate !== undefined) pig.entryDate = toISODate(pigData.entryDate);
      if (pigData.origin !== undefined) pig.origin = ensureString(pigData.origin);
      if (pigData.location !== undefined) pig.location = ensureString(pigData.location);
      if (pigData.fatherId !== undefined) pig.fatherId = ensureString(pigData.fatherId);
      if (pigData.motherId !== undefined) pig.motherId = ensureString(pigData.motherId);
      if (pigData.geneticLine !== undefined) pig.geneticLine = ensureString(pigData.geneticLine);
      if (pigData.generation !== undefined) pig.generation = ensureString(pigData.generation);
      if (pigData.birthDate !== undefined) pig.birthDate = toISODate(pigData.birthDate);
      if (pigData.gender !== undefined) pig.gender = (pigData.gender || '').trim().toUpperCase();
      if (pigData.pigType !== undefined) pig.pigType = (pigData.pigType || 'ENGORDE').trim().toUpperCase();
      if (pigData.weight !== undefined) pig.weight = Number(pigData.weight) || 0;
      if (pigData.averageDailyGain !== undefined || pigData.milkProduction !== undefined) {
        pig.averageDailyGain = Number(pigData.averageDailyGain ?? pigData.milkProduction ?? 0);
      }
      if (pigData.feedConsumption !== undefined || pigData.foodConsumption !== undefined) {
        pig.feedConsumption = Number(pigData.feedConsumption ?? pigData.foodConsumption ?? 0);
      }
      if (pigData.vaccinationsCount !== undefined) pig.vaccinationsCount = Number(pigData.vaccinationsCount) || 0;
      if (pigData.heatCycles !== undefined || pigData.heatPeriods !== undefined) {
        pig.heatCycles = Number(pigData.heatCycles ?? pigData.heatPeriods ?? 0);
      }
      if (pigData.litterCount !== undefined || pigData.offspringCount !== undefined) {
        pig.litterCount = Number(pigData.litterCount ?? pigData.offspringCount ?? pig.reproductiveRecords?.length ?? 0);
      }
      if (pigData.parentId !== undefined) pig.parentId = pigData.parentId || null;
      if (pigData.status !== undefined) pig.status = (pigData.status || 'ACTIVE').trim().toUpperCase();
      if (pigData.notes !== undefined) pig.notes = (pigData.notes || '').trim();
      if (Array.isArray(pigData.photos)) {
        pig.photos = pigData.photos.map(normalizePhoto);
      }
      pig.updatedAt = new Date().toISOString();

      return normalizePig(pig);
    });

    return simulateNetwork(payload);
  },

  addPhoto: async (id, photoData) => {
    const payload = updateData((data) => {
      const pig = findPigById(data.pigs, id);
      if (!pig) {
        throw new Error('Cerdo no encontrado');
      }

      if (!Array.isArray(pig.photos)) {
        pig.photos = [];
      }

      const photo = normalizePhoto({
        id: photoData?.id || generateId(),
        url: photoData?.url || photoData?.dataUrl || '',
        label: photoData?.label || photoData?.description || '',
        capturedAt: photoData?.capturedAt || photoData?.takenAt || photoData?.date || ''
      });

      pig.photos.push(photo);
      pig.updatedAt = new Date().toISOString();

      return normalizePig(pig);
    });

    return simulateNetwork(payload);
  },

  removePhoto: async (id, photoId) => {
    const payload = updateData((data) => {
      const pig = findPigById(data.pigs, id);
      if (!pig) {
        throw new Error('Cerdo no encontrado');
      }

      if (Array.isArray(pig.photos)) {
        pig.photos = pig.photos.filter((photo) => String(photo.id) !== String(photoId));
      }

      pig.updatedAt = new Date().toISOString();
      return normalizePig(pig);
    });

    return simulateNetwork(payload);
  },

  addReproductiveRecord: async (id, recordData) => {
    const payload = updateData((data) => {
      const pig = findPigById(data.pigs, id);
      if (!pig) {
        throw new Error('Cerda no encontrada');
      }

      if (!Array.isArray(pig.reproductiveRecords)) {
        pig.reproductiveRecords = [];
      }

      const preparedRecord = {
        ...recordData,
        id: recordData?.id || generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (preparedRecord.litter?.piglets) {
        preparedRecord.litter.piglets = preparedRecord.litter.piglets.map((piglet) => ({
          ...piglet,
          referenceCycleId: preparedRecord.id
        }));
      }

      const normalizedRecord = normalizeReproductiveRecord(preparedRecord);
      pig.reproductiveRecords.unshift(normalizedRecord);
      pig.litterCount = pig.reproductiveRecords.length;

      if (!Array.isArray(pig.piglets)) {
        pig.piglets = [];
      }
      normalizedRecord.litter.piglets.forEach((piglet) => {
        pig.piglets.push(normalizePiglet({ ...piglet, referenceCycleId: normalizedRecord.id }));
      });

      pig.updatedAt = new Date().toISOString();
      return normalizePig(pig);
    });

    return simulateNetwork(payload);
  },

  updateReproductiveRecord: async (pigId, recordId, recordData) => {
    const payload = updateData((data) => {
      const pig = findPigById(data.pigs, pigId);
      if (!pig) {
        throw new Error('Cerda no encontrada');
      }

      if (!Array.isArray(pig.reproductiveRecords)) {
        pig.reproductiveRecords = [];
      }

      const index = pig.reproductiveRecords.findIndex((record) => String(record.id) === String(recordId));
      if (index === -1) {
        throw new Error('Registro reproductivo no encontrado');
      }

      const existingRecord = pig.reproductiveRecords[index];

      const mergedRecord = {
        ...existingRecord,
        ...recordData,
        service: {
          ...existingRecord.service,
          ...(recordData.service || {}),
          date: recordData.service?.date || recordData.serviceDate || existingRecord.service?.date
        },
        pregnancyCheck: {
          ...existingRecord.pregnancyCheck,
          ...(recordData.pregnancyCheck || {})
        },
        farrowing: {
          ...existingRecord.farrowing,
          ...(recordData.farrowing || {})
        },
        litter: {
          ...existingRecord.litter,
          ...(recordData.litter || {}),
          piglets: Array.isArray(recordData.litter?.piglets)
            ? recordData.litter.piglets
            : existingRecord.litter?.piglets || []
        },
        lactation: {
          ...existingRecord.lactation,
          ...(recordData.lactation || {})
        },
        productivityIssues: {
          ...existingRecord.productivityIssues,
          ...(recordData.productivityIssues || {})
        },
        id: existingRecord.id,
        updatedAt: new Date().toISOString()
      };

      if (Array.isArray(mergedRecord.litter?.piglets)) {
        mergedRecord.litter.piglets = mergedRecord.litter.piglets.map((piglet) => ({
          ...piglet,
          referenceCycleId: existingRecord.id
        }));
      }

      const normalizedRecord = normalizeReproductiveRecord(mergedRecord);
      pig.reproductiveRecords[index] = normalizedRecord;

      if (!Array.isArray(pig.piglets)) {
        pig.piglets = [];
      }

      // Sincronizar piglets planos con el registro actualizado
      pig.piglets = pig.piglets.filter((piglet) => piglet.referenceCycleId !== normalizedRecord.id);
      normalizedRecord.litter.piglets.forEach((piglet) => {
        pig.piglets.push(normalizePiglet({ ...piglet, referenceCycleId: normalizedRecord.id }));
      });

      pig.updatedAt = new Date().toISOString();
      pig.litterCount = pig.reproductiveRecords.length;
      return normalizePig(pig);
    });

    return simulateNetwork(payload);
  },

  deleteReproductiveRecord: async (pigId, recordId) => {
    const payload = updateData((data) => {
      const pig = findPigById(data.pigs, pigId);
      if (!pig) {
        throw new Error('Cerda no encontrada');
      }

      const initialLength = Array.isArray(pig.reproductiveRecords) ? pig.reproductiveRecords.length : 0;
      pig.reproductiveRecords = (pig.reproductiveRecords || []).filter((record) => String(record.id) !== String(recordId));

      if (initialLength === pig.reproductiveRecords.length) {
        throw new Error('Registro reproductivo no encontrado');
      }

      if (Array.isArray(pig.piglets)) {
        pig.piglets = pig.piglets.filter((piglet) => piglet.referenceCycleId !== recordId);
      }

      pig.updatedAt = new Date().toISOString();
      pig.litterCount = pig.reproductiveRecords.length;
      return normalizePig(pig);
    });

    return simulateNetwork(payload);
  },

  addPiglet: async (pigId, pigletData) => {
    const payload = updateData((data) => {
      const pig = findPigById(data.pigs, pigId);
      if (!pig) {
        throw new Error('Cerda no encontrada');
      }

      if (!Array.isArray(pig.piglets)) {
        pig.piglets = [];
      }

      const sequentialId = getNextId(data, 'piglets');
      const newPigletRaw = {
        ...pigletData,
        id: pigletData?.id || generateId(),
        pigletNumber: pigletData?.pigletNumber ?? sequentialId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const newPiglet = normalizePiglet(newPigletRaw);
      pig.piglets.push(newPiglet);

      if (!Array.isArray(pig.reproductiveRecords)) {
        pig.reproductiveRecords = [];
      }

      if (newPiglet.referenceCycleId) {
        const record = pig.reproductiveRecords.find((item) => String(item.id) === String(newPiglet.referenceCycleId));
        if (record) {
          if (!Array.isArray(record.litter?.piglets)) {
            record.litter = {
              ...(record.litter || {}),
              piglets: []
            };
          }
          record.litter.piglets.push(newPiglet);
          record.litter.totalBorn = record.litter.piglets.length;
          record.litter.bornAlive = record.litter.piglets.filter((piglet) => piglet.status === 'VIVO').length;
          record.updatedAt = new Date().toISOString();
        }
      }

      pig.updatedAt = new Date().toISOString();
      return normalizePig(pig);
    });

    return simulateNetwork(payload);
  },

  updatePiglet: async (pigId, pigletId, pigletData) => {
    const payload = updateData((data) => {
      const pig = findPigById(data.pigs, pigId);
      if (!pig) {
        throw new Error('Cerda no encontrada');
      }

      if (!Array.isArray(pig.piglets)) {
        throw new Error('No existen crías registradas para esta cerda');
      }

      const index = pig.piglets.findIndex((piglet) => String(piglet.id) === String(pigletId));
      if (index === -1) {
        throw new Error('Cría no encontrada');
      }

      const existingPiglet = pig.piglets[index];
      const mergedPiglet = normalizePiglet({
        ...existingPiglet,
        ...pigletData,
        id: existingPiglet.id,
        referenceCycleId: pigletData.referenceCycleId !== undefined
          ? pigletData.referenceCycleId
          : existingPiglet.referenceCycleId,
        updatedAt: new Date().toISOString()
      });

      pig.piglets[index] = mergedPiglet;

      if (Array.isArray(pig.reproductiveRecords)) {
        pig.reproductiveRecords = pig.reproductiveRecords.map((record) => {
          if (String(record.id) === String(existingPiglet.referenceCycleId)) {
            record.litter.piglets = record.litter.piglets.filter((piglet) => String(piglet.id) !== String(existingPiglet.id));
          }
          if (String(record.id) === String(mergedPiglet.referenceCycleId)) {
            if (!Array.isArray(record.litter.piglets)) {
              record.litter.piglets = [];
            }
            record.litter.piglets.push(mergedPiglet);
            record.litter.totalBorn = record.litter.piglets.length;
            record.litter.bornAlive = record.litter.piglets.filter((piglet) => piglet.status === 'VIVO').length;
            record.updatedAt = new Date().toISOString();
          }
          return record;
        });
      }

      pig.updatedAt = new Date().toISOString();
      return normalizePig(pig);
    });

    return simulateNetwork(payload);
  },

  deletePiglet: async (pigId, pigletId) => {
    const payload = updateData((data) => {
      const pig = findPigById(data.pigs, pigId);
      if (!pig) {
        throw new Error('Cerda no encontrada');
      }

      const previousLength = Array.isArray(pig.piglets) ? pig.piglets.length : 0;
      pig.piglets = (pig.piglets || []).filter((piglet) => String(piglet.id) !== String(pigletId));

      if (previousLength === pig.piglets.length) {
        throw new Error('Cría no encontrada');
      }

      if (Array.isArray(pig.reproductiveRecords)) {
        pig.reproductiveRecords = pig.reproductiveRecords.map((record) => {
          if (Array.isArray(record.litter?.piglets)) {
            record.litter.piglets = record.litter.piglets.filter((piglet) => String(piglet.id) !== String(pigletId));
            record.litter.totalBorn = record.litter.piglets.length;
            record.litter.bornAlive = record.litter.piglets.filter((piglet) => piglet.status === 'VIVO').length;
          }
          return record;
        });
      }

      pig.updatedAt = new Date().toISOString();
      return normalizePig(pig);
    });

    return simulateNetwork(payload);
  },

  deletePig: async (id) => {
    const payload = updateData((data) => {
      const targetIndex = data.pigs.findIndex((item) => String(item.id) === String(id) || String(item.pigId) === String(id));
      const index = targetIndex;
      if (index === -1) {
        throw new Error('Cerdo no encontrado');
      }
      data.pigs.splice(index, 1);
      return { success: true };
    });

    return simulateNetwork(payload);
  }
};

export const productOutputService = {
  createProductOutput: async (outputData) => {
    const payload = updateData((data) => {
      const userId = Number(outputData.userId);
      const productId = Number(outputData.productId);
      const quantity = Number(outputData.quantity);

      if (!userId || !productId || !quantity) {
        throw new Error('Usuario, producto y cantidad son obligatorios');
      }

      const userExists = data.users.some((user) => user.id === userId);
      const productExists = data.products.some((product) => product.id === productId);

      if (!userExists) {
        throw new Error('El usuario seleccionado no existe');
      }

      if (!productExists) {
        throw new Error('El producto seleccionado no existe');
      }

      const id = getNextId(data, 'productOutputs');
      const now = new Date().toISOString();

      const newOutput = {
        id,
        userId,
        productId,
        quantity,
        notes: (outputData.notes || '').trim(),
        createdAt: now,
        updatedAt: now
      };

      data.productOutputs.push(newOutput);
      return newOutput;
    });

    return simulateNetwork(payload);
  },

  getAllProductOutputs: async () => {
    const data = getDataSnapshot();
    return simulateNetwork(data.productOutputs);
  },

  getProductOutputById: async (id) => {
    const data = getDataSnapshot();
    const output = data.productOutputs.find((item) => item.id === Number(id));
    if (!output) {
      throw new Error('Registro no encontrado');
    }
    return simulateNetwork(output);
  },

  getOutputsByProduct: async (productId) => {
    const data = getDataSnapshot();
    const filtered = data.productOutputs.filter((item) => item.productId === Number(productId));
    return simulateNetwork(filtered);
  },

  getOutputsByUser: async (userId) => {
    const data = getDataSnapshot();
    const filtered = data.productOutputs.filter((item) => item.userId === Number(userId));
    return simulateNetwork(filtered);
  },

  updateProductOutput: async (id, outputData) => {
    const payload = updateData((data) => {
      const output = data.productOutputs.find((item) => item.id === Number(id));
      if (!output) {
        throw new Error('Registro no encontrado');
      }

      const userId = Number(outputData.userId);
      const productId = Number(outputData.productId);
      const quantity = Number(outputData.quantity);

      if (!userId || !productId || !quantity) {
        throw new Error('Usuario, producto y cantidad son obligatorios');
      }

      const userExists = data.users.some((user) => user.id === userId);
      const productExists = data.products.some((product) => product.id === productId);

      if (!userExists) {
        throw new Error('El usuario seleccionado no existe');
      }

      if (!productExists) {
        throw new Error('El producto seleccionado no existe');
      }

      output.userId = userId;
      output.productId = productId;
      output.quantity = quantity;
      output.notes = (outputData.notes || '').trim();
      output.updatedAt = new Date().toISOString();

      return output;
    });

    return simulateNetwork(payload);
  },

  deleteProductOutput: async (id) => {
    const payload = updateData((data) => {
      const index = data.productOutputs.findIndex((item) => item.id === Number(id));
      if (index === -1) {
        throw new Error('Registro no encontrado');
      }
      data.productOutputs.splice(index, 1);
      return { success: true };
    });

    return simulateNetwork(payload);
  }
};

// Funciones auxiliares para cálculos reproductivos
const calculateReproductiveParameters = (pigs) => {
  const reproductoras = pigs.filter(p => p.gender === "FEMALE" && p.pigType === "REPRODUCTORA" && p.status === "ACTIVE");
  
  const individualParams = reproductoras.map(sow => {
    const records = (sow.reproductiveRecords || []).filter(r => r.farrowing?.date);
    if (records.length === 0) return null;
    
    const sortedRecords = [...records].sort((a, b) => {
      const dateA = new Date(a.farrowing.date);
      const dateB = new Date(b.farrowing.date);
      return dateB - dateA;
    });
    
    // Intervalo entre partos (IEP)
    let iep = null;
    if (sortedRecords.length > 1) {
      const intervals = [];
      for (let i = 1; i < sortedRecords.length; i++) {
        const date1 = new Date(sortedRecords[i - 1].farrowing.date);
        const date2 = new Date(sortedRecords[i].farrowing.date);
        const days = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        intervals.push(days);
      }
      iep = intervals.length > 0 ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) : null;
    }
    
    // Partos por cerda por año
    const firstFarrow = sortedRecords[sortedRecords.length - 1]?.farrowing?.date;
    const lastFarrow = sortedRecords[0]?.farrowing?.date;
    let birthsPerYear = null;
    if (firstFarrow && lastFarrow) {
      const daysDiff = Math.floor((new Date(lastFarrow) - new Date(firstFarrow)) / (1000 * 60 * 60 * 24));
      if (daysDiff > 0) {
        birthsPerYear = ((sortedRecords.length / daysDiff) * 365).toFixed(2);
      }
    }
    
    // Lechones nacidos vivos promedio
    const bornAliveAvg = records.length > 0 
      ? (records.reduce((sum, r) => sum + (r.litter?.bornAlive || 0), 0) / records.length).toFixed(2)
      : 0;
    
    // Lechones destetados promedio
    const weanedAvg = records.length > 0
      ? (records.reduce((sum, r) => sum + (r.lactation?.pigletsWeaned || 0), 0) / records.length).toFixed(2)
      : 0;
    
    // Lechones destetados por año
    let weanedPerYear = null;
    if (birthsPerYear && weanedAvg) {
      weanedPerYear = (parseFloat(birthsPerYear) * parseFloat(weanedAvg)).toFixed(2);
    }
    
    // Días no productivos (DNP)
    const today = new Date();
    const lastFarrowDate = sortedRecords[0]?.farrowing?.date;
    let dnp = null;
    if (lastFarrowDate) {
      const lastService = sortedRecords[0]?.service?.date;
      if (lastService) {
        const serviceDate = new Date(lastService);
        const daysSinceService = Math.floor((today - serviceDate) / (1000 * 60 * 60 * 24));
        dnp = daysSinceService;
      }
    }
    
    // Mortalidad en lactancia (%)
    const totalBorn = records.reduce((sum, r) => sum + (r.litter?.bornAlive || 0), 0);
    const totalWeaned = records.reduce((sum, r) => sum + (r.lactation?.pigletsWeaned || 0), 0);
    const mortalityRate = totalBorn > 0 ? ((totalBorn - totalWeaned) / totalBorn * 100).toFixed(2) : 0;
    
    // Peso promedio al destete
    const totalWeaningWeight = records.reduce((sum, r) => sum + (r.lactation?.totalWeaningWeight || 0), 0);
    const avgWeaningWeight = totalWeaned > 0 ? (totalWeaningWeight / totalWeaned).toFixed(2) : 0;
    
    return {
      sowId: sow.id,
      pigId: sow.pigId,
      name: sow.name,
      iep,
      birthsPerYear,
      bornAliveAvg: parseFloat(bornAliveAvg),
      weanedAvg: parseFloat(weanedAvg),
      weanedPerYear: weanedPerYear ? parseFloat(weanedPerYear) : null,
      dnp,
      mortalityRate: parseFloat(mortalityRate),
      avgWeaningWeight: parseFloat(avgWeaningWeight),
      totalRecords: records.length
    };
  }).filter(p => p !== null);
  
  // Parámetros a nivel de granja
  const totalServices = reproductoras.reduce((sum, sow) => {
    return sum + (sow.reproductiveRecords || []).filter(r => r.service?.date).length;
  }, 0);
  
  const totalPositive = reproductoras.reduce((sum, sow) => {
    return sum + (sow.reproductiveRecords || []).filter(r => r.pregnancyCheck?.result === "POSITIVO").length;
  }, 0);
  
  const fertilityRate = totalServices > 0 ? ((totalPositive / totalServices) * 100).toFixed(2) : 0;
  
  const totalAbortions = reproductoras.reduce((sum, sow) => {
    return sum + (sow.reproductiveRecords || []).filter(r => r.productivityIssues?.abortions && r.productivityIssues.abortions !== "").length;
  }, 0);
  
  const abortionRate = reproductoras.length > 0 ? ((totalAbortions / reproductoras.length) * 100).toFixed(2) : 0;
  
  const totalRepeats = reproductoras.reduce((sum, sow) => {
    return sum + (sow.reproductiveRecords || []).filter(r => r.productivityIssues?.repeats && r.productivityIssues.repeats !== "").length;
  }, 0);
  
  const repeatRate = totalServices > 0 ? ((totalRepeats / totalServices) * 100).toFixed(2) : 0;
  
  const totalAnestrus = reproductoras.reduce((sum, sow) => {
    return sum + (sow.reproductiveRecords || []).filter(r => r.productivityIssues?.anestrus && r.productivityIssues.anestrus !== "").length;
  }, 0);
  
  const anestrusRate = reproductoras.length > 0 ? ((totalAnestrus / reproductoras.length) * 100).toFixed(2) : 0;
  
  const totalFarrows = reproductoras.reduce((sum, sow) => {
    return sum + (sow.reproductiveRecords || []).filter(r => r.farrowing?.date).length;
  }, 0);
  
  const birthIndex = reproductoras.length > 0 ? (totalFarrows / reproductoras.length).toFixed(2) : 0;
  
  return {
    individual: individualParams,
    farm: {
      fertilityRate: parseFloat(fertilityRate),
      abortionRate: parseFloat(abortionRate),
      repeatRate: parseFloat(repeatRate),
      anestrusRate: parseFloat(anestrusRate),
      birthIndex: parseFloat(birthIndex),
      totalSows: reproductoras.length,
      totalServices,
      totalFarrows
    }
  };
};

export const reproductiveDataService = {
  // Registro de períodos críticos
  addHeatDetection: async (sowId, heatData) => {
    const payload = updateData((data) => {
      const sow = data.pigs.find((p) => p.id === Number(sowId));
      if (!sow) throw new Error('Cerda no encontrada');
      
      if (!sow.criticalPeriods) sow.criticalPeriods = {};
      if (!sow.criticalPeriods.heatDetections) sow.criticalPeriods.heatDetections = [];
      
      const newDetection = {
        id: generateId(),
        date: toISODate(heatData.date),
        durationHours: Number(heatData.durationHours) || 0,
        intensity: heatData.intensity || "MEDIO",
        detectionMethod: heatData.detectionMethod || "MACHO_DETECTOR",
        observations: heatData.observations || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      sow.criticalPeriods.heatDetections.push(newDetection);
      return newDetection;
    });
    return simulateNetwork(payload);
  },
  
  addGestationMonitoring: async (sowId, monitoringData) => {
    const payload = updateData((data) => {
      const sow = data.pigs.find((p) => p.id === Number(sowId));
      if (!sow) throw new Error('Cerda no encontrada');
      
      if (!sow.criticalPeriods) sow.criticalPeriods = {};
      if (!sow.criticalPeriods.gestationMonitoring) sow.criticalPeriods.gestationMonitoring = [];
      
      const newMonitoring = {
        id: generateId(),
        date: toISODate(monitoringData.date),
        bodyCondition: ensureString(monitoringData.bodyCondition),
        observations: ensureString(monitoringData.observations),
        vaccines: ensureString(monitoringData.vaccines),
        treatments: ensureString(monitoringData.treatments),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      sow.criticalPeriods.gestationMonitoring.push(newMonitoring);
      return newMonitoring;
    });
    return simulateNetwork(payload);
  },
  
  addFarrowingDetails: async (sowId, recordId, farrowingDetails) => {
    const payload = updateData((data) => {
      const sow = data.pigs.find((p) => p.id === Number(sowId));
      if (!sow) throw new Error('Cerda no encontrada');
      
      const record = sow.reproductiveRecords?.find(r => r.id === recordId);
      if (!record) throw new Error('Registro reproductivo no encontrado');
      
      if (!record.farrowing) record.farrowing = {};
      
      record.farrowing.startTime = farrowingDetails.startTime || "";
      record.farrowing.endTime = farrowingDetails.endTime || "";
      record.farrowing.birthIntervalMinutes = Number(farrowingDetails.birthIntervalMinutes) || null;
      record.farrowing.assistanceRequired = farrowingDetails.assistanceRequired === true || farrowingDetails.assistanceRequired === "true";
      record.farrowing.assistanceType = ensureString(farrowingDetails.assistanceType);
      record.farrowing.postPartumTemperature = Number(farrowingDetails.postPartumTemperature) || null;
      record.farrowing.medications = ensureString(farrowingDetails.medications);
      record.updatedAt = new Date().toISOString();
      
      return record;
    });
    return simulateNetwork(payload);
  },
  
  addAbortion: async (sowId, abortionData) => {
    const payload = updateData((data) => {
      const sow = data.pigs.find((p) => p.id === Number(sowId));
      if (!sow) throw new Error('Cerda no encontrada');
      
      if (!sow.criticalPeriods) sow.criticalPeriods = {};
      if (!sow.criticalPeriods.abortions) sow.criticalPeriods.abortions = [];
      
      const relatedRecord = sow.reproductiveRecords?.find(r => r.service?.date && 
        new Date(abortionData.date) >= new Date(r.service.date)
      );
      
      const newAbortion = {
        id: generateId(),
        date: toISODate(abortionData.date),
        gestationDays: Number(abortionData.gestationDays) || 0,
        fetusesExpelled: Number(abortionData.fetusesExpelled) || 0,
        fetusState: abortionData.fetusState || "",
        previousSymptoms: ensureString(abortionData.previousSymptoms),
        probableCause: abortionData.probableCause || "DESCONOCIDA",
        correctiveActions: ensureString(abortionData.correctiveActions),
        followUp: ensureString(abortionData.followUp),
        relatedRecordId: relatedRecord?.id || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      sow.criticalPeriods.abortions.push(newAbortion);
      
      // Actualizar el registro reproductivo si existe
      if (relatedRecord) {
        relatedRecord.productivityIssues = relatedRecord.productivityIssues || {};
        relatedRecord.productivityIssues.abortions = `${abortionData.date} - ${abortionData.probableCause}`;
        relatedRecord.updatedAt = new Date().toISOString();
      }
      
      return newAbortion;
    });
    return simulateNetwork(payload);
  },
  
  // Cálculos de parámetros reproductivos
  getReproductiveParameters: async () => {
    const data = await loadData();
    return calculateReproductiveParameters(data.pigs);
  },
  
  getIndividualParameters: async (sowId) => {
    const data = await loadData();
    const sow = data.pigs.find(p => p.id === Number(sowId));
    if (!sow) throw new Error('Cerda no encontrada');
    
    const params = calculateReproductiveParameters([sow]);
    return params.individual[0] || null;
  }
};
