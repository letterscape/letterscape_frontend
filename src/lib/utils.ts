import Decimal from "decimal.js";

export const formatTimestampToDateTime = (timestamp: number): string => {
  // 将秒级时间戳转换为毫秒级
  const date = new Date(timestamp * 1000);

  // 获取各个时间部分
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 格式化为 YYYY-MM-DD HH:mm:ss
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export const truncateDynamic = (str: string, maxLength: number): string =>  {
  if (str.length <= maxLength) {
    return str;
  }
  const keepLength = Math.floor((maxLength - 3) / 2); // 计算两边字符数，预留 3 个字符用于 "..."
  return `${str.slice(0, keepLength)}...${str.slice(-keepLength)}`;
}

// bigint除法保留小数位
export const divideBigIntWithDecimal = (a: bigint, b: bigint, decimalPlaces: number): string => {
  // 将 BigInt 转为 Decimal 类型
  const decimalA = new Decimal(a.toString());
  const decimalB = new Decimal(b.toString());
  
  // 执行除法并保留指定小数位
  const result = decimalA.div(decimalB).toFixed(decimalPlaces);
  return result.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
}