import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CosmosBlockResponseDto } from '../common/dto/cosmos-block-response.dto';
import { CosmosTransactionResponseDto } from '../common/dto/cosmos-transaction-response.dto';

@Injectable()
export class CosmosService {
  private readonly rpcUrl: string;
  private readonly timeout: number;

  constructor(private configService: ConfigService) {
    this.rpcUrl = this.configService.get<string>('cosmos.rpcUrl')!;
    this.timeout = this.configService.get<number>('cosmos.timeout')!;
  }

  async getBlock(height: number): Promise<CosmosBlockResponseDto> {
    try {
      const response = await axios.get(`${this.rpcUrl}/block?height=${height}`, {
        timeout: this.timeout,
      });
      
      if (response.status !== 200) {
        throw new HttpException('Failed to fetch block', HttpStatus.BAD_REQUEST);
      }

      const blockData = response.data.result.block;
      if (!blockData) {
        throw new HttpException('Block not found', HttpStatus.NOT_FOUND);
      }

      return {
        height: parseInt(blockData.header.height),
        time: blockData.header.time,
        hash: blockData.header.last_block_id.hash,
        proposedAddress: blockData.header.proposer_address,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch block data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTransaction(hash: string): Promise<CosmosTransactionResponseDto> {
    try {
      const formattedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
      
      const response = await axios.get(`${this.rpcUrl}/tx?hash=${formattedHash}`, {
        timeout: this.timeout,
      });
      
      if (response.status !== 200) {
        throw new HttpException('Failed to fetch transaction', HttpStatus.BAD_REQUEST);
      }

      const txData = response.data.result;
      if (!txData) {
        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
      }

      
      const txResult = txData.tx_result;
      const events = txResult.events || [];
      
   
      let sender = 'N/A';
      const messageEvent = events.find(event => event.type === 'message');
      if (messageEvent && messageEvent.attributes) {
        const senderAttr = messageEvent.attributes.find(attr => attr.key === 'sender');
        if (senderAttr) {
          sender = senderAttr.value;
        }
      }

      return {
        hash: txData.hash,
        height: parseInt(txData.height),
        time: new Date().toISOString(),
        gasUsed: txResult.gas_used,
        gasWanted: txResult.gas_wanted,
        fee: txResult.events,
        sender: sender,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch transaction data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
