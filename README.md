# Authentication Backend Starter

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

This project is a boilerplate for a backend application built with the [NestJS](https://nestjs.com) framework. It includes authentication features out of the box, making it a great starting point for projects requiring user authentication and authorization.

## Features

- User authentication with JWT (JSON Web Tokens).
- Google OAuth integration.
- Modular and scalable architecture.
- Built-in guards, strategies, and decorators for authentication.
- Easy-to-extend structure for adding more features.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [pnpm](https://pnpm.io/) (v7 or higher recommended)
- Docker (optional, for containerized environments)

## Installation

Clone the repository and install dependencies:

```bash
$ pnpm install
```

## Running the Application

### Development Mode

```bash
$ pnpm run start
```

### Watch Mode

```bash
$ pnpm run start:dev
```

### Production Mode

```bash
$ pnpm run start:prod
```

## Testing

Run the following commands to execute tests:

### Unit Tests

```bash
$ pnpm run test
```

### End-to-End (E2E) Tests

```bash
$ pnpm run test:e2e
```

### Test Coverage

```bash
$ pnpm run test:cov
```

## Project Structure

The project follows a modular structure to ensure scalability and maintainability. Key directories include:

- `src/auth`: Contains modules, controllers, services, and strategies for authentication.
- `src/common`: Shared modules and utilities.
- `src/users`: User-related modules, services, and controllers.
- `src/utils`: Utility functions and constants.

## Resources

Here are some resources to help you get started with NestJS:

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Devtools](https://devtools.nestjs.com) for real-time application graph visualization.
- [Official Courses](https://courses.nestjs.com) for hands-on learning.
- [Discord Community](https://discord.gg/G7Qnnhy) for support and discussions.

## Support

This project is open-source and licensed under the MIT License. Contributions are welcome! If you find this project helpful, consider supporting the [NestJS framework](https://docs.nestjs.com/support).

## Author

- [NestJS Framework](https://nestjs.com)
- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
