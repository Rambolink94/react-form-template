import { expect, test } from 'vitest';
import Form from "./Form";
import { render } from '@testing-library/react'
import '@testing-library/jest-dom';
import { generateFieldConfig } from '@/data/fake-data-generator';

test('field options empty when dependent empty', async () => {
  const fieldConfig = generateFieldConfig();

  const component = render(<Form fields={fieldConfig} />);

  fieldConfig.forEach(fieldInfo => {
    const field = component.getByTestId(`field-${fieldInfo.name}`);
    const select = field.querySelector('select');
    const options = field.querySelectorAll('option');

    const dependencyCount = fieldInfo.dependencies?.length ?? 0;
    if (dependencyCount == 0) {
      expect(options.length).toBeGreaterThan(0);
      expect(select).toBeEnabled();
    } else {
      expect(options.length).toBe(0);
      expect(select).toBeDisabled();
    }
  });
}); 