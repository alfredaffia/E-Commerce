import { BadRequestException,Injectable, NotFoundException, } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { UserRole } from 'src/utility/enum/user.role.enum';



@Injectable()
export class UserService {
    private readonly ADMIN_USERS_TO_SEED = [
    {
      email: 'admin@gmail.com',
      password: 'SuperSecureAdminPassword123!',
      userName: 'Admin',
      role: UserRole.ADMIN
    },
    {
      email: 'admin2@gmail.com',
      password: 'AnotherStrongPassword456!',
    userName: 'Secondary Administrator',
      role: UserRole.ADMIN
    },
  ];
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async seedDefaultAdmins() :Promise<any>{
    if (!this.ADMIN_USERS_TO_SEED || this.ADMIN_USERS_TO_SEED.length === 0) {
      console.warn('No admin users defined for seeding. Skipping.');
      return;
    }

    for (const adminData of this.ADMIN_USERS_TO_SEED) {
      try {
        const existingAdmin = await this.userRepository.findOneBy({ email: adminData.email })
        if (existingAdmin) {
          console.warn(`Admin "${adminData.email}" already exists. Skipping.`);
          continue;
        }
        const hashedPassword = await argon2.hash(adminData.password);

        const newAdmin = this.userRepository.create({
          userName: adminData.userName ,
          email: adminData.email,
          password: hashedPassword,
          role: adminData.role || UserRole.ADMIN,
        });
        await this.userRepository.save(newAdmin);
        console.log(`Admin "${adminData.email}" seeded successfully.`);

      } catch (error) {
        console.error(`Error seeding admin "${adminData.email}": ${error.message}`);
      }
    }
  }


  async findAll() {
    const AllUsers = await this.userRepository.find()
    if(!AllUsers){
      'no saved user'
    }
    return AllUsers;
  }

  async findOne (id:string){
    const user = await this.userRepository.findOne({where:{id: id}});
    if (!user){
      throw new NotFoundException('user not found')
    }
    return user;
  }


  async findOneById(id: string,) {
    const user = await this.userRepository.findOneBy({ id: id },);
    if (!user){
      throw new NotFoundException('user not found')
    }
    return user;
  }

    async blockUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isBlocked = true;
    await this.userRepository.save(user);

    return { message: `User with ID ${id} has been blocked.` };
  }

  async unBlockUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isBlocked = false;
    await this.userRepository.save(user);

    return { message: `User with ID ${id} has been unblocked.` };
  }


async update(userId: string, updateUserDto: UpdateUserDto) { 
    const userToUpdate = await this.userRepository.findOne({where:{id: userId}});
    if (!userToUpdate) {
      throw new NotFoundException(`User profile with ID "${userId}" not found.`);
    }
    if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
      const existingUserWithNewEmail = await this.userRepository.findOneBy({ email: updateUserDto.email });
      if (existingUserWithNewEmail && existingUserWithNewEmail.id !== userToUpdate.id) {
        throw new BadRequestException('The new email address is already registered to another user.');
      }
    }

    if (updateUserDto.password) {
      userToUpdate.password = await argon2.hash(updateUserDto.password);
      delete updateUserDto.password; 
    }

    Object.assign(userToUpdate, updateUserDto);

    const updatedUser = await this.userRepository.save(userToUpdate);

    return {
      message: `User profile with ID "${userId}" updated successfully.`,
      user: updatedUser
    };
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Library record with ID ${id} not found`);
    }
    const newresult = await this.userRepository.delete(id)

    return {
      message: `Library record with ID ${id} deleted successfully`
    };
  }
}
