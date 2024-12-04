export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type Field = {
  path: string;
  value: JsonValue;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null';
  parent?: string;
};

export type FormulaError = {
  message: string;
  position: number;
};

export type Suggestion = {
  label: string;
  value: string;
  type: 'function' | 'field' | 'operator';
  description: string;
  documentation?: string;
};