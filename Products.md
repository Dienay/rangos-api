A seguir está uma lista de endpoints criados para a API da plataforma de delivery:

## Rangos

### Authorization

- Bearer Token

## Establishments

### Add folder description…

- Authorization: Bearer Token
- This folder is using an authorization helper from collection Rangos

#### POST Create Establishment

- Open request: <http://localhost:3003/establishments>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Body: form-data
  - coverPhoto: /home/dienay/Imagens/Capturas de tela/Captura de tela de 2024-05-31 17-23-07.png
  - name: João's Restaurant

#### GET Get Establishment List

- Open request: <http://localhost:3003/establishments>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos

#### GET Get Establishment Search

- Open request: <http://localhost:3003/establishments/search?name=star>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Query Params: name: star

#### GET Get Establishment by Id

- Open request: <http://localhost:3003/establishments/:id>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 664263e9a61e5ddceac532f2

#### GET Get Establishment by Id with products

- Open request: <http://localhost:3003/establishments/:id/products>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 664263e9a61e5ddceac532f3

#### PUT Update Establishment

- Open request: <http://localhost:3003/establishments/:id>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 664263e9a61e5ddceac532f1
- Body: form-data
  - coverPhoto
  - name: João's Restaurant

#### DELETE Delete Establishment

- Open request: <http://localhost:3003/establishments/:id>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 6666130fdf166d0902f070f5

## Establishiment Address

### Add folder description…

- Authorization: Bearer Token
- This folder is using an authorization helper from collection Rangos

#### POST Add Establishment Address

- Open request: <http://localhost:3003/establishments/:entityId/address>
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

- Open request: <http://localhost:3003/establishments/:entityId/address>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: entityId: 664263e9a61e5ddceac532f2

#### PUT Edit Establishment Address

- Open request: <http://localhost:3003/establishments/:entityId/address/:addressId>
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

- Open request: <http://localhost:3003/establishments/:entityId/address/:addressId>
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

- Open request: <http://localhost:3003/establishments/:entityId/orders>
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

- Open request: <http://localhost:3003/establishments/:entityId/orders>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: entityId: 664263e9a61e5ddceac532f3

#### GET Get Establishment Order By Id

- Open request: <http://localhost:3003/establishments/:entityId/orders/:orderId>
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

- Open request: <http://localhost:3003/establishments/:entityId/orders/:orderId>
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

- Open request: <http://localhost:3003/establishments/:entityId/orders/:orderId>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: entityId: 664263e9a61e5ddceac532f2, orderId: 66741bf9e35f9c35355d3d72

## Products

### Add folder description…

- Authorization: Bearer Token
- This folder is using an authorization helper from collection Rangos

#### POST Create Product

- Open request: <http://localhost:3003/products>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Body: raw (json)

```json
{
  "coverPhoto": "",
  "name": "coiso",
  "description": "Hamburguer grelhado com queijo, alface, tomate e molho especial.",
  "price": 15.5,
  "establishment": "664263e9a61e5ddceac532f1"
}
```

#### GET Get Product List

- Open request: <http://localhost:3003/products>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos

#### GET Get Product by Id

- Open request: <http://localhost:3003/products/:id>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: id: 66436318bea46df5e1bc8bcf

#### PUT Update Product

- Open request: <http://localhost:3003/products/:id>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 66436318bea46df5e1bc8bdf
- Body: form-data
  - coverPhoto: /home/dienay/Imagens/download.png
  - name: Whopper
  - price: 4.99

#### DELETE Delete Product

- Open request: <http://localhost:3003/products/:id>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 66436318bea46df5e1bc8bdf

#### GET Get Product Search

- Open request: <http://localhost:3003/products/search?name=cap>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Query Params: name: cap

## User

### Add folder description…

- Authorization: Bearer Token
- This folder is using an authorization helper from collection Rangos

#### POST Signup

- Open request: <http://localhost:3003/signup>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Body: raw (json)

