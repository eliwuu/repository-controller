export type Sorting<U = -1 | 1> = "asc" | "desc" | U;

export interface Sort<TDocument, TSorting = void> {
  field: keyof TDocument;
  by: Sorting<TSorting>;
}
