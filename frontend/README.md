# Hotel Reservation - Frontend

Frontend del sistema de gestión de reservas de hotel, construido con React, TypeScript y Vite.

## Tecnologías

- **React 18** con TypeScript
- **Vite** como build tool
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **Vitest** para testing
- **Storybook** para Visual TDD
- **CSS puro** (sin frameworks CSS)

## Arquitectura

El proyecto sigue los principios de **Clean Architecture**:
```
src/
├── domain/              # Lógica de negocio
│   ├── entities/        # Modelos de dominio
│   ├── repositories/    # Interfaces de repositorios
│   └── usecases/        # Casos de uso
├── infrastructure/      # Implementaciones
│   ├── api/            # Cliente HTTP
│   ├── repositories/   # Implementaciones de repositorios
│   └── storage/        # Almacenamiento local
└── presentation/        # Capa de UI
    ├── components/     # Componentes reutilizables
    ├── pages/         # Páginas de la aplicación
    ├── context/       # Context API de React
    └── hooks/         # Custom hooks
```

## Instalación
```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env
```

## Scripts Disponibles
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Tests
npm run test
npm run test:ui

# Storybook
npm run storybook
npm run build-storybook

# Linting
npm run lint
```

## Variables de Entorno

Crea un archivo `.env` con:
```env
VITE_API_URL=http://localhost:3000
```

## Funcionalidades

### Para Huéspedes (GUEST)
- Registro e inicio de sesión
- Búsqueda de habitaciones disponibles
- Crear reservas
- Ver mis reservas
- Cancelar reservas

### Para Recepcionistas (RECEPTIONIST)
- Todo lo de huéspedes +
- Crear y gestionar habitaciones
- Ver todas las reservas
- Realizar check-in/check-out

### Para Administradores (ADMIN)
- Todas las funcionalidades

## Estructura de Componentes

Todos los componentes están documentados en Storybook. Para verlos:
```bash
npm run storybook
```

## Testing

El proyecto utiliza Vitest para testing:
```bash
# Ejecutar tests
npm run test

# Tests con UI
npm run test:ui
```

## Convenciones de Código

- **TypeScript** estricto habilitado
- **Arquitectura limpia** con separación de capas
- **Componentes funcionales** con hooks
- **CSS modular** por componente
- **Nombres descriptivos** para variables y funciones

## Integración con Backend

El frontend se comunica con el backend a través de la API REST en `http://localhost:3000`. Asegúrate de que el backend esté corriendo antes de iniciar el frontend.

## Deploy

Para hacer deploy:
```bash
npm run build
```

Los archivos de producción estarán en el directorio `dist/`.