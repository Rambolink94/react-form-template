import { faker } from "@faker-js/faker";

export const getYear = (): string => {
  return faker.date.between({ from: '2000-01-01', to: Date.now() }).getFullYear().toString();
};

export const getYears = (count: number): string[] => {
  const initialYears = Array.from({ length: count }, (_, _i) => getYear());
  return faker.helpers.uniqueArray(initialYears, initialYears.length);
}