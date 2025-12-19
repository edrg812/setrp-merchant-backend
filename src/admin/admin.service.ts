// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { CreatePermissionDto } from './dto/create-permission.dto';

// @Injectable()
// export class AdminService {
//   constructor(private prisma: PrismaService) {}

//   // ---- Roles ----
//   createRole(dto: CreateRoleDto) {
//     return this.prisma.role.create({
//       data: { name: dto.name },
//     });
//   }

//   // ---- Permissions ----
//   createPermission(dto: CreatePermissionDto) {
//     return this.prisma.permission.create({
//       data: { code: dto.code },
//     });
//   }

//   // ---- Assign Permissions to Role ----
//   async assignPermissionsToRole(roleId: number, permissionIds: number[]) {
//     await this.prisma.rolePermission.deleteMany({
//       where: { roleId },
//     });

//     return this.prisma.rolePermission.createMany({
//       data: permissionIds.map((permissionId) => ({
//         roleId,
//         permissionId,
//       })),
//     });
//   }

//   // ---- Assign Roles to User ----
//   async assignRolesToUser(userId: number, roleIds: number[]) {
//     await this.prisma.userRole.deleteMany({
//       where: { userId },
//     });

//     return this.prisma.userRole.createMany({
//       data: roleIds.map((roleId) => ({
//         userId,
//         roleId,
//       })),
//     });
//   }
// }






import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PermissionsCacheService } from '../auth/permissions-cache.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private permissionsCache: PermissionsCacheService,
  ) {}

  // ✅ Create role
  async createRole(name: string) {
    return this.prisma.role.create({ data: { name } });
  }

  // ✅ Create permission
  async createPermission(code: string) {
    return this.prisma.permission.create({ data: { code } });
  }

  // ✅ Assign permissions to role
  async assignPermissionsToRole(roleId: number, permissionIds: number[]) {
    await this.prisma.rolePermission.deleteMany({ where: { roleId } });

    await this.prisma.rolePermission.createMany({
      data: permissionIds.map((pid) => ({
        roleId,
        permissionId: pid,
      })),
    });

    // 🔥 Invalidate cache for users with this role
    const users = await this.prisma.userRole.findMany({
      where: { roleId },
    });

    for (const ur of users) {
      await this.permissionsCache.deleteUserPermissions(ur.userId);
    }

    return { message: 'Permissions assigned & cache cleared' };
  }

  // ✅ Assign roles to user
  async assignRolesToUser(userId: number, roleIds: number[]) {
    await this.prisma.userRole.deleteMany({ where: { userId } });

    await this.prisma.userRole.createMany({
      data: roleIds.map((rid) => ({
        userId,
        roleId: rid,
      })),
    });

    // 🔥 Invalidate cache for that user
    await this.permissionsCache.deleteUserPermissions(userId);

    return { message: 'Roles assigned & cache cleared' };
  }
}
