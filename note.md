## GET All Jobs - Advanced Search, Filter & Pagination

**Endpoint:** `GET /api/v1/jobs`

### Query Parameters

| Parameter  | Type     | Description                                                    |
| ---------- | -------- | -------------------------------------------------------------- |
| searchTerm | string   | Search across title, company, description (case insensitive)   |
| company    | string   | Filter by exact company name                                   |
| location   | LOCATION | Filter by enum location (e.g., Dhaka, Chittagong, Remote)      |
| category   | CATEGORY | Filter by enum category (e.g., Engineering, Design, Marketing) |
| page       | number   | Page number (default: 1)                                       |
| limit      | number   | Items per page (default: 10)                                   |
| sortBy     | string   | Sort field (default: createdAt)                                |
| sortOrder  | string   | asc or desc (default: desc)                                    |

### LOCATION Enum (Bangladesh 64 Districts + Remote)

```
Dhaka, Chittagong, Rajshahi, Khulna, Sylhet, Rangpur, Barishal, Mymensingh,
Comilla, Gazipur, Narayanganj, Tangail, Bogra, Dinajpur, Jessore, Cox_s_Bazar,
Brahmanbaria, Narsingdi, Savar, Tongi, Faridpur, Jamalpur, Pabna, Habiganj,
Moulvibazar, Sunamganj, Kushtia, Natore, Nawabganj, Rajbari, Sirajganj, Joypurhat,
Naogaon, Nilphamari, Kurigram, Lalmonirhat, Gaibandha, Thakurgaon, Panchagarh,
Sherpur, Netrokona, Kishoreganj, Narail, Satkhira, Bagerhat, Magura, Meherpur,
Chuadanga, Jhenaidah, Gopalganj, Madaripur, Shariatpur, Munshiganj, Manikganj,
Pirojpur, Barguna, Jhalokati, Bhola, Patuakhali, Chandpur, Lakshmipur, Noakhali,
Feni, Khagrachhari, Rangamati, Bandarban, Remote
```

### CATEGORY Enum

```
Design, Sales, Marketing, Finance, Technology, Engineering, Business, Human_Resource
```

### Example Requests

```
GET /api/v1/jobs?searchTerm=developer&page=1&limit=5
GET /api/v1/jobs?category=Engineering&location=Remote
GET /api/v1/jobs?searchTerm=node&sortBy=title&sortOrder=asc
GET /api/v1/jobs?company=QTech&page=1&limit=10
GET /api/v1/jobs?location=Dhaka&category=Technology
```

### Example Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs retrieved successfully",
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10
  },
  "data": [
    {
      "id": "uuid",
      "title": "Backend Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build REST APIs with Node.js",
      "createdAt": "2026-03-01T05:59:04.049Z"
    }
  ]
}
```

### Searchable Fields (partial match, case insensitive)
- title, company, description

### Filterable Fields (exact match, enum values)
- location (LOCATION enum)
- category (CATEGORY enum)
- company (string exact match)
