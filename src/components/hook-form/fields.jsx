import { RHFEditor } from './rhf-editor';
import { RHFTextField } from './rhf-text-field';
import { RHFRadioGroup } from './rhf-radio-group';
import { RHFTimePicker } from './rhf-time-picker';
import { RHFNumberField } from './rhf-number-field';
import { RHFNumberInput } from './rhf-number-input';
import { RHFRotationDays } from './rhf-rotation-days';
import { RHFSwitch, RHFMultiSwitch } from './rhf-switch';
import { RHFContractEditor } from './rhf-contract-editor';
import { RHFLookup, RHFLookupMultiSelect } from './rhf-lookup';
import { RHFCheckbox, RHFMultiCheckbox } from './rhf-checkbox';
import { RHFMultiCheckboxLookup } from './rhf-multicheckbox-lookup';
import { RHFUpload, RHFUploadBox, RHFUploadAvatar } from './rhf-upload';
import { RHFSelect, RHFMultiSelect, RHFSelectSearch } from './rhf-select';
import { RHFLookup, RHFLookupMultiSelect, RHFLookupSearch } from './rhf-lookup';
import { RHFDatePicker, RHFDateTimePicker, RHFMobileDateTimePicker } from './rhf-date-picker';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Number: RHFNumberField,
  DatePicker: RHFDatePicker,
  DateTimePicker: RHFDateTimePicker,

  TimePicker: RHFTimePicker,

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
  Lookup: RHFLookup,
  LookupMultiSelect: RHFLookupMultiSelect,
  RotationDays: RHFRotationDays,
  MultiCheckboxLookup: RHFMultiCheckboxLookup,
  // THIS IS A LOOKUP SELECT WITH A SEARCH BAR
  LookupSearch: RHFLookupSearch,
  SelectSearch: RHFSelectSearch,
  Editor: RHFEditor,
  ContractEditor: RHFContractEditor,
};
