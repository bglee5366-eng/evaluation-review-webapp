// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('model selector', () => {
  it('defaults to gpt-5.6-luna and keeps the requested options selectable', () => {
    render(<App />);

    const selector = screen.getByRole('combobox', { name: '모델' }) as HTMLSelectElement;
    expect(selector.value).toBe('gpt-5.6-luna');
    expect(Array.from(selector.options, option => option.value)).toEqual([
      'gpt-5.6-luna',
      'gpt-5.6',
      'gpt-6',
      'gpt-5-mini',
      'gpt-5',
      'gpt-4.1-mini',
      'gpt-4.1',
    ]);

    fireEvent.change(selector, { target: { value: 'gpt-6' } });
    expect(selector.value).toBe('gpt-6');
  });
});
