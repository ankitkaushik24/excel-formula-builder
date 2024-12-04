import React, { useState } from 'react';
import { parseJsonFields } from '../utils/fieldParser';
import { Field } from '../types/formula';

interface Props {
  onFieldsUpdate: (json: Record<string, unknown>) => void;
}

export function JsonFieldsInput({ json, setJson }: Props) {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(json, null, 4));
  const [error, setError] = useState<string | null>(null);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    
    try {
      const json = JSON.parse(value);
      setError(null);
      setJson(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        JSON Fields Definition
      </label>
      <textarea
        value={jsonInput}
        onChange={handleJsonChange}
        className="w-full h-48 p-3 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={`{
  "revenue": 50000,
  "costs": 30000,
  "compensation": {
    "base": {
      "amount": 10000
    }
  }
}`}
      />
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}