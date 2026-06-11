import { useOrderStore } from '@/stores/orderStore';
import { useCommissionStore } from '@/stores/commissionStore';
import { useDesignerStore } from '@/stores/designerStore';
import type { Order } from '@/types';

/**
 * Submit an order and auto-create a commission record if the order
 * uses a designer's artwork.
 */
export async function submitOrderWithCommission(
  orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const orderId = await useOrderStore.getState().addOrder(orderData);

  if (orderData.designerId && orderData.artworkId) {
    const designer = useDesignerStore.getState().getDesignerById(orderData.designerId);
    const rate = designer?.commissionRate ?? 0;
    const commissionAmount = orderData.amount * rate;

    if (commissionAmount > 0) {
      await useCommissionStore.getState().createCommission({
        orderId,
        designerId: orderData.designerId,
        designerName: orderData.designerName || designer?.name || '',
        artworkId: orderData.artworkId,
        artworkName: orderData.artworkName || '',
        orderAmount: orderData.amount,
        commissionAmount,
        status: 'pending',
        paidAt: null,
      });
    }
  }

  return orderId;
}
