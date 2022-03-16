import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../commons/exceptions/custom.exception';

export class PostDoesNotExistException extends CustomException {
  constructor() {
    super('Post does not exist', HttpStatus.NOT_FOUND);
  }
}
