import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Stack,
  Select,
  Divider,
  MenuItem,
  CardHeader,
  InputLabel,
  FormControl,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { createJob, updateJob } from 'src/actions/function';
import { useGetLookups, useMultiLookups } from 'src/actions/lookups';

import { toast } from 'src/components/snackbar';
import { HelperText } from 'src/components/hook-form/help-text';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  designation: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  site_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  salary_category_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  salary_grids: zod.array(zod.string().or(zod.number())),
  job_employee_quota: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(0, { message: 'Veuillez remplir ce champ' })
      .max(99, { message: 'Veuillez remplir ce champ' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  protective_clothing: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  have_premium: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  premium_amount: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(0, { message: 'Veuillez remplir ce champ' })
      .max(99999999, { message: 'Veuillez remplir ce champ' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  max_absence_allowed: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(0, { message: 'Veuillez remplir ce champ' })
      .max(99, { message: 'Veuillez remplir ce champ' }),
    // message for null value
    { message: 'Veuillez remplir ce champ' }
  ),
  key_post: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  direction_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  service_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  job_code: zod.string().optional().nullable(),
  manager_job_id: zod.string().optional().nullable(),
  mission_id: zod.string().optional().nullable(),
  action_id: zod.string().optional().nullable(),
  careerKnowledges: zod.array(zod.string()),
  dutiesResponsibilities: zod.array(zod.string()),
  // content: schemaHelper
  //   .editor()
  //   .min(100, { message: 'Content must be at least 100 characters' })
  //   .max(500, { message: 'Content must be less than 500 characters' }),
});

export function JobNewEditForm({ currentProduct }) {
  const router = useRouter();

  const { dataLookups } = useMultiLookups([
    { entity: 'sites', url: 'settings/lookups/sites' },
    { entity: 'salaryCategories', url: 'hr/lookups/identification/salary_category' },
    { entity: 'salaryGrids', url: 'hr/lookups/salary_grids' },
    { entity: 'directions', url: 'hr/lookups/identification/direction' },
    { entity: 'services', url: 'settings/lookups/services' },
    { entity: 'jobs', url: 'hr/lookups/jobs' },
    { entity: 'dutiesResponsibilities', url: 'hr/lookups/duties_responsibilities' },
    { entity: 'careerKnowledges', url: 'hr/lookups/career_knowledges' },
  ]);

  const { data: missions } = useGetLookups('hr/lookups/duties_responsibilities', {
    type: 1,
  });

  const { data: actions } = useGetLookups('hr/lookups/duties_responsibilities', {
    type: 2,
  });

  const sites = dataLookups.sites;
  const salaryCategories = dataLookups.salaryCategories;
  const salaryGrids = dataLookups.salaryGrids;
  const directions = dataLookups.directions;
  const services = dataLookups.services;
  const jobs = dataLookups.jobs;
  const dutiesResponsibilities = dataLookups.dutiesResponsibilities;
  const careerKnowledges = dataLookups.careerKnowledges;
  console.log('salaryGrids', salaryGrids);

  const defaultValues = {
    name: '',
    designation: '',
    site_id: '',
    salary_category_id: '',
    salary_grids: [],
    job_employee_quota: 0,
    protective_clothing: 'no',
    have_premium: 'no',
    premium_amount: 0,
    max_absence_allowed: 0,
    key_post: 'yes',
    direction_id: '',
    service_id: '',
    job_code: '',
    manager_job_id: '',
    mission_id: '',
    action_id: '',
    careerKnowledges: [],
    dutiesResponsibilities: [],
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: {
      name: currentProduct?.name,
      designation: currentProduct?.designation,
      site_id: currentProduct?.site_id ? currentProduct?.site_id.toString() : '',
      salary_category_id: currentProduct?.salary_category_id?.toString() || '',
      salary_grids: currentProduct?.salary_grids?.map(String) || [],
      job_employee_quota: currentProduct?.job_employee_quota || 0,
      protective_clothing: currentProduct?.protective_clothing ? 'yes' : 'no',
      have_premium: currentProduct?.have_premium ? 'yes' : 'no',
      premium_amount: currentProduct?.premium_amount || 0,
      max_absence_allowed: currentProduct?.max_absence_allowed || 0,
      key_post: currentProduct?.key_post ? 'yes' : 'no',
      direction_id: currentProduct?.direction_id?.toString() || '',
      service_id: currentProduct?.service_id?.toString() || '',
      job_code: currentProduct?.job_code,
      manager_job_id: currentProduct?.manager_job_id?.toString() || '',
      mission_id: currentProduct?.mission_id?.toString() || '',
      action_id: currentProduct?.action_id?.toString() || '',
      dutiesResponsibilities:
        currentProduct?.duties_responsibilities?.map((item) => `${item}`) || [],
      careerKnowledges: currentProduct?.career_knowledges?.map((item) => `${item}`) || [],
    },
  });

  const {
    watch,
    control,
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  console.log('err', errors);
  const handleSalaryGridsChange = (ev) => {
    const isValid = validateSelection(ev.target.value, salaryGrids);
    if (!isValid) {
      showError({
        message:
          'You can not select two salary grid with different base salary or with same net salary',
      });
      return values.salary_grids;
    }
    return ev.target.value;
  };
  const validateSelection = (selectedValues, allData) => {
    // Find the full objects for the selected values
    const selectedItems = allData.filter(
      (item) => selectedValues.includes(item.value) || selectedValues.includes(`${item.value}`)
    );

    // If 1 or 0 items are selected, the conditions don't apply, so it's valid
    if (selectedItems.length <= 1) {
      return true;
    }

    // 1. Check if all salaries are the same
    const firstSalary = Number(selectedItems[0].salary);
    const allSalariesAreTheSame = selectedItems.every(
      (item) => Number(item.salary) === firstSalary
    );

    if (!allSalariesAreTheSame) {
      console.error('Validation failed: Salaries are not the same.');
      return false;
    }

    // 2. Check if all net_salaries are different
    const netSalaries = selectedItems.map((item) => Number(item.net_salary));
    const uniqueNetSalaries = new Set(netSalaries);
    const allNetSalariesAreDifferent = netSalaries.length === uniqueNetSalaries.size;

    if (!allNetSalariesAreDifferent) {
      console.error('Validation failed: Net salaries must be different.');
      return false;
    }

    // If both checks pass, the selection is valid
    return true;
  };
  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      // ...data,
      name: data.name,
      designation: data.designation,
      site_id: data.site_id,
      salary_category_id: data.salary_category_id,
      direction_id: data.direction_id,
      service_id: data.service_id,
      manager_job_id: data.manager_job_id,
      mission_id: data.mission_id,
      action_id: data.action_id,
      key_post: data.key_post === 'yes' ? true : false,
      job_code: data.job_code,
      job_employee_quota: `${data.job_employee_quota}`,
      protective_clothing: data.protective_clothing === 'yes' ? true : false,
      have_premium: data.have_premium === 'yes' ? true : false,
      premium_amount: data.premium_amount,
      max_absence_allowed: data.max_absence_allowed,
      salaryGrids: data.salary_grids,
      careerKnowledges: data.careerKnowledges,
      dutiesResponsibilities: data.dutiesResponsibilities,
    };

    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentProduct) {
        await updateJob(currentProduct.id, updatedData);
      } else {
        await createJob(updatedData);
      }

      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.fonction.fonctions);
      console.info('DATA', updatedData);
    } catch (error) {
      showError(error, setError);

      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Gestion des Fonctions des Employés"
        subheader="Cette section vous permet de gérer les informations relatives aux différentes fonctions des employés au sein de l'entreprise"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Libellé" />
        <Field.Text name="designation" label="Designation" multiline rows={3} />
        {/* <Field.Editor name="content" sx={{ maxHeight: 480 }} /> */}
      </Stack>
    </Card>
  );

  const renderOptionelInfo = () => (
    <Card>
      <CardHeader title="Information optionnelle" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Field.Lookup name="site_id" label="Site" data={sites} />
          {/* <Field.Select name="site_id" label="Site" size="small">
            {PRODUCT_SITE_OPTIONS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Field.Select> */}
          <Field.Lookup
            name="salary_category_id"
            label="Catégorie socio-professionnelle"
            data={salaryCategories}
          />

          {/* <Field.Select name="salary_category_id" label="Catégorie socio-professionnelle" size="small">
            {SALARY_CATEGORY_OPTIONS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Field.Select> */}
        </Stack>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* <Field.LookupMultiSelect
              name="salary_grids"
              label="Net à payer"
              options={salaryGrids}
              // <FormLabel htmlFor={labelId} {...slotProps?.inputLabel}>
              slotProps={{
                inputLabel: { shrink: true },
              }}
            /> */}
            <Controller
              name="salary_grids"
              control={control}
              render={({ field, fieldState: { error } }) => {
                const labelId = `salary-grids-multi-select`;
                const renderLabel = () => <InputLabel htmlFor={labelId}>Net à payer</InputLabel>;

                const renderOptions = () =>
                  salaryGrids?.map((option) => (
                    <MenuItem key={`${option.value}`} value={`${option.value}`}>
                      {/* {checkbox && (
                <Checkbox
                  size="small"
                  disableRipple
                  checked={field.value.includes(`${option.value}`)}
                  {...slotProps?.checkbox}
                />
              )} */}

                      {option.text}
                    </MenuItem>
                  ));

                return (
                  <FormControl error={!!error} sx={{ width: '100%' }}>
                    {renderLabel()}

                    <Select
                      {...field}
                      onChange={(e) => field.onChange(handleSalaryGridsChange(e))}
                      size="small"
                      multiple
                      displayEmpty
                      // label={label}

                      renderValue={(selected) => {
                        const selectedItems = salaryGrids.filter(
                          (item) =>
                            selected.includes(`${item.value}`) || selected.includes(item.value)
                        );

                        // if (!selectedItems.length) {
                        //   return <Box sx={{ color: 'text.disabled' }}>Selectionner</Box>;
                        // }

                        // if (chip) {
                        //   return (
                        //     <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                        //       {selectedItems?.map((item) => (
                        //         <Chip
                        //           key={`${item.value}`}
                        //           size="small"
                        //           variant="soft"
                        //           label={item.text}
                        //           {...slotProps?.chip}
                        //         />
                        //       ))}
                        //     </Box>
                        //   );
                        // }

                        return selectedItems?.map((item) => item.text).join(', ');
                      }}
                      inputProps={{
                        id: `salary_grids-multi-select`,
                      }}
                    >
                      {renderOptions()}
                    </Select>

                    <HelperText
                      // {...slotProps?.helperText}
                      errorMessage={error?.message}
                      // helperText={helperText}
                    />
                  </FormControl>
                );
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="protective_clothing"
              label="Vêtements de protection"
              row
              options={[
                { label: 'Oui', value: 'yes' },
                { label: 'Non', value: 'no' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="have_premium"
              label="Prime de présence"
              row
              options={[
                { label: 'Oui', value: 'yes' },
                { label: 'Non', value: 'no' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Nombre de postes" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="job_employee_quota" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Montant" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="premium_amount" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Max de absence autorisé" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="max_absence_allowed" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="key_post"
              label="Poste clé"
              row
              options={[
                { label: 'Oui', value: 'yes' },
                { label: 'Non', value: 'no' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
  const renderJobDescription = () => (
    <Card>
      <CardHeader title="Fiche de poste" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="direction_id" label="Directions" data={directions} />

            {/* <Field.Select name="direction_id" label="Directions" size="small">
              {PRODUCT_DEPARTEMENT_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="service_id" label="Service" data={services} />

            {/* <Field.Select name="service_id" label="Service" size="small">
              {COMMUN_SERVICE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="job_code" label="Code Poste" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="manager_job_id" label="Responsable hiérarchique" data={jobs} />

            {/* <Field.Select name="manager_job_id" label="Responsable hiérarchique" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* TODO  */}
            <Field.Lookup name="mission_id" label="Missions" data={missions} />
            {/* {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="action_id" label="Actes de Fonction" data={actions} />
            {/* {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
  const renderTasks = () => (
    <Card>
      <CardHeader title="Les Tâches" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.MultiCheckboxLookup
              name="dutiesResponsibilities"
              label="Taches et resp"
              options={dutiesResponsibilities}
            />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
  const renderEducation = () => (
    <Card>
      <CardHeader title="Éducation et Expérience" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.MultiCheckboxLookup
              name="careerKnowledges"
              label="Taches et resp"
              options={careerKnowledges}
            />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
  const renderActions = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Ajouter' : 'Enregistrer les modifications'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {renderDetails()}
        {renderOptionelInfo()}
        {renderJobDescription()}
        {renderTasks()}
        {renderEducation()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
