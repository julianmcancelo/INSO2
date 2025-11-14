/**
 * Utilidades para manejo seguro de localStorage
 * Maneja errores de Tracking Prevention y otros bloqueos de storage
 */

/**
 * Intenta obtener un item del localStorage
 * @param {string} key - La clave del item
 * @returns {string|null} - El valor o null si no existe o hay error
 */
export const getLocalStorage = (key) => {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`No se pudo acceder a localStorage para la clave "${key}":`, error.message);
    return null;
  }
};

/**
 * Intenta guardar un item en localStorage
 * @param {string} key - La clave del item
 * @param {string} value - El valor a guardar
 * @returns {boolean} - true si se guardó exitosamente, false si hubo error
 */
export const setLocalStorage = (key, value) => {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`No se pudo guardar en localStorage para la clave "${key}":`, error.message);
    return false;
  }
};

/**
 * Intenta remover un item del localStorage
 * @param {string} key - La clave del item
 * @returns {boolean} - true si se removió exitosamente, false si hubo error
 */
export const removeLocalStorage = (key) => {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`No se pudo remover de localStorage la clave "${key}":`, error.message);
    return false;
  }
};

/**
 * Intenta limpiar todo el localStorage
 * @returns {boolean} - true si se limpió exitosamente, false si hubo error
 */
export const clearLocalStorage = () => {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.clear();
    return true;
  } catch (error) {
    console.warn('No se pudo limpiar localStorage:', error.message);
    return false;
  }
};

/**
 * Verifica si localStorage está disponible
 * @returns {boolean} - true si está disponible, false si no
 */
export const isLocalStorageAvailable = () => {
  try {
    if (typeof window === 'undefined') return false;
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};
