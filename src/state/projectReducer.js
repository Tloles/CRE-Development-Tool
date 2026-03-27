import { recalcFinancials } from '../utils/calculations.js'

export function projectReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }

    case 'UPDATE_PROJECT':
      return { ...state, project: { ...state.project, ...action.payload } }

    // --- Site Selection ---
    case 'SET_GEOCODED':
      return {
        ...state,
        siteSelection: { ...state.siteSelection, geocoded: action.payload },
      }

    case 'ADD_PATH_OF_PROGRESS':
      return {
        ...state,
        siteSelection: {
          ...state.siteSelection,
          pathOfProgress: [...state.siteSelection.pathOfProgress, action.payload],
        },
      }

    case 'UPDATE_PATH_OF_PROGRESS': {
      const { id, ...updates } = action.payload
      return {
        ...state,
        siteSelection: {
          ...state.siteSelection,
          pathOfProgress: state.siteSelection.pathOfProgress.map(
            (entry) => entry.id === id ? { ...entry, ...updates } : entry
          ),
        },
      }
    }

    case 'REMOVE_PATH_OF_PROGRESS':
      return {
        ...state,
        siteSelection: {
          ...state.siteSelection,
          pathOfProgress: state.siteSelection.pathOfProgress.filter(
            (entry) => entry.id !== action.payload
          ),
        },
      }

    case 'UPDATE_ZONING':
      return {
        ...state,
        siteSelection: {
          ...state.siteSelection,
          zoning: { ...state.siteSelection.zoning, ...action.payload },
        },
      }

    case 'UPDATE_INFRASTRUCTURE':
      return {
        ...state,
        siteSelection: {
          ...state.siteSelection,
          infrastructure: { ...state.siteSelection.infrastructure, ...action.payload },
        },
      }

    case 'UPDATE_ENVIRONMENTAL':
      return {
        ...state,
        siteSelection: {
          ...state.siteSelection,
          environmental: { ...state.siteSelection.environmental, ...action.payload },
        },
      }

    // --- Assemblage ---
    case 'ADD_PARCEL':
      return {
        ...state,
        assemblage: {
          ...state.assemblage,
          parcels: [...state.assemblage.parcels, action.payload],
        },
      }

    case 'UPDATE_PARCEL': {
      const { id: parcelId, ...parcelUpdates } = action.payload
      return {
        ...state,
        assemblage: {
          ...state.assemblage,
          parcels: state.assemblage.parcels.map(
            (p) => p.id === parcelId ? { ...p, ...parcelUpdates } : p
          ),
        },
      }
    }

    case 'REMOVE_PARCEL':
      return {
        ...state,
        assemblage: {
          ...state.assemblage,
          parcels: state.assemblage.parcels.filter((p) => p.id !== action.payload),
        },
      }

    case 'UPDATE_ASSEMBLAGE_SETTINGS':
      return {
        ...state,
        assemblage: { ...state.assemblage, ...action.payload },
      }

    // --- Existing actions (kept) ---
    case 'SET_MACRO_LOADING':
      return { ...state, macro: { ...state.macro, loading: true, error: null } }

    case 'SET_MACRO_DATA':
      return {
        ...state,
        macro: {
          ...state.macro,
          indicators: { ...state.macro.indicators, ...action.payload },
          lastFetched: new Date().toISOString(),
          loading: false,
        },
      }

    case 'SET_MACRO_ERROR':
      return { ...state, macro: { ...state.macro, loading: false, error: action.payload } }

    case 'SET_SECTOR': {
      return {
        ...state,
        sector: { ...state.sector, selected: action.payload.sector, subtype: action.payload.subtype },
      }
    }

    case 'SET_SECTOR_TRENDS':
      return { ...state, sector: { ...state.sector, trends: action.payload, loading: false } }

    case 'SET_SECTOR_LOADING':
      return { ...state, sector: { ...state.sector, loading: action.payload } }

    case 'TOGGLE_DRIVER': {
      const drivers = state.drivers.selected.includes(action.payload)
        ? state.drivers.selected.filter(d => d !== action.payload)
        : [...state.drivers.selected, action.payload]
      return { ...state, drivers: { ...state.drivers, selected: drivers } }
    }

    case 'SET_DRIVER_RESEARCH':
      return {
        ...state,
        drivers: {
          ...state.drivers,
          research: { ...state.drivers.research, [action.payload.driver]: action.payload.data },
        },
      }

    case 'UPDATE_FINANCIAL': {
      const updatedFinancial = { ...state.financial, ...action.payload }
      return { ...state, financial: recalcFinancials(updatedFinancial) }
    }

    case 'SET_AI_LOADING':
      return { ...state, aiAnalysis: { ...state.aiAnalysis, loading: true, error: null } }

    case 'ADD_AI_RESULT':
      return {
        ...state,
        aiAnalysis: {
          ...state.aiAnalysis,
          results: [action.payload, ...state.aiAnalysis.results],
          loading: false,
        },
      }

    case 'SET_AI_ERROR':
      return { ...state, aiAnalysis: { ...state.aiAnalysis, loading: false, error: action.payload } }

    case 'SET_RESEARCH':
      return {
        ...state,
        research: { ...state.research, [action.payload.step]: action.payload.data },
      }

    // --- Parcel Intelligence ---
    case 'UPDATE_PARCEL_PREFS':
      return {
        ...state,
        parcelIntelligence: {
          ...state.parcelIntelligence,
          preferences: { ...state.parcelIntelligence.preferences, ...action.payload },
        },
      }

    case 'ADD_TO_WATCHLIST':
      return {
        ...state,
        parcelIntelligence: {
          ...state.parcelIntelligence,
          watchlist: [...state.parcelIntelligence.watchlist, action.payload],
        },
      }

    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        parcelIntelligence: {
          ...state.parcelIntelligence,
          watchlist: state.parcelIntelligence.watchlist.filter(
            (item) => item.parcelId !== action.payload
          ),
        },
      }

    default:
      return state
  }
}
