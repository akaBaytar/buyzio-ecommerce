import dotenv from 'dotenv';

dotenv.config();

import {
  Img,
  Row,
  Text,
  Body,
  Head,
  Html,
  Column,
  Heading,
  Preview,
  Section,
  Tailwind,
  Container,
} from '@react-email/components';

import { APP_NAME } from '@/constants';
import { formatCurrency, formatDate } from '@/lib/utils';

import type { Order } from '@/types';

const PurchaseReceipt = ({ order }: { order: Order }) => {
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <div className='flex justify-between items-center'>
              <Heading>Purchase Receipt</Heading>
              <Img
                width='40'
                alt={APP_NAME}
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/logo.svg`}
              />
            </div>
            <Section className='border border-solid border-gray-300 rounded-md p-5 my-5'>
              <Row>
                <Column>
                  <Text className='mb-0 me-5 text-gray-500 whitespace-nowrap text-nowrap'>
                    Order ID:
                  </Text>
                  <Text className='mt-0 me-5'>{order.id.toString()}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className='mb-0 me-5 text-gray-500 whitespace-nowrap text-nowrap'>
                    Purchase Date:
                  </Text>
                  <Text className='mt-0 me-5'>
                    {formatDate(order.createdAt).dateAndTime}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className='mb-0 me-5 text-gray-500 whitespace-nowrap text-nowrap'>
                    Total:
                  </Text>
                  <Text className='mt-0 me-5'>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className='border border-solid border-gray-300 rounded-md p-5 my-5'>
              {order.orderItems.map((item) => (
                <Row key={item.productId} className='mt-5'>
                  <Column className='w-20'>
                    <Img
                      width='80'
                      alt={item.name}
                      src={
                        item.image.startsWith('/')
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                      className='rounded-md me-2.5'
                    />
                  </Column>
                  <Column>
                    {item.name} x {item.qty}
                  </Column>
                  <Column align='right'>{formatCurrency(item.price)}</Column>
                </Row>
              ))}
              {[
                { name: 'Item(s)', price: order.itemsPrice },
                { name: 'Tax', price: order.taxPrice },
                { name: 'Shipping', price: order.shippingPrice },
                { name: 'Total', price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className='py-0.5'>
                  <Column align='right'>{name}: </Column>
                  <Column align='right' width={70}>
                    <Text className='m-0'>{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PurchaseReceipt;
