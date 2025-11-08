# API Estatísticas - Documentação

Esta documentação descreve as rotas relacionadas às estatísticas do sistema de mapeamento colaborativo de acessibilidade.

## Base URL
```
http://localhost:3333
```

## Autenticação
Todas as rotas de estatísticas são **públicas** e não requerem autenticação.

---

## Rotas de Estatísticas

### 1. Estatísticas Gerais

**GET** `/stats/general`

Retorna estatísticas gerais da plataforma, incluindo totais de usuários, relatos, locais e votos.

#### Respostas

**200 - Sucesso**
```json
{
  "totalUsers": 150,
  "totalReports": 1250,
  "totalPlaces": 89,
  "totalVotes": 3200,
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

**500 - Erro interno**
```json
{
  "message": "Erro interno do servidor"
}
```

#### Exemplo de Uso
```bash
curl -X GET "http://localhost:3333/stats/general"
```

---

### 2. Tendências de Relatos

**GET** `/stats/reports/trends`

Retorna tendências de relatos ao longo do tempo, agrupados por dia, semana ou mês.

#### Query Parameters
- `period` (string, opcional): Período de agrupamento
  - `day` (padrão): Agrupa por dia
  - `week`: Agrupa por semana
  - `month`: Agrupa por mês
- `limit` (number, opcional): Número de períodos a retornar (1-365, padrão: 30)

#### Respostas

**200 - Sucesso**
```json
{
  "period": "day",
  "data": [
    {
      "date": "2024-01-15",
      "count": 12
    },
    {
      "date": "2024-01-14", 
      "count": 8
    },
    {
      "date": "2024-01-13",
      "count": 15
    }
  ],
  "total": 1250,
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

**400 - Parâmetros inválidos**
```json
{
  "message": "Período inválido. Use: day, week ou month"
}
```

**500 - Erro interno**
```json
{
  "message": "Erro interno do servidor"
}
```

#### Exemplos de Uso

**Tendências por dia (padrão)**
```bash
curl -X GET "http://localhost:3333/stats/reports/trends"
```

**Tendências por semana**
```bash
curl -X GET "http://localhost:3333/stats/reports/trends?period=week"
```

**Tendências por mês, limitado a 12 períodos**
```bash
curl -X GET "http://localhost:3333/stats/reports/trends?period=month&limit=12"
```

---

### 3. Relatos por Tipo

**GET** `/stats/reports/by-type`

Retorna estatísticas de relatos agrupados por tipo, incluindo contagens e percentuais.

#### Query Parameters
- `limit` (number, opcional): Número máximo de tipos a retornar (1-100, padrão: 20)

#### Respostas

**200 - Sucesso**
```json
{
  "data": [
    {
      "type": "accessibility",
      "count": 450,
      "percentage": 36.0
    },
    {
      "type": "safety",
      "count": 320,
      "percentage": 25.6
    },
    {
      "type": "cultural",
      "count": 280,
      "percentage": 22.4
    },
    {
      "type": "transport",
      "count": 120,
      "percentage": 9.6
    },
    {
      "type": "health",
      "count": 80,
      "percentage": 6.4
    }
  ],
  "total": 1250,
  "uniqueTypes": 8,
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

**500 - Erro interno**
```json
{
  "message": "Erro interno do servidor"
}
```

#### Exemplos de Uso

**Todos os tipos (padrão)**
```bash
curl -X GET "http://localhost:3333/stats/reports/by-type"
```

**Limitado a 5 tipos**
```bash
curl -X GET "http://localhost:3333/stats/reports/by-type?limit=5"
```

---

### 4. Estatísticas de Características de Acessibilidade

**GET** `/stats/reports/accessibility-features`

Retorna estatísticas sobre as características de acessibilidade dos relatos, incluindo rampa de acesso, banheiro acessível, estacionamento acessível e acessibilidade visual.

#### Respostas

**200 - Sucesso**
```json
{
  "data": [
    {
      "feature": "Rampa de Acesso",
      "count": 450,
      "percentage": 36.0
    },
    {
      "feature": "Banheiro Acessível",
      "count": 320,
      "percentage": 25.6
    },
    {
      "feature": "Estacionamento Acessível",
      "count": 280,
      "percentage": 22.4
    },
    {
      "feature": "Acessibilidade Visual",
      "count": 200,
      "percentage": 16.0
    }
  ],
  "total": 1250,
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

**500 - Erro interno**
```json
{
  "message": "Erro interno do servidor"
}
```

#### Exemplo de Uso
```bash
curl -X GET "http://localhost:3333/stats/reports/accessibility-features"
```

#### Características Retornadas
- **Rampa de Acesso**: Relatos que indicam presença de rampa de acesso
- **Banheiro Acessível**: Relatos que indicam banheiro adaptado para cadeirantes
- **Estacionamento Acessível**: Relatos que indicam vagas especiais para PCD
- **Acessibilidade Visual**: Relatos que indicam recursos para deficientes visuais

---

## Casos de Uso

### Dashboard Administrativo
As estatísticas gerais podem ser usadas para criar um dashboard que mostra:
- Número total de usuários cadastrados
- Total de relatos criados
- Quantidade de locais mapeados
- Engajamento através de votos

### Análise de Tendências
As tendências de relatos permitem:
- Identificar períodos de maior atividade
- Detectar crescimento ou declínio no engajamento
- Planejar campanhas baseadas em padrões de uso
- Monitorar a saúde da comunidade

### Análise de Conteúdo
Os relatos por tipo ajudam a:
- Identificar os tipos de problemas mais reportados
- Direcionar recursos para áreas prioritárias
- Entender os interesses da comunidade
- Criar categorias mais específicas se necessário

### Análise de Acessibilidade
As estatísticas de características de acessibilidade permitem:
- Identificar quais recursos de acessibilidade são mais comuns nos relatos
- Monitorar a disponibilidade de recursos de acessibilidade em locais mapeados
- Planejar melhorias baseadas em dados reais
- Avaliar o impacto de políticas públicas de acessibilidade

---

## Códigos de Status HTTP

- **200**: Sucesso
- **400**: Parâmetros inválidos
- **500**: Erro interno do servidor

---

## Notas Importantes

1. **Performance**: As consultas de estatísticas são otimizadas para performance, mas podem ser lentas com grandes volumes de dados
2. **Cache**: Considere implementar cache para estatísticas que não mudam frequentemente
3. **Paginação**: As rotas de tendências e tipos suportam limitação de resultados para melhor performance
4. **Dados em Tempo Real**: As estatísticas são calculadas em tempo real, refletindo o estado atual do banco de dados
5. **Formato de Data**: As datas nas tendências seguem o formato ISO (YYYY-MM-DD para dias, YYYY-WWW para semanas, YYYY-MM para meses)

---

## Exemplos de Integração

### Frontend - Gráfico de Linha (Tendências)
```javascript
fetch('/stats/reports/trends?period=week&limit=12')
  .then(response => response.json())
  .then(data => {
    // Criar gráfico de linha com data.data
    const chartData = data.data.map(item => ({
      x: item.date,
      y: item.count
    }));
    // Usar com Chart.js, D3.js, etc.
  });
```

### Frontend - Gráfico de Pizza (Tipos)
```javascript
fetch('/stats/reports/by-type?limit=10')
  .then(response => response.json())
  .then(data => {
    // Criar gráfico de pizza com data.data
    const chartData = data.data.map(item => ({
      label: item.type,
      value: item.count,
      percentage: item.percentage
    }));
    // Usar com biblioteca de gráficos
  });
```

### Frontend - Cards de Estatísticas
```javascript
fetch('/stats/general')
  .then(response => response.json())
  .then(data => {
    // Atualizar cards no dashboard
    document.getElementById('total-users').textContent = data.totalUsers;
    document.getElementById('total-reports').textContent = data.totalReports;
    document.getElementById('total-places').textContent = data.totalPlaces;
    document.getElementById('total-votes').textContent = data.totalVotes;
  });
```

### Frontend - Gráfico de Barras (Características de Acessibilidade)
```javascript
fetch('/stats/reports/accessibility-features')
  .then(response => response.json())
  .then(data => {
    // Criar gráfico de barras com data.data
    const chartData = data.data.map(item => ({
      label: item.feature,
      value: item.count,
      percentage: item.percentage
    }));
    // Usar com Chart.js, D3.js, Recharts, etc.
  });
```
