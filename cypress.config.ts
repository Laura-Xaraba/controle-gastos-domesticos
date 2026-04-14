import {defineConfig} from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',

    setupNodeEvents(on, config) {
      // node event listeners aqui se necessario
    },

    // Defina onde o cypress deve procurar os arquivos de teste
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
})