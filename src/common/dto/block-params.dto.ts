import { IsInt, Min, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class BlockParamsDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Height must be an integer' })
  @IsPositive({ message: 'Height must be a positive number' })
  @Min(1, { message: 'Height must be at least 1' })
  height: number;
}