```json
{
  "avatar": "user.jpg",
  "name": "Dienay Lima",
  "email": "dienayl@email.com",
  "phone": "986986868686",
  "password": "86986868686"
}
```

#### POST Login

- Open request: <http://localhost:3003/login>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Body: raw (json)

```json
{
  "email": "dienay@email.com",
  "password": "86986868686"
}
```

#### GET Get User by Id

- Open request: <http://localhost:3003/user/:id>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: id: 667038c8d23b11fd040e86f5

#### PUT Update User

- Open request: <http://localhost:3003/user/:id>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: id: 666752ed4c7c92c6a643959b

#### DELETE Delete User

- Open request: <http://localhost:3003/user/:id>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: id: 66533bed7ce6a6529d521189

## Use Address

### Add folder description…

- Authorization: Bearer Token
- This folder is using an authorization helper from collection Rangos

#### POST Add User Address

- Open request: <http://localhost:3003/user/:entityId/address>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: entityId: 666752ed4c7c92c6a643959b
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

#### GET Get User Address

- Open request: <http://localhost:3003/user/:entityId/address>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: entityId: 666752ed4c7c92c6a643959b

#### PUT Edit User Address

- Open request: <http://localhost:3003/user/:entityId/address/:addressId>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: entityId: 666752ed4c7c92c6a643959b, addressId: 6669dd3c6f1c085ad18a26da
- Body: raw (json)

```json
{
  "description": "Flagship",
  "street": "123 Main St",
  "number": "20",
  "complement": "perto do coiso",
  "neighborhood": "Uptown",
  "city": "Metropolis",
  "state": "State"
}
```

#### DELETE Delete User Address

- Open request: <http://localhost:3003/user/:entityId/address/:addressId>
- Add request description…
- Authorization: Bearer Token
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAzOGM4ZDIzYjExZmQwNDBlODZmNSIsImlhdCI6MTcxOTE0ODQzNX0.8qp3fdNKolrq34814k1QuBXQ-T1EzyoWc-R2NUtvlRA
- Path Variables: entityId: 666752ed4c7c92c6a643959b, addressId: 6669d5485e9f22f8b12ad403
- Body: raw (json)

```json
{
  "description": "Flagship",
  "street": "123 Main St",
  "number": "20",
  "complement": "perto do coiso",
  "neighborhood": "Uptown",
  "city": "Metropolis",
  "state": "State"
}
```

## User Order

### Add folder description…

- Authorization: Bearer Token
- This folder is using an authorization helper from collection Rangos

#### POST Create User Order

- Open request: <http://localhost:3003/user/:entityId/orders>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: entityId: 667038c8d23b11fd040e86f5
- Body: raw (json)

```json
{
  "userId": "667038c8d23b11fd040e86f5",
  "establishmentId": "664263e9a61e5ddceac532f3",
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

#### GET Get User Orders

- Open request: <http://localhost:3003/user/:entityId/orders>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: entityId: 667038c8d23b11fd040e86f5

#### PUT Update User Order

- Open request: <http://localhost:3003/user/orders/:id>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 666c747c3fc010fef669d16d
- Body: raw (json)

```json
{
  "userId": "666752ed4c7c92c6a643959b",
  "date": "2024-06-07T12:34:56.000Z",
  "status": "Open",
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

#### PUT Add Product in User Order

- Open request: <http://localhost:3003/user/orders/:id/products>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 666c747c3fc010fef669d16d
- Body: raw (json)

```json
{
  "quantity": 3,
  "price": 3.99,
  "_id": "66436318bea46df5e1bc8bd2"
}
```

#### DELETE Delete User Order

- Open request: <http://localhost:3003/user/orders/:id>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
- Path Variables: id: 666c7eb9faa1106425976a5b

## Root

### GET Root

- Open request: <http://localhost:3003>
- Add request description…
- Authorization: Bearer Token
- This request is using an authorization helper from collection Rangos
