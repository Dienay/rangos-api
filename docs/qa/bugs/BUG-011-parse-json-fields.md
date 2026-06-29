# BUG-011 — parseJsonFields não interrompe execução em JSON inválido

|                    |                                          |
| ------------------ | ---------------------------------------- |
| **ID**             | BUG-011                                  |
| **Módulo**         | Middleware — `parseJsonFields`           |
| **Severidade**     | Média                                    |
| **Prioridade**     | Média                                    |
| **Status**         | 🔴 Aberto                                |
| **Encontrado em**  | TC-EST-014                               |
| **Encontrado por** | Análise de código — `parseJsonFields.ts` |

---

## Descrição

O middleware `parseJsonFields` tenta retornar uma resposta de erro `400` quando um campo contém JSON inválido, mas o `return` está dentro de um `forEach` — o que em JavaScript apenas encerra a iteração atual do callback, não a função principal. Como resultado, o `next()` no final do middleware é chamado mesmo após o erro, fazendo a requisição prosseguir para o controller com dados inválidos no body.

---

## Passos para reproduzir

1. Enviar `POST /establishments` com `openingHours` em formato inválido:

```json
{
  "name": "Novo Lugar",
  "openingHours": "isso nao e json"
}
```

---

## Resultado esperado

- Status `400 Bad Request`
- Body: `{ "message": "Invalid JSON format in openingHours field." }`
- Requisição **não** prossegue para o controller

## Resultado atual

- Comportamento imprevisível — a resposta de erro pode ser enviada mas `next()` também é chamado, podendo causar o erro `Cannot set headers after they are sent`

---

## Causa raiz

```typescript
// src/middlewares/parseJsonFields.ts
const parseJsonFields = (req, res, next) => {
  const fieldsToParse = ['openingHours', 'address'];

  fieldsToParse.forEach((field) => {
    const value = req.body[field];
    if (value !== undefined) {
      if (isValidJson(value)) {
        req.body[field] = JSON.parse(value);
      } else {
        return res.status(400).json({
          // ❌ return dentro de forEach
          message: `Invalid JSON format in ${field} field.`
        });
        // apenas encerra o callback do forEach,
        // não a função parseJsonFields
      }
    }
    return undefined;
  });

  next(); // ❌ sempre executado, mesmo após o erro
};
```

---

## Impacto

- Requisições com JSON inválido chegam ao controller com dados corrompidos
- Pode causar erro `Cannot set headers after they are sent` em algumas situações
- Comportamento difícil de reproduzir de forma consistente

---

## Sugestão de correção

Substituir `forEach` por `for...of` com `return` explícito da função:

```typescript
const parseJsonFields = (req, res, next) => {
  const fieldsToParse = ['openingHours', 'address'];

  for (const field of fieldsToParse) {
    const value = req.body[field];
    if (value !== undefined) {
      if (isValidJson(value)) {
        req.body[field] = JSON.parse(value);
      } else {
        return res.status(400).json({
          // ✅ encerra a função
          message: `Invalid JSON format in ${field} field.`
        });
      }
    }
  }

  next();
};
```
