import {
  exec as execWithCallback,
  execFile as execFileWithCallback,
} from 'child_process';

// Shell 命令执行结果
interface ExecResult {
  stdout: string;
  stderr: string;
}

// 将回调式 Shell 命令执行封装为 Promise
export const exec = (command: string) => {
  return new Promise<ExecResult>((resolve, reject) => {
    execWithCallback(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
};

// 将回调式文件命令执行封装为 Promise
export const execFile = (file: string, args: string[]) => {
  return new Promise<ExecResult>((resolve, reject) => {
    execFileWithCallback(file, args, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
};
