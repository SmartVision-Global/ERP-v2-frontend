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

import { showError } from 'src/utils/toast-error';

import { uploadMedia } from 'src/actions/media';
import { useGetLookups, useMultiLookups } from 'src/actions/lookups';
import { createPersonal, updatePersonal } from 'src/actions/personal';
import {
  COMMUN_SEXE_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  JOB_SITUATION_OPTIONS,
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
    firstname_fr: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    lastname_fr: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    firstname_ar: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    lastname_ar: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    birth_date: schemaHelper.date({ message: { required: 'Veuillez remplir ce champ' } }),
    location_fr: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    location_ar: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    gender: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
    blood_group: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    nationality_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),

    phone: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    national_service_situation: zod
      .string()
      .min(1, { message: 'Veuillez remplir ce champ' })
      .or(zod.number()),
    email: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    social_security_number: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    adressFr: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    adressAr: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),

    national_number: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    act_of_birth_number: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    image: schemaHelper.file().optional().nullable(),
    certificate: schemaHelper.file().optional().nullable(),
    photo: zod.string().optional().nullable(),
    employment_certificate: zod.string().optional().nullable(),
    father_firstname_fr: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    father_firstname_ar: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    mother_firstname_fr: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    mother_lastname_fr: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    mother_firstname_ar: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    mother_lastname_ar: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),

    // Informations Familiales
    family_situation: zod
      .string()
      .min(1, { message: 'Veuillez remplir ce champ' })
      .or(zod.number()),
    children: zod.number({ coerce: true }).optional().nullable(),
    minor_children: zod.number({ coerce: true }).optional().nullable(),
    spouse_fullname_fr: zod.string().optional(),
    spouse_fullname_ar: zod.string().optional(),
    spouse_situation: zod.string().optional(),
    spouse_phone: zod.string().optional(),

    // Education
    careerKnowledges: zod.array(zod.string().or(zod.number())).optional(),
    speciality: zod.string().optional(),

    // Emplacement et Structure Organisationnelle
    subsidiary_id: zod.string().optional().nullable(),
    direction_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    site_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),

    division_id: zod.string().optional().nullable(),
    department_id: zod.string().optional().nullable(),
    section_id: zod.string().optional().nullable(),
    workshop_id: zod.string().optional().nullable(),
    machine_id: zod.string().optional().nullable(),
    zone_id: zod.string().optional().nullable(),

    // Informations sur l'Emploi
    enterprise_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    job_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    salary_category_id: zod.string().optional().nullable(),
    rung_id: zod.string().optional().nullable(),
    salary_scale_level_id: zod.string().optional().nullable(),

    salary_grid_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    salary_supplemental: zod.number().optional(),
    job_regime: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
    agency_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    allowed_overtime: zod.boolean(),
    allowed_exit_voucher: zod.boolean(),
    pea_exist: zod.boolean(),
    rate_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
    payroll_calculation: zod
      .string()
      .min(1, { message: 'Veuillez remplir ce champ' })
      .or(zod.number()),
    days_per_month: schemaHelper.nullableInput(
      zod
        .number({ coerce: true })
        .min(1, { message: 'Veuillez remplir ce champ' })
        .max(30, { message: 'days_per_month must be between 1 and 30' }),
      // message for null value
      { message: 'days_per_month is required!' }
    ),
    hours_per_month: schemaHelper.nullableInput(
      zod
        .number({ coerce: true })
        .min(1, { message: 'hours_per_month is required!' })
        .max(173.33, { message: 'hours_per_month must be between 1 and 173.33' }),
      // message for null value
      { message: 'hours_per_month is required!' }
    ),
    declaration_date: schemaHelper.date({ message: { required: 'Veuillez remplir ce champ' } }),
    service_start: schemaHelper.date({ message: { required: 'Veuillez remplir ce champ' } }),

    // Informations de la contra
    contract_type: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
    from_date: schemaHelper.date({ message: { required: 'Veuillez remplir ce champ' } }),
    to_date: schemaHelper.date().optional().nullable(),
    contract_probation: schemaHelper.nullableInput(
      zod.number({ coerce: true }).min(0, { message: 'Veuillez remplir ce champ' }),
      {
        message: 'Veuillez remplir ce champ',
      }
    ),
    payment_type: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
    rib: zod.string().optional().nullable(),
    bank_id: zod.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (String(data.family_situation) === '3') {
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
    if (String(data.contract_type) !== '2') {
      if (!data.to_date) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ',
          path: ['to_date'],
        });
      }
    }
    if (String(data.payment_type) !== '2') {
      if (!data.rib) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ',
          path: ['rib'],
        });
      }
      if (!data.bank_id) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ',
          path: ['bank_id'],
        });
      }
    }
  });

