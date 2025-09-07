import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvmModule } from './evm/evm.module';
import { CosmosModule } from './cosmos/cosmos.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    EvmModule,
    CosmosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
