import { FormGroup, ValidatorFn } from '@angular/forms';

export const scoreInputValidator: ValidatorFn = (fg: FormGroup) => {
  const first = fg.get('first').value;
  const second = fg.get('second').value;
  return first !== null && second !== null && (first + second) <= 10 ? null : { scoreInput: true };
};
