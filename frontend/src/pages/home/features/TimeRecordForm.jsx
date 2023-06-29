import { Button } from 'baseui/button';
import { Calendar as DatePicker } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { StatefulPopover } from 'baseui/popover';
import { Select } from 'baseui/select';
import { TimePicker } from 'baseui/timepicker';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Calendar, MoreVertical, Trash, X } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';

import DurationInput from './DurationInput';
import Stopwatch from './Stopwatch';

export default function TimeRecordForm({
  projects,
  isEditing,
  isLoading,
  initialValues,
  onSubmitHandler,
  onDeleteHandler,
  setModalVisibility,
}) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState,
    reset,
    resetField,
  } = useForm({
    defaultValues: {
      project: '',
      endTime: new Date(),
      taskDate: new Date(),
      startTime: new Date(),
      ...(initialValues ?? {}),
    },
  });

  const [trackingMode, setMode] = useState('manual');
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(false);
  const [duration, setDuration] = useState(
    initialValues?.duration ?? '00:00:00',
  );

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const setTimeFromDuration = (duration) => {
    const hours = duration.substring(0, 2);
    const minutes = duration.substring(3, 5);
    const seconds = duration.substring(6, 8);

    // adding a duration string (HH:mm:ss) to a date object is made consistent by using .setTime()
    const newEndTime = endTime;
    const totalTime =
      Number(hours) * 3600e3 + Number(minutes) * 60e3 + Number(seconds) * 1e3;
    newEndTime.setTime(startTime.getTime() + totalTime);

    resetField('endTime', { defaultValue: newEndTime });
    if (trackingMode === 'timer') {
      // Once timer is stopped, startTime is updated to current time
      resetField('startTime', { defaultValue: new Date() });
    }

    if (isEditing) {
      if (onSubmitHandler) {
        onSubmitHandler({
          id: initialValues.id,
          startTime,
          endTime,
        });
      }
    }
  };

  const durationHandler = (event) => {
    if (event.currentTarget && event.target.value) {
      const duration = event.target.value;
      setDuration(duration);

      setTimeFromDuration(duration);
    }
  };

  const timerHandler = handleSubmit(() => {
    if (!timer) {
      setTimer((prev) => !prev);
      // This is to ensure that startTime is updated to current time on timer start
      resetField('startTime', { defaultValue: new Date() });
    } else {
      setTimer((prev) => !prev);
      const hours = Math.floor((time / 3600e3) % 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
      });
      const minutes = Math.floor((time / 60e3) % 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
      });
      const seconds = Math.floor((time / 1e3) % 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
      });
      setTimeFromDuration(`${hours}:${minutes}:${seconds}`);
      setTime(0);
    }
  });

  const onSubmit = handleSubmit((data) => {
    if (onSubmitHandler) {
      const { taskDate, startTime, endTime, project, ...formData } = data;
      startTime.setDate(taskDate.getDate());
      endTime.setDate(taskDate.getDate());

      // on submit is called on blur for form inputs when editing an existing time record
      if (isEditing) {
        onSubmitHandler({
          ...formData,
          project: project[0].id,
          startTime,
          endTime,
        });

        return;
      }

      // else, trigger submit when user manually submits form
      onSubmitHandler(
        {
          ...formData,
          project: project[0].id,
          startTime,
          endTime,
        },
        reset({
          project: '',
          endTime: new Date(),
          taskDate: new Date(),
          startTime: new Date(),
        }),
      );
    }
  });

  /*
    This is to avoid cases where users might input a start time later than the end time, 
    or input an end time earlier than the start time
  */
  useEffect(() => {
    if (formState.dirtyFields.startTime && startTime - endTime > 0) {
      setValue('endTime', startTime);
      resetField('startTime', { defaultValue: startTime });
      return;
    }
    if (formState.dirtyFields.endTime) {
      if (startTime - endTime > 0) {
        setValue('startTime', endTime);

        resetField('endTime', { defaultValue: endTime });
        return;
      }

      const rawDuration = endTime - startTime;
      const hours = Math.floor((rawDuration / 3600e3) % 60).toLocaleString(
        'en-US',
        {
          minimumIntegerDigits: 2,
        },
      );
      const minutes = Math.floor((rawDuration / 60e3) % 60).toLocaleString(
        'en-US',
        {
          minimumIntegerDigits: 2,
        },
      );
      const seconds = Math.floor((rawDuration / 1e3) % 60).toLocaleString(
        'en-US',
        {
          minimumIntegerDigits: 2,
        },
      );

      setDuration(`${hours}:${minutes}:${seconds}`);
    }
  }, [endTime, formState, resetField, setValue, startTime]);

  return (
    <div className="bg-white border rounded-md shadow-md shrink-0 py-1 px-2 md:py-2 md:px-4">
      {isEditing && (
        <div className="flex items-center justify-between mt-[-0.25rem] mx-[-0.5rem] rounded-t-md p-4 py-2 bg-blue-400">
          <h6 className="text-sm text-white underline">
            {initialValues?.taskDate?.toLocaleDateString('default', {
              month: 'long',
              day: '2-digit',
            })}
          </h6>
          <Button
            className="bg-red-400 text-sm p-2 ml-2"
            overrides={{
              StartEnhancer: {
                props: { className: 'mr-0 p-0' },
              },
            }}
            size="compact"
            startEnhancer={<Trash size={16} />}
            onClick={onDeleteHandler}
          />
        </div>
      )}
      <form
        className="flex flex-col xl:flex-row xl:items-center xl:space-x-2"
        onSubmit={onSubmit}
      >
        <div className="flex flex-1 space-x-2">
          <Controller
            control={control}
            name="description"
            defaultValue=""
            render={({
              field: { ref, ...field }, // acquire ref
              fieldState: { error },
            }) => (
              <FormControl
                overrides={{
                  ControlContainer: {
                    props: {
                      className: clsx('w-2/3', {
                        'min-[576px]:w-full': trackingMode === 'timer',
                        'md:w-full': trackingMode === 'manual',
                      }),
                    },
                  },
                }}
                error={error?.type === 'required' && 'Required'}
              >
                <Input
                  overrides={{
                    Root: {
                      props: {
                        className:
                          'border-t-0 border-x-0 border-b-gray-300 rounded-none',
                      },
                    },
                    Input: {
                      props: {
                        className:
                          'placeholder:text-gray-500 placeholder:text-sm bg-white text-sm pl-2',
                      },
                    },
                  }}
                  {...field}
                  inputRef={ref} // explicitly pass ref in order for input properties to work as intended
                  error={!!error}
                  placeholder="Enter task description"
                  onKeyDown={(e) => {
                    e.key === 'Enter' && e.preventDefault();
                  }}
                  onBlur={() => {
                    if (isEditing && formState.dirtyFields.description) {
                      onSubmit();
                    }
                  }}
                />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="project"
            defaultValue=""
            rules={{ required: true }}
            render={({
              field: { ref, ...field }, // acquire ref
              fieldState: { error },
            }) => (
              <FormControl
                overrides={{
                  ControlContainer: {
                    props: {
                      className: clsx('w-1/3', {
                        'min-[576px]:hidden': trackingMode === 'timer',
                        'md:hidden': trackingMode === 'manual',
                      }),
                    },
                  },
                }}
                error={error?.type === 'required' && 'Required'}
              >
                <Select
                  overrides={{
                    ControlContainer: {
                      props: {
                        className:
                          'border-t-0 border-x-0 border-b-gray-300 rounded-none bg-white',
                      },
                    },
                    Input: {
                      props: {
                        className: 'text-sm text-black',
                        onKeyDown: (e) =>
                          e.key === 'Enter' && e.preventDefault(),
                      },
                    },
                    ValueContainer: {
                      props: { className: 'text-sm text-black px-2' },
                    },
                    Placeholder: {
                      props: {
                        className: 'text-gray-500 text-sm',
                      },
                    },
                    IconsContainer: {
                      props: {
                        className: 'pr-0',
                      },
                    },
                  }}
                  labelKey="name"
                  valueKey="id"
                  clearable={false}
                  inputRef={ref}
                  options={
                    projects && projects.length
                      ? [...projects, { id: 0, name: '+ Create new project' }]
                      : [{ id: 0, name: '+ Create new project' }]
                  }
                  getOptionLabel={({ option }) => (
                    <span
                      className={
                        option.id === 0 ? 'text-blue-400' : 'text-black'
                      }
                    >
                      {option.name}
                    </span>
                  )}
                  {...field}
                  onChange={({ value }) => {
                    if (value[0].id === 0) {
                      setModalVisibility((prev) => !prev);
                      return;
                    }
                    field.onChange(value);
                  }}
                  onBlur={() => {
                    if (isEditing && formState.dirtyFields.project) {
                      onSubmit();
                    }
                  }}
                />
              </FormControl>
            )}
          />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Controller
            control={control}
            name="project"
            defaultValue=""
            render={({
              field: { ref, ...field }, // acquire ref
              fieldState: { error },
            }) => (
              <FormControl
                overrides={{
                  ControlContainer: {
                    props: {
                      className: clsx('w-full', {
                        'max-[575px]:hidden': trackingMode === 'timer',
                        'max-md:hidden': trackingMode === 'manual',
                      }),
                    },
                  },
                }}
                error={error?.type === 'required' && 'Required'}
              >
                <Select
                  overrides={{
                    ControlContainer: {
                      props: {
                        className:
                          'border-t-0 border-x-0 border-b-gray-300 rounded-none bg-white',
                      },
                    },
                    Input: {
                      props: {
                        className: 'text-sm',
                        onKeyDown: (e) =>
                          e.key === 'Enter' && e.preventDefault(),
                      },
                    },
                    ValueContainer: {
                      props: { className: 'text-sm px-2' },
                    },
                    Placeholder: {
                      props: {
                        className: 'text-gray-500 text-sm',
                      },
                    },
                    IconsContainer: {
                      props: {
                        className: 'pr-0',
                      },
                    },
                  }}
                  clearable={false}
                  inputRef={ref}
                  labelKey="name"
                  valueKey="id"
                  options={
                    projects && projects.length
                      ? [...projects, { id: 0, name: '+ Create new project' }]
                      : [{ id: 0, name: '+ Create new project' }]
                  }
                  getOptionLabel={({ option }) => (
                    <span
                      className={
                        option.id === 0 ? 'text-blue-400' : 'text-black'
                      }
                    >
                      {option.name}
                    </span>
                  )}
                  {...field}
                  onChange={({ value }) => {
                    if (value[0].id === 0) {
                      setModalVisibility((prev) => !prev);
                      return;
                    }
                    field.onChange(value);
                  }}
                  onBlur={() => {
                    if (isEditing && formState.dirtyFields.project) {
                      onSubmit();
                    }
                  }}
                />
              </FormControl>
            )}
          />
          {trackingMode === 'manual' ? (
            <>
              <Controller
                control={control}
                name="startTime"
                defaultValue=""
                render={({
                  field: { ref, ...field }, // acquire ref
                  fieldState: { error },
                }) => (
                  <FormControl
                    overrides={{
                      ControlContainer: {
                        props: { className: 'w-full max-w-fit' },
                      },
                    }}
                    error={error?.type === 'required' && 'Required'}
                  >
                    <TimePicker
                      overrides={{
                        Select: {
                          props: {
                            overrides: {
                              ControlContainer: {
                                props: {
                                  className:
                                    'border-t-0 border-x-0 border-b-gray-300 rounded-none bg-white',
                                },
                              },
                              Input: {
                                props: {
                                  className: 'text-sm',
                                },
                              },
                              ValueContainer: {
                                props: {
                                  className: 'text-sm px-3',
                                },
                              },
                              Placeholder: {
                                props: {
                                  className: 'text-gray-500 text-sm',
                                },
                              },
                              IconsContainer: {
                                props: { className: 'hidden' },
                              },
                            },
                          },
                        },
                      }}
                      format="24"
                      creatable
                      ref={ref}
                      {...field}
                      onChange={(a) => {
                        field.onChange(a);
                        if (isEditing) {
                          onSubmit();
                        }
                      }}
                    />
                  </FormControl>
                )}
              />
              <span className="pb-4">-</span>
              <Controller
                control={control}
                name="endTime"
                defaultValue=""
                render={({
                  field: { ref, ...field }, // acquire ref
                  fieldState: { error },
                }) => (
                  <FormControl
                    overrides={{
                      ControlContainer: {
                        props: { className: 'w-full max-w-fit' },
                      },
                    }}
                    error={error?.type === 'required' && 'Required'}
                  >
                    <TimePicker
                      overrides={{
                        Select: {
                          props: {
                            overrides: {
                              ControlContainer: {
                                props: {
                                  className:
                                    'border-t-0 border-x-0 border-b-gray-300 rounded-none bg-white',
                                },
                              },
                              Input: {
                                props: {
                                  className: 'text-sm',
                                },
                              },
                              ValueContainer: {
                                props: {
                                  className: 'text-sm px-3',
                                },
                              },
                              Placeholder: {
                                props: {
                                  className: 'text-gray-500 text-sm',
                                },
                              },
                              IconsContainer: {
                                props: { className: 'hidden' },
                              },
                            },
                          },
                        },
                      }}
                      format="24"
                      ref={ref}
                      {...field}
                      onBlur={() => {
                        if (isEditing) {
                          onSubmit();
                        }
                      }}
                    />
                  </FormControl>
                )}
              />
            </>
          ) : (
            <Stopwatch
              className="flex justify-center items-center w-full max-w-fit pb-3"
              time={time}
              timer={timer}
              setTime={setTime}
            />
          )}
          <Controller
            control={control}
            name="taskDate"
            defaultValue=""
            render={({
              field: { ref, ...field }, // acquire ref
            }) => (
              <StatefulPopover
                content={({ close }) => (
                  <DatePicker
                    ref={ref}
                    overrides={{
                      Root: { className: 'max-[767px]:w-80' },
                      CalendarHeader: {
                        props: { className: 'max-[767px]:w-80' },
                      },
                      MonthHeader: {
                        props: { className: 'max-[767px]:w-80' },
                      },
                      Week: {
                        props: { className: 'max-[767px]:w-80' },
                      },
                      Day: {
                        props: {
                          className: 'max-[767px]:w-[3.5rem]',
                        },
                      },
                    }}
                    {...field}
                    onChange={({ date }) => {
                      field.onChange(date);
                      if (isEditing) {
                        onSubmit();
                      }

                      close();
                    }}
                  />
                )}
                returnFocus
                placement="bottom"
              >
                <div className="pb-3 px-3" role="button">
                  <Calendar />
                </div>
              </StatefulPopover>
            )}
          />
          {trackingMode === 'manual' && (
            <DurationInput
              overrides={{
                Root: {
                  props: {
                    className:
                      'border-t-0 border-x-0 border-b-gray-300 rounded-none mb-2 max-w-[6rem] max-[575px]:hidden',
                  },
                },
                Input: {
                  props: {
                    className: 'placeholder:text-gray-500 pl-4 bg-white',
                  },
                },
              }}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              value={duration}
              onBlur={durationHandler}
              setValue={(value) => setDuration(value)}
            />
          )}

          {trackingMode === 'manual' ? (
            !isEditing && (
              <Button
                className="bg-blue-400 mb-3"
                size="compact"
                type="submit"
                isLoading={isLoading}
              >
                Add
              </Button>
            )
          ) : (
            <Button
              className={clsx('bg-blue-400 mb-3', { 'bg-red-400': timer })}
              size="compact"
              onClick={timerHandler}
              isLoading={isLoading}
            >
              {timer ? 'Stop' : 'Start'}
            </Button>
          )}
          {trackingMode === 'timer' && timer ? (
            <Button
              className="mb-3 bg-white text-sm text-red-400 hover:bg-slate-100"
              size="compact"
              onClick={() => {
                setTime(0);
                setTimer((prev) => !prev);
              }}
            >
              <X size={20} />
            </Button>
          ) : (
            <StatefulPopover
              content={({ close }) => (
                <ul className="bg-white rounded-md font-prompt overflow-hidden">
                  <li>
                    <Button
                      size="compact"
                      overrides={{
                        BaseButton: {
                          props: {
                            className: clsx('bg-white text-black z-50', {
                              'text-blue-400': trackingMode === 'manual',
                            }),
                          },
                        },
                      }}
                      onClick={() => {
                        setMode('manual');
                        close();
                      }}
                    >
                      Manual
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="compact"
                      overrides={{
                        BaseButton: {
                          props: {
                            className: clsx('bg-white text-black z-50', {
                              'text-blue-400': trackingMode === 'timer',
                            }),
                          },
                        },
                      }}
                      onClick={() => {
                        setMode('timer');
                        close();
                      }}
                    >
                      Timer
                    </Button>
                  </li>
                </ul>
              )}
              returnFocus
              placement="bottom"
            >
              <div
                className="pb-3 text-gray-400"
                role="button"
                aria-disabled={isLoading}
              >
                <MoreVertical />
              </div>
            </StatefulPopover>
          )}
        </div>
      </form>
    </div>
  );
}
