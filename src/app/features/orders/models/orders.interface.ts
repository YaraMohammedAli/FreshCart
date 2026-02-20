export interface Order {
  _id: string;
  totalOrderPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  shippingAddress: {
    city: string;
    street: string;
    phone: string;
    postalCode: string;
    country: string;
  };
  orderItems: OrderItem[];
  user: User;
}

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    quantity: number;
    imageCover: string;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}
