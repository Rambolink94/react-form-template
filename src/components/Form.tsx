import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch, type FieldValues } from 'react-hook-form';
import { FormField } from './FormField';
import type { FieldConfig } from '@/types/FormTypes';

type Props = {
  fieldData: FieldConfig[];
}

export default function Form({ fieldData }: Props) {
  const { register, control, setValue, handleSubmit, getValues } = useForm();
  const formValues = useWatch({ control });
  const [optionsMap, setOptionsMap] = useState<Record<string, string[]>>({});
  const [requiredMap, setRequiedMap] = useState<Record<string, boolean>>({});

  const computeRequiredMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    const markRequired = (fieldName: string) => {
      const field = fieldData.find(f => f.name === fieldName);

      if (!field || map[fieldName]) return;

      map[fieldName] = true;
      field.dependencies?.forEach(d => markRequired(d.field));
    };

    fieldData.forEach(f => {
      if (f.required) markRequired(f.name);
    });

    return map;
  }, [fieldData])

  useEffect(() => setRequiedMap(computeRequiredMap), [computeRequiredMap]);

  useEffect(() => {
    fieldData.forEach(field => {
      const dependencies = field.dependencies ?? [];

      dependencies.forEach(dep => {
        const depValue = formValues?.[dep.field];

        if (depValue != null && depValue !== "") {
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
  }, [formValues, fieldData, getValues, setValue]);

  const isSubmitEnabled = fieldData.every((f) => {
    return !requiredMap[f.name] || !!formValues[f.name];
  });

  const onValidSubmit = (data: FieldValues) => {
    console.log('Form Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="flex flex-col justify-center items-center m-20">
      {fieldData.map((field) => (
        <div key={field.name}>
          <FormField
            field={field}
            control={control}
            register={register}
            options={field.options ?? optionsMap[field.name] ?? []}
            disabled={field.dependencies?.some(dep => !formValues?.[dep.field]) ?? false}
          />
        </div>
      ))}

      <button type="submit" disabled={!isSubmitEnabled} className="mt-4 pl-10 pr-10 p-4 rounded-md border-none bg-slate-500 text-white hover:bg-slate-600">
        Submit
      </button>
    </form>
  )
}
