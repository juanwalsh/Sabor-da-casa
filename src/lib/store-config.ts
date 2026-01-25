// CONFIGURAÇÕES DO RESTAURANTE
// Dados sensiveis devem ser configurados via variaveis de ambiente

export const STORE_CONFIG = {
  // Dados para geração do Pix Real (Static Code)
  pix: {
    key: process.env.NEXT_PUBLIC_STORE_PIX_KEY || "", // Configurar via NEXT_PUBLIC_STORE_PIX_KEY no .env
    name: process.env.NEXT_PUBLIC_STORE_PIX_NAME || "EP LOPES GELO",
    city: process.env.NEXT_PUBLIC_STORE_PIX_CITY || "SAO PAULO"
  }
};
