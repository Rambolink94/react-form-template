import { getYears } from "@/test/faker-utils";
import type { FieldConfig } from "@/types/FormTypes";
import { faker } from "@faker-js/faker";

type Range = {
  min: number;
  max: number;
}

export const generateFieldConfig = (yearCount: number = 3, codeCount: Range = { min: 2, max: 5 }): FieldConfig[] => {
  const years = getYears(yearCount);
  const codeMap = years.map(year => ({ year, codes: faker.lorem.words(codeCount).split(' ') }));
  const locationMap = codeMap.flatMap(cm => cm.codes.map(code => ({ code, locations: Array.from({ length: 3 }, (_, _i) => faker.location.country()) })));

  return [
    {
      name: "year",
      label: "Year",
      type: "select",
      options: years,
    },
    {
      name: "code",
      label: "Code",
      type: "select",
      dependencies: [
        {
          field: "year",
          fetchOptions: async ({ year }) => Promise.resolve(codeMap.find(v => v.year === year)?.codes ?? []),
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
          fetchOptions: async ({ code }) => Promise.resolve(locationMap.find(v => v.code === code)?.locations ?? []),
        },
      ]
    }
  ];
}