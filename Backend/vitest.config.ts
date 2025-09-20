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
    // Usar arquivo de ambiente específico para testes
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5434/mapa_colaborativo_test',
      JWT_SECRET: 'test-secret-key-for-testing-only',
      GOOGLE_MAPS_API_KEY: 'test-api-key-for-testing'
    },
    // Configurar mocks
    setupFiles: ['./src/__mocks__/setup.ts'],
    // Configuração de coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*.{ts,js}',
        'routes/**/*.{ts,js}'
      ],
      exclude: [
        'src/**/*.test.{ts,js}',
        'src/**/*.spec.{ts,js}',
        'src/__mocks__/**',
        'src/tests/**',
        'src/database/seed.ts',
        'src/server.ts',
        'src/app.ts',
        '**/*.d.ts',
        '**/node_modules/**',
        '**/coverage/**',
        '**/dist/**',
        '**/.{idea,git,cache,output,temp}/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
