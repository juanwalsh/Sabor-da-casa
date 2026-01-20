// Função para calcular o CRC16 (obrigatório para o Pix funcionar)
function getCRC16(payload: string): string {
  payload += "6304";
  const polynomial = 0x1021;
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i++) {
    let bit = (crc >> 8) ^ payload.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      if ((bit <<= 1) & 0x100) bit ^= polynomial;
    }
    crc = ((crc << 8) | (bit >> 8)) & 0xffff;
  }

  return payload + crc.toString(16).toUpperCase().padStart(4, "0");
}

// Formata campos do padrão EMV (ID + Tamanho + Valor)
function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

interface PixData {
  key: string;      // Sua chave Pix
  name: string;     // Seu nome (sem acentos, max 25 chars)
  city: string;     // Sua cidade (sem acentos, max 15 chars)
  amount: number;   // Valor do pedido
  txid?: string;    // Identificador (opcional, max 25 chars)
}

// Gera a string "Copia e Cola" Oficial
export function generatePixPayload({ key, name, city, amount, txid = "***" }: PixData): string {
  // Tratamento de dados
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25).toUpperCase();
  const cleanCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 15).toUpperCase();
  const cleanKey = key.trim();
  const formattedAmount = amount.toFixed(2);

  // Montagem do Payload (Padrão Banco Central)
  // 00: Payload Format Indicator
  // 26: Merchant Account Information (GUI + Key)
  // 52: Merchant Category Code (0000 = Geral)
  // 53: Transaction Currency (986 = BRL)
  // 54: Transaction Amount
  // 58: Country Code (BR)
  // 59: Merchant Name
  // 60: Merchant City
  // 62: Additional Data Field Template (TxID)
  
  const merchantAccount = formatField("00", "BR.GOV.BCB.PIX") + formatField("01", cleanKey);
  
  let payload = 
    formatField("00", "01") +                           // Payload Format
    formatField("26", merchantAccount) +                // Merchant Info
    formatField("52", "0000") +                         // MCC
    formatField("53", "986") +                          // Currency
    formatField("54", formattedAmount) +                // Amount
    formatField("58", "BR") +                           // Country
    formatField("59", cleanName) +                      // Name
    formatField("60", cleanCity) +                      // City
    formatField("62", formatField("05", txid));         // TxID

  // Adiciona CRC16 no final
  return getCRC16(payload);
}
