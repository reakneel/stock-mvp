export interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  type: 'real' | 'simulation';
  shortCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Holding {
  id: string;
  portfolioId: string;
  stockCode: string;
  stockName: string;
  quantity?: number;      // 实盘持仓数量
  weight?: number;        // 模拟盘权重 (0-100)
  avgCost: number;        // 平均成本价
}

export interface PortfolioStats {
  totalValue: number;     // 总市值
  totalCost: number;      // 总成本
  profit: number;         // 盈亏金额
  profitRate: number;     // 盈亏比例 (%)
  dailyProfit: number;    // 当日盈亏
}

export interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface FuturesData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}
