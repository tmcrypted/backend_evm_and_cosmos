import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class TransactionParamsDto {
  @IsString({ message: 'Hash must be a string' })
  @IsNotEmpty({ message: 'Hash cannot be empty' })
  @Matches(/^(0x)?[0-9a-fA-F]+$/, { message: 'Hash must be a valid hexadecimal string (with or without 0x prefix)' })
  @Length(64, 66, { message: 'Hash must be between 64 and 66 characters' })
  hash: string;
}
