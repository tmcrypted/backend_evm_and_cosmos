export class EvmTransactionResponseDto {
  hash: string;
  to: string;
  from: string;
  value: string;
  input: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  gasPrice: string;
}
