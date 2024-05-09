interface PageNode<T> {
  name: String;
  children?: PageNode<T>[];
}

export class Page<T> {
  public root: Readonly<PageNode<T>>;

  constructor(node: PageNode<T> = { name: "Page", children: [] }) {
    this.root = node;
  }

  public insert(node: PageNode<T>, parent: PageNode<T> = this.root): void {
    parent.children?.push(node);
  }
}
