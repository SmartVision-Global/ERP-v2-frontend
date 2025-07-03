import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Tab, Card, Tabs, Stack, Divider, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { createGeneralSetting } from 'src/actions/generalSettings';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewProductSchema = zod
  .object({
    contract_type: zod.string(),
    languageCdd: zod.string(),
    languageCdi: zod.string(),
    languageOther: zod.string(),

    contentCdi: zod.string().optional().nullable(),
    contentCdd: zod.string().optional().nullable(),
    contentOther: zod.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.contract_type === '1') {
      if (data.contentCdd.length < 8) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remlir ce champ',
          path: ['contentCdd'],
        });
      }
    }
    if (data.contract_type === '2') {
      if (data.contentCdi.length < 8) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remlir ce champ',
          path: ['contentCdi'],
        });
      }
    }
    if (data.contract_type === '3') {
      if (data.contentOther.length < 8) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remlir ce champ',
          path: ['contentOther'],
        });
      }
    }
  });

const CONTRACT_TYPE_OPTIONS = [
  { label: 'CDD', value: '1' },
  { label: 'CDI', value: '2' },
  { label: 'Autre', value: '3' },
];

export function ContractNewEditForm({ currentProduct }) {
  const router = useRouter();
  const defaultValues = {
    contentCdd: '',
    // '<p><strong>article 1-Cadre légal</strong></p><p style="text-align: left">Ce contrat de travail est établi suivant  les dispositive  de la loi 90-11 du 21/04/1990 relative aux relations de travail et du code civil dans sa partie concernant les conditions du contrat</p><p style="text-align: left"><strong>Article 2 Droits et obligations de l\'employé</strong></p><p style="text-align: left">Les droits et obligations de l\'employé ...</p>',
    // '<p>Entre l\'employeur <strong><span data-enterprise-name="" htmlattributes="[object Object]">enterprise_name</span> </strong>sis a <span data-enterprise-address="" htmlattributes="[object Object]">enterprise_address</span>                                                   Représenté par : RH                                                                                                                                                  Et                                                                                                                                                                             d\'une autre part :  Mr <strong><span data-fullname="" htmlattributes="[object Object]">full_name</span> </strong></p><p style="text-align: justify">Définition des differentes parties présentés sur le contrat : ici l\'employeur fait référence a la <span data-enterprise-name="" htmlattributes="[object Object]">enterprise_name</span> , l\'employé a Mr <span data-fullname="" htmlattributes="[object Object]">full_name</span>.</p><p><strong>article 1-Cadre légal</strong></p><p style="text-align: left">Ce contrat de travail est établi suivant les dispositive de la loi 90-11 du 21/04/1990 relative aux relations de travail et du code civil dans sa partie concernant les conditions du contrat</p><p style="text-align: left"><strong>Article 2 Droits et obligations de l\'employé</strong></p><p style="text-align: left">Les droits et obligations de l\'employé ...</p>',
    contentCdi: '',
    contentOther: '',

    contract_type: '1',
    languageCdd: 'fr',
    languageCdi: 'fr',
    languageOther: 'fr',
  };
  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: {
      contentCdd: currentProduct ? JSON.parse(currentProduct)[1].text : '',
      contentCdi: currentProduct ? JSON.parse(currentProduct)[2].text : '',
      contentOther: currentProduct ? JSON.parse(currentProduct)[3].text : '',

      contract_type: '1',
      languageCdd: currentProduct ? JSON.parse(currentProduct)[1].language : 'fr',
      languageCdi: currentProduct ? JSON.parse(currentProduct)[2].language : 'fr',
      languageOther: currentProduct ? JSON.parse(currentProduct)[3].language : 'fr',
    },
  });

  const {
    watch,
    setValue,
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();

  const handleChangeTab = useCallback(
    (event, newValue) => {
      setValue('contract_type', newValue);
    },
    [setValue]
  );

  const handleChangeLangCdd = useCallback(
    (lang) => {
      setValue('languageCdd', lang);
    },
    [setValue]
  );
  const handleChangeLangCdi = useCallback(
    (lang) => {
      setValue('languageCdi', lang);
    },
    [setValue]
  );

  const handleChangeLangOther = useCallback(
    (lang) => {
      setValue('languageOther', lang);
    },
    [setValue]
  );
  console.log('values', values);
  ('<p>Entre l\'employeur <strong><span data-enterprise-name="" htmlattributes="[object Object]">enterprise_name</span> </strong>sis a <span data-enterprise-address="" htmlattributes="[object Object]">enterprise_address</span> Représenté par : RH Et d\'une autre part : Mr <strong><span data-fullname="" htmlattributes="[object Object]">full_name</span></strong></p><p style="text-align: justify">Définition des differentes parties présentés sur le contrat : ici l\'employeur fait référence a la <span data-enterprise-name="" htmlattributes="[object Object]">enterprise_name</span> , l\'employé a Mr <span data-fullname="" htmlattributes="[object Object]">full_name</span>.</p><p><strong>article 1-Cadre légal</strong></p><p style="text-align: left">Ce contrat de travail est établi suivant les dispositive de la loi 90-11 du 21/04/1990 relative aux relations de travail et du code civil dans sa partie concernant les conditions du contrat</p><p style="text-align: left"><strong>Article 2 Droits et obligations de l\'employé</strong></p><p style="text-align: left">Les droits et obligations de l\'employé ... le present contrat date de début : <span data-contract-start-date="" htmlattributes="[object Object]">contract_start_date</span> ,et se termine le : <span data-contract-end-date="" htmlattributes="[object Object]">contract_end_date</span>.</p>');

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };
    const newData = {
      contract: {
        1: {
          language: data.languageCdd,
          text: data.contentCdd,
        },
        2: {
          language: data.languageCdi,
          text: data.contentCdi,
        },
        3: {
          language: data.languageOther,
          text: data.contentOther,
        },
      },
    };

    const jsonData = JSON.stringify(newData.contract);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // if (currentProduct) {
      //   // await updateZone(currentProduct.id, updatedData);
      // } else {
      // console.log('vdvdvv', JSON.parse(newData));

      await createGeneralSetting({ contract: jsonData });
      // await createZone(data);
      // }
      // console.log('ddddddd', JSON.stringify(data));
      //  JSON.stringify(data);
      // reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.rhSettings.contracts);
      console.info('DATA', updatedData);
    } catch (error) {
      showError(error, setError);

      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Ajouter Contract"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />
      <Box p={3}>
        <Tabs value={values.contract_type} onChange={handleChangeTab}>
          {CONTRACT_TYPE_OPTIONS.map((contractType) => (
            <Tab key={contractType.value} label={contractType.label} value={contractType.value} />
          ))}
        </Tabs>
      </Box>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {values.contract_type === '1' && (
            <Grid size={{ xs: 12, md: 12 }}>
              <Field.ContractEditor
                name="contentCdd"
                sx={{ minHeight: 800 }}
                languageCb={handleChangeLangCdd}
              />
            </Grid>
          )}
          {values.contract_type === '2' && (
            <Grid size={{ xs: 12, md: 12 }}>
              <Field.ContractEditor
                name="contentCdi"
                sx={{ minHeight: 500 }}
                languageCb={handleChangeLangCdi}
              />
            </Grid>
          )}
          {values.contract_type === '3' && (
            <Grid size={{ xs: 12, md: 12 }}>
              <Field.ContractEditor
                name="contentOther"
                sx={{ minHeight: 500 }}
                languageCb={handleChangeLangOther}
              />
            </Grid>
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
        {!currentProduct ? 'Ajouter' : 'Enregistrer les modification'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {renderDetails()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
