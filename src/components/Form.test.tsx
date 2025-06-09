import { expect, test } from 'vitest';
import Form from "./Form";
import { render } from '@testing-library/react'
import type { FieldConfig } from "@/types/FormTypes";
import '@testing-library/jest-dom';

test('field options empty when dependent empty', async () => {
  const fetchCodesByYear = async (year: string) => year === "2020" ? ["A1", "B1"] : ["C1", "B1"];
  const fetchLocationsByCode = async (code: string) => code === "A1" ? ["Chicago", "Boston"] : ["Houston"];
  const fieldConfigs: FieldConfig[] = [
    {
      name: "year",
      label: "Year",
      type: "select",
      options: ["2020", "2021"],
    },
    {
      name: "code",
      label: "Code",
      type: "select",
      dependencies: [
        {
          field: "year",
          fetchOptions: async ({ year }) =>  await fetchCodesByYear(year),
        }
      ],
    },
    {
      name: "location",
      label: "Location",
      type: "select",
      dependencies: [
        {
          field: "code",
          fetchOptions: async ({ code }) => await fetchLocationsByCode(code),
        },
      ]
    }
  ];

  const component = render(<Form fields={fieldConfigs} />);

  fieldConfigs.forEach(fieldInfo => {
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