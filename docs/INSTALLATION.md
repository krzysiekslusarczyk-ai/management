# Instrukcja instalacji - System Grafików Aptek

## Wymagania systemowe

- **Node.js** v18 lub nowszy
- **PostgreSQL** v14 lub nowszy
- **npm** v9 lub nowszy

## Instalacja

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/krzysiekslusarczyk-ai/management.git
cd management
```

### 2. Instalacja zależności

```bash
# Instalacja wszystkich zależności (root, server, client)
npm run install:all
```

Lub ręcznie:

```bash
# Zależności główne
npm install

# Zależności serwera
cd server
npm install

# Zależności klienta
cd ../client
npm install
```

### 3. Konfiguracja bazy danych

#### Utwórz bazę danych PostgreSQL:

```sql
CREATE DATABASE pharmacy_schedule;
CREATE USER pharmacy_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pharmacy_schedule TO pharmacy_user;
```

#### Skonfiguruj zmienne środowiskowe:

Skopiuj plik `.env.example` do `.env` w katalogu `server/`:

```bash
cd server
cp .env.example .env
```

Edytuj plik `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://pharmacy_user:your_password@localhost:5432/pharmacy_schedule?schema=public"
JWT_SECRET="your-very-secure-secret-key-change-this"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

⚠️ **Ważne:** Zmień `JWT_SECRET` na bezpieczny, losowy ciąg znaków w środowisku produkcyjnym!

### 4. Migracja bazy danych

```bash
cd server

# Generowanie klienta Prisma
npm run prisma:generate

# Utworzenie migracji i zastosowanie jej do bazy danych
npm run prisma:migrate
```

### 5. (Opcjonalne) Seed danych testowych

Możesz utworzyć plik `server/prisma/seed.js` z danymi testowymi:

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Utworzenie użytkownika administratora
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@apteka.pl',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'System',
      role: 'ADMINISTRATOR',
      phoneNumber: '+48123456789'
    }
  })

  console.log('Utworzono administratora:', admin.email)

  // Utworzenie przykładowej apteki
  const pharmacy = await prisma.pharmacy.create({
    data: {
      name: 'Apteka Centralna',
      address: 'ul. Główna 1',
      city: 'Warszawa',
      phoneNumber: '+48221234567'
    }
  })

  console.log('Utworzono aptekę:', pharmacy.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Dodaj skrypt do `package.json`:

```json
{
  "scripts": {
    "seed": "node prisma/seed.js"
  }
}
```

Uruchom seed:

```bash
npm run seed
```

## Uruchomienie aplikacji

### Tryb development (wszystko razem)

Z głównego katalogu:

```bash
npm run dev
```

To uruchomi:
- Backend API na `http://localhost:3000`
- Frontend React na `http://localhost:5173`

### Uruchomienie osobno

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

## Pierwsze logowanie

Jeśli uruchomiłeś seed, możesz zalogować się jako administrator:

- **Email:** `admin@apteka.pl`
- **Hasło:** `admin123`

⚠️ **Zmień hasło administratora po pierwszym logowaniu!**

## Narzędzia deweloperskie

### Prisma Studio

GUI do przeglądania i edytowania danych w bazie:

```bash
cd server
npm run prisma:studio
```

Otwiera się w przeglądarce na `http://localhost:5555`

### Build production

**Backend:**
```bash
cd server
npm run start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## Rozwiązywanie problemów

### Problem z połączeniem do bazy danych

1. Sprawdź czy PostgreSQL jest uruchomiony
2. Zweryfikuj `DATABASE_URL` w pliku `.env`
3. Upewnij się, że baza danych została utworzona
4. Sprawdź uprawnienia użytkownika bazy danych

### Problem z migracjami Prisma

```bash
cd server
# Resetuj bazę danych (UWAGA: usuwa wszystkie dane!)
npx prisma migrate reset

# Lub utwórz nową migrację
npx prisma migrate dev --name init
```

### Port już zajęty

Jeśli port 3000 lub 5173 jest zajęty, zmień go:

- Backend: edytuj `PORT` w `server/.env`
- Frontend: edytuj `server.port` w `client/vite.config.js`

### Problem z instalacją node_modules

```bash
# Usuń wszystkie node_modules i zainstaluj ponownie
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

## Wsparcie

W razie problemów sprawdź:
- [Dokumentację API](./API.md)
- [README.md](../README.md)
- Logi w konsoli serwera i klienta
