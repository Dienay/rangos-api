# BUG-007 — Sem verificação de duplicidade ao atualizar email ou telefone

| Campo              | Detalhe                                 |
| ------------------ | --------------------------------------- |
| **ID**             | BUG-008                                 |
| **Módulo**         | User — `PUT /user/:id`                  |
| **Severidade**     | Alta                                    |
| **Prioridade**     | Alta                                    |
| **Status**         | 🔴 Aberto                               |
| **Encontrado em**  | TC-USER-009                             |
| **Encontrado por** | Análise de código — `userController.ts` |

---

## Descrição

O endpoint `PUT /user/:id` permite atualizar o email ou telefone de um usuário para um valor já cadastrado por outro usuário, sem verificar duplicidade. O comportamento é inconsistente com o `POST /signup`, que verifica duplicidade antes de criar o usuário.

---

## Passos para reproduzir

1. Cadastrar dois usuários com emails distintos:
   - Usuário A: `email: "user-a@test.com"`
   - Usuário B: `email: "user-b@test.com"`

2. Enviar `PUT /user/:id` do Usuário A com o email do Usuário B:

```json
{
  "email": "user-b@test.com"
}
```

---

## Resultado esperado

```status-code
Status: 409 Conflict
```

```json
{
  "message": "Email already exists."
}
```

---

## Resultado atual

```status-code
Status: 200 OK
```

```json
{
  "message": "User updated already.",
  "user": {
    "email": "user-b@test.com",
    ...
  }
}
```

---

## Causa raiz

O método `updateUser` em `userController.ts` usa `findByIdAndUpdate` diretamente sem verificar duplicidade antes, ao contrário do `signup` que faz essa verificação explicitamente:

```typescript
// signup — verifica duplicidade (correto)
const emailExists = await User.findOne({ email: body.email });
if (emailExists) {
  return res.status(409).json({ message: 'Email already exists.' });
}

// updateUser — não verifica duplicidade (incorreto)
const updatedUser = await User.findByIdAndUpdate(
  id,
  { $set: { email: newData.email, ... } },
  { new: true }
);
```

---

## Correção sugerida

Adicionar verificação de duplicidade no método `updateUser` antes de executar o update:

```typescript
if (newData.email) {
  const emailExists = await User.findOne({
    email: newData.email,
    _id: { $ne: id } // excluir o próprio usuário da verificação
  });
  if (emailExists) {
    return res.status(409).json({ message: 'Email already exists.' });
  }
}

if (newData.phone) {
  const phoneExists = await User.findOne({
    phone: newData.phone,
    _id: { $ne: id }
  });
  if (phoneExists) {
    return res.status(409).json({ message: 'Phone already exists.' });
  }
}
```

---

## Impacto

- Dois usuários podem terminar com o mesmo email ou telefone no banco
- Conflito de dados que pode causar falhas de autenticação
- Viola a restrição `unique` definida no schema, podendo gerar erros inesperados no MongoDB
- Comportamento inconsistente entre `signup` e `updateUser` para a mesma regra de negócio
