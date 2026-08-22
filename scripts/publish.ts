import { useGiteeReleases, useGithubReleases } from 'ym-release';
import { join } from 'path';
import { readFileSync } from 'fs';
import { name, version } from '../package.json';

const __dirname = import.meta.dirname;
const { GITEE_TOKEN, GH_TOKEN } = process.env;

if (!GITEE_TOKEN || !GH_TOKEN) {
  throw new Error('未找到 GITEE_TOKEN 或 GH_TOKEN');
}

const giteeRelease = useGiteeReleases({
  token: GITEE_TOKEN,
  repo: name,
  owner: 'zmy-devs',
});

const githubRelease = useGithubReleases({
  token: GH_TOKEN,
  repo: name,
  owner: 'zmy-devs',
});

const getReleaseNotes = (releaseVersion: string) => {
  const notes = readFileSync(
    join(__dirname, '../docs/release-note.md'),
    'utf8',
  );
  const match = notes.match(
    new RegExp(`## ${releaseVersion}([\\s\\S]*?)(?=\\n## |$)`),
  );

  return match?.[1].trim() || '发布第一个版本';
};

const main = async () => {
  const body = getReleaseNotes(version);
  const files = [
    join(__dirname, '../dist/latest.yml'),
    join(__dirname, `../dist/${name}-${version}.exe`),
    join(__dirname, `../dist/${name}-${version}.exe.blockmap`),
  ];

  await giteeRelease({ version, body, files });
  await githubRelease({ version, body, files });
};

main();
