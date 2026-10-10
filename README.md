# Smart Inventory

Full-stack inventory management app with role-based access. Managers control the product catalog; employees can view products and record stock changes. A dashboard shows total products, low-stock items, and total inventory value.

**Live demo:** TODO-add-link  
**Note:** the backend runs on a free tier, so the first request after a period of inactivity can take up to a minute.

![Dashboard](docs/dashboard.png)
![Products](docs/products.png)

## Features

- **Role-based access:** Managers can create, edit, and delete products; Employees can view products and adjust stock.
- **Secure authentication:** bcrypt password hashing, JWT stored in an httpOnly cookie, protected routes on both the API and the frontend.
- **Race-safe stock updates:** stock changes are applied atomically in the database, so concurrent requests can never push stock below zero.
- **Dashboard:** total products, low-stock count, and total inventory value.
- **Search:** filter products by name.
- **Validation everywhere:** all API input is validated with Zod and errors are shown clearly in the UI.
- **API hardening:** rate limiting on login and registration, Helmet security headers, CORS restricted to the configured frontend, request size limits, and startup checks for required configuration.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB Atlas, Mongoose |
| Auth & security | JWT (httpOnly cookie), bcrypt, Helmet, express-rate-limit |
| Validation | Zod |

## Roles and permissions

| Action | Employee | Manager |
|---|:-:|:-:|
| View products and dashboard | ✅ | ✅ |
| Adjust stock | ✅ | ✅ |
| Create, edit, delete products | ❌ | ✅ |

New accounts registered through the app are Employees. Managers are created with a script (see setup).

## Demo accounts

| Role | Username | Password |
|---|---|---|
| Manager | TODO | TODO |
| Employee | TODO | TODO |

## Project structure

```
smart-inventory/
├── backend/
│   └── src/
│       ├── config/        # database connection
│       ├── controllers/   # request handlers
│       ├── middleware/    # auth, validation, rate limiting, error handling
│       ├── models/        # Mongoose schemas (User, Product)
│       ├── routes/        # route definitions
│       ├── scripts/       # createManager script
│       └── types/         # Zod schemas and TypeScript types
└── frontend/
    └── src/
        ├── app/           # pages (login, register, dashboard, products)
        ├── components/    # Navbar, ProductForm
        ├── context/       # AuthContext
        └── lib/           # API client
```

## API overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create an Employee account |
| POST | `/auth/login` | Public | Log in (sets httpOnly cookie) |
| POST | `/auth/logout` | Public | Clear the cookie |
| GET | `/auth/me` | Logged in | Current user |
| GET | `/products` | Logged in | List products |
| GET | `/products/:id` | Logged in | Get one product |
| POST | `/products` | Manager | Create a product |
| PUT | `/products/:id` | Manager | Replace a product |
| PATCH | `/products/:id` | Manager | Update name, price, or category |
| PATCH | `/products/:id/stock` | Logged in | Add or remove stock (atomic) |
| DELETE | `/products/:id` | Manager | Delete a product |

## Running locally

**Requirements:** Node.js 20+ and a MongoDB database (a free MongoDB Atlas cluster works).

### Backend

```bash
cd backend
npm install
cp .env.example .env     # on Windows: copy .env.example .env
```

Fill in `.env`, then create a manager account and start the server:

```bash
npm run create-manager   # uses MANAGER_USERNAME and MANAGER_PASSWORD from .env
npm run dev              # http://localhost:5000
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string (32+ characters) |
| `CLIENT_URL` | Frontend origin(s) allowed by CORS, comma-separated |
| `PORT` | Server port (default 5000) |
| `NODE_ENV` | Set to `production` when deployed (enables secure cookies) |
| `DNS_SERVERS` | Optional, e.g. `8.8.8.8` if your network blocks Atlas DNS lookups |
| `MANAGER_USERNAME`, `MANAGER_PASSWORD` | Only used by `npm run create-manager` |

Production build: `npm run build`, then `npm start`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev              # http://localhost:3000
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL, e.g. `http://localhost:5000` |

## Design decisions

- **Atomic stock updates.** Removing stock uses a single conditional database update (`stock >= amount`) instead of read-then-write, so two simultaneous requests can never oversell. Insufficient stock returns a clear 409 error.
- **Stock is only changed through the stock endpoint.** The product edit form cannot send a stock value, so editing a product can never overwrite a change someone else just made.
- **httpOnly cookies instead of localStorage.** The token is not readable from JavaScript, which protects it from XSS. Cookies use `Secure` and `SameSite=None` in production for the cross-domain setup.
- **Server-side validation with Zod.** Unknown fields are rejected, strings are trimmed, usernames are normalized to lowercase, and passwords are limited to bcrypt's 72-byte maximum.
- **Known tradeoff.** The user's role is read from the token, so a demoted user keeps their old role until the token expires (1 day).

## Possible improvements

- Server-side search and pagination
- Stock-change history (who changed what, and when)
- Automated tests