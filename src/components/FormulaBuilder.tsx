import React, { useState } from 'react';
import { Calculator, Function, Database, Plus } from 'lucide-react';
import { FormulaInput } from './FormulaInput';
import { JsonFieldsInput } from './JsonFieldsInput';
import { FormulaError, Field } from '../types/formula';
import { functions } from '../data/functions';
import { getFieldValue } from '../utils/fieldParser';

const defaultJson = {
  "revenue": 50000,
  "costs": 30000,
  "profit_margin": 0.25,
  "tax_rate": 0.2,
  "employees": 100,
  "compElements": ["EQUITY", "BONUS", "SALARY"],
  "compensation": {
    "base": {
      "amount": 10000,
      "currency": "USD"
    },
    "bonus": 1000
  }
};

export function FormulaBuilder() {
  const [formula, setFormula] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [json, setJson] = useState(defaultJson);
  const [error, setError] = useState<FormulaError | null>(null);
  const [calculationError, setCalculationError] = useState(null);
  const [result, setResult] = useState<number | null>(null);

  const evaluateFormula = (formula: string): number => {
    try {
      let evaluatedFormula = formula;
      console.log('formula', formula);
      
      // Replace field references with their values
      // fields.forEach(field => {
      //   const value = getFieldValue(fields, field.path);
      //   if (value !== undefined) {
      //     const regex = new RegExp(field.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      //     evaluatedFormula = evaluatedFormula.replace(regex, JSON.stringify(value));
      //   }
      // });

      console.log('evaluatedFormular', evaluatedFormula);
      Object.assign(self, json);

      return eval(evaluatedFormula);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Invalid formula');
    }
  };

  const handleFormulaChange = (newFormula: string) => {
    setFormula(newFormula);
    try {
      const value = evaluateFormula(newFormula);
      setResult(value);
      setCalculationError(null);
    } catch(e) {
      setResult(null);
      setCalculationError(e?.message || e);
    }
  };

  const handleFieldsUpdate = (json) => {
    setJson(json);
    // Re-evaluate formula with new fields
    if (formula) {
      handleFormulaChange(formula);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Calculator className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Smart Formula Builder</h2>
          <p className="mt-2 text-gray-600">Build complex formulas with nested JSON fields</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6">
            <JsonFieldsInput json={json} setJson={handleFieldsUpdate} />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formula Editor
            </label>
            <FormulaInput
              value={formula}
              onChange={handleFormulaChange}
              onError={setError}
              json={json}
            />
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                Error at position {error.position}: {error.message}
              </div>
            )}
            {calculationError && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                {calculationError?.toString()}
              </div>
            )}
          </div>

          {result !== null && !error && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-md">
              <div className="text-sm text-blue-700 font-medium">Result</div>
              <div className="text-2xl font-bold text-blue-900">{result?.toString()}</div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Examples</h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { 
                title: 'Nested Property Access',
                formula: 'compensation.base.amount * (1 + profit_margin)'
              },
              {
                title: 'Array Access',
                formula: 'IF(compElements[0] === "EQUITY", compensation.bonus * 2, compensation.bonus)'
              },
              {
                title: 'Complex Calculation',
                formula: 'SUM(revenue, -costs, compensation.bonus) * (1 - tax_rate)'
              },
              {
                title: 'Nested Objects',
                formula: 'compensation.base.amount + compensation.bonus'
              }
            ].map((example) => (
              <div
                key={example.title}
                className="bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setFormula(example.formula)}
              >
                <div className="font-medium text-gray-800">{example.title}</div>
                <code className="text-sm text-gray-600">{example.formula}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}