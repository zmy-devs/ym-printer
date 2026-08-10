import { join } from 'path';

// 应用资源目录
const resourcesPath = join(__dirname, '../../resources');

// PDF 文件缓存目录
export const cachePath = join(resourcesPath, 'cache');
