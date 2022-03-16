import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../commons/exceptions/custom.exception';

export class UserDoesNotExistException extends CustomException {
  constructor() {
    super('User does not exist', HttpStatus.NOT_FOUND);
  }
}
