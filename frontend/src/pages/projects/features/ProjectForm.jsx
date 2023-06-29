import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Controller, useForm } from 'react-hook-form';

export default function ProjectForm({ id, initialValues, onSubmitHandler }) {
  const { control, handleSubmit } = useForm({
    defaultValues: { ...(initialValues ?? {}) },
  });

  const onSubmit = handleSubmit((data) => {
    if (onSubmitHandler) {
      onSubmitHandler(data);
    }
  });

  return (
    <form id={id} onSubmit={onSubmit}>
      <Controller
        control={control}
        name="name"
        defaultValue=""
        rules={{ required: true }}
        render={({
          field: { ref, ...field }, // acquire ref
          fieldState: { error },
        }) => (
          <FormControl error={error?.type === 'required' && 'Required'}>
            <Input
              {...field}
              inputRef={ref} // explicitly pass ref in order for input properties to work as intended
              error={!!error}
              placeholder="Enter project name"
            />
          </FormControl>
        )}
      />
    </form>
  );
}
