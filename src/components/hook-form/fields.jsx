import { RHFTextField } from './rhf-text-field';
import { RHFRadioGroup } from './rhf-radio-group';
import { RHFNumberField } from './rhf-number-field';
import { RHFNumberInput } from './rhf-number-input';
import { RHFSelect, RHFMultiSelect } from './rhf-select';
import { RHFSwitch, RHFMultiSwitch } from './rhf-switch';
import { RHFCheckbox, RHFMultiCheckbox } from './rhf-checkbox';
import { RHFUpload, RHFUploadBox, RHFUploadAvatar } from './rhf-upload';
import { RHFDatePicker, RHFMobileDateTimePicker } from './rhf-date-picker';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Number: RHFNumberField,
  DatePicker: RHFDatePicker,
  Upload: RHFUpload,
  MobileDateTimePicker: RHFMobileDateTimePicker,
  Select: RHFSelect,
  MultiSelect: RHFMultiSelect,
  UploadBox: RHFUploadBox,
  UploadAvatar: RHFUploadAvatar,
  Switch: RHFSwitch,
  MultiSwitch: RHFMultiSwitch,
  NumberInput: RHFNumberInput,
  Checkbox: RHFCheckbox,
  RadioGroup: RHFRadioGroup,
  MultiCheckbox: RHFMultiCheckbox,
};
