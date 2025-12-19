// import {
//   Controller,
//   Post,
//   Body,
//   Param,
//   UseGuards,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { AdminService } from './admin.service';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { CreatePermissionDto } from './dto/create-permission.dto';
// import { AssignRolesDto } from './dto/assign-roles.dto';
// import { AssignPermissionsDto } from './dto/assign-permissions.dto';
// import { JwtAuthGuard } from '../User/jwt-auth.guard';
// import { PermissionsGuard } from '../common/guards/permissions.guard';
// import { Permissions } from '../common/decorators/permissions.decorator';

// @Controller('admin')
// @UseGuards(JwtAuthGuard, PermissionsGuard)
// @Permissions('admin.manage')
// export class AdminController {
//   constructor(private adminService: AdminService) {}

//   // ---- Roles ----
//   @Post('roles')
//   createRole(@Body() dto: CreateRoleDto) {
//     return this.adminService.createRole(dto);
//   }

//   // ---- Permissions ----
//   @Post('permissions')
//   createPermission(@Body() dto: CreatePermissionDto) {
//     return this.adminService.createPermission(dto);
//   }

//   // ---- Assign Permissions → Role ----
//   @Post('roles/:id/permissions')
//   assignPermissions(
//     @Param('id', ParseIntPipe) roleId: number,
//     @Body() dto: AssignPermissionsDto,
//   ) {
//     return this.adminService.assignPermissionsToRole(
//       roleId,
//       dto.permissionIds,
//     );
//   }

//   // ---- Assign Roles → User ----
//   @Post('users/:id/roles')
//   assignRoles(
//     @Param('id', ParseIntPipe) userId: number,
//     @Body() dto: AssignRolesDto,
//   ) {
//     return this.adminService.assignRolesToUser(userId, dto.roleIds);
//   }
// }






import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../auth/rbac.guard';
import { Permissions } from '../auth/permissions.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RbacGuard)
@Permissions('admin.manage')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('roles')
  createRole(@Body('name') name: string) {
    return this.adminService.createRole(name);
  }

  @Post('permissions')
  createPermission(@Body('code') code: string) {
    return this.adminService.createPermission(code);
  }

  @Post('roles/:id/permissions')
  assignPermissions(
    @Param('id') roleId: string,
    @Body('permissionIds') permissionIds: number[],
  ) {
    return this.adminService.assignPermissionsToRole(+roleId, permissionIds);
  }

  @Post('users/:id/roles')
  assignRoles(
    @Param('id') userId: string,
    @Body('roleIds') roleIds: number[],
  ) {
    return this.adminService.assignRolesToUser(+userId, roleIds);
  }
}

