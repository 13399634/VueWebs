export function focus_idx(node: HTMLInputElement, index: number): void {
  node.focus();
  node.setSelectionRange(index, index);
}
