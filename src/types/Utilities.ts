const bannedCharacters = /[&<>\"'\r\n]/g;

export function formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

export function convertArrayElements(array: number[]): { converted: string[]; targetUnit: string } {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  // 找到数组中的最大字节值
  const maxBytes = Math.max(...array);

  // 根据最大字节值计算最适合的单位
  const maxIndex = Math.min(4, Math.floor(Math.log(maxBytes || 1) / Math.log(1024)));
  const targetUnit = units[maxIndex];

  // 转换每个字节值到统一的单位
  const convertedArray = array.map(byteValue => {
    const i = Math.min(maxIndex, Math.floor(Math.log(byteValue || 1) / Math.log(1024)));
    return (byteValue / Math.pow(1024, maxIndex)).toFixed(2);
  });

  return { converted: convertedArray, targetUnit };
}

export function formatDuration(startTime: number): string {
    if (typeof startTime !== 'number' || startTime <= 0) {
      throw new Error('Invalid start time');
    }
  
    const now = Date.now();
    const duration = now - startTime;
  
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
  
    return [
      String(days).padStart(2, '0'),
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
    ].join(':');
};

export function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };
    return new Date(dateString).toLocaleDateString("zh-CN", options);
};

export function formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt);
    const chinaTime = new Date(date.getTime());
  
    const year = chinaTime.getFullYear();
    const month = String(chinaTime.getMonth() + 1).padStart(2, '0');
    const day = String(chinaTime.getDate()).padStart(2, '0');
    const hours = String(chinaTime.getHours()).padStart(2, '0');
    const minutes = String(chinaTime.getMinutes()).padStart(2, '0');
    const seconds = String(chinaTime.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export function checkName(name: string): boolean {
    return !bannedCharacters.test(name);
};