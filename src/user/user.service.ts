import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CatService } from 'src/cat/cat.service';
import { CreateUserDTO } from './user.dto';
import { Cat } from 'src/cat/cat.model';
import { BaseService } from 'src/utils/base.service';

@Injectable()
export class UserService extends BaseService<User, CreateUserDTO> {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    @Inject(forwardRef(() => CatService)) private readonly catService: CatService
  ) { super() }


  async findAll(): Promise<User[] | null> {
    return (await this.userModel
      .find()
      .populate({ path: 'cats', model: Cat })
      .exec())
      .map((user) => user.toJSON());
  }

  async findByName(name: string): Promise<User> {
    const user = await this.userModel
      .findOne({ name })
      .populate({ path: 'cats', model: Cat });

    if (!user) {
      throw new NotFoundException(`User ${name} not found`, name);
    }

    return user.toJSON();
  }

  async findByNames(names: string[]): Promise<User[] | null> {
    const users = await this.userModel.find({ name: { $in: names } });

    const userNames = users.map(({ name }) => name);
    names.forEach(userName => {
      if (!userNames.includes(userName)) {
        throw new NotFoundException(`Cat ${userName} not found`);
      }
    })

    return users;
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    await super.validateNoDuplicates(createUserDTO.name);

    const user = await this.createUserFromDTO(createUserDTO);
    return await this.userModel.create(user);
  }

  async updateByName(name: string, newCreateUserDTO: CreateUserDTO): Promise<User> {
    await super.validateExists(name);

    const newUser = await this.createUserFromDTO(newCreateUserDTO);
    return await this.userModel.findOneAndUpdate({ name }, newUser);
  }

  async removeByName(name: string): Promise<User> {
    await super.validateExists(name);
    return await this.userModel.findOneAndRemove({ name });
  }

  private async createUserFromDTO(createUserDTO: CreateUserDTO): Promise<User> {
    const cats = await this.catService.findByNames(createUserDTO.catNames);
    const user = {
      name: createUserDTO.name,
      cats: cats.map(({ _id }) => _id)
    }

    return user;
  }
}
