export function findMaxValue(arr, fieldName) {
    // Проверка входных данных
    if (!Array.isArray(arr)) {
        throw new TypeError('Expected an array as first argument');
    }

    if (typeof fieldName !== 'string') {
        throw new TypeError('Expected a string as field name');
    }

    // Фильтрация и преобразование
    const numbers = arr
        .map(item => item?.[fieldName])
        .filter(value => typeof value === 'number' && !isNaN(value));

    // Проверка наличия валидных значений
    if (numbers.length === 0) {
        return null;
    }

    return Math.max(...numbers);
}

export function findMinValue(arr, fieldName) {
    // Проверка входных данных
    if (!Array.isArray(arr)) {
      throw new TypeError('Ожидается массив в качестве первого аргумента');
    }
  
    if (typeof fieldName !== 'string') {
      throw new TypeError('Ожидается строка с именем поля');
    }
  
    // Основная логика
    let min = Infinity;
    let hasValidValues = false;
  
    for (const item of arr) {
      const value = item[fieldName];
      if (typeof value === 'number' && !isNaN(value)) {
        hasValidValues = true;
        if (value < min) {
          min = value;
        }
      }
    }
  
    return hasValidValues ? min : null;
}