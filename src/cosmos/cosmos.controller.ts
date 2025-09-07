import { Controller, Get, Param } from '@nestjs/common';
import { CosmosService } from './cosmos.service';
import { BlockParamsDto } from '../common/dto/block-params.dto';
import { TransactionParamsDto } from '../common/dto/transaction-params.dto';
import { CosmosBlockResponseDto } from '../common/dto/cosmos-block-response.dto';
import { CosmosTransactionResponseDto } from '../common/dto/cosmos-transaction-response.dto';

@Controller('cosmos')
export class CosmosController {
  constructor(private readonly cosmosService: CosmosService) {}

  @Get('block/:height')
  async getBlock(@Param() params: BlockParamsDto): Promise<CosmosBlockResponseDto> {
    return this.cosmosService.getBlock(params.height);
  }

  @Get('transactions/:hash')
  async getTransaction(@Param() params: TransactionParamsDto): Promise<CosmosTransactionResponseDto> {
    return this.cosmosService.getTransaction(params.hash);
  }
}
