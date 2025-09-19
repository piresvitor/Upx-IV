import { db } from './cliente'
import { users, places, reports } from './schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { hash } from 'argon2'


 // Limpa as tabelas
async function LimparTabelas() {
  console.log('Limpando tabelas...')
  await db.delete(reports)
  await db.delete(users)
  await db.delete(places)
}

async function seedUser() {

  try {
    console.log('Iniciando o processo de seed do banco de dados...')

    // Gera 10 usuários fictícios
    const usersToInsert = Array.from({ length: 10 }).map(() => {
      return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: 'user', 
        passwordHash: 'placeholder', 
      }
    })

    // Adiciona o hash da senha 
    for (const user of usersToInsert) {
      user.passwordHash = await hash('123456')
    }

    // Insere todos os usuários na tabela
    console.log('Inserindo 10 novos usuários...')
    await db.insert(users).values(usersToInsert)

    console.log('Seed de usuários concluído com sucesso!')
  } catch (error) {
    console.error('Erro durante o seed de usuários:', error)
    throw error
  }
}

async function seedReports() {
  try {
    console.log('Iniciando seed de relatos de acessibilidade...')

    // Buscar um usuário e os locais para criar os relatos
    const [user] = await db.select().from(users).limit(1)
    const sorocabaPlaces = await db.select().from(places)

    if (!user) {
      console.log('Nenhum usuário encontrado. Execute o seed de usuários primeiro!')
      return
    }

    if (sorocabaPlaces.length === 0) {
      console.log('Nenhum local encontrado. Execute o seed de places primeiro!')
      return
    }

    console.log(`Usando usuário: ${user.name}`)
    console.log(`Encontrados ${sorocabaPlaces.length} locais de Sorocaba`)

    // Relatos de acessibilidade para diferentes locais
    const accessibilityReports = [
      {
        placeId: sorocabaPlaces[0].id, // Sorocaba, SP
        title: "Acessibilidade no Centro de Sorocaba",
        description: "O centro da cidade possui algumas rampas de acesso, mas ainda há muitas calçadas irregulares que dificultam a locomoção de pessoas com deficiência. As faixas de pedestres precisam de melhor sinalização sonora para deficientes visuais.",
        type: "accessibility"
      },
      {
        placeId: sorocabaPlaces[1].id, // Parque da Biquinha
        title: "Parque da Biquinha - Acessibilidade Limitada",
        description: "O parque tem algumas áreas acessíveis, mas a maior parte dos caminhos não possui piso tátil. Os banheiros públicos não são totalmente adaptados para cadeirantes. Seria importante instalar mais rampas e melhorar a sinalização.",
        type: "accessibility"
      },
      {
        placeId: sorocabaPlaces[2].id, // Shopping Iguatemi
        title: "Shopping Iguatemi - Boa Acessibilidade",
        description: "O shopping possui excelente infraestrutura de acessibilidade: elevadores, rampas, banheiros adaptados e vagas especiais. Há também funcionários treinados para auxiliar pessoas com deficiência. Recomendo para todos!",
        type: "accessibility"
      },
      {
        placeId: sorocabaPlaces[3].id, // Hospital Regional
        title: "Hospital Regional - Acessibilidade Adequada",
        description: "O hospital possui boa infraestrutura de acessibilidade com rampas, elevadores e banheiros adaptados. Porém, a sinalização poderia ser melhorada para facilitar a orientação de pacientes e visitantes com deficiência visual.",
        type: "accessibility"
      },
      {
        placeId: sorocabaPlaces[4].id, // Catedral Metropolitana
        title: "Catedral - Acessibilidade Precisa Melhorar",
        description: "A Catedral Metropolitana é um local histórico importante, mas possui limitações de acessibilidade. As escadas na entrada principal dificultam o acesso de cadeirantes. Seria importante instalar uma rampa lateral ou elevador para garantir acesso universal.",
        type: "accessibility"
      }
    ]

    // Inserir os relatos
    console.log('Inserindo relatos de acessibilidade...')
    await db.insert(reports).values(
      accessibilityReports.map(report => ({
        title: report.title,
        description: report.description,
        type: report.type,
        userId: user.id,
        placeId: report.placeId
      }))
    )

    console.log('Seed de relatos de acessibilidade concluído com sucesso!')
  } catch (error) {
    console.error('Erro durante o seed de relatos:', error)
    throw error
  }
}

