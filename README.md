# 🚀 Digital Marketing Course Delivery Backend

Backend API responsible for managing course purchases, payment validation, automated email delivery, and transaction lifecycle management.

Built using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- Brevo Transactional Email API
- Node Cron
- CORS
- dotenv

---

# Project Purpose

This backend powers a digital course sales funnel.

Instead of instantly granting access after payment, the system follows a controlled verification workflow:

1. User submits email.
2. Transaction record is created.
3. User proceeds to payment.
4. User submits payment proof.
5. Admin manually verifies payment.
6. System automatically delivers course materials through email.
7. Expired transactions are automatically cancelled.

This prevents unauthorized access while keeping course delivery automated.

---

# System Architecture

```text
Customer
   │
   ▼
Submit Email
   │
   ▼
Create Payment Record
   │
   ▼
Status = pending
   │
   ▼
User Makes Payment
   │
   ▼
Status = inreview
   │
   ▼
Admin Reviews Payment
   │
   ├─────────────► Reject
   │                 │
   │                 ▼
   │            Status = rejected
   │
   ▼
Approve
   │
   ▼
Status = successful
   │
   ▼
Email Queue Created
   │
   ▼
Cron Job Detects Queue
   │
   ▼
Brevo Sends Email
   │
   ▼
Email Marked As Sent
```

---

# Core Features

## Email Collection

Endpoint:

```http
POST /email
```

Creates a payment transaction and stores:

- User email
- Payment amount
- Creation date
- Expiration time
- Validation status

Initial transaction state:

```json
{
  "status": "pending",
  "validated": false
}
```

---

## Payment Validation Workflow

Endpoint:

```http
POST /validate/payment/user
```

When a user submits proof of payment:

Transaction state changes from:

```text
pending
```

to:

```text
inreview
```

Only active non-expired transactions can be moved into review.

---

## Admin Approval System

Endpoint:

```http
POST /validate/payment/paid/admin
```

Admin manually approves payment.

The system:

1. Updates transaction status.
2. Marks transaction as validated.
3. Creates email queue entry.
4. Waits for cron processor.

Updated transaction:

```json
{
  "status": "succesful",
  "validated": true
}
```

---

## Admin Rejection System

Endpoint:

```http
POST /validate/payment/reject/admin
```

Allows administrators to reject invalid payments.

Updates transaction:

```json
{
  "status": "rejected",
  "validated": false
}
```

---

# Automated Email Delivery

Email delivery is handled using:

```javascript
@getbrevo/brevo
```

The system sends:

- Course access link
- PDF download
- WhatsApp community access
- Training resources

Emails are not sent immediately.

Instead they are queued for processing.

---

# Email Queue System

Collection:

```text
validatedEmail
```

Structure:

```json
{
  "email": "customer@example.com",
  "emailSent": false
}
```

This allows reliable delivery even if email providers temporarily fail.

---

# Cron Job Processor

Runs every minute.

```javascript
cron.schedule("* * * * *");
```

Responsibilities:

### 1. Cancel Expired Payments

Finds:

```json
{
  "status": "pending",
  "expiresAt": {
    "$lte": "currentTime"
  }
}
```

Automatically updates:

```json
{
  "status": "rejected"
}
```

---

### 2. Send Pending Emails

Finds:

```json
{
  "emailSent": false
}
```

For each record:

1. Sends course access email.
2. Confirms success.
3. Marks email as delivered.

Updates:

```json
{
  "emailSent": true
}
```

---

# Database Models

## Payment Transactions

Stores:

- Email
- Amount
- Status
- Expiration Date
- Validation State

Lifecycle:

```text
pending
   │
   ▼
inreview
   │
   ▼
successful
```

or

```text
pending
   │
   ▼
rejected
```

---

## Validated Emails

Stores email delivery queue information.

Fields:

```javascript
{
  email: String,
  emailSent: Boolean
}
```

---

# Environment Variables

Required:

```env
DataBaseUrl=mongodb://...

BREVO_API_KEY=your_api_key

Email_USER=sender@email.com
```

---

# API Endpoints

## Create Transaction

```http
POST /email
```

---

## Submit Payment For Review

```http
POST /validate/payment/user
```

---

## Get All Transactions

```http
GET /all/payment/transactions
```

---

## Approve Payment

```http
POST /validate/payment/paid/admin
```

---

## Reject Payment

```http
POST /validate/payment/reject/admin
```

---

# Security Considerations

Current implementation includes:

- Email validation
- Expiration-based payment control
- Duplicate validation prevention
- Transaction state management

Future improvements:

- Admin authentication
- JWT authorization
- Rate limiting
- Request logging
- Email verification
- Payment gateway integration
- HTTPS enforcement

---

# Future Roadmap

- Flutterwave Integration
- Paystack Integration
- Automatic Payment Verification
- Admin Dashboard
- Analytics System
- Email Templates Database
- Transaction History Search
- Course Access Tokens
- User Accounts
- Download Tracking

---

# Author

Victory

Built as part of a digital product sales and delivery ecosystem designed to automate course fulfillment while maintaining manual payment verification control.
