import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { zodResolver } from '@hookform/resolvers/zod';

import { schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewTourSchema = zod.object({
  content: schemaHelper
    .editor()
    .min(100, { message: 'Content must be at least 100 characters' })
    .max(500, { message: 'Content must be less than 500 characters' }),
});

const defaultValues = {
  editor: '',
};

export function Page() {
  const methods = useForm({
    resolver: zodResolver(NewTourSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      reset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <Helmet>
        <title>Two</title>
      </Helmet>
      <p>ssss</p>
    </>
  );
}
