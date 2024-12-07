import { Order } from "@/types";
import { Separator } from "@radix-ui/react-separator";

type Props = {
  order: Order;
};

export default function OrderStatusDetail({ order }: Props) {
  console.log(order.totalAmount);

  return (
    <div className="space-y-5">
      <div className="flex flex-col">
        <span className="font-bold">
          Delivering to: <span>{order.deliveryDetails.name}</span>
          <span>
            {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
          </span>
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <ul>
          {order.cartItems.map((item, idx) => (
            <li key={idx}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="font-bold">Total</span>
        <span>${(order.totalAmount / 100).toFixed(2)}</span>
      </div>
    </div>
  );
}