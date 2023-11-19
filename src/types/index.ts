interface TreeContent {
  mode: string;
  type: 'blob' | 'tree';
  hash: string;
  name: string;
}

export type {
  TreeContent,
}
