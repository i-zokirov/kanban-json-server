import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
export class CreateSectionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'To Do' })
  title: string
}
