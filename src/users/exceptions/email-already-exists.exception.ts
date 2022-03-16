import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../commons/exceptions/custom.exception';

export class EmailAlreadyExistsException extends CustomException {
  constructor() {
    super('Email already Exists', HttpStatus.BAD_REQUEST);
  }
}
