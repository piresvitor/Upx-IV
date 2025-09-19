import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Rodar testes sequencialmente para evitar interferência entre eles
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    // Configurações adicionais para testes
    testTimeout: 10000,
    hookTimeout: 10000,
  }
})
