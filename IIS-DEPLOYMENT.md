# Guía de Despliegue en Windows IIS

Esta aplicación Next.js ha sido configurada para despliegue en Windows IIS usando **Standalone Output**.

## Archivos Creados/Modificados

✅ `next.config.ts` - Configurado con `output: "standalone"`
✅ `web.config` - Configuración de IIS (URL Rewrite)
✅ `.env.production` - Variables de ambiente
✅ `.next/standalone/` - Compilación lista para producción

## Estructura de Archivos para Copiar a Windows

```
C:\inetpub\wwwroot\ticket-validation\
├── .next/
│   └── standalone/              ← Carpeta completa
│       ├── .next/
│       ├── node_modules/
│       ├── public/
│       ├── server.js            ← Servidor Node.js
│       └── package.json
├── public/                       ← Carpeta de assets
│   └── logo-capa.png
├── web.config                    ← Copiado del proyecto
├── .env.production               ← Copiado del proyecto
└── package.json                  ← Original del proyecto
```

## Pasos en Windows

### 1. Requisitos Previos (Una sola vez)

Instalar en el servidor Windows:
- **Node.js LTS v18+** desde https://nodejs.org/
- **IIS** (Roles → Web Server → IIS)
- **URL Rewrite Module** para IIS desde https://www.microsoft.com/en-us/download/details.aspx?id=47337

Verificar en PowerShell:
```powershell
node --version    # Debería mostrar v18+
npm --version     # Debería mostrar 10+
```

### 2. Copiar Aplicación

Copiar la carpeta `.next/standalone/` completa a:
```
C:\inetpub\wwwroot\ticket-validation\
```

Incluir también:
- `public/` (carpeta con logo-capa.png)
- `web.config` (descargado del proyecto)
- `.env.production` (descargado del proyecto)
- `package.json` (descargado del proyecto)

### 3. Configurar IIS Manager

#### A. Crear Application Pool

1. Abrir **IIS Manager**
2. **Application Pools** → Click derecho → **Add Application Pool**
   - Name: `TicketValidation`
   - .NET CLR version: `No Managed Code`
   - Pipeline mode: `Integrated`

3. Seleccionar `TicketValidation` → **Advanced Settings**
   - Identity: `NetworkService`
   - Enable 32-Bit Applications: `False`

#### B. Crear Aplicación

1. **Default Web Site** → Click derecho → **Add Application**
   - Alias: `ticket`
   - Application pool: `TicketValidation`
   - Physical path: `C:\inetpub\wwwroot\ticket-validation\`

2. Click **OK**

#### C. Permisos NTFS

1. Click derecho en `C:\inetpub\wwwroot\ticket-validation\` → **Properties**
2. **Security** tab → **Edit**
3. **Add** → `IIS AppPool\TicketValidation`
4. Dar permisos: **Modify**, **Read & Execute**, **List Folder Contents**
5. **Apply** → **OK**

### 4. Ejecutar Servidor Node.js

#### Opción A: Como Servicio Windows (RECOMENDADO)

En PowerShell como **Administrador**, dentro de `C:\inetpub\wwwroot\ticket-validation\`:

```powershell
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar servidor
pm2 start .next/standalone/server.js --name "ticket-app"

# Guardar configuración
pm2 save

# Hacer que PM2 se ejecute al iniciar Windows
pm2 startup windows-service

# Verificar estado
pm2 status
pm2 logs ticket-app
```

#### Opción B: Ejecución Manual (Testing)

En PowerShell como **Administrador**:

```powershell
cd C:\inetpub\wwwroot\ticket-validation
node .next/standalone/server.js
```

### 5. Verificar que Funciona

```powershell
# Verificar que Node.js escucha en puerto 3000
netstat -ano | findstr :3000

# Debería mostrar:
# TCP    127.0.0.1:3000    0.0.0.0:0    LISTENING    [PID]
```

### 6. Probar en Navegador

**Desde el servidor:**
```
http://localhost/qr/
http://127.0.0.1/qr/
```

**Desde otra máquina (reemplazar con IP del servidor):**
```
http://192.168.x.x/qr/
```

**Prueba con comprobante:**
```
http://[SERVIDOR]/qr?n=PRUEBA&c=001&f=20250526&t=500&i=TEST001&h=abc123
```

## Solución de Problemas

### Problema: "No puede conectarse a http://localhost/qr/"

**Solución:**
1. Verificar que Node.js está corriendo: `netstat -ano | findstr :3000`
2. Si no está corriendo, ejecutar: `node C:\inetpub\wwwroot\ticket-validation\.next\standalone\server.js`
3. Revisar permisos NTFS en la carpeta

### Problema: "Error en IIS Rewrite"

**Solución:**
1. Verificar que URL Rewrite está instalado
2. En IIS Manager → Agregar Feature: **URL Rewrite**
3. Verificar que `web.config` está en la raíz (`C:\inetpub\wwwroot\ticket-validation\web.config`)

### Problema: "Permisos denegados"

**Solución:**
1. Verificar permisos NTFS en `C:\inetpub\wwwroot\ticket-validation\`
2. El usuario `IIS AppPool\TicketValidation` debe tener **Modify**
3. Reiniciar IIS: `iisreset` en PowerShell

## Mantenimiento

### Actualizar la Aplicación

1. Compilar localmente: `npm run build`
2. Copiar nueva carpeta `.next/standalone/` a servidor (reemplazar carpeta `.next/`)
3. Reiniciar servidor Node.js: `pm2 restart ticket-app` o reiniciar servicio

### Ver Logs

```powershell
# Logs de PM2
pm2 logs ticket-app

# O si está en PowerShell directo:
# Ctrl+C para detener y revisar último error
```

### Auto-reinicio en caso de error

PM2 reinicia automáticamente si el proceso falla.

Verificar:
```powershell
pm2 status
pm2 logs ticket-app
```

---

## URLs Finales

| Página | URL |
|--------|-----|
| Home | `http://[SERVIDOR]/qr/` |
| Comprobante Demo | `http://[SERVIDOR]/qr?n=DEMO&c=001&f=20250526&t=1000&i=DEMO001&h=hash123` |
| Escanear QR | Hacer click en botón "Escanear QR" en home |

---

## Soporte

- Documentación Next.js: https://nextjs.org/docs
- Documentación IIS: https://docs.microsoft.com/en-us/iis/
- PM2: https://pm2.keymetrics.io/

