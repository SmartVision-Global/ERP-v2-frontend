import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import {
  Stack,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import { fNumber } from 'src/utils/format-number';
import { showError } from 'src/utils/toast-error';

import { createPersonalPayroll } from 'src/actions/payroll-calculation';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

export function CalculationSalaryGridTableBody({
  payroll,
  fields,
  register,
  remove,
  update,
  setValue,
  setPayroll,
}) {
  const [elementId, setElementId] = useState();
  const confirmDialog = useBoolean();

  const combinedElements = [
    ...payroll.elements.map((el) => ({ ...el, source: 'server' })),
    ...fields.map((el, idx) => ({ ...el, source: 'form', formIndex: idx })),
  ];
  const newElements = sortElements(combinedElements);
  console.log('fields', fields);

  const handleCalculatePayroll = async (id, newItem) => {
    const newAddElement = {
      deduction_compensation_id: newItem.id,
      percentage_amount: newItem.percent,
      amount: newItem.amount,
    };
    const dataPayroll = {
      additional_elements: [newAddElement],
      removed_elements: [],
    };
    try {
      const response = await createPersonalPayroll(id, dataPayroll);
      setPayroll(response.data?.data);
      setValue('elements', []);
      console.log('respo', response);
    } catch (error) {
      console.log(error);
      showError(error);
    }
  };

  const handleRemoveElement = async () => {
    const dataPayroll = {
      additional_elements: [],
      removed_elements: [elementId],
    };
    try {
      const response = await createPersonalPayroll(payroll.id, dataPayroll);
      setPayroll(response.data?.data);
      console.log('respo', response);
    } catch (error) {
      console.log(error);
      showError(error);
    }
  };
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Supprimer"
      content={<>Êtes-vous sûr de vouloir effacer ?</>}
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            // handleDeleteRows();
            handleRemoveElement();
            confirmDialog.onFalse();
          }}
        >
          Supprimer
        </Button>
      }
    />
  );
  return (
    <>
      <TableBody>
        {newElements?.map((element) => (
          <TableRow
            key={element.name}
            sx={{
              backgroundColor:
                element.name === 'Salaire de poste' ||
                element.name === '9 % Sécuritê sociale' ||
                element.name === 'Salaire Imposable' ||
                element.name === 'IRG Mensuel'
                  ? 'success.lighter'
                  : 'inherit',
            }}
          >
            <TableCell>
              <Typography variant="body2">{element.type}</Typography>
            </TableCell>

            <TableCell>
              <Typography variant="body2" fontWeight={500}>
                {element.name}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body2" fontWeight={500}>
                {element.source === 'form' ? newElements[0].amount : element.day_base}
                {/* {element.day_base} */}
              </Typography>
            </TableCell>
            <TableCell>
              {element.source === 'form' ? (
                0
              ) : (
                <Typography variant="body2" fontWeight={500}>
                  {fNumber(element.amount)}
                </Typography>
              )}
            </TableCell>
            <TableCell>
              {element.source === 'form' ? (
                <TextField
                  {...register(`elements.${element.formIndex}.percent`)}
                  onChange={(e) => {
                    const newPercent = parseFloat(e.target.value);
                    if (isNaN(newPercent)) return;

                    const newAmount = (newPercent * newElements[0]?.salary_base) / 100;

                    update(element.formIndex, {
                      ...fields[element.formIndex],
                      tax: newPercent,
                      amount: Number(newAmount.toFixed(2)),
                    });
                    setValue(`elements.${element.formIndex}.amount`, Number(newAmount.toFixed(2)));
                  }}
                  size="small"
                  type="number"
                />
              ) : (
                <Typography variant="body2" fontWeight={500}>
                  0
                </Typography>
              )}
            </TableCell>
            <TableCell>
              <Typography variant="body2" fontWeight={500}>
                0
              </Typography>
            </TableCell>
            <TableCell>
              {element.source === 'form' ? (
                <TextField
                  type="number"
                  {...register(`elements.${element.formIndex}.amount`)}
                  size="small"
                  onChange={(e) => {
                    const newAmount = parseFloat(e.target.value);
                    if (isNaN(newAmount)) return;

                    const newTax = (newAmount * 100) / newElements[0]?.salary_base;
                    console.log(newTax);

                    update(element.formIndex, {
                      ...fields[element.formIndex],
                      amount: newAmount,
                      percent: Number(newTax.toFixed(2)),
                    });
                    setValue(`elements.${element.formIndex}.percent`, Number(newTax.toFixed(2)));
                  }}
                />
              ) : (
                <Typography variant="body2" fontWeight={500}>
                  {fNumber(element.salary_base)}
                </Typography>
              )}
            </TableCell>
            {element.source === 'form' ? (
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Valider">
                    <IconButton onClick={() => handleCalculatePayroll(payroll.id, element)}>
                      <Iconify icon="eva:checkmark-fill" sx={{ color: 'success.main' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Retirer">
                    <IconButton onClick={() => remove(element.formIndex)}>
                      <Iconify icon="eva:trash-2-fill" sx={{ color: 'error.main' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            ) : (
              <>
                {payroll?.status === 1 && element.is_deletable && (
                  <TableCell>
                    <Tooltip title="Retirer">
                      <IconButton
                        onClick={() => {
                          setElementId(element.deduction_compensation_id);
                          confirmDialog.onTrue();
                        }}
                      >
                        <Iconify icon="eva:trash-2-fill" sx={{ color: 'error.main' }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
      {confirmDialog.value && elementId && renderConfirmDialog()}
    </>
  );
}

const sortElements = (combinedElements) => {
  // Step 1: Group by contributory_imposable
  const groups = {};
  for (const el of combinedElements) {
    const key = el.contributory_imposable;
    if (!groups[key]) groups[key] = [];
    groups[key].push(el);
  }

  const sortedResult = [];

  // Step 2: Sort keys
  const sortedKeys = Object.keys(groups).sort((a, b) => a - b);

  for (const key of sortedKeys) {
    const group = groups[key];

    // Handle contributory_imposable === 3 with custom logic
    if (Number(key) === 3) {
      const formElements = group.filter((el) => el.source === 'form');
      const serverElements = group.filter((el) => el.source === 'server');

      const lastServerIndex = serverElements.length - 1;

      const beforeLastServer = serverElements.slice(0, lastServerIndex);
      const lastServer = serverElements[lastServerIndex] ? [serverElements[lastServerIndex]] : [];

      // Add: server elements (before last), then form, then last server
      sortedResult.push(...beforeLastServer, ...formElements, ...lastServer);
    } else {
      // Default: just append the group as-is
      sortedResult.push(...group);
    }
  }

  return sortedResult;
};
