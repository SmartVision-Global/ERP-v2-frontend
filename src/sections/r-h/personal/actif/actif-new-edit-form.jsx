import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader, Typography } from '@mui/material';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  firstname: zod.string().min(1, { message: 'Name is required!' }),
  lastname: zod.string().min(1, { message: 'Name is required!' }),
  birthday: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  location: zod.string().min(1, { message: 'Name is required!' }),
  sex: zod.string().min(1, { message: 'Name is required!' }),
  blood_type: zod.string().min(1, { message: 'Product code is required!' }),
  nationality: zod.string().min(1, { message: 'Name is required!' }),

  phone: zod.string().min(1, { message: 'Product sku is required!' }),
  national_service_status: zod.string().min(1, { message: 'Product sku is required!' }),
  email: zod.string().min(1, { message: 'Product sku is required!' }),
  social_number: zod.string().min(1, { message: 'Product sku is required!' }),
  adressFr: zod.string().min(1, { message: 'Product sku is required!' }),
  adressAr: zod.string().min(1, { message: 'Product sku is required!' }),

  national_number: zod.string().min(1, { message: 'Product sku is required!' }),
  image: schemaHelper.file({ message: 'Cover is required!' }),
  employment_certificate: schemaHelper.file({ message: 'Cover is required!' }),
  father_lastname: zod.string().min(1, { message: 'Product sku is required!' }),
  mother_firstname: zod.string().min(1, { message: 'Product sku is required!' }),
  mother_lastname: zod.string().min(1, { message: 'Product sku is required!' }),

  // Informations Familiales
  family_situation: zod.string().min(1, { message: 'Product sku is required!' }),

  // Emplacement et Structure Organisationnelle
  subsidiary: zod.string().min(1, { message: 'Product sku is required!' }),
  direction: zod.string().min(1, { message: 'Product sku is required!' }),
  site: zod.string().min(1, { message: 'Product sku is required!' }),
  division: zod.string().min(1, { message: 'Product sku is required!' }),
  department: zod.string().min(1, { message: 'Product sku is required!' }),
  sections: zod.string().min(1, { message: 'Product sku is required!' }),
  workshop: zod.string().min(1, { message: 'Product sku is required!' }),
  machine: zod.string().min(1, { message: 'Product sku is required!' }),
  area: zod.string().min(1, { message: 'Product sku is required!' }),

  // Informations sur l'Emploi
  company: zod.string().min(1, { message: 'Product sku is required!' }),
  function: zod.string().min(1, { message: 'Product sku is required!' }),
  category: zod.string().min(1, { message: 'Product sku is required!' }),
  steps: zod.string().min(1, { message: 'Product sku is required!' }),
  salary_grid_level: zod.string().min(1, { message: 'Product sku is required!' }),
  net_payable: zod.string().min(1, { message: 'Product sku is required!' }),
  salary_supplement: zod.string().min(1, { message: 'Product sku is required!' }),
  work_schedule: zod.string().min(1, { message: 'Product sku is required!' }),
  agencies: zod.string().min(1, { message: 'Product sku is required!' }),
  overtime: zod.boolean(),
  stock_withdrawals: zod.boolean(),
  professional_experience_allowance: zod.boolean(),
  contribution_scheme: zod.string().min(1, { message: 'Product sku is required!' }),
  calculation_method: zod.string().min(1, { message: 'Product sku is required!' }),
  days_per_month: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  hours_per_month: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  declaration_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  entry_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),

  // Informations de la contra
  contract_type: zod.string().min(1, { message: 'Product sku is required!' }),
  start_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  end_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  probation: schemaHelper.nullableInput(
    zod.number({ coerce: true }).min(1, { message: 'Quantity is required!' }),
    {
      // message for null value
      message: 'Quantity is required!',
    }
  ),
  paymant_type: zod.string().min(1, { message: 'Product sku is required!' }),
  rib: zod.string().min(1, { message: 'Product sku is required!' }),
  bank: zod.string().min(1, { message: 'Product sku is required!' }),
});

