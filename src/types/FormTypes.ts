export type FieldType = "select" | "checkbox" | "radio";

type Dependency = {
  field: string;
  fetchOptions: (values: any) => Promise<string[]>;
};

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  dependencies?: Dependency[];
  required?: boolean;
}