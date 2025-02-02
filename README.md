# Buyzio

> Discover a world of premium products and seamless shopping at Buyzio. From trending items to everyday essentials.

eCommerce platform offering secure authentication and multiple payment options. Built with Next.js, TypeScript and PostgreSQL, it ensures efficiency, reliability and a smooth user experience.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Screenshot](#screenshot)
- [Features](#features)
- [Usage](#usage)
- [Deployment](#deployment)
- [License](#license)

## Live Demo

- Experience Buyzio live on [Vercel](https://buyzio.vercel.app/).

## Screenshot

![Screenshot](/public/screens/home.png)

---

## Features

### Core Features

- Authentication
- Admin area with stats and charts
- Order, product and user management
- User area with profile and orders
- Stripe API integration
- PayPal integration
- Cash on delivery and bank transfer options
- Interactive checkout process
- Email notification after payment
- Featured products with banners
- Multiple images for products
- Ratings & reviews system
- Search form (customer and admin)
- Sorting, filtering and pagination
- Deals countdown
- Dark and light mode

### Technologies Used

Buyzio is built using the latest technologies:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn](https://ui.shadcn.com/)
- [Auth.js](https://authjs.dev/)
- [Prisma](https://www.prisma.io/)
- [Neon](https://neon.tech/)
- [Recharts](https://recharts.org/)
- [uploadthing](https://uploadthing.com/)
- [Resend](https://resend.com/)
- [zod](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

---

## Usage

### Pre Requirements

#### PostgreSQL Database URL

Sign up for a free PostgreSQL database through Vercel. Log into Vercel and click on "Storage" and create a new Postgres database. Then add the URL.

#### Next Auth Secret

Generate a secret with the following command and add it to your `.env`:

```bash
openssl rand -base64 32
```

#### PayPal Client ID and Secret

Create a PayPal developer account and create a new app to get the client ID and secret.

#### Stripe Publishable and Secret Key

Create a Stripe account and get the publishable and secret key.

#### Uploadthing Settings

Sign up for an account at https://uploadthing.com/ and get the token, secret and app ID.

#### Resend API Key

Sign up for an account at https://resend.io/ and get the API key.

#### Install Dependencies

```bash
npm install
```

Note: Some dependencies may have not yet been upadated to support React 19. If you get any errors about depencency compatability, run the following:

```bash
npm install --legacy-peer-deps
```

#### Environment Variables

Create a `.env` file using the example and replace the values inside the square brackets with your own values.

```
NEXT_PUBLIC_APP_NAME=[APP_NAME]
NEXT_PUBLIC_SERVER_URL=[LOCALHOST OR SERVER URL AFTER DEPLOYMENT]
NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT=[DEFAULT: 4]

ENCRYPTION_KEY=[GENERATED ENCRYPTION KEY FOR USER PASSWORDS]

DATABASE_URL=[YOUR NEON DATABASE URL]

NEXTAUTH_SECRET=[GENERATED SECRET KEY]
NEXTAUTH_URL=[LOCALHOST OR SERVER URL AFTER DEPLOYMENT]
NEXTAUTH_URL_INTERNAL=[LOCALHOST OR SERVER URL AFTER DEPLOYMENT]

UPLOADTHING_TOKEN=[YOUR UPLOADTHING TOKEN]

PAYPAL_API_URL=[DEFAULT: "https://api-m.sandbox.paypal.com"]
PAYPAL_CLIENT_ID=[YOUR PAYPAL CLIENT ID]
PAYPAL_APP_SECRET=[YOUR PAYPAL SECRET]

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[YOUR STRIPE KEY]
STRIPE_SECRET_KEY=[YOUR STRIPE SECRET KEY]
STRIPE_WEBHOOK_SECRET=[YOUR STRIPE WEBHOOK KEY]

RESEND_API_KEY=[YOUR RESEND API KEY]
SENDER_EMAIL=[DEFAULT: onboarding@resend.dev]
```

#### Run

```bash

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm start

# Export static site
npm run export
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

#### Prisma Studio

To open Prisma Studio, run the following command:

```bash

npx prisma studio
```

Open [http://localhost:5555](http://localhost:5555) with your browser.

#### Seed Database

To seed the database with mock data, run the following command:

```bash
npx tsx ./mock/seed
```

### Deployment

1. Overwrite install command with the legacy peer flag if necessary:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Deploy your application to Vercel.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more details.