export function ActifNewEditForm({ currentProduct }) {
  const router = useRouter();
  const { dataLookups, dataLoading } = useMultiLookups([
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
    // { entity: 'salary_grids', url: 'hr/lookups/salary_grids' },
    { entity: 'salary_scale_levels', url: 'hr/lookups/identification/salary_scale_level' },
    { entity: 'agencies', url: 'hr/lookups/agencies' },
    { entity: 'banks', url: 'hr/lookups/identification/bank' },
    { entity: 'rates', url: 'hr/lookups/rates' },
    { entity: 'nationalities', url: 'hr/lookups/identification/nationality' },
    { entity: 'careerKnowledges', url: 'hr/lookups/career_knowledges' },
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
  // const salaryGrids = dataLookups?.salary_grids || [];
  const salaryScaleLevels = dataLookups?.salary_scale_levels || [];
  const agencies = dataLookups?.agencies || [];
  const banks = dataLookups?.banks || [];
  const rates = dataLookups?.rates || [];
  const nationalities = dataLookups?.nationalities || [];
  const careerKnowledges = dataLookups?.careerKnowledges || [];

  const defaultValues = {
    firstname_fr: '',
    firstname_ar: '',

    lastname_fr: '',
    lastname_ar: '',

    birth_date: null,
    location_fr: '',
    location_ar: '',
    /********/
    gender: '1',
    blood_group: '1',
    nationality_id: '',
    phone: '',
    national_service_situation: '',
    email: '',
    social_security_number: '',
    adressFr: '',
    adressAr: '',

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
    family_situation: '1',
    children: 0,
    minor_children: 0,
    spouse_fullname_fr: '',
    spouse_fullname_ar: '',
    spouse_situation: '',
    spouse_phone: '',

    // Education
    careerKnowledges: [],
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
    job_regime: '2',
    agency_id: '',
    allowed_overtime: false,
    allowed_exit_voucher: false,
    pea_exist: false,
    rate_id: '',
    payroll_calculation: '1',
    days_per_month: 30,
    hours_per_month: 173.33,
    declaration_date: null,
    service_start: null,
    contract_type: '1',
    from_date: null,
    to_date: null,
    contract_probation: 0,
    payment_type: '1',
    rib: '',
    bank_id: '',
  };
  const formattedNation = nationalities?.map((nat) => ({
    value: String(nat.value),
    text: nat.text,
  }));
  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: {
      firstname_fr: currentProduct?.first_name?.fr || '',
      firstname_ar: currentProduct?.first_name?.ar || '',
      lastname_fr: currentProduct?.last_name?.fr || '',
      lastname_ar: currentProduct?.last_name?.ar || '',
      location_fr: currentProduct?.birth_place?.fr || '',
      location_ar: currentProduct?.birth_place?.ar || '',
      adressFr: currentProduct?.address?.fr || '',
      adressAr: currentProduct?.address?.ar || '',
      gender: currentProduct?.gender || '1',
      blood_group: currentProduct?.blood_group || '1',
      phone: currentProduct?.phone || '',
      national_service_situation: currentProduct?.national_service_situation || '4',
      email: currentProduct?.email || '',
      social_security_number: currentProduct?.social_security_number || '',
      national_number: currentProduct?.national_number || '',
      act_of_birth_number: currentProduct?.act_of_birth_number || '',
      family_situation: currentProduct?.family_situation?.toString() || '1',
      birth_date: currentProduct?.birth_date || null,
      father_firstname_fr: currentProduct?.first_name_father?.fr || '',
      father_firstname_ar: currentProduct?.first_name_father?.ar || '',
      mother_firstname_fr: currentProduct?.first_name_mother?.fr || '',
      mother_firstname_ar: currentProduct?.first_name_mother?.ar || '',
      mother_lastname_fr: currentProduct?.last_name_mother?.fr || '',
      mother_lastname_ar: currentProduct?.last_name_mother?.ar || '',
      nationality_id: currentProduct?.nationality_id ? String(currentProduct?.nationality_id) : '',
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
      salary_supplemental: currentProduct?.salary_supplemental || 0,
      job_regime: currentProduct?.job_regime || '2',
      spouse_phone: currentProduct?.spouse_phone || '',
      spouse_situation: currentProduct?.spouse_situation || '',
      allowed_overtime: currentProduct?.allowed_overtime || false,
      allowed_exit_voucher: currentProduct?.allowed_exit_voucher || false,
      pea_exist: currentProduct?.pea_exist || false,
      payroll_calculation: currentProduct?.payroll_calculation || '1',
      days_per_month: currentProduct?.days_per_month || 30,
      hours_per_month: currentProduct?.hours_per_month || 173.33,
      declaration_date: currentProduct?.declaration_date || null,
      service_start: currentProduct?.service_start || null,
      contract_type: currentProduct?.contract_type || '1',

      from_date: currentProduct?.from_date || null,
      to_date: currentProduct?.to_date || null,
      contract_probation: currentProduct?.contract_probation || 0,
      payment_type: currentProduct?.payment_type || '1',
      rib: currentProduct?.rib || '',
      careerKnowledges: currentProduct?.careerKnowledges || [],
    },
  });

  const {
    reset,
    watch,
    setValue,
    setError,
    control,
    handleSubmit,

    formState: { isSubmitting },
  } = methods;
  const onDropImage = async (acceptedFiles) => {
    const value = acceptedFiles[0];
    const newData = new FormData();
    newData.append('type', 'image');
    newData.append('file', value);
    newData.append('collection', 'photos');
    setValue('image', value, { shouldValidate: true });

    try {
      const response = await uploadMedia(newData);
      setValue('photo', response?.uuid, { shouldValidate: true });
    } catch (error) {
      console.log('error in upload file', error);
    }
  };

  const onDropCertificate = async (acceptedFiles) => {
    const value = acceptedFiles[0];
    const newData = new FormData();
    newData.append('type', 'image');
    newData.append('file', value);
    newData.append('collection', 'certifications');
    setValue('certificate', value, { shouldValidate: true });

    try {
      const response = await uploadMedia(newData);
      setValue('employment_certificate', response?.uuid, { shouldValidate: true });
    } catch (error) {
      console.log('error in upload file', error);
    }
  };
  const values = watch();

  const { data: salaryGrids, dataLoading: loadingSalaryGrids } = useGetLookups(
    'hr/lookups/salary_grids',
    {
      salary_category: values.salary_category_id || null,
      rung: values.rung_id || null,
      salary_scale_level: values.salary_scale_level_id || null,
      job: values.job_id || null,
    }
  );

  const handleRemoveImage = useCallback(() => {
    setValue('image', null);
    setValue('photo', '');
  }, [setValue]);

  const handleRemoveCertificate = useCallback(() => {
    setValue('employment_certificate', '');
    setValue('certificate', null);
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
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
      children: data.children,
      minor_children: data.minor_children,
      subsidiary_id: data.subsidiary_id,
      direction_id: data.direction_id,
      division_id: data.division_id,
      department_id: data.department_id,
      section_id: data.section_id,
      site_id: data.site_id,
      workshop_id: data.workshop_id,
      machine_id: data.machine_id,
      enterprise_id: data.enterprise_id,
      job_id: data.job_id,
      salary_grid_id: data.salary_grid_id,
      rate_id: data.rate_id,
      agency_id: data.agency_id,
      nationality_id: data.nationality_id,
      zone_id: data.zone_id,
      job_regime: data.job_regime,
      allowed_overtime: data.allowed_overtime,
      allowed_exit_voucher: data.allowed_exit_voucher,
      pea_exist: data.pea_exist,
      salary_supplemental: data.salary_supplemental,
      payroll_calculation: data.payroll_calculation,
      days_per_month: data.days_per_month,
      hours_per_month: data.hours_per_month,
      declaration_date: data.declaration_date,
      service_start: data.service_start,
      service_end: data.service_end,
      contract_type: data.contract_type,
      contract_probation: data.contract_probation,
      pea_rate: 0,
      pea_earned: 0,
      from_date: data.from_date,
      to_date: data.contract_type !== '2' ? data.to_date : null,
      payment_type: data.payment_type,
      bank_id: data.payment_type !== '2' ? data.bank_id : '',
      rib: data.payment_type !== '2' ? data.rib : '',
      address: { fr: data.adressFr, ar: data.adressAr },
      photo: data.photo ?? null,
      employment_certificate: data.employment_certificate ?? null,
      careerKnowledges: data.careerKnowledges,
    };

    try {
      if (currentProduct) {
        await updatePersonal(currentProduct?.id, updatedData);
      } else {
        await createPersonal(updatedData);
      }
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.personal.root);
    } catch (error) {
      showError(error, setError);
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Informations personnelles" sx={{ mb: 3 }} />

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
          {!dataLoading && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="nationality_id" label="Nationalité" data={formattedNation} />
            </Grid>
          )}
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
              <Field.Upload
                name="image"
                maxSize={3145728}
                onDelete={handleRemoveImage}
                onDrop={onDropImage}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Certificat d&apos;embauche</Typography>
              <Field.Upload
                name="certificate"
                maxSize={3145728}
                onDelete={handleRemoveCertificate}
                onDrop={onDropCertificate}
                accept={{
                  'image/*': [],
                  'application/pdf': [],
                }}
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
        </Grid>
      </Stack>
    </Card>
  );
  console.log('vvvv', values);

  const renderFamilyInformation = () => (
    <Card>
      <CardHeader title="Informations Familiales" sx={{ mb: 3 }} />

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
        {!dataLoading && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.LookupMultiSelect
                name="careerKnowledges"
                label="Niveau d’études"
                options={careerKnowledges}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Text name="speciality" label="Spécialité" />
            </Grid>
          </Grid>
        )}
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
        {!dataLoading && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="subsidiary_id" label="Filiale" data={subsidiaries} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="direction_id" label="Direction" data={directions} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="site_id" label="Site" data={sites} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="division_id" label="Division" data={divisions} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="department_id" label="Departement" data={departments} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="section_id" label="Sections" data={sections} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="workshop_id" label="Atelier" data={workshops} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="machine_id" label="Machine" data={machines} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="zone_id" label="Zone" data={zones} />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Card>
  );

  const renderEmploymentInformation = () => (
    <Card>
      <CardHeader title="Informations sur l'Emploi" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        {!dataLoading && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="enterprise_id" label="Societé" data={enterprises} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="job_id" label="Function" data={jobs} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup
                name="salary_category_id"
                label="Catégorie socio-professionnelle"
                data={salaryCategories}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="rung_id" label="Échelons" data={rungs} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup
                name="salary_scale_level_id"
                label="Niveau de grille salariale"
                data={salaryScaleLevels}
              />
            </Grid>
            {!loadingSalaryGrids && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Lookup name="salary_grid_id" label="Net à payer" data={salaryGrids} />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Text
                name="salary_supplemental"
                label="Complément Salaire"
                placeholder="0"
                type="number"
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Switch
                name="allowed_overtime"
                labelPlacement="start"
                label="Peut effectuer des heures supplémentaires"
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Switch
                name="allowed_exit_voucher"
                labelPlacement="start"
                label="Peut effectuer des prélèvements du stock"
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Switch
                name="pea_exist"
                labelPlacement="start"
                label="Indemnité d'expérience professionnelle"
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="rate_id" label="Regime de cotisation" data={rates} />
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
              <Field.Number name="days_per_month" label="Jours par mois" type="number" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Number name="hours_per_month" label="Heures par mois" type="number" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.DatePicker name="declaration_date" label="Date déclaration" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.DatePicker name="service_start" label="Date entrée" />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Card>
  );
  const renderContractInformation = () => (
    <Card>
      <CardHeader title="Informations de la contrat" sx={{ mb: 3 }} />

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
          {String(values.contract_type) !== '2' && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.DatePicker name="to_date" label="Au" />
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 6 }}>
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
          {String(values.payment_type) !== '2' && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Text name="rib" label="RIB" />
              </Grid>
              {!dataLoading && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Lookup name="bank_id" label="Banque" data={banks} />
                </Grid>
              )}
            </>
          )}
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
