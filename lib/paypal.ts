const API = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

export const paypal = {
  createOrder: async (price: number) => {
    const accessToken = await generateAccessToken();
    const url = `${API}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: price,
            },
          },
        ],
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const message = await response.text();

      throw new Error(message);
    }
  },

  capturePayment: async (id: string) => {
    const accessToken = await generateAccessToken();
    const url = `${API}/v2/checkout/orders/${id}/capture`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      const message = await response.text();

      throw new Error(message);
    }
  },
};

const generateAccessToken = async () => {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    'base64'
  );

  const response = await fetch(`${API}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (response.ok) {
    const data = await response.json();

    return data.access_token;
  } else {
    const message = await response.text();

    throw new Error(message);
  }
};
