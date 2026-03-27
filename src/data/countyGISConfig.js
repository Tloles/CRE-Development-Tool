export const COUNTY_GIS_CONFIG = {
  '13121': {
    name: 'Fulton County',
    fips: '13121',
    parcelEndpoint: '/api/gis-fulton/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer/11',
    zoningEndpoint: '/api/gis-fulton/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer/34',
    futureLandUseEndpoint: '/api/gis-fulton/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer/33',
    maxRecords: 2000,
    nativeSR: 102667,
    fieldMap: {
      parcelId: 'ParcelID',
      address: 'Address',
      owner: 'Owner',
      ownerAddress: 'OwnerAddr1',
      totalAssessed: 'TotAssess',
      landAssessed: 'LandAssess',
      improvementAssessed: 'ImprAssess',
      totalAppraised: 'TotAppr',
      landAppraised: 'LandAppr',
      improvementAppraised: 'ImprAppr',
      landUseCode: 'LUCode',
      classCode: 'ClassCode',
      exemptionCode: 'ExCode',
      livingUnits: 'LivUnits',
      acres: 'LandAcres',
      neighborhood: 'NbrHood',
      subdivision: 'Subdiv',
      taxYear: 'TaxYear',
      yearBuilt: null,
      lastSaleDate: null,
      lastSalePrice: null,
      zoning: null,
    },
    queryFields: [
      'ParcelID', 'Address', 'Owner', 'OwnerAddr1',
      'TotAppr', 'LandAppr', 'ImprAppr',
      'TotAssess', 'LandAssess', 'ImprAssess',
      'LUCode', 'ClassCode', 'ExCode',
      'LivUnits', 'LandAcres', 'Subdiv', 'TaxYear',
    ],
    landUseCodes: {
      '01': 'Residential (Single Family)',
      '02': 'Residential (Multi-Family)',
      '03': 'Residential (Condo)',
      '04': 'Commercial',
      '05': 'Industrial',
      '06': 'Agricultural/Forest',
      '07': 'Exempt',
      '08': 'Utility',
      '09': 'Vacant Land (Residential)',
      '10': 'Vacant Land (Commercial)',
      '11': 'Vacant Land (Industrial)',
    },
  },

  '13089': {
    name: 'DeKalb County',
    fips: '13089',
    parcelEndpoint: '/api/gis-dekalb/arcgis/rest/services/Parcels/MapServer/0',
    maxRecords: 1000,
    nativeSR: 102100,
    fieldMap: {
      parcelId: 'PARCELID',
      address: null,
      owner: null,
      totalAppraised: null,
      landAppraised: null,
      improvementAppraised: null,
      landUseCode: null,
      acres: null,
      yearBuilt: null,
      lastSaleDate: null,
      lastSalePrice: null,
      zoning: null,
    },
    queryFields: ['*'],
    landUseCodes: {},
  },

  '13135': {
    name: 'Gwinnett County',
    fips: '13135',
    parcelEndpoint: null,
    maxRecords: 1000,
    nativeSR: null,
    fieldMap: {},
    queryFields: ['*'],
    landUseCodes: {},
  },

  '13067': {
    name: 'Cobb County',
    fips: '13067',
    parcelEndpoint: null,
    maxRecords: 1000,
    nativeSR: null,
    fieldMap: {},
    queryFields: ['*'],
    landUseCodes: {},
  },
}

export function getCountyConfig(countyFips) {
  return COUNTY_GIS_CONFIG[countyFips] || null
}

export function getCountyByStateFips(stateFips, countyFips) {
  const fullFips = `${stateFips}${countyFips}`
  return COUNTY_GIS_CONFIG[fullFips] || null
}

export function normalizeParcel(rawProperties, fieldMap) {
  const get = (key) => {
    const field = fieldMap[key]
    if (!field) return null
    const val = rawProperties[field]
    return val !== undefined && val !== null ? val : null
  }

  const totalAppraised = get('totalAppraised') || 0
  const imprAppraised = get('improvementAppraised') || 0
  const improvementRatio = totalAppraised > 0 ? imprAppraised / totalAppraised : 0

  return {
    parcelId: get('parcelId'),
    address: get('address'),
    owner: get('owner'),
    ownerAddress: get('ownerAddress'),
    totalAssessed: get('totalAssessed'),
    landAssessed: get('landAssessed'),
    improvementAssessed: get('improvementAssessed'),
    totalAppraised,
    landAppraised: get('landAppraised'),
    improvementAppraised: imprAppraised,
    improvementRatio,
    landUseCode: get('landUseCode'),
    classCode: get('classCode'),
    exemptionCode: get('exemptionCode'),
    livingUnits: get('livingUnits'),
    acres: get('acres'),
    yearBuilt: get('yearBuilt'),
    lastSaleDate: get('lastSaleDate'),
    lastSalePrice: get('lastSalePrice'),
    subdivision: get('subdivision'),
    neighborhood: get('neighborhood'),
    zoning: get('zoning'),
    taxYear: get('taxYear'),
  }
}
