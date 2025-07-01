import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { TimePicker } from '@mui/x-date-pickers';

import { formatPatterns } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function RHFTimePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          {...field}
          value={field.value ? dayjs(`1970-01-01T${field.value}`) : null}
          // onChange={(newValue) => field.onChange(dayjs(newValue).format())}
          onChange={(newValue) => {
            const formattedTime = newValue ? dayjs(newValue).format('HH:mm') : null;
            field.onChange(formattedTime);
          }}
          // format="HH:mm"
          format={formatPatterns.time}
          // format="HH:mm"
          ampm={false}
          slotProps={{
            ...slotProps,
            textField: {
              size: 'small',
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
              ...slotProps?.textField,
            },
          }}
          {...other}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------
