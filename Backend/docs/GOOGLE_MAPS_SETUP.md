# Configuração do Google Maps API

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Google Maps API
GOOGLE_MAPS_API_KEY=sua_chave_da_api_do_google_maps_aqui
```

## Como obter a chave da API do Google Maps

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - Places API
   - Maps JavaScript API
   - Geocoding API
4. Vá para "Credenciais" e crie uma nova chave de API
5. Configure as restrições de API conforme necessário para segurança

## APIs Necessárias

- **Places API**: Para buscar locais próximos e detalhes de locais
- **Maps JavaScript API**: Para exibir mapas no frontend
- **Geocoding API**: Para converter endereços em coordenadas (opcional)

## Limites e Custos

- A API do Google Maps tem limites de uso gratuitos
- Consulte a [documentação de preços](https://developers.google.com/maps/billing-and-pricing) para mais detalhes
- Configure alertas de uso no Google Cloud Console

## Segurança

- Nunca exponha sua chave de API no frontend
- Use restrições de API no Google Cloud Console
- Configure restrições de IP se necessário
- Monitore o uso da API regularmente
