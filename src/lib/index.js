// ultilidades da para o teste 
/**
 * função de debounce
 * @param {Function} func - função a ser executada
 * @param {number} wait - tempo de espera em milissegundos
 * @returns {Function} - função debounced
 */
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const leter = () => {
      clearTimeout(timeout);
      func(...args);
  }
    clearTimeout(timeout);
    timeout = setTimeout(leter, wait);
  };
}

/**
 * valida nomes para consultas
 * @param {string} name - nome a ser validado
 * @returns {boolean} - true se o nome for válido, false caso contrário
 * 
*/
export function isValidName(name) {
  return typeof name === 'string' && name.trim() !== '';
}

/**
 * formatando o resultado da consulta
 * @param {Object} result - resultados da consulta
 * @returns {Object} - objeto formatado com nome e idade
 */
export function formatResult(result) {
  if (!result) return null;
  return {
    name: result.name || '',
    age: result.age || null,
    count: result.count || 0,
    probability: result.probability || 0,
  };
}