import {
  Stack,
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

export function CalculationSalaryGridTableBody({
  payroll,
  fields,
  register,
  remove,
  update,
  setValue,
  setPayroll,
}) {
  // const cotis_impos = fields.filter((item) => item.contributory_imposable === 1);
  // const no_cotis_impos = fields.filter((item) => item.contributory_imposable === 2);
  // const no_cotis_no_impos = fields.filter((item) => item.contributory_imposable === 3);
  const combinedElements = [
    ...payroll.elements.map((el) => ({ ...el, source: 'server' })),
    ...fields.map((el, idx) => ({ ...el, source: 'form', formIndex: idx })),
  ];
  const newElements = sortElements(combinedElements);
  console.log('nnnnnnnnn', newElements);

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
      console.log('respo', response);
    } catch (error) {
      console.log(error);
      showError(error);
    }
  };

  return (
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
              0 // <TextField {...register(`elements.${element.formIndex}.amount`)} size="small" />
            ) : (
              <Typography variant="body2" fontWeight={500}>
                {fNumber(element.amount)}
              </Typography>
            )}

            {/* <Typography variant="body2" fontWeight={500}>
              {fNumber(element.amount)}
            </Typography> */}
          </TableCell>
          <TableCell>
            {/* <Typography variant="body2" fontWeight={500}>
              0
            </Typography> */}
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
              {/* {element.tax} */}0
            </Typography>
            {/* {element.source === 'form' ? (
              <TextField {...register(`elements.${element.formIndex}.percent`)} size="small" />
            ) : (
              <Typography variant="body2" fontWeight={500}>
                {fNumber(element.tax)}
              </Typography>
            )} */}
          </TableCell>
          <TableCell>
            {/* <Typography variant="body2" fontWeight={500}>
              {fNumber(element.salary_base)}
            </Typography> */}
            {element.source === 'form' ? (
              <TextField
                type="number"
                {...register(`elements.${element.formIndex}.amount`)}
                size="small"
                onChange={(e) => {
                  // eslint-disable-next-line no-debugger
                  debugger;
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
                {/* {fNumber(element.tax)} */}
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
              {element.is_deletable && (
                <TableCell>
                  <Tooltip title="Retirer">
                    <IconButton onClick={() => console.log('retirer')}>
                      {/* <Iconify icon="eva:person-done-fill" sx={{ color: 'success.main' }} /> */}
                      <Iconify icon="eva:trash-2-fill" sx={{ color: 'error.main' }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </>
          )}
        </TableRow>
      ))}
      {/* <TableRow>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>

        <TableCell>
          <Typography>Salaire de Base</Typography>
        </TableCell>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>
        <TableCell>
          <Typography>39,256.00</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>39,256.00</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography>3</Typography>
        </TableCell>

        <TableCell>
          <Typography>Indemnité d&apos;expérience professionnelle</Typography>
        </TableCell>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>
        <TableCell>
          <Typography>392.50</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>39,642.50</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography>1</Typography>
        </TableCell>

        <TableCell>
          <Typography> Prime de rendement individuel</Typography>
        </TableCell>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>
        <TableCell>
          <Typography>15,857.00</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography> 55,499.50</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>

        <TableCell>
          <Typography>SALAIRE DE POSTE</Typography>
        </TableCell>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>
        <TableCell>
          <Typography>55,499.50</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>55,499.50</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>

        <TableCell>
          <Typography>9 % SÉCURITÉ SOCIALE</Typography>
        </TableCell>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>
        <TableCell>
          <Typography>55,499.50</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>4,994.95</Typography>
        </TableCell>
        <TableCell>
          <Typography>50,504.54</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>

        <TableCell>
          <Typography>Panier</Typography>
        </TableCell>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>
        <TableCell>
          <Typography>7,700.00</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>58,204.54</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography>31</Typography>
        </TableCell>

        <TableCell>
          <Typography>Transport</Typography>
        </TableCell>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>
        <TableCell>
          <Typography>4,400.00</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>62,604.54</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>

        <TableCell>
          <Typography>SALAIRE IMPOSABLE</Typography>
        </TableCell>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>
        <TableCell>
          <Typography>62,604.54</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>62,604.54</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography>16</Typography>
        </TableCell>

        <TableCell>
          <Typography>IRG MENSUEL</Typography>
        </TableCell>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>
        <TableCell>
          <Typography>53,402.40</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>9,202.15</Typography>
        </TableCell>
        <TableCell>
          <Typography>53,402.40</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography>16</Typography>
        </TableCell>

        <TableCell>
          <Typography>SALAIRE NET</Typography>
        </TableCell>
        <TableCell>
          <Typography>30</Typography>
        </TableCell>
        <TableCell>
          <Typography>53,402.40</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>0</Typography>
        </TableCell>
        <TableCell>
          <Typography>53,402.40</Typography>
        </TableCell>
      </TableRow> */}
    </TableBody>
  );
}

// const sortElements = (elements,new) => {
//   // const serverElements = payroll.elements;

//   // Find last index with same contributory_imposable
//   const allElements = [...serverElements, ...newElements];
//   const lastIndex = [...allElements]
//     .map((el, index) => ({ value: el.contributory_imposable, index }))
//     .filter((item) => item.value === newElement.contributory_imposable)
//     .map((item) => item.index)
//     .pop();

//   // Compute the insert position within newElements
//   const serverLength = serverElements.length;
//   const relativeIndex = lastIndex >= serverLength ? lastIndex - serverLength + 1 : 0;

//   const updated = [
//     ...newElements.slice(0, relativeIndex),
//     newElement,
//     ...newElements.slice(relativeIndex),
//   ];

//   setNewElements(updated);
// };

const sortElements = (combinedElements) => {
  // const sortedCombined = combinedElements.sort((a, b) => {
  //   if (a.contributory_imposable === b.contributory_imposable) return 0;
  //   return a.contributory_imposable - b.contributory_imposable;
  // });
  // return sortedCombined;

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