async function seedPlaces() {
  try {
    console.log('Iniciando seed de locais...')

    // Locais de Sorocaba, SP com place_ids válidos e únicos do Google Maps
    const placesToInsert = [
      {
        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4', // Sorocaba, SP, Brasil
        name: 'Sorocaba, São Paulo, Brasil',
        address: 'Sorocaba, SP, Brasil',
        latitude: -23.5015,
        longitude: -47.4526,
        types: ['locality', 'political'],
        rating: 4.3,
        userRatingsTotal: 15000
      },
      {
        placeId: 'ChIJVwJc2_tZzpQRhI_YPMS9efY', // Parque da Biquinha, Sorocaba
        name: 'Parque da Biquinha',
        address: 'R. da Biquinha, 1 - Vila Hortência, Sorocaba - SP, Brasil',
        latitude: -23.5015,
        longitude: -47.4526,
        types: ['park', 'tourist_attraction'],
        rating: 4.4,
        userRatingsTotal: 2500
      },
      {
        placeId: 'ChIJKxjxuaNqzpQRY_4f1V2tJxY', // Shopping Iguatemi Sorocaba
        name: 'Shopping Iguatemi Sorocaba',
        address: 'Rod. Sen. José Ermírio de Moraes, 1425 - Alto da Boa Vista, Sorocaba - SP, Brasil',
        latitude: -23.5015,
        longitude: -47.4526,
        types: ['shopping_mall', 'store', 'point_of_interest'],
        rating: 4.2,
        userRatingsTotal: 8000
      },
      {
        placeId: 'ChIJLQcUGJhqzpQRY_4f1V2tJxY', // Hospital Regional de Sorocaba
        name: 'Hospital Regional de Sorocaba',
        address: 'Av. Comendador Pereira Inácio, 564 - Jardim Vergueiro, Sorocaba - SP, Brasil',
        latitude: -23.5015,
        longitude: -47.4526,
        types: ['hospital', 'health', 'point_of_interest'],
        rating: 3.8,
        userRatingsTotal: 1200
      },
      {
        placeId: 'ChIJM5Mh_8JZzpQRYzOKlDvJx_0', // Catedral Metropolitana de Sorocaba
        name: 'Catedral Metropolitana de Sorocaba',
        address: 'Praça Coronel Fernando Prestes, 1 - Centro, Sorocaba - SP, Brasil',
        latitude: -23.5015,
        longitude: -47.4526,
        types: ['church', 'place_of_worship', 'point_of_interest'],
        rating: 4.5,
        userRatingsTotal: 800
      },
      {
        placeId: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA', // McDonald's Sorocaba Centro
        name: 'McDonald\'s - Centro Sorocaba',
        address: 'R. Dr. Álvaro Soares, 400 - Centro, Sorocaba - SP, Brasil',
        latitude: -23.5015,
        longitude: -47.4526,
        types: ['restaurant', 'food', 'point_of_interest'],
        rating: 3.9,
        userRatingsTotal: 1500
      },
      {
        placeId: 'ChIJLU7jZClu5kcR4PcOOO6p3I0', // Parque Zoológico Municipal Quinzinho de Barros
        name: 'Parque Zoológico Municipal Quinzinho de Barros',
        address: 'R. Teodoro Kaisel, 883 - Vila Hortência, Sorocaba - SP, Brasil',
        latitude: -23.5015,
        longitude: -47.4526,
        types: ['zoo', 'tourist_attraction', 'point_of_interest'],
        rating: 4.6,
        userRatingsTotal: 5000
      },
      {
        placeId: 'ChIJAVkDPzdZxwcRc0g4T5D2aJY', // FACENS - Faculdade de Engenharia de Sorocaba
        name: 'FACENS - Faculdade de Engenharia de Sorocaba',
        address: 'Rod. Sen. José Ermírio de Moraes, 1425 - Alto da Boa Vista, Sorocaba - SP, Brasil',
        latitude: -23.5015,
        longitude: -47.4526,
        types: ['university', 'school', 'point_of_interest'],
        rating: 4.3,
        userRatingsTotal: 2500
      },
      {
        placeId: 'ChIJ0WGkg4FEzpQRrlsz_whLqZs', // Estação Ferroviária de Sorocaba
        name: 'Estação Ferroviária de Sorocaba',
        address: 'Praça da Estação, s/n - Centro, Sorocaba - SP, Brasil',
        latitude: -23.5015,
        longitude: -47.4526,
        types: ['transit_station', 'train_station', 'point_of_interest'],
        rating: 4.0,
        userRatingsTotal: 800
      },
      {
        placeId: 'ChIJKxjxuaNqzpQRY_4f1V2tJxZ', // Mercado Municipal de Sorocaba
        name: 'Mercado Municipal de Sorocaba',
        address: 'R. Dr. Álvaro Soares, 400 - Centro, Sorocaba - SP, Brasil',
        latitude: -23.5015,
        longitude: -47.4526,
        types: ['market', 'store', 'point_of_interest'],
        rating: 4.3,
        userRatingsTotal: 1200
      }
    ]

    // Insere todos os locais na tabela
    console.log('Inserindo locais de teste...')
    await db.insert(places).values(placesToInsert)

    console.log('Seed de locais concluído com sucesso!')
  } catch (error) {
    console.error('Erro durante o seed de locais:', error)
    throw error
  }
}

async function seed() {
  try {
    console.log('=== INICIANDO SEED DO BANCO DE DADOS ===')

    // await LimparTabelas() 
    await seedPlaces()
    await seedReports()
    
    console.log('=== SEED CONCLUÍDO COM SUCESSO! ===')
    console.log('10 usuários criados')
    console.log('10 locais de Sorocaba criados')
    console.log('5 relatos de acessibilidade criados')
    console.log(' Todos os dados foram inseridos no banco de dados')
    
  } catch (error) {
    console.error('Erro durante o processo de seed:', error)
    process.exit(1)
  } finally {
    console.log('Fechando a conexão com o banco de dados...')
    process.exit(0)
  }
}

seed()
