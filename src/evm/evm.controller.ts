import { Controller, Get, Param } from '@nestjs/common';
import { EvmService } from './evm.service';
import { BlockParamsDto } from '../common/dto/block-params.dto';
import { TransactionParamsDto } from '../common/dto/transaction-params.dto';
import { EvmBlockResponseDto } from '../common/dto/evm-block-response.dto';
import { EvmTransactionResponseDto } from '../common/dto/evm-transaction-response.dto';

@Controller('evm')
export class EvmController {
  constructor(private readonly evmService: EvmService) {}

  @Get('block/:height')
  async getBlock(@Param() params: BlockParamsDto): Promise<EvmBlockResponseDto> {
    return this.evmService.getBlock(params.height);
  }

  @Get('transactions/:hash')
  async getTransaction(@Param() params: TransactionParamsDto): Promise<EvmTransactionResponseDto> {
    return this.evmService.getTransaction(params.hash);
  }
}
