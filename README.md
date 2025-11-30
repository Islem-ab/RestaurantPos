# 🍕 Restaurant POS System

A modern Point of Sale system for restaurants built with React Native (Expo) and Node.js.

![Demo](demo.gif)

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript**
- **Expo Router** for navigation
- **AsyncStorage** for local data persistence

### Backend
- **Node.js** with Express
- **MySQL** database
- **RESTful API**

## ✨ Features

- 📱 Create and manage orders
- 🔄 Real-time order tracking
- 📊 Order history with filtering
- ✏️ Edit existing orders
- 🖨️ Generate PDF receipts
- 🗂️ Category-based menu filtering
- 💾 Local data storage

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MySQL installed and running
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

1. **Create database**:
```bash
mysql -u root -p
source backend/database.sql
```

2. **Install dependencies**:
```bash
cd backend
npm install
```

3. **Start server**:
```bash
npm start
```
Backend runs on `http://localhost:3000`

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
npx expo install expo-sharing
```

2. **Start app**:
```bash
npx expo start
```

3. **Run on device**:
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app

## 📁 Project Structure

```
Caisseresto/
├── backend/
│   ├── server.js          # Express server
│   ├── db.js              # MySQL connection
│   ├── database.sql       # Database schema
│   └── routes/
│       ├── menus.js       # Menu API endpoints
│       └── orders.js      # Orders API endpoints
│
└── frontend/
    ├── app/(tabs)/        # App screens
    └── src/
        ├── components/    # Reusable components
        ├── storage/       # Local storage logic
        └── utils/         # Helper functions
```

## 🔌 API Endpoints

### Menus
- `GET /api/menus` - Get all menu items
- `POST /api/menus` - Create menu item
- `PUT /api/menus/:id` - Update menu item
- `DELETE /api/menus/:id` - Delete menu item

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## 💾 Database Schema

**Tables:**
- `menus` - Menu items (id, name, price, category, image)
- `orders` - Orders (id, date, total)
- `order_items` - Order details (order_id, menu_item_id, name, price, quantity)

## 📝 License

MIT

## 👤 Author

Islem-Ab

---

Made with ❤️ for restaurants
