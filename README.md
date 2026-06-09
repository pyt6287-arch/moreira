# KeepSpace - Supabase Bookmark Manager

Un gestor de marcadores rápido, minimalista y autohospedable. Diseñado para desplegarse fácilmente en **Coolify** usando **Docker / Docker Compose** e integrarse con **Supabase** como base de datos.

## Estructura del Proyecto

- `app/main.py`: Backend en FastAPI.
- `templates/index.html`: Interfaz limpia y responsiva con tema oscuro.
- `schema.sql`: Sentencias SQL para inicializar la tabla en Supabase.
- `Dockerfile` & `docker-compose.yml`: Configuración de contenedores lista para producción.

## Configuración de Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com).
2. Ve al **SQL Editor** en Supabase, copia el contenido de `schema.sql` y ejecútalo.
3. Copia la **Project URL** y la **API Key (anon/public)** desde *Project Settings > API*.

## Despliegue en Coolify

1. Sube este repositorio a GitHub/GitLab.
2. En Coolify, crea un nuevo recurso seleccionando **Public Repository** o **Private Repository**.
3. Selecciona el destino (servidor) y define el tipo de build como **Docker Compose**.
4. Define las variables de entorno en Coolify:
   - `SUPABASE_URL`: Tu URL del proyecto de Supabase.
   - `SUPABASE_KEY`: Tu clave anónima (anon public key) de Supabase.
5. Haz clic en **Deploy**. Coolify expondrá automáticamente el puerto `8080`.

## Ejecución Local

1. Copia `.env.example` a `.env` y rellena las credenciales de Supabase:
   ```bash
   cp .env.example .env
   ```
2. Ejecuta con Docker Compose:
   ```bash
   docker compose up --build
   ```
3. Abre [http://localhost:8080](http://localhost:8080) en tu navegador.
