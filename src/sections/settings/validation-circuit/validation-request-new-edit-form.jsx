import { z as zod } from 'zod';
import PropTypes from 'prop-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import {
  Card,
  Stack,
  Button,
  Divider,
  MenuItem,
  IconButton,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

const ValidationRequestSchema = zod.object({
  target_action: zod.string(),
  type: zod.string().min(1, { message: 'Type is required' }),
  steps: zod
    .array(
      zod.object({
        name: zod.string().min(1, { message: 'Name is required' }),
        description: zod.string().optional(),
        required_approvals: zod
          .number({ coerce: true })
          .min(1, { message: 'Required approvals must be at least 1' }),
        order: zod.number({ coerce: true }).min(1, { message: 'Order must be at least 1' }),
        users: zod.array(zod.number()).min(1, { message: 'At least one user must be selected' }),
      })
    )
    .min(1, { message: 'At least one step is required' }),
});

const TYPE_OPTIONS = [
  { label: 'Sequential', value: 'sequential' },
  { label: 'Parallel', value: 'parallel' },
];

// Mock users for now.
const MOCK_USERS = [
    { value: 1, label: 'User 1' },
    { value: 2, label: 'User 2' },
    { value: 3, label: 'User 3' },
    { value: 4, label: 'User 4' },
]

export function ValidationRequestNewEditForm({ targetAction, onEnd, onCancel }) {
  const defaultValues = {
    target_action: targetAction,
    type: 'sequential',
    steps: [],
  };

  const methods = useForm({
    resolver: zodResolver(ValidationRequestSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('SUBMITTING DATA', data);
      // await createValidationCircuit(data);
      onEnd();
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddStep = () => {
    append({
      name: '',
      description: '',
      required_approvals: 1,
      order: fields.length + 1,
      users: [],
    });
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ p: 1 }}>
      
        <Field.Select name="type" label="Type" size="small">
          {TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Field.Select>
        
        <Divider />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Steps</Typography>
          <Button startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleAddStep}>
            Add Step
          </Button>
        </Stack>

        <Stack spacing={3}>
          {fields.map((item, index) => (
            <Card key={item.id} sx={{ p: 2, position: 'relative' }}>
              <IconButton onClick={() => remove(index)} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Iconify icon="eva:close-fill" />
              </IconButton>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Field.Text name={`steps.${index}.name`} label="Name" />
                <Field.Text
                  name={`steps.${index}.description`}
                  label="Description"
                  multiline
                  rows={2}
                />
                <Field.Select name={`steps.${index}.users`} label="Users" multiple>
                  {MOCK_USERS.map((user) => (
                    <MenuItem key={user.value} value={user.value}>
                      {user.label}
                    </MenuItem>
                  ))}
                </Field.Select>
                <Field.Number
                  name={`steps.${index}.required_approvals`}
                  label="Required Approvals"
                />
                <Field.Number name={`steps.${index}.order`} label="Order" />
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
        <Button color="inherit" variant="outlined" onClick={onCancel}>
          Close
        </Button>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Submit
        </LoadingButton>
      </Stack>
    </Form>
  );
}

ValidationRequestNewEditForm.propTypes = {
  targetAction: PropTypes.string,
  onEnd: PropTypes.func,
  onCancel: PropTypes.func,
}; 