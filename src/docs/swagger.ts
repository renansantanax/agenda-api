// swagger.ts
// Cole esse arquivo em src/docs/swagger.ts
// Instale as dependências:
//   npm install swagger-ui-express
//   npm install -D @types/swagger-ui-express

import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

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
      url: "http://localhost:3333/api",
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
      // ─── Appointment ────────────────────────────────────────
      AppointmentResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          date: {
            type: "string",
            format: "date-time",
            example: "2026-05-23T14:00:00.000Z",
          },
          description: {
            type: "string",
            example: "Corte + barba",
            nullable: true,
          },
          status: {
            type: "string",
            enum: ["PENDING", "DONE", "CANCELLED"],
            example: "PENDING",
          },
          user: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
                example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
              },
              name: { type: "string", example: "João Silva" },
            },
          },
          client: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "Maria Silva" },
              phone: { type: "string", example: "11999999999" },
            },
          },
        },
      },
      CreateAppointmentBody: {
        type: "object",
        required: ["date", "clientId"],
        properties: {
          date: {
            type: "string",
            format: "date-time",
            example: "2026-05-23T14:00:00.000Z",
          },
          description: { type: "string", example: "Corte + barba" },
          clientId: { type: "integer", example: 1 },
        },
      },
      UpdateAppointmentBody: {
        type: "object",
        description: "Pelo menos um campo deve ser informado.",
        properties: {
          date: {
            type: "string",
            format: "date-time",
            example: "2026-05-24T10:00:00.000Z",
          },
          description: { type: "string", example: "Manicure" },
          status: {
            type: "string",
            enum: ["PENDING", "DONE", "CANCELLED"],
            example: "DONE",
          },
        },
      },
      // ─── Client ─────────────────────────────────────────────
      ClientResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Maria Silva" },
          phone: { type: "string", example: "11999999999" },
          active: { type: "boolean", example: true },
        },
      },
      CreateClientBody: {
        type: "object",
        required: ["name", "phone"],
        properties: {
          name: { type: "string", example: "Maria Silva" },
          phone: { type: "string", example: "11999999999" },
        },
      },
      UpdateClientBody: {
        type: "object",
        description: "Pelo menos um campo deve ser informado.",
        properties: {
          name: { type: "string", example: "Maria Santos" },
          phone: { type: "string", example: "11988888888" },
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
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout — invalida o cookie de sessão",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Logout realizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Logout realizado com sucesso",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Retorna os dados do usuário autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dados do usuário logado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          401: {
            description: "Token ausente ou inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
          404: {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
    },
    // ─── Clients ────────────────────────────────────────────────────────────
    "/clients": {
      get: {
        tags: ["Clients"],
        summary: "Listar todos os clientes ativos",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de clientes retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ClientResponse" },
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Clients"],
        summary: "Criar um novo cliente",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateClientBody" },
            },
          },
        },
        responses: {
          201: {
            description: "Cliente criado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClientResponse" },
              },
            },
          },
          400: {
            description: "Dados inválidos",
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
    "/clients/{id}": {
      get: {
        tags: ["Clients"],
        summary: "Buscar cliente por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Cliente encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClientResponse" },
              },
            },
          },
          400: {
            description: "Cliente não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Clients"],
        summary: "Atualizar um cliente",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateClientBody" },
            },
          },
        },
        responses: {
          200: {
            description: "Cliente atualizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClientResponse" },
              },
            },
          },
          400: {
            description: "Dados inválidos ou cliente não encontrado",
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
        tags: ["Clients"],
        summary: "Desativar um cliente (soft delete)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Cliente desativado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Cliente desativado com sucesso",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Cliente não encontrado ou já desativado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
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
        security: [{ bearerAuth: [] }],
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
    // ─── Appointments ───────────────────────────────────────────────────────
    "/appointments": {
      get: {
        tags: ["Appointments"],
        summary: "Listar todos os agendamentos",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de agendamentos retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AppointmentResponse" },
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Appointments"],
        summary: "Criar um novo agendamento",
        description: "O userId é extraído automaticamente do token JWT.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAppointmentBody" },
            },
          },
        },
        responses: {
          201: {
            description: "Agendamento criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Agendamento criado com sucesso",
                    },
                    appointment: {
                      $ref: "#/components/schemas/AppointmentResponse",
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Dados inválidos, cliente não encontrado ou desativado",
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
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
    },
    "/appointments/{id}": {
      get: {
        tags: ["Appointments"],
        summary: "Buscar agendamento por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Agendamento encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AppointmentResponse" },
              },
            },
          },
          400: {
            description: "Agendamento não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Appointments"],
        summary: "Atualizar um agendamento",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateAppointmentBody" },
            },
          },
        },
        responses: {
          200: {
            description: "Agendamento atualizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AppointmentResponse" },
              },
            },
          },
          400: {
            description: "Dados inválidos ou agendamento não encontrado",
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
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Appointments"],
        summary: "Deletar um agendamento",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Agendamento excluído com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Agendamento excluído com sucesso!",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Agendamento não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
          401: {
            description: "Não autorizado",
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
  console.log("📄 Swagger disponível em http://localhost:3333/api/docs");
}
