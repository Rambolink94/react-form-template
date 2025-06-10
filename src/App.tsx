import './App.css'
import Form from './components/Form'
import { FaGithub } from "react-icons/fa";
import { generateFieldConfig } from './data/fake-data-generator';
import { RiRefreshLine } from "react-icons/ri";
import { useState } from 'react';

function App() {
  const [fieldConfig, setFieldConfig] = useState(generateFieldConfig());

  return (
    <>
      <section className="flex flex-col justify-center items-center m-10">
        <h1 className="font-medium"> Dependency Form Example</h1>
        <strong className="flex items-center space-x-1">
          
          
        </strong>
        <button onClick={() => setFieldConfig(generateFieldConfig())} className="mt-4 pl-4 pr-4 p-2 rounded-md border-none bg-green-600 text-white hover:bg-slate-600 flex items-center">
          <RiRefreshLine className="mr-2" />
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
