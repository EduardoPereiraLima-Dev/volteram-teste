// Utilitários para a aplicação

/**
 * Função de debounce para limitar a frequência de execução
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em millisegundos
 * @returns {Function} Função com debounce aplicado
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Valida se um nome é válido para consulta
 * @param {string} name - Nome a ser validado
 * @returns {boolean} True se o nome é válido
 */
export function isValidName(name) {
  return typeof name === "string" && name.trim().length > 0
}

/**
 * Formata o resultado da API para exibição
 * @param {Object} result - Resultado da API Agify
 * @returns {Object} Resultado formatado
 */
export function formatResult(result) {
  if (!result) return null

  return {
    name: result.name || "",
    age: result.age || null,
    count: result.count || 0,
    hasData: result.age !== null && result.age !== undefined,
  }
}
