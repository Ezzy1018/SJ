# Security Test Cases

## Authorization Boundary: Alerts Ownership

### Case
User A attempts to read User B alerts.

### Preconditions
- User A has a valid Firebase ID token (`TOKEN_A`) with uid `user_a`.
- User B exists with uid `user_b`.

### Request

```bash
curl -i -X GET \
  http://localhost:4000/api/alerts/user/user_b \
  -H "Authorization: Bearer TOKEN_A"
```

### Expected
- HTTP status: `403`
- Body:

```json
{ "error": "Forbidden" }
```

### Why
The alerts controller verifies that the path uid matches the authenticated uid before returning data.
