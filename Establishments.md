## Establishments

#### POST /establishments

- **Descrição:** Criação estabelecimento

- **Request Body:**
  ```json
  {
    "coverPhoto": "",
    "name": "João's Restaurant",
    "openingHours": [
      {
        "openDays": ["Monday", "Wednesday", "Friday"],
        "hours": [
          {
            "open": "11:00",
            "close": "15:00"
          }
        ]
      },
      {
        "openDays": ["Saturday", "Sunday"],
        "hours": [
          {
            "open": "18:00",
            "close": "22:00"
          }
        ]
      }
    ],
    "address": [
      {
        "description": "Flagship",
        "street": "333 Oak Ave",
        "number": "101",
        "complement": "Downtown",
        "neighborhood": "Downtown",
        "city": "Cityville",
        "state": "State"
      }
    ],
    "category": ["Restaurant"],
    "deliveryTime": "20-40",
    "shipping": 8.0
  }
  ```
- **Response:**
  ```json
  {
    "message": "Establishment created successfully.",
    "data": {
      "coverPhoto": "",
      "name": "João's Restaurant",
      "openingHours": [
        {
          "openDays": ["Monday", "Wednesday", "Friday"],
          "hours": [
            {
              "open": "11:00",
              "close": "15:00"
            }
          ]
        },
        {
          "openDays": ["Saturday", "Sunday"],
          "hours": [
            {
              "open": "18:00",
              "close": "22:00"
            }
          ]
        }
      ],
      "deliveryTime": "20-40",
      "shipping": 8,
      "address": [
        {
          "description": "Flagship",
          "street": "333 Oak Ave",
          "number": "101",
          "complement": "Downtown",
          "neighborhood": "Downtown",
          "city": "Cityville",
          "state": "State",
          "_id": "6686e0966fe40e0d7875083a"
        }
      ],
      "category": ["Restaurant"],
      "_id": "6686e0966fe40e0d78750839"
    }
  }
  ```

#### GET Get Establishment List

- Open request: </establishments>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos

#### GET Get Establishment Search

- Open request: </establishments/search?name=star>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Query Params: name: star

#### GET Get Establishment by Id

- Open request: </establishments/:id>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 664263e9a61e5ddceac532f2

#### GET Get Establishment by Id with products

- Open request: </establishments/:id/products>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 664263e9a61e5ddceac532f3

#### PUT Update Establishment

- Open request: </establishments/:id>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 664263e9a61e5ddceac532f1
- Body: form-data
  - coverPhoto
  - name: João's Restaurant

#### DELETE Delete Establishment

- Open request: </establishments/:id>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 6666130fdf166d0902f070f5

## Establishiment Address

### Add folder description…

- Authorization: Bearer Token
- This folder is using an authorization helper from collection Rangos

#### POST Add Establishment Address

- Open request: </establishments/:entityId/address>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: entityId: 664263e9a61e5ddceac532f2
- Body: raw (json)

```json
{
  "description": "Work",
  "street": "231 Oak Ave",
  "number": "2020",
  "complement": "",
  "neighborhood": "Hillside",
  "city": "Countyville",
  "state": "State"
}
```

#### GET Get Establishment Address

- Open request: </establishments/:entityId/address>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: entityId: 664263e9a61e5ddceac532f2

#### PUT Edit Establishment Address

- Open request: </establishments/:entityId/address/:addressId>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: entityId: 664263e9a61e5ddceac532f2, addressId: 6669f85829081454c624dba0
- Body: raw (json)

```json
{
  "description": "Flagship",
  "street": "123 Main St",
  "number": "202",
  "complement": "perto",
  "neighborhood": "Uptown",
  "city": "Metropolis",
  "state": "State"
}
```

#### DELETE Delete Establishment Address

- Open request: </establishments/:entityId/address/:addressId>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: entityId: 664263e9a61e5ddceac532f2, addressId: 6669e8b7c5f385da853d2f52
- Body: raw (json)

```json
{
  "description": "Work",
  "street": "231 Oak Ave",
  "number": "2020",
  "complement": "aqui",
  "neighborhood": "Hillside",
  "city": "Countyville",
  "state": "State"
}
```

## Establishment Order

### Add folder description…

- Authorization: Bearer Token
- This folder is using an authorization helper from collection Rangos

#### POST Create Establishment Order

- Open request: </establishments/:entityId/orders>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: entityId: 664263e9a61e5ddceac532f3
- Body: raw (json)

```json
{
  "userId": "667038c8d23b11fd040e86f5",
  "establishmentId": "664263e9a61e5ddceac532f3",
  "date": "2024-06-07T12:34:56Z",
  "status": "Cart",
  "products": [
    {
      "productId": "66436318bea46df5e1bc8bd1",
      "quantity": 2
    },
    {
      "productId": "66436318bea46df5e1bc8bd2",
      "quantity": 1
    }
  ],
  "shipping": 2.5,
  "totalPrice": 9.47,
  "deliveryAddress": {
    "description": "Work",
    "street": "231 Oak Ave",
    "number": "2020",
    "complement": "",
    "neighborhood": "Hillside",
    "city": "Countryville",
    "state": "State"
  },
  "paymentMethod": "Credit Card"
}
```

#### GET Get Establishment Orders

- Open request: </establishments/:entityId/orders>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: entityId: 664263e9a61e5ddceac532f3

#### GET Get Establishment Order By Id

- Open request: </establishments/:entityId/orders/:orderId>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: entityId: 664263e9a61e5ddceac532f3, orderId: 6671d82c46502dd7e292ec85
- Body: raw (json)

```json
{
  "userId": "666752ed4c7c92c6a643959b",
  "date": "2024-06-07T12:34:56.000Z",
  "status": "done",
  "paymentMethod": "Credit Card",
  "products": [
    {
      "quantity": 2,
      "price": 3.99,
      "_id": "666c747c3fc010fef669d16e"
    },
    {
      "quantity": 1,
      "price": 14.99,
      "_id": "666c747c3fc010fef669d16f"
    }
  ],
  "deliveryAddress": {
    "description": "Work",
    "street": "231 Oak Ave",
    "number": "2020",
    "complement": "",
    "neighborhood": "Hillside",
    "city": "Countryville",
    "state": "State",
    "_id": "666c747c3fc010fef669d170"
  },
  "shipping": 2.5,
  "totalPrice": 21.48
}
```

#### PUT Update Establishment Order

- Open request: </establishments/:entityId/orders/:orderId>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: entityId: 664263e9a61e5ddceac532f3, orderId: 6671d82c46502dd7e292ec85
- Body: raw (json)

```json
{
  "userId": "667038c8d23b11fd040e86f5",
  "establishmentId": "664263e9a61e5ddceac532f3",
  "date": "2024-06-07T12:34:56Z",
  "status": "Delivered",
  "products": [
    {
      "productId": "66436318bea46df5e1bc8bd1",
      "quantity": 2
    },
    {
      "productId": "66436318bea46df5e1bc8bd2",
      "quantity": 1
    }
  ],
  "shipping": 2.5,
  "totalPrice": 9.47,
  "deliveryAddress": {
    "description": "Work",
    "street": "231 Oak Ave",
    "number": "2020",
    "complement": "",
    "neighborhood": "Hillside",
    "city": "Countryville",
    "state": "State"
  },
  "paymentMethod": "Credit Card"
}
```

#### DELETE Delete Establishment Order

- Open request: </establishments/:entityId/orders/:orderId>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: entityId: 664263e9a61e5ddceac532f2, orderId: 66741bf9e35f9c35355d3d72
