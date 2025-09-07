import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EvmBlockResponseDto } from '../common/dto/evm-block-response.dto';
import { EvmTransactionResponseDto } from '../common/dto/evm-transaction-response.dto';

@Injectable()
export class EvmService {
  private readonly rpcUrl: string;
  private readonly timeout: number;

  constructor(private configService: ConfigService) {
    this.rpcUrl = this.configService.get<string>('evm.rpcUrl')!;
    this.timeout = this.configService.get<number>('evm.timeout')!;
  }

  async getBlock(height: number): Promise<EvmBlockResponseDto> {
    try {
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: [`0x${height.toString(16)}`, true],
        id: 1,
      }, {
        timeout: this.timeout,
      });

      if (response.data.error) {
        throw new HttpException(response.data.error.message, HttpStatus.BAD_REQUEST);
      }

      const block = response.data.result;
      if (!block) {
        throw new HttpException('Block not found', HttpStatus.NOT_FOUND);
      }

      return {
        height: parseInt(block.number, 16),
        hash: block.hash,
        parentHash: block.parentHash,
        gasLimit: block.gasLimit,
        gasUsed: block.gasUsed,
        size: parseInt(block.size, 16),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch block data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTransaction(hash: string): Promise<EvmTransactionResponseDto> {
    try {
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [hash],
        id: 1,
      }, {
        timeout: this.timeout,
      });

      if (response.data.error) {
        throw new HttpException(response.data.error.message, HttpStatus.BAD_REQUEST);
      }

      const transaction = response.data.result;
      if (!transaction) {
        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
      }


      return {
        hash: transaction.hash,
        to: transaction.to,
        from: transaction.from,
        value: transaction.value,
        input: transaction.input,
        maxFeePerGas: transaction.maxFeePerGas || '0x0',
        maxPriorityFeePerGas: transaction.maxPriorityFeePerGas || '0x0',
        gasPrice: transaction.gasPrice || '0x0',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch transaction data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
