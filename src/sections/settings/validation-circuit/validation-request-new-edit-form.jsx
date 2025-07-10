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

import { createEntity } from 'src/actions/settings/validation-circuit';
import { VALIDATION_CIRCUIT_TYPE_OPTIONS } from 'src/_mock/settings/validation-circuit';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

const ValidationRequestSchema = zod.object({
  target_action: zod.string().min(1, { message: 'Target action is required' }),
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
        users: zod.array(zod.string()).min(1, { message: 'At least one user must be selected' }),
      })
    )
    .min(1, { message: 'At least one step is required' }),
});


// Mock users for now.
const MOCK_USERS = [
    { value: 1, text: 'User 1' },
    { value: 2, text: 'User 2' },
    { value: 3, text: 'User 3' },
    { value: 4, text: 'User 4' },
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
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('SUBMITTING DATA', data);
      // await createValidationCircuit(data);
      await createEntity(data);
      toast.success('Validation circuit created successfully');
      
      onEnd();
    } catch (error) {
      console.error(error);
      if (error && error.errors) {
        Object.entries(error.errors).forEach(([key, value]) => {
          setError(key, { type: 'manual', message: value[0] });
        });
      }
      toast.error(error?.message || 'Operation failed');
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
          {VALIDATION_CIRCUIT_TYPE_OPTIONS.map((option) => (
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

          {!!errors.steps && <Typography color="error" sx={{ mt: 2 }}>{errors.steps.message}</Typography>}
        <Stack spacing={3}>
          {fields.map((item, index) => (
            <Card
              key={item.id}
              sx={{
                p: 2,
                pt: 5,
                position: 'relative',
                border: '1px solid',
                borderColor: 'grey.500',
                boxShadow: 1,
              }}
            >
              <IconButton
                color="error"
                onClick={() => remove(index)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Field.Text name={`steps.${index}.name`} label="Name" />
                <Field.Text
                  name={`steps.${index}.description`}
                  label="Description"
                  multiline
                  rows={2}
                />
                <Field.LookupMultiSelect name={`steps.${index}.users`} label="Users" options={MOCK_USERS} />
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