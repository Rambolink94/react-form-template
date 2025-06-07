import './App.css'
import Form from './components/Form'
import type { FieldConfig } from './types/FormTypes';

// Test data.
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

function App() {
  return (
    <>
      <Form fieldData={fieldConfigs} />
    </>
  )
}

export default App
