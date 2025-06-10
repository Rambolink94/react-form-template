import './App.css'
import Form from './components/Form'
import { FaGithub } from "react-icons/fa";
import type { FieldConfig } from './types/FormTypes';
import { generateFieldConfig } from './data/fake-data-generator';
import { useState } from 'react';

// Test data.
const fetchCodesByYear = async (year: string) => year === "2020" ? ["A1", "B1"] : ["C1", "B1"];
const fetchLocationsByCode = async (code: string) => code === "A1" ? ["Chicago", "Boston"] : ["Houston"];

const baseFieldConfig: FieldConfig[] = [
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
  },
  {
    name: "class",
    label: "Class",
    type: "select",
    options: ['A', 'B', 'C', 'D'],
  },
  /*
  {
    name: 'has-external-code',
    label: 'Has External Code?',
    type: 'toggle',
  },
  {
    name: 'external-code',
    label: 'External Code',
    type: 'text',
    dependencies: [
      {
        field: 'has-external-code',
      }
    ]
  }
  */
];

function App() {
  const [fieldConfig, setFieldConfig] = useState(generateFieldConfig());

  return (
    <>
      <section className="flex flex-col justify-center items-center m-10">
        <h1>Dependency Form Example</h1>
        <button onClick={() => setFieldConfig(generateFieldConfig())} className="mt-4 pl-4 pr-4 p-2 rounded-md border-none bg-green-600 text-white hover:bg-slate-600">
          Regenerate Data
        </button>
        <Form fields={fieldConfig} />
        <a className="flex items-center" href="https://github.com/Rambolink94/react-form-template">
          <FaGithub className="h-10 w-10 hover:animate-bounce" />
        </a>
      </section>
    </>
  )
}

export default App
