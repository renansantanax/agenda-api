import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const port = process.env.PORT || 3333;

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Agenda API",
    version: "1.0.0",
    description:
      "API para gerenciamento de clientes e agendamentos. Models: User (auth), Client, Appointment.",
  },
  servers: [
    {
      url: `http://localhost:${port}/api`,
      description: "Servidor local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT obtido na rota POST /auth/login",
      },
    },
    schemas: {
      // ─── User ───────────────────────────────────────────────
      UserResponse: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          },
          name: { type: "string", example: "João Silva" },
          email: { type: "string", format: "email", example: "joao@email.com" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-05-20T14:00:00.000Z",
          },
        },
      },
      CreateUserBody: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 1, example: "João Silva" },
          email: { type: "string", format: "email", example: "joao@email.com" },
          password: { type: "string", minLength: 6, example: "senha123" },
        },
      },
      UpdateUserBody: {
        type: "object",
        description: "Pelo menos um campo deve ser informado.",
        properties: {
          name: { type: "string", minLength: 2, example: "João Santos" },
          email: {
            type: "string",
            format: "email",
            example: "joao.novo@email.com",
          },
          password: { type: "string", minLength: 6, example: "novasenha123" },
        },
      },
      // ─── Auth ───────────────────────────────────────────────
      LoginBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "joao@email.com" },
          password: { type: "string", minLength: 6, example: "senha123" },
        },
      },
      TokenResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      // ─── Erros ──────────────────────────────────────────────
      ErrorMessage: {
        type: "object",
        properties: {
          message: { type: "string", example: "Usuário não encontrado." },
        },
      },
      ValidationError: {
        type: "object",
        properties: {
          errors: {
            type: "object",
            example: {
              email: ["Email inválido"],
              password: ["A senha deve conter no mínimo 6 caracteres"],
            },
          },
        },
      },
    },
  },
  paths: {
    // ─── Auth ───────────────────────────────────────────────────────────────
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login — gera token JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginBody" },
            },
          },
        },
        responses: {
          200: {
            description: "Login realizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenResponse" },
              },
            },
          },
          400: {
            description: "Email/senha ausentes ou inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
                examples: {
                  camposAusentes: {
                    summary: "Campos não informados",
                    value: { message: "Email e senha são obrigatórios" },
                  },
                  credenciaisInvalidas: {
                    summary: "Credenciais erradas",
                    value: { message: "Email ou senha inválidos" },
                  },
                },
              },
            },
          },
        },
      },
    },
    // ─── Users ──────────────────────────────────────────────────────────────
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Listar todos os usuários",
        responses: {
          200: {
            description: "Lista de usuários retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/UserResponse" },
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Criar um novo usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserBody" },
            },
          },
        },
        responses: {
          201: {
            description: "Usuário criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Usuário criado com sucesso",
                    },
                    user: { $ref: "#/components/schemas/UserResponse" },
                  },
                },
              },
            },
          },
          400: {
            description: "Dados inválidos (Zod) ou email já cadastrado",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/ValidationError" },
                    { $ref: "#/components/schemas/ErrorMessage" },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Buscar usuário por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          },
        ],
        responses: {
          200: {
            description: "Usuário encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          400: {
            description: "ID inválido ou usuário não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Atualizar um usuário",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserBody" },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário atualizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          400: {
            description: "Dados inválidos ou usuário não encontrado",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/ValidationError" },
                    { $ref: "#/components/schemas/ErrorMessage" },
                  ],
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Deletar um usuário",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          },
        ],
        responses: {
          200: {
            description: "Usuário deletado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Usuário deletado com sucesso",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "ID inválido ou usuário não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`📄 Swagger disponível em http://localhost:${port}/api/docs`);
}
