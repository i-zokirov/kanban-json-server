import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './schemas/section.schema';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section.name) private sectionModal: Model<Section>,
  ) {}
  async create(createSectionDto: CreateSectionDto) {
    const createdSection = await this.sectionModal.create(createSectionDto);
    return createdSection.save();
  }

  findAll() {
    return this.sectionModal.find();
  }

  findOne(id: string) {
    return this.sectionModal.findById(id);
  }

  update(id: string, updateSectionDto: UpdateSectionDto) {
    return this.sectionModal.findByIdAndUpdate(id, updateSectionDto);
  }

  remove(id: string) {
    return this.sectionModal.findByIdAndDelete(id);
  }
}
