import { z as zod } from 'zod';
import { useCallback } from 'react';
import InputMask from 'react-input-mask';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Stack,
  Divider,
  MenuItem,
  TextField,
  CardHeader,
  Typography,
} from '@mui/material';

import {
  DAS_DENOM_OPTIONS,
  COMMUN_SEXE_OPTIONS,
  USER_STATUS_OPTIONS,
  PRODUCT_SITE_OPTIONS,
  SALARY_ECHEL_OPTIONS,
  JOB_SITUATION_OPTIONS,
  COMMUN_SERVICE_OPTIONS,
  SALARY_CATEGORY_OPTIONS,
  COMMUN_AGENCIES_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  PRODUCT_CONTRACT_OPTIONS,
  COMMUN_BLOOD_TYPE_OPTIONS,
  PRODUCT_TEAM_TYPE_OPTIONS,
  COMMUN_NATIONNALITY_OPTIONS,
  PRODUCT_DEPARTEMENT_OPTIONS,
  COMMUN_FAMILY_SITUATION_OPTIONS,
  COMMUN_GRID_SALARY_LEVEL_OPTIONS,
  COMMUN_CALCULATION_METHOD_OPTIONS,
  COMMUN_CONTRIBUTION_SCHEME_OPTIONS,
  COMMUN_NATIONAL_SERVICE_STATUS_OPTIONS,
} from 'src/_mock';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewProductSchema = zod
  .object({
    firstname_fr: zod.string().min(1, { message: 'firstname_fr is required!' }),
    lastname_fr: zod.string().min(1, { message: 'lastname_fr is required!' }),
    firstname_ar: zod.string().min(1, { message: 'firstname_ar is required!' }),
    lastname_ar: zod.string().min(1, { message: 'lastname_ar is required!' }),
    birthday: schemaHelper.date({ message: { required: 'birthday is required!' } }),
    location_fr: zod.string().min(1, { message: 'location_fr is required!' }),
    location_ar: zod.string().min(1, { message: 'location_ar is required!' }),
    sex: zod.string().min(1, { message: 'sex is required!' }),
    blood_type: zod.string().min(1, { message: 'blood_type code is required!' }),
    nationality: zod.string().min(1, { message: 'nationality is required!' }),

    phone: zod.string().min(1, { message: 'phone is required!' }),
    national_service_status: zod
      .string()
      .min(1, { message: 'national_service_status is required!' }),
    email: zod.string().min(1, { message: 'email is required!' }),
    social_number: zod.string().min(1, { message: 'social_number is required!' }),
    adressFr: zod.string().min(1, { message: 'adressFr is required!' }),
    adressAr: zod.string().min(1, { message: 'adressAr is required!' }),

    national_number: zod.string().min(1, { message: 'national_number is required!' }),
    birth_certificate_number: zod
      .string()
      .min(1, { message: 'birth_certificate_number is required!' }),
    image: schemaHelper.file({ message: 'image is required!' }),
    employment_certificate: schemaHelper.file({ message: 'employment_certificate is required!' }),
    father_lastname_fr: zod.string().min(1, { message: 'father_lastname_fr is required!' }),
    mother_firstname_fr: zod.string().min(1, { message: 'mother_firstname_fr is required!' }),
    mother_lastname_fr: zod.string().min(1, { message: 'mother_lastname_fr is required!' }),
    father_lastname_ar: zod.string().min(1, { message: 'father_lastname_ar is required!' }),
    mother_firstname_ar: zod.string().min(1, { message: 'mother_firstname_ar is required!' }),
    mother_lastname_ar: zod.string().min(1, { message: 'mother_lastname_ar is required!' }),

    // Informations Familiales
    family_situation: zod.string().min(1, { message: 'family_situation is required!' }),
    children_number: schemaHelper.nullableInput(zod.number({ coerce: true }).optional()),
    children_number_min: schemaHelper.nullableInput(zod.number({ coerce: true }).optional()),
    spouse_fullname_fr: zod.string().optional(),
    spouse_fullname_ar: zod.string().optional(),
    spouse_job: zod.string().optional(),
    spouse_phone: zod.string().optional(),

    // Education
    education: zod.string().min(1, { message: 'Education is required!' }),
    speciality: zod.string().min(1, { message: 'speciality is required!' }),

    // Emplacement et Structure Organisationnelle
    subsidiary: zod.string().min(1, { message: 'subsidiary is required!' }),
    direction: zod.string().min(1, { message: 'direction is required!' }),
    site: zod.string().min(1, { message: 'site is required!' }),
    lieu: zod.string().min(1, { message: 'lieu is required!' }),

    division: zod.string().min(1, { message: 'division is required!' }),
    department: zod.string().min(1, { message: 'department is required!' }),
    sections: zod.string().min(1, { message: 'sections is required!' }),
    workshop: zod.string().min(1, { message: 'workshop is required!' }),
    machine: zod.string().min(1, { message: 'machine is required!' }),
    area: zod.string().min(1, { message: 'area is required!' }),

    // Informations sur l'Emploi
    company: zod.string().min(1, { message: 'company is required!' }),
    function: zod.string().min(1, { message: 'function is required!' }),
    category: zod.string().min(1, { message: 'category is required!' }),
    steps: zod.string().min(1, { message: 'steps is required!' }),
    salary_grid_level: zod.string().min(1, { message: 'salary_grid_level is required!' }),
    net_payable: zod.string().min(1, { message: 'net_payable is required!' }),
    salary_supplement: zod.number().min(1, { message: 'salary_supplement is required!' }),
    work_schedule: zod.string().min(1, { message: 'work_schedule is required!' }),
    agencies: zod.string().min(1, { message: 'agencies is required!' }),
    overtime: zod.boolean(),
    stock_withdrawals: zod.boolean(),
    professional_experience_allowance: zod.boolean(),
    contribution_scheme: zod.string().min(1, { message: 'contribution_scheme is required!' }),
    calculation_method: zod.string().min(1, { message: 'calculation_method is required!' }),
    days_per_month: schemaHelper.nullableInput(
      zod
        .number({ coerce: true })
        .min(1, { message: 'days_per_month is required!' })
        .max(99, { message: 'days_per_month must be between 1 and 99' }),
      // message for null value
      { message: 'days_per_month is required!' }
    ),
    hours_per_month: schemaHelper.nullableInput(
      zod
        .number({ coerce: true })
        .min(1, { message: 'hours_per_month is required!' })
        .max(99, { message: 'hours_per_month must be between 1 and 99' }),
      // message for null value
      { message: 'hours_per_month is required!' }
    ),
    declaration_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
    entry_date: schemaHelper.date({ message: { required: 'entry_date is required!' } }),

    // Informations de la contra
    contract_type: zod.string().min(1, { message: 'contract_type is required!' }),
    start_date: schemaHelper.date({ message: { required: 'start_date is required!' } }),
    end_date: schemaHelper.date({ message: { required: 'end_date is required!' } }),
    probation: schemaHelper.nullableInput(
      zod.number({ coerce: true }).min(1, { message: 'probation is required!' }),
      {
        // message for null value
        message: 'probation is required!',
      }
    ),
    paymant_type: zod.string().min(1, { message: 'paymant_type is required!' }),
    rib: zod.string().min(1, { message: 'rib is required!' }),
    bank: zod.string().min(1, { message: 'bank is required!' }),
  })
  .superRefine((data, ctx) => {
    if (data.family_situation === 'Marié') {
      if (!data.children_number) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Spouse's children number is required when married",
          path: ['children_number'],
        });
      }
      if (!data.children_number_min) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Spouse's children number min is required when married",
          path: ['children_number_min'],
        });
      }
      if (!data.spouse_fullname_fr) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Spouse's French name is required when married",
          path: ['spouse_fullname_fr'],
        });
      }
      if (!data.spouse_fullname_ar) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Spouse's Arabe name is required when married",
          path: ['spouse_fullname_ar'],
        });
      }
      if (!data.spouse_job) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Spouse's job is required when married",
          path: ['spouse_job'],
        });
      }
      if (!data.spouse_phone) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Spouse's phone is required when married",
          path: ['spouse_phone'],
        });
      }
    }
  });

