import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './models/create_user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './models/update_user.dto';


@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    // Dependency Injection
    constructor(private userService: UserService) {

    }

    
    @Get() 
    async all(@Query('page') page = 1): Promise<User[]> {
        return await this.userService.paginate(page);
    }

    @Post()
    async create(@Body() body: CreateUserDto): Promise<User> {
        const password = await bcrypt.hash('1234', 12); // belum paham

        // copy semua data ke body
        const{role_id, ...data} = body;

        // jadiin role_idnya sebagai object melalui role
        return this.userService.create({
            ...data,
            password,
            role: {id: body.role_id}
        });
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return this.userService.findOne({id});
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: UpdateUserDto
    ) {

        // tangkep role id dan semua data
        const{role_id, ...data} = body;

        // tunggu data-nya diupdate, setelah itu di return kembali
        await this.userService.update(id, {
            ...data,
            role: {id: role_id}
        });

        return this.userService.findOne({id});
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }
}

   


