import { toast } from 'src/components/snackbar';

export function showError(error, setError) {
  if (error && error?.errors) {
    const errors = error.errors;

    // Loop through the errors object and display each error
    for (const [field, messages] of Object.entries(errors)) {
      // If you want to show them via react-hook-form
      if (setError) {
        setError(field, {
          type: 'manual',
          message: messages[0], // just take the first message
        });
      }

      // Or show via toast
      toast.error(`${field}: ${messages[0]}`);
    }
  } else if (error && error?.message) {
    toast.error(error?.message);
  } else {
    // Generic error fallback
    toast.error('An unexpected error occurred.');
  }
}
