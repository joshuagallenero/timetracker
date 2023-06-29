import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { Skeleton } from 'baseui/skeleton';
import { useMemo, useState } from 'react';
import { Clock } from 'react-feather';

import DeleteRecordModal from './features/DeleteRecordModal';
import TimeRecordForm from './features/TimeRecordForm';

import { fetchTimeRecords, partialUpdateTimeRecord } from '../../api/records';
import addDurationStrings from '../../utils/addDurationStrings';
import getCurrentWeek from '../../utils/getCurrentWeek';

export default function RecordsList({ projects }) {
  const queryClient = useQueryClient();
  const {
    refetch,
    isError,
    isLoading,
    data: recordData,
  } = useQuery({
    queryKey: ['records'],
    queryFn: fetchTimeRecords,
  });

  const createTaskMutation = useMutation({
    mutationFn: partialUpdateTimeRecord,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });

  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);

  const [recordId, setRecordId] = useState('');

  const getCurrentWeekTotal = (records) => {
    if (records && records.length < 1) {
      return '00:00:00';
    }

    // reduce function adds all duration strings to get the current week's logged hours
    return records
      .map((record) => record.duration)
      .reduce((accumulator, currentValue) =>
        addDurationStrings(accumulator, currentValue),
      );
  };

  const weekIntervals = useMemo(() => {
    if (recordData && recordData.length > 0) {
      const dates = [];
      recordData.forEach((record) => {
        const { startTime } = record;
        const [firstDayOfTheWeek] = getCurrentWeek(startTime);

        /*
          To get each week interval for all time records, each beginning date of the week
          for each record is acquired and compared to. If it does not exist in the array, it is added
        */
        if (!dates.includes(firstDayOfTheWeek.toLocaleDateString()))
          dates.push(firstDayOfTheWeek.toLocaleDateString());
      });

      // Each date is then modified to be a tuple containing the start and end dates of the week
      dates.forEach((date, index) => {
        const [firstDay, lastDay] = getCurrentWeek(new Date(date));
        dates[index] = [firstDay, lastDay];
      });

      // Intervals are sorted to show the latest dates first
      return dates.sort((a, b) =>
        b[0].toLocaleDateString().localeCompare(a[0].toLocaleDateString()),
      );
    }
  }, [recordData]);

  const handleEditTask = (data) => {
    createTaskMutation.mutate({ data, queryParams: { id: data.id } });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <Skeleton rows={2} width="100%" animation />
        <Skeleton rows={6} width="100%" animation />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-full font-prompt bg-white p-4 md:grid">
        <div className="max-w-max">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Error
            </h3>
            <p className="mt-1 text-base text-gray-500">
              Failed to load data, please try again.
            </p>
          </div>
          <div className="mt-5">
            <Button kind="secondary" size="compact" onClick={refetch}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && !isError && recordData.length < 1) {
    return (
      <div
        role="list"
        aria-label="comments"
        className="flex flex-col justify-center items-center space-y-2 pt-4 text-gray-500"
      >
        <Clock className="h-10 w-10" />
        <h4>No time tracked. Create a record now!</h4>
      </div>
    );
  }

  return (
    <>
      <DeleteRecordModal
        isOpen={deleteModalVisibility}
        setVisibility={setDeleteModalVisibility}
        recordId={recordId}
      />
      <div className="flex flex-1 flex-col space-y-4">
        <h1>Current Week:</h1>

        {weekIntervals &&
          weekIntervals.length > 0 &&
          weekIntervals.map(([firstDayOfTheWeek, lastDayOfTheWeek]) => (
            <div key={firstDayOfTheWeek} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  {firstDayOfTheWeek.toLocaleDateString('default', {
                    month: 'long',
                    day: '2-digit',
                  })}{' '}
                  -{' '}
                  {lastDayOfTheWeek.toLocaleDateString('default', {
                    month: 'long',
                    day: '2-digit',
                  })}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Week Total: </span>
                  {getCurrentWeekTotal(
                    recordData.filter((record) => {
                      const [recordFirstDay] = getCurrentWeek(
                        new Date(record.time_started),
                      );

                      return (
                        firstDayOfTheWeek.toLocaleDateString() ===
                        recordFirstDay.toLocaleDateString()
                      );
                    }),
                  )}
                </div>
              </div>

              <ul className="flex flex-col mb-4 space-y-4">
                {recordData
                  .sort((a, b) => b.time_started.localeCompare(a.time_started))
                  .map((record, index) => {
                    const [recordFirstDay] = getCurrentWeek(
                      new Date(record.time_started),
                    );

                    if (
                      firstDayOfTheWeek.toLocaleDateString() ===
                      recordFirstDay.toLocaleDateString()
                    ) {
                      return (
                        <li key={record.id || index}>
                          <TimeRecordForm
                            isEditing={true}
                            projects={projects}
                            initialValues={{
                              // have to assign taskDate and startTime here; for some reason declaring them in `records.js` doesn't give accurate dates
                              ...record,
                              taskDate: new Date(record.time_started),
                              startTime: new Date(record.time_started),
                            }}
                            onSubmitHandler={handleEditTask}
                            onDeleteHandler={() => {
                              setRecordId(record.id);
                              setDeleteModalVisibility((prev) => !prev);
                            }}
                          />
                        </li>
                      );
                    }

                    return <></>;
                  })}
              </ul>
            </div>
          ))}
      </div>
    </>
  );
}
