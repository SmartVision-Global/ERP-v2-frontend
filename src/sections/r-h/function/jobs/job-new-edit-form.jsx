import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { USER_STATUS_OPTIONS } from 'src/_mock';
import { useMultiLookups } from 'src/actions/lookups';
import { createJob, updateJob } from 'src/actions/function';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  designation: zod.string().min(1, { message: 'Name is required!' }),
  site_id: zod.string().min(1, { message: 'Name is required!' }),
  salary_category_id: zod.string().min(1, { message: 'Name is required!' }),
  salary_grids: zod.string().min(1, { message: 'Name is required!' }),
  job_employee_quota: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  protective_clothing: zod.string().min(1, { message: 'Name is required!' }),
  have_premium: zod.string().min(1, { message: 'Name is required!' }),
  premium_amount: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99999999, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  max_absence_allowed: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  key_post: zod.string().min(1, { message: 'Name is required!' }),
  direction_id: zod.string().min(1, { message: 'Name is required!' }),
  service_id: zod.string().min(1, { message: 'Name is required!' }),
  job_code: zod.string().min(1, { message: 'Name is required!' }),
  manager_job_id: zod.string().optional(),
  mission_id: zod.string().min(1, { message: 'Name is required!' }),
  action_id: zod.string().min(1, { message: 'Name is required!' }),
  careerKnowledges: zod.array(zod.string()),
  dutiesResponsibilities: zod.array(zod.string()),
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

  const sites = dataLookups.sites;
  const salaryCategories = dataLookups.salaryCategories;
  const salaryGrids = dataLookups.salaryGrids;
  const directions = dataLookups.directions;
  const services = dataLookups.services;
  const jobs = dataLookups.jobs;
  const dutiesResponsibilities = dataLookups.dutiesResponsibilities;
  const careerKnowledges = dataLookups.careerKnowledges;

  const defaultValues = {
    name: '',
    designation: '',
    site_id: '',
    salary_category_id: '',
    salary_grids: '',
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
      salary_grids: currentProduct?.salary_grids,
      job_employee_quota: currentProduct?.job_employee_quota,
      protective_clothing: currentProduct?.protective_clothing ? 'yes' : 'no',
      have_premium: currentProduct?.have_premium ? 'yes' : 'no',
      premium_amount: currentProduct?.premium_amount,
      max_absence_allowed: currentProduct?.max_absence_allowed,
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
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      // ...data,
      name: data.name,
      designation: data.designation,
      site_id: parseInt(data.site_id),
      salary_category_id: parseInt(data.salary_category_id),
      direction_id: parseInt(data.direction_id),
      service_id: parseInt(data.service_id),
      manager_job_id: parseInt(data.manager_job_id),
      mission_id: null,
      action_id: null,
      key_post: data.key_post === 'yes' ? true : false,
      job_code: data.job_code,
      job_employee_quota: `${data.job_employee_quota}`,
      protective_clothing: data.protective_clothing === 'yes' ? true : false,
      have_premium: data.have_premium === 'yes' ? true : false,
      premium_amount: data.premium_amount,
      max_absence_allowed: data.max_absence_allowed,
      salaryGrids: [parseInt(data.salary_grids)],
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
            <Field.Lookup name="salary_grids" label="Net à payer" data={salaryGrids} />

            {/* <Field.Select name="salary_grids" label="Net à payer" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
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
            <Field.Select name="mission_id" label="Missions" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* TODO */}
            <Field.Select name="action_id" label="Actes de Fonction" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
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
