import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../commons/exceptions/custom.exception';

export class UsernameAlreadyExistsException extends CustomException {
  constructor() {
    super('Username already Exists', HttpStatus.BAD_REQUEST);
  }
}
