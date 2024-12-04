import { Field, JsonValue } from '../types/formula';

export function parseJsonFields(json: Record<string, JsonValue>, parentPath = ''): Field[] {
  const fields: Field[] = [];

  function getType(value: JsonValue): Field['type'] {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value as Field['type'];
  }

  function processValue(key: string, value: JsonValue, currentPath: string) {
    const path = currentPath ? `${currentPath}.${key}` : key;
    
    fields.push({
      path,
      value,
      type: getType(value),
      parent: currentPath || undefined
    });

    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            parseNestedObject(item, `${path}[${index}]`);
          }
        });
      } else {
        parseNestedObject(value, path);
      }
    }
  }

  function parseNestedObject(obj: Record<string, JsonValue>, currentPath: string) {
    Object.entries(obj).forEach(([key, value]) => {
      processValue(key, value, currentPath);
    });
  }

  Object.entries(json).forEach(([key, value]) => {
    processValue(key, value, '');
  });

  return fields;
}

export function getFieldValue(fields: Field[], path: string): JsonValue | undefined {
  const field = fields.find(f => f.path === path);
  return field?.value;
}

export function getSuggestions(fields: Field[], input: string): string[] {
  const parts = input.split('.');
  const parentPath = parts.slice(0, -1).join('.');
  const searchTerm = parts[parts.length - 1].toLowerCase();

  return fields
    .filter(field => {
      if (!parentPath) {
        return field.path.toLowerCase().startsWith(searchTerm) && !field.path.includes('.');
      }
      return field.parent === parentPath && 
             field.path.slice(parentPath.length + 1).toLowerCase().startsWith(searchTerm);
    })
    .map(field => field.path);
}