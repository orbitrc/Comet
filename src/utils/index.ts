import fs from 'fs'
import child_process from 'child_process'
import { basename, dirname } from 'path'

import { COMET_GIT_ROOT } from '@/vars'
import {
  TreeContent,
} from '@/types'

export function gitVersion(): string {
  const cmd = 'git --version';
  const output = child_process.execSync(cmd, { encoding: 'utf-8' });

  return output.trim();
}

export function listOrgs(): string[] {
  const ls = fs.readdirSync(COMET_GIT_ROOT);
  const orgs = ls.filter(file => {
    return file.endsWith('.org');
  });
  const organizations = ls.filter(file => {
    return orgs.includes(file + '.org');
  });

  return organizations;
}

export function listRepos(org: string): string[] {
  const ls = fs.readdirSync(`${COMET_GIT_ROOT}/${org}`);
  const repos = ls.filter(dir => {
    return dir.endsWith('.git');
  });
  const repositories = repos.map(repo => {
    return repo.replace('.git', '');
  });

  return repositories;
}

export function listBranches(repo: string): string[] {
  const path = `${COMET_GIT_ROOT}/${repo}.git`;
  const cmd = `cd ${path} && git branch`;
  const output = child_process.execSync(cmd, { encoding: 'utf-8' });
  const lines = output.split('\n');
  return lines.map(line => {
    line = line.replace('*', '');
    return line.trim();
  });
}

export function getHeadBranch(repo: string): string {
  const path = `${COMET_GIT_ROOT}/${repo}.git`;
  const cmd = `cd ${path} && git branch --show-current`;
  const output = child_process.execSync(cmd, { encoding: 'utf-8' });

  return output.trim();
}

function lsTree(repo: string, ref: string): TreeContent[] | null {
  const gitPath = `${COMET_GIT_ROOT}/${repo}.git`;
  const cmd = `cd ${gitPath} && git ls-tree ${ref}`;
  try {
    const output = child_process.execSync(cmd, { encoding: 'utf-8' });
    const lines = output.split('\n');

    let treeContents: TreeContent[] = [];
    lines.forEach(line => {
      // Ignore empty line.
      if (line.trim() === '') {
        return;
      }
      const m = line.match(/([0-9]*) *([a-z]*) *([0-9a-f]*)[ \t]*(.*)/);
      if (m === null) {
        return;
      }
      treeContents.push({
        mode: m[1],
        type: m[2] as 'tree' | 'blob',
        hash: m[3],
        name: m[4],
      });
    });

    return treeContents;
  } catch {
    return null;
  }
}

export function lsTreePath(repo: string, branch: string, path: string): TreeContent[] | null {
  const rootTree = lsTree(repo, branch);
  if (rootTree === null) {
    return null;
  }
  let tree = rootTree;
  let p = path;
  while (p !== '') {
    const curPath = p.split('/')[0];
    const found = tree.find(content => {
      return content.name === curPath;
    });
    if (!found) {
      return null;
    }
    const hash = found.hash;
    const newTree = lsTree(repo, hash);
    if (newTree === null) {
      return null;
    }
    tree = newTree;

    p = p.replace(curPath, '');
    if (p.startsWith('/')) {
      p = p.replace('/', '');
    }
  }

  return tree;
}

/**
 * git cat-file
 * @param repo Repository. e.g. `'myorg/myrepo'`.
 * @param ref Ref. Specifically hash.
 * @returns Blob string or null.
 */
function catFile(repo: string, ref: string): string | null {
  const gitPath = `${COMET_GIT_ROOT}/${repo}.git`;
  const cmd = `cd ${gitPath} && git cat-file blob ${ref}`;
  try {
    const output = child_process.execSync(cmd, { encoding: 'utf-8' });

    return output;
  } catch {
    return null;
  }
}

export function catFilePath(repo: string, branch: string, path: string): string | null {
  const filename = basename(path);
  const dir = dirname(path);
  const relpath = (dir === branch) ? '' : dir.replace(`${branch}/`, '');

  const tree = lsTreePath(repo, branch, relpath);
  if (tree === null) {
    return null;
  }

  const found = tree.find(item => {
    return item.name === filename;
  });
  if (!found) {
    return null;
  }

  const hash = found.hash;

  const content = catFile(repo, hash);

  return content;
}

/**
 * Create a new repository.
 * @param repo Repository. e.g.: 'myorg/myrepo'.
 * @returns True or false.
 */
export function createNewRepo(repo: string): boolean {
  const gitPath = `${COMET_GIT_ROOT}/${repo}.git`;

  const cmd = `mkdir ${gitPath}`;

  try {
    child_process.execSync(cmd, { encoding: 'utf-8' });

    const initCommand = `cd ${gitPath} && git init --bare -b main`;

    try {
      child_process.execSync(initCommand, { encoding: 'utf-8' });

      return true;
    } catch {
      return false;
    }
  } catch {
    return false;
  }
}