export function ActifNewEditForm({ currentProduct }) {
  const defaultValues = {
    firstname: '',
    lastname: '',
    birthday: null,
    location: '',
    /********/
    sex: 'male',
    blood_type: '',
    nationality: '',
    phone: '',
    national_service_status: '',
    email: '',
    social_number: '',
    adressFr: '',
    adressAr: '',

    // category: PRODUCT_CATEGORY_GROUP_OPTIONS[0].classify[1],
    national_number: '',
    birth_certificate_number: '',
    image: null,
    employment_certificate: null,
    father_lastname: '',
    mother_firstname: '',
    morther_lastname: '',
    // Informations Familiales
    family_situation: '',

    // Emplacement et Structure Organisationnelle
    subsidiary: '',
    direction: '',
    site: '',
    division: '',
    department: '',
    sections: '',
    workshop: '',
    machine: '',
    area: '',
    // Informations sur l'Emploi
    company: '',
    function: '',
    category: '',
    steps: '',
    salary_grid_level: '',
    net_payable: '',
    salary_supplement: null,
    work_schedule: '',
    agencies: '',
    overtime: false,
    stock_withdrawals: false,
    professional_experience_allowance: false,
    contribution_scheme: '',
    calculation_method: '',
    days_per_month: null,
    hours_per_month: null,
    declaration_date: null,
    entry_date: null,
    contract_type: '',
    start_date: null,
    end_date: null,
    probation: '',
    paymant_type: '',
    rib: '',
    bank: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
    reset,
    // watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();
  const handleRemoveImage = useCallback(() => {
    setValue('image', null);
  }, [setValue]);
  const handleRemoveCertificate = useCallback(() => {
    setValue('employment_certificate', null);
  }, [setValue]);
  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      // toast.success(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
      console.info('DATA', updatedData);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Informations personnelles"
        // subheader="Nom, Prénom, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="firstname" label="Product name" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="lastname" label="Sub description" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="birthday" label="Date de naissance" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="location" label="Lieu de naissance" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="sex" label="Sexe" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="blood_type" label="Groupe sanguin" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="nationality" label="Nationalité" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="phone" label="Téléphone" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select
              name="national_service_status"
              label="Situation Service National"
              size="small"
            >
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="email" label="Email" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="social_number" label="Numéro de sécurité sociale" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="adressFr" label="Adresse" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="adressAr" label="العنوان" dir="rtl" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="national_number" label="Numéro national" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="birth_certificate_number" label="Numéro d'acte de naissance" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Photo de l&apos;employé</Typography>
              <Field.Upload name="image" maxSize={3145728} onDelete={handleRemoveImage} />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Certificat d&apos;embauche</Typography>
              <Field.Upload
                name="employment_certificate"
                maxSize={3145728}
                onDelete={handleRemoveCertificate}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="father_lastname" label="Prénom Pere" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="mother_lastname" label="Nom Mere" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="mother_firstname" label="Prénom Mere" />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
  const renderFamilyInformation = () => (
    <Card>
      <CardHeader
        title="Informations Familiales"
        // subheader="Nom, Prenom, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="family_situation" label="Situation familiale " size="small">
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
  const renderLocationOrganizationalStructure = () => (
    <Card>
      <CardHeader
        title="Emplacement et Structure Organisationnelle"
        // subheader="Nom, Prenom, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="subsidiary" label="Filiale" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="direction" label="Direction" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="site" label="Site" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="division" label="Division" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="departement" label="Departement" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="sections" label="Sections" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="workshop" label="Atelier" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="machine" label="Machine" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="area" label="Zone" size="small">
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

  const renderEmploymentInformation = () => (
    <Card>
      <CardHeader
        title="Informations sur l'Emploi"
        // subheader="Nom, Prenom, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="company" label="Societé" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="fonction" label="Fonction" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="category" label="Catégorie socio-professionnelle" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="steps" label="Échelons" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="salary_grid_level" label="Niveau de grille salariale" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="net_payable" label="Net à payer" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="salary_supplement"
              label="Complément Salaire"
              placeholder="0"
              type="number"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="work_schedule" label="Régime de travail" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="agencies" label="Agences" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} />
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Switch
              name="overtime"
              labelPlacement="start"
              label="Peut effectuer des heures supplémentaires"
              // sx={{ mt: 5, justidyContent: 'space-between' }}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Switch
              name="stock_withdrawals"
              labelPlacement="start"
              label="Peut effectuer des prélèvements du stock"
              // sx={{ mt: 5 }}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Switch
              name="professional_experience_allowance"
              labelPlacement="start"
              label="Indemnité d'expérience professionnelle"
              // sx={{ mt: 5 }}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} />

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="contribution_scheme" label="Regime de cotisation" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select
              name="calculation_method"
              label="Méthode de calcul de la paie"
              size="small"
            >
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Jours par mois" sx={{ alignItems: 'center' }}>
              <Field.NumberInput name="days_per_month" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Heures par mois" sx={{ alignItems: 'center' }}>
              <Field.NumberInput name="hours_per_month" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="declaration_date" label="Date déclaration" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="entry_date" label="Date entrée" />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
  const renderContractInformation = () => (
    <Card>
      <CardHeader
        title="Informations de la contrat"
        // subheader="Nom, Prenom, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="contract_type" label="Type de contrat" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="start_date" label="Du" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="end_date" label="Au" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* <Field.Text
              name="probation"
              label="Probation"
              placeholder="0"
              type="number"
              slotProps={{ inputLabel: { shrink: true } }}
            /> */}
            <FieldContainer label="Probation" sx={{ alignItems: 'center' }}>
              <Field.NumberInput name="probation" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="paymant_type" label="Type de paiement" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="rib" label="RIB" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="bank" label="Banque" size="small">
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

  const renderActions = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {/* <FormControlLabel
        label="Publish"
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        sx={{ pl: 3, flexGrow: 1 }}
      /> */}

      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create product' : 'Save changes'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {renderDetails()}
        {renderFamilyInformation()}
        {renderLocationOrganizationalStructure()}
        {renderEmploymentInformation()}
        {renderContractInformation()}
        {renderActions()}
      </Stack>
    </Form>
  );
}

function FieldContainer({ sx, children, label = 'RHFTextField' }) {
  return (
    <Box
      sx={[
        () => ({
          gap: 1,
          width: 1,
          display: 'flex',
          // flexDirection: 'row',
          justifyContent: 'space-between',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        variant="caption"
        sx={[
          (theme) => ({
            textAlign: 'right',
            // fontStyle: 'italic',
            // color: 'text.disabled',
            fontSize: theme.typography.pxToRem(12),
          }),
        ]}
      >
        {label}
      </Typography>

      {children}
    </Box>
  );
}
