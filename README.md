
# 🌱 AgriNova — Smart Agriculture & Digital Farming Platform

<p align="center">
  <strong>Grow Smarter, Farm Better.</strong><br />
  A modern, production-oriented AgriTech platform connecting farmers, agricultural experts, marketplaces, investment opportunities, AI assistance, community services, and B2B agricultural supply workflows.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.1-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0B1F2A" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/AI-Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</p>

---

## 🌾 About AgriNova

**AgriNova** is an integrated **Smart Agriculture & Digital Farming Platform** designed for the agricultural ecosystem of Bangladesh.

Instead of forcing farmers to depend on disconnected tools for farming information, marketplace activity, expert advice, AI assistance, financial records, investment opportunities, community interaction, and produce supply, AgriNova brings these services together in one centralized platform.

The system supports three primary roles:

- 👨‍🌾 **Farmer**
- 🧑‍🔬 **Expert**
- 🛡️ **Admin**

AgriNova focuses on practical agricultural workflows, secure role-based access, modern UI/UX, AI-assisted farming support, commerce, consultation, and scalable full-stack architecture.

---

## 👥 Development Team

| Team Member | Role | GitHub |
|---|---|---|
| **Rasel Ahmed** | **Team Leader** | [raselahmed2023](https://github.com/raselahmed2023) |
| **Md Rayhan ul Fardous** | Core Developer | [rayhan-fardous](https://github.com/rayhan-fardous)|
| **Shariea Reza Nabil** | Core Developer | [Nabil593](https://github.com/Nabil593) |
| **Abdul Korim** | Core Developer | [abdul-korim-web](https://github.com/abdul-korim-web) |
| **Naymul Islam Antor** | Core Developer | [devnaymul247](https://github.com/devnaymul247) |

---

## 🌟 Why AgriNova Stands Out

### 🌱 Integrated Agricultural Ecosystem

AgriNova combines farming tools, AI assistance, marketplace commerce, expert consultation, financial tracking, investment, community interaction, agricultural blogs, and B2B supply support in one platform.

### 🛒 Farmer-First Marketplace

Farmers can operate as both **buyers and sellers** without requiring a separate seller account.

### 🧑‍🔬 Paid Expert Consultation

Farmers can browse approved Experts, check availability, select a valid consultation slot, complete Stripe payment, and join scheduled video consultations.

### 🤖 AI-Powered Agricultural Assistance

AgriNova provides AI-assisted crop disease analysis, agricultural Q&A, farming recommendations, and additional intelligent support.

### 🚚 B2B Produce Supply Support

Farmers can submit agricultural produce directly to AgriNova and securely track their requests using server-generated tracking IDs.

### 💬 Farmer Community

Farmers can share agricultural experiences, create posts, upload images, like posts, comment, reply, and interact with the farming community.

### 💰 Agricultural Investment

Farmers can create agricultural investment projects while investors can explore approved projects and submit investment applications.

### 🔐 Production-Oriented Security

The system uses protected APIs, role-based authorization, server-side ownership checks, validation, secure payments, protected routes, and safe production error handling.

---

# 🚀 Core Features

## 👨‍🌾 1. Farmer Experience

Farmers can access:

- Farmer Dashboard
- Farm Management
- Weather Information
- AI Farming Assistant
- Smart Farming Recommendations
- Crop Disease Image Analysis
- Financial Tracking
- Agricultural Marketplace
- Cart & Checkout
- Buyer Orders
- Seller Orders
- Expert Consultation
- Agricultural Investment
- Farmer Community
- B2B Produce Submission
- Notifications

---

## 🏡 2. Farm Management

Farmers can create and manage their farms.

Farm information may include:

- Farm Name
- Farm Type
- Division
- District
- Upazila
- Land Area
- Land Unit
- Soil Type
- Description
- Cover Image
- Farm Status

Farm operations are protected and linked to the authenticated Farmer.

---

## 🌦️ 3. Weather Information

AgriNova provides agricultural weather information using configured weather services.

Weather information may include:

- Temperature
- Humidity
- Rainfall Information
- Wind
- Forecast Information
- Agricultural Weather Conditions

Weather data is intended to support farming decisions and should not be treated as a guaranteed agricultural outcome.

---

## 🤖 4. AI Agricultural Assistance

AgriNova includes multiple AI-supported agricultural tools.

### AI Farming Assistant

Authenticated Farmers can ask agriculture-related questions.


### Crop Disease Detection

Farmers can upload crop or leaf images for AI-assisted analysis.

The system may provide:

- Possible Disease
- Symptoms
- Possible Causes
- Recommended Actions
- Prevention Suggestions

### Smart Farming Recommendation

Farmers can request recommendations using agricultural context and submitted information.

### Public Agricultural Assistant

AgriNova may provide a limited public agricultural assistant without exposing private Farmer information.

> AI output is designed to assist decision-making and should not be treated as a guaranteed diagnosis.

---

# 🛒 Agricultural Marketplace

AgriNova includes a complete agricultural marketplace where Farmers can operate as both buyers and sellers.

## Marketplace Features

- Public Product Browsing
- Product Search
- Product Filtering
- Product Details
- Farmer Product Publishing
- Edit Own Products
- Delete Own Products
- Product Images
- Shopping Cart
- Checkout
- Shipping Information
- Order Creation
- Buyer Order History
- Seller Order Management
- Fulfillment Status Updates
- Stripe Payment
- Admin Marketplace Moderation

Marketplace listings do not require normal Admin pre-approval.

Admins can remove inappropriate or policy-violating listings when required.

---

# 📦 Orders & Fulfillment

AgriNova separates Buyer and Seller order workflows.

## Buyer

Buyers can:

- Create Orders
- View Own Orders
- View Order Details
- Complete Supported Payment
- Track Order Status

## Seller

Sellers can:

- View Orders Related to Their Own Products
- Manage Fulfillment
- Update Supported Statuses


---

# 🧑‍🔬 Expert Consultation System

AgriNova provides a structured Farmer-to-Expert agricultural consultation workflow.

## Expert Directory

Public users and Farmers can browse approved agricultural Experts.


## 🗓️ Expert Availability

Experts can configure weekly availability.

The system validates the actual configured availability before accepting consultation schedules.


---

# 🎥 Video Consultation

AgriNova uses **Jitsi Meet** for supported Farmer-Expert video consultations.

Meeting links become available according to consultation payment and scheduling conditions.

---

# 💰 Farmer Finance

Farmers can maintain personal farming financial records.

Supported operations include:

- Create Transaction
- View Transactions
- Update Transaction
- Delete Transaction
- Track Expenses
- Track Revenue

The Finance module is intended for farm-management records and does not represent professional accounting advice.

---

# 📈 Agricultural Investment

AgriNova includes agricultural investment functionality.

## Farmer Project Owner

Farmers can:

- Create Investment Projects
- View Own Projects
- Update Projects
- Delete Projects Where Allowed
- Track Funding Progress

Project information may include:

- Project Name
- Category
- Required Investment
- Minimum Investment
- Funded Amount
- Duration
- Projected Return
- Location
- Description
- Use of Funds
- Project Image
- Supporting Documents


---

## Investor Features

Authenticated Farmers can:

- Browse Approved Investment Projects
- View Project Details
- Submit Investment Applications
- View Own Applications
- Submit Supported Payments

---

# 💬 AgriNova Community

AgriNova includes a Farmer-focused social Community.

## Public Visitors

Public users can read Community posts.

## Farmers

Authenticated Farmers can:

- Create Posts
- Upload Images
- Edit Own Posts
- Delete Own Posts
- Like / Unlike
- Comment
- Reply
- View Farmer Profiles
- Manage Community Profile


---

# 📝 Agricultural Blog

AgriNova includes an Expert-authored agricultural Blog system.

## Public Users

Can:

- Browse Published Blogs
- Open Blog Details
- Read Agricultural Articles

## Experts

Experts can:

- Create Blogs
- Upload Blog Images
- Edit Own Blogs
- Delete Own Blogs
- View Own Content

Only Experts can create normal Expert-authored agricultural blog posts.

---

# 🚚 B2B Supply Chain

AgriNova provides a Farmer-to-AgriNova produce submission workflow.

Farmers can submit agricultural produce to AgriNova for buyer, business, or industry connection.

## Access Rules

```text
Public Information          ✅
Farmer Submission           ✅
Farmer Tracking             ✅
Guest Submission            ❌
Public Tracking             ❌
OTP Tracking                ❌
```

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────────────┐
│        Public / Farmer / Expert / Admin      │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│              Next.js Web Client              │
│       React • TypeScript • Tailwind CSS      │
└───────────────────────┬──────────────────────┘
                        │
                        │ HTTPS / REST API
                        ▼
┌──────────────────────────────────────────────┐
│              Express API Server              │
│ Authentication • RBAC • Validation • Logic  │
└─────────────┬─────────────┬────────────┬─────┘
              │             │            │
              ▼             ▼            ▼
          MongoDB        Stripe       AI Services
              │
              │
              └──────────────┐
                             ▼
                    Notifications
                    Business Workflows

Expert Consultation
        ↓
    Jitsi Meet
```

---

# 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | Next.js 16.3.1, React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Forms** | React Hook Form |
| **Validation** | Zod |
| **Charts** | Recharts |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB, Mongoose |
| **Authentication** | Better Auth-compatible authentication, Bearer Token, JWKS Verification |
| **Payments** | Stripe |
| **AI** | Google Gemini / configured AI providers |
| **Video Consultation** | Jitsi Meet |
| **Image Handling** | Remote Image Upload + Supported Local Fallback |
| **Deployment** | Next.js-compatible frontend hosting, Node.js backend hosting, MongoDB Atlas |

---

# ⚙️ Getting Started

## Prerequisites

Make sure the following are installed:

```text
Node.js 20+
npm
MongoDB / MongoDB Atlas
Git
```

You will also need credentials for the external services enabled in your deployment.

---

# 📥 Clone the Project

## Client

```bash
git clone <YOUR_CLIENT_REPOSITORY_URL>
cd agrinova-client
npm install
```

## Server

```bash
git clone <YOUR_SERVER_REPOSITORY_URL>
cd agrinova-server
npm install
```

---

# 🔐 Environment Variables

## Client

Create:

```text
.env
```

Example:

```env
IMGBB_API_KEY=
NEXT_PUBLIC_SITE_URL=
RESEND_API_KEY=

AUTH_EMAIL_FROM=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=

BETTER_AUTH_URL=
MONGODB_URL=
BETTER_AUTH_SECRET=
```

---

## Server

Create:

```text
.env
```

Example:

```env
AUTH_BASE_URL
CLIENT_URL
GEMINI_API_KEY

GEMINI_API_KEY_1
GEMINI_API_KEY_2
GEMINI_API_KEY_3

GEMINI_DISEASE_MODEL
GROQ_API_KEY
GROQ_API_KEY_1
GROQ_API_KEY_3
GROQ_API_KEY_4
IMGBB_API_KEY

MARKETPLACE_COMMISSION_RATE
MARKETPLACE_DELIVERY_FEE
MONGODB_URL

NEXT_PUBLIC_INVESTMENT_BANK_ACCOUNT_NAME
NEXT_PUBLIC_INVESTMENT_BANK_ACCOUNT_NUMBER
NEXT_PUBLIC_INVESTMENT_BANK_BRANCH
NEXT_PUBLIC_INVESTMENT_BANK_NAME
NEXT_PUBLIC_SERVER_URL

OPENROUTER_API_KEY
OPENROUTER_API_KEY_1
OPENROUTER_API_KEY_2
OPENROUTER_API_KEY_3
OPENROUTER_API_KEY_4

PORT
STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
WEATHERAPI_KEY
```

---

# ▶️ Running Locally

## Start Backend

```bash
cd agrinova-server
npm run dev
```

## Start Frontend

```bash
cd agrinova-client
npm run dev
```

Open:

```text
http://localhost:3000
```


---

# 🖼️ Application Screenshots


 Screenshots:

```

<p align="center">
  <img src="https://github.com/user-attachments/assets/4021f37d-d220-4cc7-81c2-3389ee32e87a" alt="AgriNova Screenshot 1" width="900" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/1a186c58-741e-4437-b69f-53236032e02a" alt="AgriNova Screenshot 2" width="900" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/baa1a22f-cdc4-47a2-977e-c74efb9ae4cb" alt="AgriNova Screenshot 3" width="900" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/dfe8ea00-8a43-427e-8c26-2a1c9b837583" alt="AgriNova Screenshot 4" width="900" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/58b0ed91-8462-4e55-a65c-86f09da195ec" alt="AgriNova Screenshot 5" width="900" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/b6600cc8-2699-4ac7-b673-a6c36d2bdb40" alt="AgriNova Screenshot 6" width="900" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/feea8ec6-7456-4a38-907c-084776639ae5" alt="AgriNova Screenshot 7" width="900" />
</p>

```

---

# 🔭 Future Scope

Possible future improvements include:

- Bangla Localization
- Native Mobile Application
- AI Yield Prediction
- Advanced Crop Management
- Soil History Tracking
- Irrigation Scheduling
- Crop Activity Timeline
- Expanded Agricultural Knowledge Center
- Real-Time Farmer-Expert Messaging
- IoT Soil Sensors
- Automated Irrigation
- Satellite Crop Monitoring
- Drone-Based Monitoring
- Pest Prediction
- Agricultural Market Price Forecasting
- GPS Farm Mapping
- Agricultural Insurance Integration
- Advanced Logistics
- Voice-Based AI Assistant
- Bangla Speech Input / Output

---

<p align="center">
  <strong>🌱 AgriNova  Grow Smarter, Farm Better.</strong>
</p>
