import * as bcrypt from 'bcrypt';
import * as F from 'fp-ts';

const encrypt = (data: string) => {
  return F.taskEither.tryCatch(
    async () => await bcrypt.hash(data, 10),
    (err) => new Error('cannot encrypt'),
  )();
};

const compare = async (data: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(data, hashed);
};

export { encrypt, compare };
