import dotenv from 'dotenv';

dotenv.config();

import { Resend } from 'resend';

import PurchaseReceipt from '@/email/purchase-receipt';

import { APP_NAME, SENDER_EMAIL } from '@/constants';

import type { Order } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation - Order ID: ${order.id}`,
    react: <PurchaseReceipt order={order} />,
  });
};