export function ActifNewEditForm({ currentProduct }) {
  const defaultValues = {
    firstname_fr: '',
    firstname_ar: '',

    lastname_fr: '',
    lastname_ar: '',

    birthday: null,
    location_fr: '',
    location_ar: '',
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
    father_lastname_fr: '',
    mother_firstname_fr: '',
    mother_lastname_fr: '',
    father_lastname_ar: '',
    mother_firstname_ar: '',
    mother_lastname_ar: '',

    // Informations Familiales
    family_situation: '',
    children_number: 0,
    children_number_min: 0,
    spouse_fullname_fr: '',
    spouse_fullname_ar: '',
    spouse_job: '',
    spouse_phone: '',

    // Education
    education: '',
    speciality: '',

    // Emplacement et Structure Organisationnelle
    subsidiary: '',
    direction: '',
    lieu: '',
    site: '',
    division: '',
    department: 'AA',
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
    salary_supplement: 0,
    work_schedule: '',
    agencies: '',
    overtime: false,
    stock_withdrawals: false,
    professional_experience_allowance: false,
    contribution_scheme: '',
    calculation_method: '',
    days_per_month: 22,
    hours_per_month: 130,
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
    watch,
    setValue,
    control,
    handleSubmit,

    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();
  console.log('vallllllllllll', errors);

  const handleRemoveImage = useCallback(() => {
    setValue('image', null);
  }, [setValue]);
  const handleRemoveCertificate = useCallback(() => {
    setValue('employment_certificate', null);
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('submitted');

    const updatedData = {
      ...data,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
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
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="lastname_fr" label="Nom" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="lastname_ar" label="اللقب بالعربية" dir="rtl" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="firstname_fr" label="Prénom" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="firstname_ar" label="الإسم بالعربية" dir="rtl" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="birthday" label="Date de naissance" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="location_fr" label="Lieu de naissance" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="location_ar" label="مكان الميلاد" dir="rtl" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="sex" label="Sexe" size="small">
              {COMMUN_SEXE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="blood_type" label="Groupe sanguin" size="small">
              {COMMUN_BLOOD_TYPE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="nationality" label="Nationalité" size="small">
              {COMMUN_NATIONNALITY_OPTIONS.map((status) => (
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
              {COMMUN_NATIONAL_SERVICE_STATUS_OPTIONS.map((status) => (
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
            {/* <Field.Text name="social_number" label="Numéro de sécurité sociale" /> */}
            <Controller
              name="social_number"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputMask
                  mask="99 9999 9999 99"
                  maskChar=" "
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      {...field}
                      size="small"
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      slotProps={{
                        htmlInput: {
                          autoComplete: 'off',
                        },
                      }}
                      placeholder="-- ---- ---- --"
                      label="Numéro de sécurité sociale"
                    />
                  )}
                </InputMask>
              )}
            />
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
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="father_lastname_fr" label="Prénom Pere" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="father_lastname_ar" label="اسم الأب بالعربية" dir="rtl" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="mother_lastname_fr" label="Nom Mere" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="mother_lastname_ar" label="لقب الأم بالعربية" dir="rtl" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="mother_firstname_fr" label="Prénom Mere" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="mother_firstname_ar" label="اسم الأم بالعربية" dir="rtl" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Number name="number" label="Number" type="number" />
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
              {COMMUN_FAMILY_SITUATION_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          {(values.family_situation === 'Marié' ||
            values.family_situation === 'Divorcé' ||
            values.family_situation === 'Veuf') && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Number name="children_number" label="Nombre d'enfants" type="number" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Number
                  name="children_number_min"
                  label="Nombre d'enfants mineurs"
                  type="number"
                />
              </Grid>
            </>
          )}
          {
            // values.family_situation !== 'Divorcé' &&
            //   values.family_situation !== 'Veuf' &&
            //   values.family_situation !== 'Célibataire'
            values.family_situation === 'Marié' && (
              <>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Field.Text name="spouse_fullname_fr" label="Nom et Prénom Conjoint" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Field.Text name="spouse_fullname_ar" label="لقب و اسم الزوج" dir="rtl" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Select name="spouse_job" label="Situation conjoint" size="small">
                    {JOB_SITUATION_OPTIONS.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Text name="spouse_phone" label="Téléphone de conjoint" />
                </Grid>
              </>
            )
          }
        </Grid>
      </Stack>
    </Card>
  );
  const renderEducationInformation = () => (
    <Card>
      <CardHeader title="Education" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="education" label="Niveau d’études" size="small">
              {EDUCATION_LEVEL_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="speciality" label="Spécialité" />
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
              {PRODUCT_DEPARTEMENT_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="lieu" label="Lieu" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="site" label="Site" size="small">
              {PRODUCT_SITE_OPTIONS.map((status) => (
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
            <Field.Select name="department" label="Departement" size="small">
              {COMMUN_SERVICE_OPTIONS.map((status) => (
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
              {DAS_DENOM_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="function" label="Function" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="category" label="Catégorie socio-professionnelle" size="small">
              {SALARY_CATEGORY_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="steps" label="Échelons" size="small">
              {SALARY_ECHEL_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="salary_grid_level" label="Niveau de grille salariale" size="small">
              {COMMUN_GRID_SALARY_LEVEL_OPTIONS.map((status) => (
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
              {PRODUCT_TEAM_TYPE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="agencies" label="Agences" size="small">
              {COMMUN_AGENCIES_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
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
              {COMMUN_CONTRIBUTION_SCHEME_OPTIONS.map((status) => (
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
              {COMMUN_CALCULATION_METHOD_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* <FieldContainer label="Jours par mois" sx={{ alignItems: 'center' }}>
              <Field.NumberInput name="days_per_month" />
            </FieldContainer> */}

            <Field.Number name="days_per_month" label="Jours par mois" type="number" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* <FieldContainer label="Heures par mois" sx={{ alignItems: 'center' }}>
              <Field.NumberInput name="hours_per_month" />
            </FieldContainer> */}
            <Field.Number name="hours_per_month" label="Heures par mois" type="number" />
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
              {PRODUCT_CONTRACT_OPTIONS.map((status) => (
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
            {/* <FieldContainer label="Probation" sx={{ alignItems: 'center' }}>
              <Field.NumberInput name="probation" />
            </FieldContainer> */}
            <Field.Number name="probation" label="Probation" type="number" />
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
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Ajouter' : 'Enregistrer'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {renderDetails()}
        {renderFamilyInformation()}
        {renderEducationInformation()}
        {renderLocationOrganizationalStructure()}
        {renderEmploymentInformation()}
        {renderContractInformation()}
        {renderActions()}
      </Stack>
    </Form>
  );
}

// function FieldContainer({ sx, children, label = 'RHFTextField' }) {
//   return (
//     <Box
//       sx={[
//         () => ({
//           gap: 1,
//           width: 1,
//           display: 'flex',
//           // flexDirection: 'row',
//           justifyContent: 'space-between',
//         }),
//         ...(Array.isArray(sx) ? sx : [sx]),
//       ]}
//     >
//       <Typography
//         variant="caption"
//         sx={[
//           (theme) => ({
//             textAlign: 'right',
//             // fontStyle: 'italic',
//             // color: 'text.disabled',
//             fontSize: theme.typography.pxToRem(12),
//             textWrap: 'nowrap',
//           }),
//         ]}
//       >
//         {label}
//       </Typography>

//       {children}
//     </Box>
//   );
// }
