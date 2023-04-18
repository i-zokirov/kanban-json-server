import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Task 1' })
  title: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String, example: 'Description 1' })
  description: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  section: string
}
