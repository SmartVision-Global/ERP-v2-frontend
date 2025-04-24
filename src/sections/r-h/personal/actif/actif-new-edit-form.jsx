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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useMultiLookups } from 'src/actions/lookups';
import { createPersonal, updatePersonal } from 'src/actions/personal';
import {
  COMMUN_SEXE_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  JOB_SITUATION_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  PRODUCT_CONTRACT_OPTIONS,
  COMMUN_BLOOD_TYPE_OPTIONS,
  PRODUCT_TEAM_TYPE_OPTIONS,
  COMMUN_FAMILY_SITUATION_OPTIONS,
  COMMUN_CALCULATION_METHOD_OPTIONS,
  COMMUN_NATIONAL_SERVICE_STATUS_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewProductSchema = zod
  .object({
    firstname_fr: zod.string().min(1, { message: 'firstname_fr is required!' }),
    lastname_fr: zod.string().min(1, { message: 'lastname_fr is required!' }),
    firstname_ar: zod.string().min(1, { message: 'firstname_ar is required!' }),
    lastname_ar: zod.string().min(1, { message: 'lastname_ar is required!' }),
    birth_date: schemaHelper.date({ message: { required: 'birthday is required!' } }),
    location_fr: zod.string().min(1, { message: 'location_fr is required!' }),
    location_ar: zod.string().min(1, { message: 'location_ar is required!' }),
    gender: zod.string().min(1, { message: 'sex is required!' }),
    blood_group: zod.string().min(1, { message: 'blood_type code is required!' }),
    nationality_id: zod.string().min(1, { message: 'nationality is required!' }),

    phone: zod.string().min(1, { message: 'phone is required!' }),
    national_service_situation: zod
      .string()
      .min(1, { message: 'national_service_situation is required!' }),
    email: zod.string().min(1, { message: 'email is required!' }),
    social_security_number: zod.string().min(1, { message: 'social_number is required!' }),
    adressFr: zod.string().min(1, { message: 'adressFr is required!' }),
    adressAr: zod.string().min(1, { message: 'adressAr is required!' }),

    national_number: zod.string().min(1, { message: 'national_number is required!' }),
    act_of_birth_number: zod.string().min(1, { message: 'birth_certificate_number is required!' }),
    image: schemaHelper.file().optional(),
    employment_certificate: schemaHelper.file().optional(),
    father_firstname_fr: zod.string().min(1, { message: 'father_firstname_fr is required!' }),
    father_firstname_ar: zod.string().min(1, { message: 'father_firstname_ar is required!' }),
    mother_firstname_fr: zod.string().min(1, { message: 'mother_firstname_fr is required!' }),
    mother_lastname_fr: zod.string().min(1, { message: 'mother_lastname_fr is required!' }),
    mother_firstname_ar: zod.string().min(1, { message: 'mother_firstname_ar is required!' }),
    mother_lastname_ar: zod.string().min(1, { message: 'mother_lastname_ar is required!' }),

    // Informations Familiales
    family_situation: zod.string().min(1, { message: 'family_situation is required!' }),
    children: schemaHelper.nullableInput(zod.number({ coerce: true }).optional()),
    minor_children: schemaHelper.nullableInput(zod.number({ coerce: true }).optional()),
    spouse_fullname_fr: zod.string().optional(),
    spouse_fullname_ar: zod.string().optional(),
    spouse_situation: zod.string().optional(),
    spouse_phone: zod.string().optional(),

    // Education
    education: zod.string().optional(),
    speciality: zod.string().optional(),

    // Emplacement et Structure Organisationnelle
    subsidiary_id: zod.string().min(1, { message: 'subsidiary is required!' }),
    direction_id: zod.string().min(1, { message: 'direction is required!' }),
    site_id: zod.string().min(1, { message: 'site is required!' }),
    // lieu: zod.string().min(1, { message: 'lieu is required!' }),

    division_id: zod.string().min(1, { message: 'division is required!' }),
    department_id: zod.string().min(1, { message: 'department is required!' }),
    section_id: zod.string().min(1, { message: 'sections is required!' }),
    workshop_id: zod.string().min(1, { message: 'workshop is required!' }),
    machine_id: zod.string().min(1, { message: 'machine is required!' }),
    zone_id: zod.string().min(1, { message: 'area is required!' }),

    // Informations sur l'Emploi
    enterprise_id: zod.string().min(1, { message: 'company is required!' }),
    job_id: zod.string().min(1, { message: 'function is required!' }),
    salary_category_id: zod.string().min(1, { message: 'category is required!' }),
    rung_id: zod.string().min(1, { message: 'steps is required!' }),
    salary_scale_level_id: zod.string().min(1, { message: 'salary_grid_level is required!' }),

    salary_grid_id: zod.string().min(1, { message: 'salary_grid_id is required!' }),
    salary_supplemental: zod.string().min(1, { message: 'salary_supplement is required!' }),
    job_regime: zod.string().min(1, { message: 'work_schedule is required!' }),
    agency_id: zod.string().min(1, { message: 'agencies is required!' }),
    allowed_overtime: zod.boolean(),
    allowed_exit_voucher: zod.boolean(),
    pea_exist: zod.boolean(),
    rate_id: zod.string().min(1, { message: 'contribution_scheme is required!' }),
    payroll_calculation: zod.string().min(1, { message: 'calculation_method is required!' }),
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
        .max(159, { message: 'hours_per_month must be between 1 and 99' }),
      // message for null value
      { message: 'hours_per_month is required!' }
    ),
    declaration_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
    service_start: schemaHelper.date({ message: { required: 'entry_date is required!' } }),

    // Informations de la contra
    contract_type: zod.string().min(1, { message: 'contract_type is required!' }),
    from_date: schemaHelper.date({ message: { required: 'start_date is required!' } }),
    to_date: schemaHelper.date({ message: { required: 'end_date is required!' } }),
    contract_probation: schemaHelper.nullableInput(
      zod.number({ coerce: true }).min(1, { message: 'probation is required!' }),
      {
        // message for null value
        message: 'probation is required!',
      }
    ),
    payment_type: zod.string().min(1, { message: 'paymant_type is required!' }),
    rib: zod.string().min(1, { message: 'rib is required!' }),
    bank_id: zod.string().min(1, { message: 'bank is required!' }),
  })
  .superRefine((data, ctx) => {
    if (data.family_situation === '3') {
      if (!data.children) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Spouse's children number is required when married",
          path: ['children'],
        });
      }
      if (!data.minor_children) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Spouse's children number min is required when married",
          path: ['minor_children'],
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
      if (!data.spouse_situation) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Spouse's job is required when married",
          path: ['spouse_situation'],
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
  const router = useRouter();
  const { dataLookups, dataLoading, dataError } = useMultiLookups([
    { entity: 'subsidiaries', url: 'hr/lookups/identification/subsidiary' },
    { entity: 'directions', url: 'hr/lookups/identification/direction' },
    { entity: 'sites', url: 'settings/lookups/sites' },
    { entity: 'divisions', url: 'hr/lookups/identification/division' },
    { entity: 'departments', url: 'hr/lookups/identification/department' },
    { entity: 'sections', url: 'hr/lookups/identification/section' },
    { entity: 'rungs', url: 'hr/lookups/identification/rung' },
    { entity: 'workshops', url: 'settings/lookups/workshops' },
    { entity: 'machines', url: 'settings/lookups/machines' },
    { entity: 'zones', url: 'hr/lookups/zones' },
    { entity: 'enterprises', url: 'settings/lookups/enterprises' },
    { entity: 'jobs', url: 'hr/lookups/jobs' },
    { entity: 'salary_categories', url: 'hr/lookups/identification/salary_category' },
    { entity: 'salary_grids', url: 'hr/lookups/salary_grids' },
    { entity: 'salary_scale_levels', url: 'hr/lookups/identification/salary_scale_level' },
    { entity: 'agencies', url: 'hr/lookups/agencies' },
    { entity: 'banks', url: 'hr/lookups/identification/bank' },
    { entity: 'rates', url: 'hr/lookups/rates' },
    { entity: 'nationalities', url: 'hr/lookups/identification/nationality' },
  ]);

  const subsidiaries = dataLookups?.subsidiaries || [];
  const directions = dataLookups?.directions || [];
  const sites = dataLookups?.sites || [];
  const divisions = dataLookups?.divisions || [];
  const departments = dataLookups?.departments || [];
  const sections = dataLookups?.sections || [];
  const rungs = dataLookups?.rungs || [];
  const workshops = dataLookups?.workshops || [];
  const machines = dataLookups?.machines || [];
  const zones = dataLookups?.zones || [];
  const enterprises = dataLookups?.enterprises || [];
  const jobs = dataLookups?.jobs || [];
  const salaryCategories = dataLookups?.salary_categories || [];
  const salaryGrids = dataLookups?.salary_grids || [];
  const salaryScaleLevels = dataLookups?.salary_scale_levels || [];
  const agencies = dataLookups?.agencies || [];
  const banks = dataLookups?.banks || [];
  const rates = dataLookups?.rates || [];
  const nationalities = dataLookups?.nationalities || [];

  const defaultValues = {
    firstname_fr: '',
    firstname_ar: '',

    lastname_fr: '',
    lastname_ar: '',

    birth_date: null,
    location_fr: '',
    location_ar: '',
    /********/
    gender: 'MALE',
    blood_group: '',
    nationality_id: '',
    phone: '',
    national_service_situation: '',
    email: '',
    social_security_number: '',
    adressFr: '',
    adressAr: '',

    // category: PRODUCT_CATEGORY_GROUP_OPTIONS[0].classify[1],
    national_number: '',
    act_of_birth_number: '',
    image: null,
    employment_certificate: null,
    father_firstname_fr: '',
    mother_firstname_fr: '',
    mother_lastname_fr: '',
    father_firstname_ar: '',
    mother_firstname_ar: '',
    mother_lastname_ar: '',

    // Informations Familiales
    family_situation: '',
    children: 0,
    minor_children: 0,
    spouse_fullname_fr: '',
    spouse_fullname_ar: '',
    spouse_situation: '',
    spouse_phone: '',

    // Education
    education: '',
    speciality: '',

    // Emplacement et Structure Organisationnelle
    subsidiary_id: '',
    direction_id: '',
    // lieu: '',
    site_id: '',
    division_id: '',
    department_id: '',
    section_id: '',
    workshop_id: '',
    machine_id: '',
    zone_id: '',
    // Informations sur l'Emploi
    enterprise_id: '',
    job_id: '',
    salary_category_id: '',
    rung_id: '',
    salary_grid_id: '',
    salary_scale_level_id: '',
    salary_supplemental: 0,
    job_regime: '',
    agency_id: '',
    allowed_overtime: false,
    allowed_exit_voucher: false,
    pea_exist: false,
    rate_id: '',
    payroll_calculation: '',
    days_per_month: 22,
    hours_per_month: 130,
    declaration_date: null,
    service_start: null,
    contract_type: '',
    from_date: null,
    to_date: null,
    contract_probation: '',
    payment_type: '',
    rib: '',
    bank_id: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: {
      ...currentProduct,
      firstname_fr: currentProduct?.first_name?.fr,
      firstname_ar: currentProduct?.first_name?.ar,
      lastname_fr: currentProduct?.last_name?.fr,
      lastname_ar: currentProduct?.last_name?.ar,
      location_fr: currentProduct?.birth_place?.fr,
      location_ar: currentProduct?.birth_place?.ar,
      adressFr: currentProduct?.address?.fr,
      adressAr: currentProduct?.address?.ar,
      father_firstname_fr: currentProduct?.first_name_father?.fr,
      father_firstname_ar: currentProduct?.first_name_father?.ar,
      mother_firstname_fr: currentProduct?.first_name_mother?.fr,
      mother_firstname_ar: currentProduct?.first_name_mother?.ar,
      mother_lastname_fr: currentProduct?.last_name_mother?.fr,
      mother_lastname_ar: currentProduct?.last_name_mother?.ar,
      nationality_id: currentProduct?.nationality_id?.toString() || '',
      subsidiary_id: currentProduct?.subsidiary_id?.toString() || '',
      direction_id: currentProduct?.direction_id?.toString() || '',
      site_id: currentProduct?.site_id?.toString() || '',
      division_id: currentProduct?.division_id?.toString() || '',
      department_id: currentProduct?.department_id?.toString() || '',
      section_id: currentProduct?.section_id?.toString() || '',
      workshop_id: currentProduct?.workshop_id?.toString() || '',
      machine_id: currentProduct?.machine_id?.toString() || '',
      zone_id: currentProduct?.zone_id?.toString() || '',
      enterprise_id: currentProduct?.enterprise_id?.toString() || '',
      job_id: currentProduct?.job_id?.toString() || '',
      salary_category_id: currentProduct?.salary_category_id?.toString() || '',
      rung_id: currentProduct?.rung_id?.toString() || '',
      salary_grid_id: currentProduct?.salary_grid_id?.toString() || '',
      salary_scale_level_id: currentProduct?.salary_scale_level_id?.toString() || '',
      agency_id: currentProduct?.agency_id?.toString() || '',
      rate_id: currentProduct?.rate_id?.toString() || '',
      bank_id: currentProduct?.bank_id?.toString() || '',
      // salary_supplemental:parsecurrentProduct?.salary_supplemental
      spouse_phone: currentProduct?.spouse_phone || '',
      spouse_situation: currentProduct?.spouse_situation || '',
    },
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
      // ...data,
      first_name: { fr: data.firstname_fr, ar: data.firstname_ar },
      last_name: { fr: data.lastname_fr, ar: data.lastname_ar },
      birth_date: data.birth_date,
      birth_place: { fr: data.location_fr, ar: data.location_ar },
      gender: data.gender,
      blood_group: data.blood_group,
      phone: data.phone,
      email: data.email,
      national_service_situation: data.national_service_situation,
      social_security_number: data.social_security_number,
      national_number: data.national_number,
      act_of_birth_number: data.act_of_birth_number,
      first_name_father: { fr: data.father_firstname_fr, ar: data.father_firstname_ar },
      last_name_mother: { fr: data.mother_lastname_fr, ar: data.mother_lastname_ar },
      first_name_mother: { fr: data.mother_firstname_fr, ar: data.mother_firstname_ar },
      family_situation: data.family_situation,
      spouse: { fr: data.spouse_fullname_fr, ar: data.spouse_fullname_ar },
      spouse_phone: data.spouse_phone,
      // spouse_situation: data.spouse_situation ? data.spouse_situation : null,
      children: data.children,
      minor_children: data.minor_children,
      subsidiary_id: parseInt(data.subsidiary_id),
      direction_id: parseInt(data.direction_id),
      division_id: parseInt(data.division_id),
      department_id: parseInt(data.department_id),
      section_id: parseInt(data.section_id),
      site_id: parseInt(data.site_id),
      workshop_id: parseInt(data.workshop_id),
      machine_id: parseInt(data.machine_id),
      enterprise_id: parseInt(data.enterprise_id),
      job_id: parseInt(data.job_id),
      salary_grid_id: parseInt(data.salary_grid_id),
      rate_id: parseInt(data.rate_id),
      agency_id: parseInt(data.agency_id),
      nationality_id: parseInt(data.nationality_id),
      zone_id: parseInt(data.zone_id),
      job_regime: data.job_regime,
      allowed_overtime: data.allowed_overtime,
      allowed_exit_voucher: data.allowed_exit_voucher,
      pea_exist: data.pea_exist,
      salary_supplemental: parseInt(data.salary_supplemental),
      payroll_calculation: data.payroll_calculation,
      days_per_month: data.days_per_month,
      hours_per_month: data.hours_per_month,
      declaration_date: data.declaration_date,
      service_start: data.service_start,
      service_end: null,
      contract_type: data.contract_type,
      contract_probation: data.contract_probation,
      pea_rate: 0,
      pea_earned: 0,
      from_date: data.from_date,
      to_date: data.to_date,
      payment_type: data.payment_type,
      bank_id: parseInt(data.bank_id),
      rib: data.rib,
      address: { fr: data.adressFr, ar: data.adressAr },
    };

    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentProduct) {
        await updatePersonal(currentProduct?.id, updatedData);
      } else {
        await createPersonal(updatedData);
      }
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.personal.root);
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
            <Field.DatePicker name="birth_date" label="Date de naissance" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="location_fr" label="Lieu de naissance" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="location_ar" label="مكان الميلاد" dir="rtl" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="gender" label="Sexe" size="small">
              {COMMUN_SEXE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="blood_group" label="Groupe sanguin" size="small">
              {COMMUN_BLOOD_TYPE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="nationality_id" label="Nationalité" data={nationalities} />
            {/* <Field.Select name="nationality_id" label="Nationalité" size="small">
              {COMMUN_NATIONNALITY_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="phone" label="Téléphone" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select
              name="national_service_situation"
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
              name="social_security_number"
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
            <Field.Text name="act_of_birth_number" label="Numéro d'acte de naissance" />
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
            <Field.Text name="father_firstname_fr" label="Prénom Pere" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="father_firstname_ar" label="اسم الأب بالعربية" dir="rtl" />
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
          {/* <Grid size={{ xs: 12, md: 3 }}>
            <Field.Number name="number" label="Number" type="number" />
          </Grid> */}
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
          {(values.family_situation === '3' ||
            values.family_situation === '2' ||
            values.family_situation === '4') && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Number name="children" label="Nombre d'enfants" type="number" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Number
                  name="minor_children"
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
            values.family_situation === '3' && (
              <>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Field.Text name="spouse_fullname_fr" label="Nom et Prénom Conjoint" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Field.Text name="spouse_fullname_ar" label="لقب و اسم الزوج" dir="rtl" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Select name="spouse_situation" label="Situation conjoint" size="small">
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
            <Field.Lookup name="subsidiary_id" label="Filiale" data={subsidiaries} />
            {/* <Field.Select name="subsidiary_id" label="Filiale" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="direction_id" label="Direction" data={directions} />

            {/* <Field.Select name="direction_id" label="Direction" size="small">
              {PRODUCT_DEPARTEMENT_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          {/* <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="lieu" label="Lieu" />
          </Grid> */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="site_id" label="Site" data={sites} />

            {/* <Field.Select name="site_id" label="Site" size="small">
              {PRODUCT_SITE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="division_id" label="Division" data={divisions} />

            {/* <Field.Select name="division_id" label="Division" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="department_id" label="Departement" data={departments} />

            {/* <Field.Select name="department_id" label="Departement" size="small">
              {COMMUN_SERVICE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="section_id" label="Sections" data={sections} />

            {/* <Field.Select name="section_id" label="Sections" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="workshop_id" label="Atelier" data={workshops} />

            {/* <Field.Select name="workshop_id" label="Atelier" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="machine_id" label="Machine" data={machines} />

            {/* <Field.Select name="machine_id" label="Machine" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="zone_id" label="Zone" data={zones} />

            {/* <Field.Select name="zone_id" label="Zone" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
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
            <Field.Lookup name="enterprise_id" label="Societé" data={enterprises} />

            {/* <Field.Select name="enterprise_id" label="Societé" size="small">
              {DAS_DENOM_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="job_id" label="Function" data={jobs} />

            {/* <Field.Select name="job_id" label="Function" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup
              name="salary_category_id"
              label="Catégorie socio-professionnelle"
              data={salaryCategories}
            />

            {/* <Field.Select
              name="salary_category_id"
              label="Catégorie socio-professionnelle"
              size="small"
            >
              {SALARY_CATEGORY_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* <Field.Select name="rung_id" label="Échelons" size="small">
              {SALARY_ECHEL_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
            <Field.Lookup name="rung_id" label="Échelons" data={rungs} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup
              name="salary_scale_level_id"
              label="Niveau de grille salariale"
              data={salaryScaleLevels}
            />

            {/* <Field.Select name="salary_grid_id" label="Niveau de grille salariale" size="small">
              {COMMUN_GRID_SALARY_LEVEL_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="salary_grid_id" label="Net à payer" data={salaryGrids} />

            {/* <Field.Select name="salary_grid_id" label="Net à payer" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="salary_supplemental"
              label="Complément Salaire"
              placeholder="0"
              // type="number"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="job_regime" label="Régime de travail" size="small">
              {PRODUCT_TEAM_TYPE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="agency_id" label="Agences" data={agencies} />
            {/* <Field.Select name="agency_id" label="Agences" size="small">
              {COMMUN_AGENCIES_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Switch
              name="allowed_overtime"
              labelPlacement="start"
              label="Peut effectuer des heures supplémentaires"
              // sx={{ mt: 5, justidyContent: 'space-between' }}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Switch
              name="allowed_exit_voucher"
              labelPlacement="start"
              label="Peut effectuer des prélèvements du stock"
              // sx={{ mt: 5 }}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Switch
              name="pea_exist"
              labelPlacement="start"
              label="Indemnité d'expérience professionnelle"
              // sx={{ mt: 5 }}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} />

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="rate_id" label="Regime de cotisation" data={rates} />
            {/* <Field.Select name="rate_id" label="Regime de cotisation" size="small">
              {COMMUN_CONTRIBUTION_SCHEME_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select
              name="payroll_calculation"
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
            <Field.DatePicker name="service_start" label="Date entrée" />
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
            <Field.DatePicker name="from_date" label="Du" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="to_date" label="Au" />
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
            <Field.Number name="contract_probation" label="Probation" type="number" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="payment_type" label="Type de paiement" size="small">
              {PAYMENT_TYPE_OPTIONS.map((status) => (
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
            <Field.Lookup name="bank_id" label="Banque" data={banks} />

            {/* <Field.Select name="bank_id" label="Banque" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
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
      {!dataLoading && !dataError && (
        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
          {renderDetails()}
          {renderFamilyInformation()}
          {renderEducationInformation()}
          {renderLocationOrganizationalStructure()}
          {renderEmploymentInformation()}
          {renderContractInformation()}
          {renderActions()}
        </Stack>
      )}
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
