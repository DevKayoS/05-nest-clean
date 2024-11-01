import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
 public client: PrismaClient

  constructor() {
    super({
      log: ['warn', 'error']
    })
  }
  // quando modulo iniciar ele se conecta ao banco de dados
  onModuleInit() {
    return this.$connect()
  }

  // quando a aplicacao parar o prisma sera desconectado
  onModuleDestroy() {
    return this.$disconnect()
  }
}