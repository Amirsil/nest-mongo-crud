import { Injectable, NotFoundException } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import { Cat } from "src/cat/cat.model";
import { BaseService } from "src/utils/base.service";
import { CreateCatDTO } from "./cat.dto";

@Injectable()
export class CatService extends BaseService<Cat, CreateCatDTO> {
  constructor(
    @InjectModel(Cat)
    private readonly catModel: ReturnModelType<typeof Cat>) { super() }

  async findAll(): Promise<Cat[]> {
    return await this.catModel
      .find()
      .exec();
  }

  async findByName(name: string): Promise<Cat> {
    const cat = await this.catModel
      .findOne({ name })
      .exec();

    if (!cat) {
      throw new NotFoundException(`Cat ${name} not found`);
    }

    return cat;
  }

  async findByNames(names: string[]): Promise<Cat[]> {
    const cats = await this.catModel
      .find({ name: { $in: names } })
      .exec();

    const catNames = cats.map(({ name }) => name);
    names.forEach(catName => {
      if (!catNames.includes(catName)) {
        throw new NotFoundException(`Cat ${catName} not found`);
      }
    })

    return cats;
  }

  async create(createCatDTO: CreateCatDTO): Promise<Cat> {
    await super.validateNameIsLegal(createCatDTO.name);
    await super.validateNoDuplicates(createCatDTO.name);
    return await this.catModel.create(createCatDTO);
  }

  async updateByName(name: string, createCatDTO: CreateCatDTO): Promise<Cat> {
    await super.validateNameIsLegal(createCatDTO.name);
    await super.validateExists(name);
    return await this.catModel
      .findOneAndUpdate({ name }, createCatDTO)
      .exec();
  }

  async removeByName(name: string): Promise<void> {
    await super.validateNameIsLegal(name);
    await super.validateExists(name);
    await this.catModel
      .findOneAndDelete({ name })
      .exec();
  }
}