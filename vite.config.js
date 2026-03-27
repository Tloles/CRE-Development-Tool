import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/geocoder': {
        target: 'https://geocoding.geo.census.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/geocoder/, ''),
      },
      '/api/fred': {
        target: 'https://api.stlouisfed.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fred/, ''),
      },
      '/api/fema': {
        target: 'https://hazards.fema.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fema/, ''),
      },
      '/api/gis-fulton': {
        target: 'https://gismaps.fultoncountyga.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gis-fulton/, ''),
      },
      '/api/gis-dekalb': {
        target: 'https://gis.dekalbcountyga.gov',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/gis-dekalb/, ''),
      },
      '/api/gis-gwinnett': {
        target: 'https://gis.gwinnettcounty.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gis-gwinnett/, ''),
      },
      '/api/gis-cobb': {
        target: 'https://gis.cobbcounty.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gis-cobb/, ''),
      },
    },
  },
})
