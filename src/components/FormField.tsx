import { Controller, type FieldValues, type UseFormRegister } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import type { FieldConfig } from '@/types/FormTypes';

type Props = {
  field: FieldConfig;
  control: any;
  register: UseFormRegister<FieldValues>;
  error?: string;
  options: string[];
  disabled: boolean;
};

export const FormField = ({ field, control, register, error, options, disabled }: Props) => {
  const commonProps = {
    ...register(field.name),
    disabled,
  };
  
  switch (field.type) {
    case "select":
      return (
        <div className="p-2 flex flex-row space-x-4 justify-center">
          <label>{field.label}</label>
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Select
                onValueChange={controllerField.onChange}
                value={controllerField.value || ""}
                disabled={disabled}
                >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label}...`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );
    case "radio":
      return (
        <>
          <label>{field.label}</label>
          {options.map((opt) => (
            <label key={opt}>
              <input type="radio" value={opt} {...commonProps} />
              {opt}
            </label>
          ))}
        </>
      );
    case "checkbox":
      return (
        <>
          <label>{field.label}</label>
          {options.length == 0 && <input type="checkbox"/>}
          {options.map((opt) => (
            <label key={opt}>
              <input
                type="checkbox"
                value={opt}
                {...register(field.name)}
              />
              {opt}
            </label>
          ))}
        </>
      );
    case "toggle":
      return (
        <>
          <label>{field.label}</label>
          <input className="m-2" type="checkbox" />
        </>
      )
    case "text":
      return (
        <>
          <label>{field.label}</label>
          <input className="m-2 p-2 border-2 rounded-md" type="text" placeholder={field.label} />
        </>
      )
    default:
      return null;
  }
}
