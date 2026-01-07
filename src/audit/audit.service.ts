import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    action: string;
    entityType: string;
    entityId: string;
    performedBy?: number;
    ipAddress?: string;
    metadata?: any;
  }) {
    return this.prisma.auditLog.create({
      data,
    });
  }
}
