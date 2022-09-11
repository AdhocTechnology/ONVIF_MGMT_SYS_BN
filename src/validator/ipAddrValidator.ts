import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
@ValidatorConstraint({ name: 'customIPcamera', async: false })
export class CustomIPcameraLength implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(text);
    // return text.length > 1 && text.length < 10; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return '($value) is\'t IPv4 Address !';
  }
}
