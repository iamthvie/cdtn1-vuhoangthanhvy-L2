# API Documentation - Mekong Mobile Smart CRM (Track SE)

This document specifies the core RESTful API endpoints for Luồng L2 (Warranty Service Intake & Verification).

## 1. Lookup Device & Warranty Status
- **Endpoint**: `GET /api/devices/:serialNo`
- **Description**: Retrieves device details, owner information (with masked phone number for security), and prior repair history.
- **Request Parameters**: 
  - `serialNo` (Path parameter): Serial number or IMEI of the device.
- **Response Example (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "deviceId": 1,
      "serialNo": "35693803564380",
      "modelName": "Galaxy A15",
      "customerName": "Phan Hữu Bình",
      "phone": "076****885",
      "purchaseDate": "2026-02-14",
      "warrantyMonths": 12,
      "warrantyStatus": "CON_BAO_HANH",
      "repairHistory": [
        {
          "ticketCode": "BH000101/2026",
          "receivedAt": "2026-03-03",
          "incidentGroup": "Màn hình",
          "status": "DA_DONG"
        }
      ]
    }
  }

## 2. Create Warranty Ticket
- **Endpoint**: `POST /api/tickets`
- **Description**: Creates a new warranty ticket in 'MOI' status with duplicate prevention (Idempotency-Key).
- **Request Body**:
```json
{
  "deviceId": 1,
  "serviceCenterId": 1,
  "receivedBy": 101,
  "issueDesc": "Màn hình bị sọc ngang khi hiển thị",
  "accessories": ["SAC"],
  "idempotencyKey": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
}
Response Example (201 Created):

```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "ticketId": 15,
    "ticketCode": "BH000188/2026",
    "status": "MOI",
    "warrantyStatus": "CON_BAO_HANH"
  }
}

- **Error Responses**:

400 Bad Request: Missing mandatory fields (issueDesc) or invalid data format.

409 Conflict: Duplicate request via Idempotency-Key or active ticket already exists for the device.