export const initialState = {
  currentStep: 1,

  // Project definition (updated for land enhancement model)
  project: {
    name: '',
    location: '',
    description: '',
    totalAcreage: null,
    targetAcquisitionPrice: null,
    currentUse: '',
  },

  // Step 1: Site Selection data
  siteSelection: {
    geocoded: null,
    pathOfProgress: [],
    zoning: {
      currentZoning: '',
      permittedUses: '',
      maxDensityFAR: null,
      maxHeight: null,
      heightUnit: 'feet',
      setbacks: { front: null, rear: null, sideLeft: null, sideRight: null },
      overlayDistricts: '',
      minLotSize: null,
      source: '',
    },
    infrastructure: {
      highwayProximity: { distance: '', name: '' },
      nearestTransit: { distance: '', type: '' },
      roadFrontage: null,
      adt: null,
      adtSource: '',
      ingressEgress: { count: null, description: '' },
      utilities: {
        water: 'Unknown',
        sewer: 'Unknown',
        electric: 'Unknown',
        gas: 'Unknown',
        fiber: 'Unknown',
      },
    },
    environmental: {
      phaseIStatus: 'Not Started',
      geotechStatus: 'Not Started',
      wetlands: '',
      topographyNotes: '',
    },
  },

  // Step 2: Assemblage
  assemblage: {
    parcels: [],
    closingCostPercent: 2,
    carryRate: 6.5,
    demolitionEstimate: 0,
  },

  // Macro research (kept from existing)
  macro: {
    indicators: {
      fedFundsRate: null,
      sofr: null,
      cpiInflation: null,
      unemployment: null,
      treasury5yr: null,
      treasury10yr: null,
    },
    lastFetched: null,
    loading: false,
    error: null,
  },

  sector: {
    selected: null,
    subtype: null,
    trends: null,
    loading: false,
  },

  drivers: {
    selected: [],
    research: {},
  },

  // Financial Model (kept from existing — will be refactored later)
  financial: {
    noi: 8000000,
    tcd: 100000000,
    exitCapRate: 6.5,
    developerYield: 0,
    developerSpread: 0,
    impliedSalesPrice: 0,
    grossProfit: 0,
  },

  // AI Analysis
  aiAnalysis: {
    results: [],
    loading: false,
    error: null,
  },

  // Research results cache
  research: {
    step1: null,
    step2: null,
    step3: null,
    step5: null,
    step11: null,
  },

  // Development activity / competing projects
  competingProjects: [],

  // Parcel intelligence (Land Opportunity Scanner)
  parcelIntelligence: {
    preferences: {
      minAcres: 1,
      maxAssessedValue: null,
      minOpportunityScore: 0,
      vacantOnly: false,
    },
    watchlist: [],
  },

  // Steps 3-9 state (placeholder — will be expanded later)
  reimagination: {},
  identity: {},
  masterPlan: {},
  entitlements: {},
  driversAndUsers: {},
  infrastructureDev: {},
  disposition: {},
}
