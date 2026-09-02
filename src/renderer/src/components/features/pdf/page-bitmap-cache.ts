// 页面位图缓存项
type PageBitmapCacheEntry = {
  bitmap: ImageBitmap;
  bytes: number;
};

// 创建受内存预算约束的页面位图 LRU 缓存
export const createPageBitmapCache = (maxBytes: number) => {
  // 按最近访问顺序保存的页面位图
  const entries = new Map<string, PageBitmapCacheEntry>();

  // 当前缓存占用的估算字节数
  const state = {
    totalBytes: 0,
  };

  // 释放指定缓存项持有的位图内存
  const releaseEntry = (entry: PageBitmapCacheEntry) => {
    entry.bitmap.close();
    state.totalBytes -= entry.bytes;
  };

  // 淘汰最久未使用的位图直到满足内存预算
  const trim = () => {
    while (state.totalBytes > maxBytes && entries.size > 0) {
      // 最久未使用的缓存项
      const oldestEntry = entries.entries().next().value;

      if (!oldestEntry) {
        return;
      }

      const [key, entry] = oldestEntry;
      entries.delete(key);
      releaseEntry(entry);
    }
  };

  // 获取页面位图并将其移动到最近使用位置
  const get = (key: string) => {
    // 当前缓存键对应的页面位图
    const entry = entries.get(key);

    if (!entry) {
      return;
    }

    entries.delete(key);
    entries.set(key, entry);

    return entry.bitmap;
  };

  // 保存页面位图并执行超额淘汰
  const set = (key: string, bitmap: ImageBitmap) => {
    // 当前缓存键原有的页面位图
    const existingEntry = entries.get(key);

    if (existingEntry) {
      entries.delete(key);
      releaseEntry(existingEntry);
    }

    // 位图 RGBA 像素占用的估算字节数
    const bytes = bitmap.width * bitmap.height * 4;

    entries.set(key, { bitmap, bytes });
    state.totalBytes += bytes;
    trim();
  };

  // 释放缓存中的全部页面位图
  const clear = () => {
    entries.forEach(releaseEntry);
    entries.clear();
    state.totalBytes = 0;
  };

  return {
    clear,
    get,
    set,
  };
};
