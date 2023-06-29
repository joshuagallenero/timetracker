import { Banner } from 'baseui/banner';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Watch } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const { control, handleSubmit } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div className="flex flex-1 flex-col items-center h-screen bg-white">
      <div className="flex flex-col justify-center items-center w-full px-10 mt-[15%]">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl text-blue-400 font-bold mr-2">
            Time Tracker
          </h1>
          <Watch className="text-blue-400" size={30} />
        </div>

        <div className="rounded-2xl max-w-lg w-full">
          <div className="bg-white rounded-lg shadow-lg shadow-blue-200 shrink-0 px-4 py-6 space-y-8">
            {/* <Banner
              title="Registration failed"
              kind="negative"
              overrides={{ Root: { props: { className: 'm-0' } } }}
            >
              Please try again.
            </Banner> */}
            <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
              <Controller
                control={control}
                name="firstName"
                defaultValue=""
                rules={{ required: true }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error },
                }) => (
                  <FormControl
                    overrides={{
                      LabelContainer: { props: { className: 'mb-0' } },
                    }}
                    label="First Name"
                    error={error?.type === 'required' && 'Required'}
                  >
                    <Input inputRef={ref} error={!!error} {...field} />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="lastName"
                defaultValue=""
                rules={{ required: true }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error },
                }) => (
                  <FormControl
                    overrides={{
                      LabelContainer: { props: { className: 'mb-0' } },
                    }}
                    label="Last Name"
                    error={error?.type === 'required' && 'Required'}
                  >
                    <Input inputRef={ref} error={!!error} {...field} />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="email"
                defaultValue=""
                rules={{ required: true }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error },
                }) => (
                  <FormControl
                    overrides={{
                      LabelContainer: { props: { className: 'mb-0' } },
                    }}
                    label="Email"
                    error={error?.type === 'required' && 'Required'}
                  >
                    <Input inputRef={ref} error={!!error} {...field} />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="password"
                defaultValue=""
                rules={{ required: true }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error },
                }) => (
                  <FormControl
                    overrides={{
                      LabelContainer: { props: { className: 'mb-0' } },
                    }}
                    label="Password"
                    error={error?.type === 'required' && 'Required'}
                  >
                    <Input
                      inputRef={ref}
                      error={!!error}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                )}
              />

              <Button
                overrides={{
                  BaseButton: {
                    props: { className: 'w-[7.5rem] self-end bg-blue-400' },
                  },
                }}
                size="compact"
                type="submit"
              >
                Register
              </Button>
            </form>
          </div>
          <h1 className="self-start mt-4 text-sm">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 text-sm text-blue-400 font-prompt hover:underline"
            >
              Log In
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
}
