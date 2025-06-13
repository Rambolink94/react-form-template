import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch, type FieldValues } from 'react-hook-form';
import { FormField } from './FormField';
import type { FieldConfig } from '@/types/FormTypes';
type Props = {
  fields: FieldConfig[];
  toggleRefresh?: boolean;
}

export default function Form({ fields, toggleRefresh }: Props) {
  const { register, control, setValue, handleSubmit, getValues, reset } = useForm();
  const formValues = useWatch({ control });
  const [optionsMap, setOptionsMap] = useState<Record<string, string[]>>({});
  const [requiredMap, setRequiedMap] = useState<Record<string, boolean>>({});

  const computeRequiredMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    const markRequired = (fieldName: string) => {
      const field = fields.find(f => f.name === fieldName);

      if (!field || map[fieldName]) return;

      map[fieldName] = true;
      field.dependencies?.forEach(d => markRequired(d.field));
    };

    fields.forEach(f => {
      if (f.required) markRequired(f.name);
    });

    return map;
  }, [fields])

  // Handle form refresh.
  useEffect(() => reset() , [toggleRefresh]);

  // Handle required field map.
  useEffect(() => setRequiedMap(computeRequiredMap), [computeRequiredMap]);

  // Handle Dependencies.
  useEffect(() => {
    fields.forEach(field => {
      const dependencies = field.dependencies ?? [];

      dependencies.forEach(dep => {
        const depValue = formValues?.[dep.field];
        
        if (depValue != null && depValue !== "") {
          if (dep.fetchOptions === undefined) {
            return;
          }
          
          dep.fetchOptions(getValues()).then(options => {
            setOptionsMap((prev) => ({
              ...prev,
              [field.name]: options,
            }));

            const currentValue = getValues()[field.name];

            if (currentValue && !options.includes(currentValue)) {
              setValue(field.name, "");
            }
          });
        } else {
          setOptionsMap(prev => ({
            ...prev,
            [field.name]: [],
          }));

          const currentValue = getValues()[field.name];
          if (currentValue) {
            setValue(field.name, "");
          }
        }
      });
    });
  }, [formValues, fields, getValues, setValue]);

  const isSubmitEnabled = fields.every((f) => {
    return !requiredMap[f.name] || !!formValues[f.name];
  });

  const onValidSubmit = (data: FieldValues) => {
    console.log('Form Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="flex flex-col justify-center items-center p-4 m-8 rounded-md border-green-600 border-1">
        {fields.map((field) => (
          <div key={field.name} className="grid grid-cols-2 p-2 items-center w-full">
            <label htmlFor={field.name}>{field.label}</label>
            <FormField
              field={field}
              control={control}
              register={register}
              options={field.options ?? optionsMap[field.name] ?? []}
              disabled={field.dependencies?.some(dep => !formValues?.[dep.field]) ?? false}
              data-testid={`field-${field.name}`}
            />
          </div>
        ))}

        <button type="submit" disabled={!isSubmitEnabled} className="mt-4 pl-10 pr-10 p-4 rounded-md border-none bg-slate-500 text-white hover:bg-slate-600">
          Submit
        </button>
      </form>
  )
}
