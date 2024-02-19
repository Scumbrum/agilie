export interface IGIF {
  id: string;
  title: string;
  import_datetime: string;
  images: {
    original: {
      url: string;
    }
  }
}

export interface IPaginatorData<T> {
  data: T,
  pagination: {
    count: number;
    offset: number;
    total_count: number;
  }
}
