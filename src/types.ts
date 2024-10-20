export interface BacktestData {
  id: number;
  date: string;
  time: string;
  symbol: string;
  pattern: string;
  support: string;
  additional: string;
  r: number;
  feeling: string;
}
export interface BacktestDataInput {
  date: string;
  time: string;
  symbol: string;
  pattern: string;
  support: string;
  additional: string;
  r: number;
  feeling: string;
}
