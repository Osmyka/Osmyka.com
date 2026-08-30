---
id: api-reference
title: REST API & Webhooks Reference
sidebar_label: REST API & Webhooks
sidebar_position: 1
---

# REST API & Webhooks Reference

The Osmyka platform exposes a lightweight, authenticated REST API and Webhook subscription system for integrating external accounting software, ERPs, inventory catalogs, and custom dashboards.

---

## 🔑 Authentication

All API requests must include your secret API key in the `Authorization` header:

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

---

## 📡 Endpoints

### 1. Create a New Booking
`POST /api/v1/bookings`

```json title="Request Payload"
{
  "serviceId": "svc_oil_filter_change",
  "clientName": "Alexandre Kallas",
  "clientPhone": "+372 555 12345",
  "clientEmail": "alex@example.ee",
  "vehiclePlate": "123 ABC",
  "requestedTimestamp": "2026-09-01T10:00:00Z",
  "notes": "Please also inspect front brake pads."
}
```

```json title="Response (201 Created)"
{
  "status": "confirmed",
  "bookingId": "bk_987654",
  "assignedLiftId": "lift-1",
  "scheduledTime": "2026-09-01T10:00:00Z",
  "smsSent": true
}
```

---

### 2. Query Work Order Status
`GET /api/v1/orders/{orderId}`

```json title="Response (200 OK)"
{
  "orderId": "wo_2026_0891",
  "plate": "123 ABC",
  "stage": "in_progress",
  "currentStep": "Engine oil draining & new filter replacement",
  "assignedMechanic": "Dmitri S.",
  "estimatedCompletion": "2026-09-01T11:30:00Z",
  "totalDueEur": 124.00,
  "vatIncludedEur": 24.00
}
```

---

## 🪝 Webhook Events

Configure webhook endpoints in your dashboard to receive real-time HTTP POST notifications when events occur:

| Event Name | Trigger Condition |
|---|---|
| `booking.created` | New appointment booked online by a customer |
| `order.status_changed` | Work order advanced to next stage (e.g. Diagnostics → Repairing) |
| `order.completed` | Quality check passed, invoice generated, ready for pickup |
| `invoice.paid` | Client settled invoice via online link or bank terminal |

```json title="Webhook Payload Example (order.status_changed)"
{
  "event": "order.status_changed",
  "timestamp": "2026-09-01T10:45:12Z",
  "data": {
    "orderId": "wo_2026_0891",
    "previousStage": "waiting_for_parts",
    "newStage": "in_progress",
    "notes": "Brembo brake pads delivered by courier."
  }
}
```
