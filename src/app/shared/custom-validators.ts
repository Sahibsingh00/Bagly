
import { AbstractControl, FormControl, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    static email(c: AbstractControl): ValidationErrors {
        let isValid = true;
        try {
          const name = c.value;
          const regex = new RegExp('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$');
          if (!regex.test(name) && name !== '' && name !== null && name !== undefined) {
            isValid = false;
          }
        } catch {
          isValid = false;
        }
        const message = { email: true };
        // return isValid ? null : message;
       return  message;
      }
}
