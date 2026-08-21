import { basename, extname } from 'path';
import { getMd5 } from './md5';
import type { Doc } from '@type';
import { nanoid } from 'nanoid';

// 主进程解析后、尚未关联分组的文档数据
export type ParsedDoc = Omit<Doc, 'groupId'>;

//解析文档
export const parseDoc = async (path: string): Promise<ParsedDoc> => {
  //名称
  const name = basename(path);

  //后缀
  const ext = extname(path).slice(1);

  //md5
  const md5 = await getMd5(path);

  //唯一id
  const id = nanoid();

  return {
    id,
    name,
    path,
    md5,
    ext,
    pageCount: 0,
    status: 'loading',
  };
};
