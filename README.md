# 📦 L2 Code - Packing API

🔗 **API Online:** [https://\_\_\_.com](https://___.com)

Aplicação desenvolvida em **Node.js com NestJS** para auxiliar no processo de empacotamento de pedidos de uma loja online.  
A API recebe pedidos com produtos e suas dimensões e retorna a distribuição otimizada em caixas de papelão disponíveis.

---

## 🖥️ Interface de Testes

A aplicação também disponibiliza uma interface web simples na rota **root (`/`)** para facilitar os testes de pedidos e autenticação.

📸 Prints de funcionamento:

### Tela de pedidos

![Gerenciador de Pedidos](https://i.imgur.com/t5uZAPR.gif)

### Testes unitários

![Testes Unitários](https://i.imgur.com/CIAGynj.png)

### Testes E2E

![Testes E2E](https://i.imgur.com/sa2QZ2B.png)

---

## 🚀 Funcionalidades

- Recebe uma lista de pedidos com produtos e dimensões.
- Determina automaticamente quais caixas usar para cada pedido.
- Minimiza o número de caixas utilizadas.
- Retorna quais produtos foram atribuídos a cada caixa.
- ✅ Autenticação JWT para rotas protegidas (opcional).
- ✅ Documentação automática com Swagger.
- ✅ Testes unitários e de integração (Jest).
- ✅ Suporte a execução com **Docker**.

---

## 📦 Caixas Disponíveis

- **Caixa 1**: `30 x 40 x 80 cm`
- **Caixa 2**: `50 x 50 x 40 cm`
- **Caixa 3**: `50 x 80 x 60 cm`

---

## 📑 Exemplo de Entrada (JSON)

```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "produtos": [
        {
          "produto_id": "PS5",
          "dimensoes": { "altura": 40, "largura": 10, "comprimento": 25 }
        },
        {
          "produto_id": "Volante",
          "dimensoes": { "altura": 40, "largura": 30, "comprimento": 30 }
        }
      ]
    }
  ]
}
```

---

## 📤 Exemplo de Saída

```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "caixas": [
        {
          "caixa_id": "Caixa 2",
          "produtos": ["PS5", "Volante"]
        }
      ]
    }
  ]
}
```

---

## 📘 Documentação Swagger

Acesse a documentação interativa da API em:  
👉 [/doc](http://localhost:3001/doc)

---

## 🔑 Autenticação JWT

A API possui rotas protegidas que requerem autenticação via **Bearer Token**.

- **Login**: `POST /auth/login`

  ```json
  {
    "email": "tester@test.com",
    "password": "test@2025#"
  }
  ```

- **Exemplo de resposta**:

  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1..."
  }
  ```

- Para acessar a rota protegida:
  ```http
  GET /packing/secure
  Authorization: Bearer <TOKEN>
  ```

---

## 🐳 Executando com Docker

### Subir os containers

```bash
npm run dc:up
```

### Derrubar os containers

```bash
npm run dc:down
```

A aplicação ficará disponível em:  
👉 [http://localhost:3001](http://localhost:3001)

---

## 🧪 Testes

Rodar todos os testes:

```bash
npm run test
```

Rodar testes em watch mode:

```bash
npm run test:watch
```

Cobertura de testes:

```bash
npm run test:cov
```

Testes E2E:

```bash
npm run test:e2e
```

---

## 📂 Estrutura das Rotas

- **POST /packing** → Processa os pedidos.
- **GET /packing** → Lista as caixas disponíveis.
- **GET /packing/secure** → Rota protegida com JWT.
- **POST /auth/login** → Autenticação de usuário.
- **GET /** → Interface de teste em HTML.

---

## ✅ Requisitos Atendidos

- [x] API em **NestJS**
- [x] Documentação com **Swagger**
- [x] Execução via **Docker Compose**
- [x] Autenticação JWT
- [x] Testes unitários e E2E

---

<hr>
<p align="center">
👨‍💻 Developed with ❤️ by Megas
</p>
