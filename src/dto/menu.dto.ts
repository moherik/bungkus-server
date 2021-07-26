export interface MenuVariants {
  id: number;
  name: string;
  isSingle?: boolean;
  isRequired?: boolean;
  items: [{ id: number; name: string; price?: string }];
}

export interface CreateMenuPayload {
  title: string;
  order?: number;
}

export interface CreateMenuItemPayload {
  name: string;
  description?: string;
  price: number;
  discount?: number;
  imageUrl?: string;
  variants: MenuVariants[];
  order?: number;
}

export interface UpdateMenuPayload extends CreateMenuPayload {}

export interface UpdateMenuItemPayload extends CreateMenuItemPayload {}

export interface ReorderPayload {
  id: number;
  order: number;
}
