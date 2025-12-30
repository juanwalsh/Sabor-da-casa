/**
 * Implementação de busca fuzzy para encontrar resultados mesmo com erros de digitação
 */

/**
 * Calcula a distância de Levenshtein entre duas strings
 * Quanto menor o número, mais parecidas as strings são
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  // Criar matriz de distâncias
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Preencher primeira coluna e primeira linha
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Preencher o resto da matriz
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calcula um score de similaridade entre 0 e 1
 * 1 = strings idênticas, 0 = completamente diferentes
 */
function similarityScore(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  return 1 - distance / maxLength;
}

/**
 * Verifica se uma string contém outra (aproximadamente)
 */
function fuzzyContains(text: string, query: string, threshold = 0.7): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Verificar correspondência exata primeiro
  if (textLower.includes(queryLower)) {
    return true;
  }

  // Dividir o texto em palavras e verificar cada uma
  const words = textLower.split(/\s+/);
  for (const word of words) {
    if (similarityScore(word, queryLower) >= threshold) {
      return true;
    }
  }

  // Verificar substrings do texto
  for (let i = 0; i <= text.length - query.length; i++) {
    const substring = textLower.slice(i, i + queryLower.length);
    if (similarityScore(substring, queryLower) >= threshold) {
      return true;
    }
  }

  return false;
}

export interface FuzzySearchOptions {
  /**
   * Limite mínimo de similaridade (0 a 1)
   * Padrão: 0.6
   */
  threshold?: number;

  /**
   * Campos para buscar (se os itens forem objetos)
   */
  keys?: string[];

  /**
   * Número máximo de resultados
   */
  maxResults?: number;
}

export interface FuzzySearchResult<T> {
  item: T;
  score: number;
  matches: string[];
}

/**
 * Realiza busca fuzzy em uma lista de itens
 */
export function fuzzySearch<T>(
  items: T[],
  query: string,
  options: FuzzySearchOptions = {}
): FuzzySearchResult<T>[] {
  const { threshold = 0.6, keys = [], maxResults } = options;

  if (!query || query.trim().length === 0) {
    return items.map((item) => ({ item, score: 1, matches: [] }));
  }

  const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results: FuzzySearchResult<T>[] = [];

  for (const item of items) {
    let totalScore = 0;
    let matchCount = 0;
    const matches: string[] = [];

    // Obter valores para buscar
    const searchValues: string[] = [];
    if (keys.length === 0) {
      // Se não houver keys, tratar o item como string
      searchValues.push(String(item));
    } else {
      // Buscar nos campos especificados
      for (const key of keys) {
        const value = getNestedValue(item, key);
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            searchValues.push(...value.map(String));
          } else {
            searchValues.push(String(value));
          }
        }
      }
    }

    // Verificar cada termo da busca
    for (const term of queryTerms) {
      let bestTermScore = 0;
      let bestMatch = '';

      for (const value of searchValues) {
        const valueLower = value.toLowerCase();

        // Correspondência exata é priorizada
        if (valueLower.includes(term)) {
          const score = term.length / valueLower.length + 0.5;
          if (score > bestTermScore) {
            bestTermScore = Math.min(score, 1);
            bestMatch = value;
          }
          continue;
        }

        // Busca fuzzy
        const words = valueLower.split(/\s+/);
        for (const word of words) {
          const similarity = similarityScore(word, term);
          if (similarity >= threshold && similarity > bestTermScore) {
            bestTermScore = similarity;
            bestMatch = value;
          }
        }
      }

      if (bestTermScore > 0) {
        totalScore += bestTermScore;
        matchCount++;
        if (bestMatch && !matches.includes(bestMatch)) {
          matches.push(bestMatch);
        }
      }
    }

    // Calcular score final
    if (matchCount > 0) {
      const finalScore = (totalScore / queryTerms.length) * (matchCount / queryTerms.length);

      if (finalScore >= threshold * 0.5) {
        results.push({
          item,
          score: finalScore,
          matches,
        });
      }
    }
  }

  // Ordenar por score (maior primeiro)
  results.sort((a, b) => b.score - a.score);

  // Limitar resultados se necessário
  if (maxResults && results.length > maxResults) {
    return results.slice(0, maxResults);
  }

  return results;
}

/**
 * Obtém valor de um objeto por caminho de chave (ex: "address.city")
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Destaca os termos encontrados no texto
 */
export function highlightMatches(
  text: string,
  query: string,
  highlightClass = 'bg-yellow-200 dark:bg-yellow-800'
): string {
  if (!query.trim()) return text;

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  let result = text;

  for (const term of terms) {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    result = result.replace(regex, `<mark class="${highlightClass}">$1</mark>`);
  }

  return result;
}

/**
 * Escape caracteres especiais de regex
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sugestões de correção ortográfica simples para termos comuns de comida
 */
const commonCorrections: Record<string, string> = {
  // Variações comuns
  hamburguer: 'hamburguer',
  hamburgue: 'hamburguer',
  amburger: 'hamburguer',
  hamburger: 'hamburguer',
  feijoada: 'feijoada',
  fejuada: 'feijoada',
  fejoada: 'feijoada',
  fejioada: 'feijoada',
  escondidinho: 'escondidinho',
  escondinho: 'escondidinho',
  escondidino: 'escondidinho',
  marmita: 'marmita',
  marmitex: 'marmita',
  sobremesa: 'sobremesa',
  sobremeza: 'sobremesa',
  sorvete: 'sorvete',
  sorveti: 'sorvete',
  pudim: 'pudim',
  pudin: 'pudim',
  brigadeiro: 'brigadeiro',
  brigadero: 'brigadeiro',
  limonada: 'limonada',
  limuada: 'limonada',
  suco: 'suco',
  sucu: 'suco',
  frango: 'frango',
  fango: 'frango',
  carne: 'carne',
  carni: 'carne',
  arroz: 'arroz',
  arros: 'arroz',
  feijao: 'feijao',
  feijão: 'feijao',
  fejao: 'feijao',
  vegetariano: 'vegetariano',
  vegetariana: 'vegetariano',
  vegano: 'vegano',
  vegan: 'vegano',
};

/**
 * Sugere correção para termo de busca
 */
export function suggestCorrection(query: string): string | null {
  const queryLower = query.toLowerCase().trim();

  // Verificar se há correção direta
  if (commonCorrections[queryLower]) {
    return commonCorrections[queryLower];
  }

  // Verificar similaridade com termos conhecidos
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [wrong, correct] of Object.entries(commonCorrections)) {
    const score = similarityScore(queryLower, wrong);
    if (score > bestScore && score >= 0.7) {
      bestScore = score;
      bestMatch = correct;
    }
  }

  return bestMatch;
}
