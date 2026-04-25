import { StockData, IndexData, FuturesData } from '@/types';

/**
 * 解析新浪财经 API 返回的数据
 * 格式：var hq_str_sh000001="上证指数，3042.507,32.097,1.07,..."
 */
export function parseSinaStockData(code: string, rawData: string): StockData | null {
  if (!rawData || rawData.includes('null')) return null;

  const match = rawData.match(/="([^"]+)"/);
  if (!match) return null;

  const parts = match[1].split(',');
  if (parts.length < 32) return null;

  const name = parts[0];
  const open = parseFloat(parts[1]) || 0;
  const close = parseFloat(parts[2]) || 0; // 昨日收盘
  const current = parseFloat(parts[3]) || 0; // 当前价
  const high = parseFloat(parts[4]) || 0;
  const low = parseFloat(parts[5]) || 0;
  const volume = parseFloat(parts[8]) || 0;

  const change = current - close;
  const changePercent = close !== 0 ? (change / close) * 100 : 0;

  return {
    code: code.toLowerCase().replace('_', ''),
    name,
    price: current,
    change,
    changePercent: parseFloat(changePercent.toFixed(2)),
    open,
    high,
    low,
    close,
    volume,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 从新浪财经获取股票数据
 * 使用服务端代理绕过 CORS
 */
export async function fetchStockData(codes: string[]): Promise<StockData[]> {
  if (codes.length === 0) return [];

  // 限制每次请求的股票数量（最多 50 个）
  const batchCodes = codes.slice(0, 50);
  const scriptCodes = batchCodes.map(code => {
    const prefix = code.startsWith('sh') || code.startsWith('sz') ? code : 
                   code.startsWith('6') || code.startsWith('0') || code.startsWith('3') 
                   ? (code.startsWith('6') ? `sh${code}` : `sz${code}`)
                   : code;
    return prefix;
  });

  const url = `https://hq.sinajs.cn/rn=${Date.now()}/list=${scriptCodes.join(',')}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Referer': 'https://finance.sina.com.cn/',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch stock data:', response.status);
      return [];
    }

    const text = await response.text();
    const results: StockData[] = [];

    // 解析每个股票的数据
    scriptCodes.forEach(code => {
      const regex = new RegExp(`var hq_str_${code}="([^"]+)"`);
      const match = text.match(regex);
      if (match) {
        const stockData = parseSinaStockData(code, match[0]);
        if (stockData) results.push(stockData);
      }
    });

    return results;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
}

/**
 * 获取全球指数数据
 */
const INDEX_CODES = {
  'sh000001': '上证指数',
  'sz399001': '深证成指',
  'sz399006': '创业板指',
  'hkHSI': '恒生指数',
  'gb_DJI': '道琼斯指数',
  'gb_IXIC': '纳斯达克指数',
  'gb_INX': '标普 500',
  'jn_N225': '日经 225',
  'kc_KOSPI': '韩国综指',
};

export async function fetchIndexData(): Promise<IndexData[]> {
  const codes = Object.keys(INDEX_CODES);
  const url = `https://hq.sinajs.cn/rn=${Date.now()}/list=${codes.join(',')}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Referer': 'https://finance.sina.com.cn/',
      },
      cache: 'no-store',
    });

    if (!response.ok) return [];

    const text = await response.text();
    const results: IndexData[] = [];

    codes.forEach(code => {
      const regex = new RegExp(`var hq_str_${code}="([^"]+)"`);
      const match = text.match(regex);
      if (match) {
        const parts = match[1].split(',');
        if (parts.length >= 4) {
          const current = parseFloat(parts[3]) || 0;
          const close = parseFloat(parts[2]) || 0;
          const change = current - close;
          const changePercent = close !== 0 ? (change / close) * 100 : 0;

          results.push({
            symbol: code,
            name: INDEX_CODES[code as keyof typeof INDEX_CODES] || code,
            price: current,
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
          });
        }
      }
    });

    return results;
  } catch (error) {
    console.error('Error fetching index data:', error);
    return [];
  }
}

/**
 * 获取期货数据
 */
const FUTURES_CODES = {
  'hf_CL': '原油期货',
  'hf_GC': '黄金期货',
  'hf_SI': '白银期货',
  'nf_CU': '沪铜',
  'nf_AL': '沪铝',
};

export async function fetchFuturesData(): Promise<FuturesData[]> {
  const codes = Object.keys(FUTURES_CODES);
  const url = `https://hq.sinajs.cn/rn=${Date.now()}/list=${codes.join(',')}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Referer': 'https://finance.sina.com.cn/',
      },
      cache: 'no-store',
    });

    if (!response.ok) return [];

    const text = await response.text();
    const results: FuturesData[] = [];

    codes.forEach(code => {
      const regex = new RegExp(`var hq_str_${code}="([^"]+)"`);
      const match = text.match(regex);
      if (match) {
        const parts = match[1].split(',');
        if (parts.length >= 4) {
          const current = parseFloat(parts[3]) || 0;
          const close = parseFloat(parts[2]) || 0;
          const change = current - close;
          const changePercent = close !== 0 ? (change / close) * 100 : 0;

          results.push({
            symbol: code,
            name: FUTURES_CODES[code as keyof typeof FUTURES_CODES] || code,
            price: current,
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
          });
        }
      }
    });

    return results;
  } catch (error) {
    console.error('Error fetching futures data:', error);
    return [];
  }
}

/**
 * 判断是否为交易时间
 */
export function isTradingHours(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const day = now.getDay();

  // 周末不交易
  if (day === 0 || day === 6) return false;

  // 交易时间：9:30-11:30, 13:00-15:00
  const time = hours * 60 + minutes;
  return (time >= 570 && time < 690) || (time >= 780 && time < 900);
}
