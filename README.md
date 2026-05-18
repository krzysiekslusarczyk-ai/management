# Pharmacy Schedule Management System

System do zarządzania grafikami pracy w aptekach.

## 📋 Spis treści

- [O projekcie](#o-projekcie)
- [Funkcjonalności](#funkcjonalności)
- [Technologie](#technologie)
- [Instalacja](#instalacja)
- [Dokumentacja](#dokumentacja)
- [Struktura projektu](#struktura-projektu)
- [Rozwój](#rozwój)

## O projekcie

System Grafików Aptek to kompleksowa aplikacja webowa przeznaczona do zarządzania grafikami pracy w aptekach. Umożliwia tworzenie, zatwierdzanie i publikację grafików, zarządzanie nieobecnościami pracowników oraz preferencjami dotyczącymi zmian.

## Funkcjonalności

### ✨ Kluczowe funkcje MVP

- ✅ **Tworzenie i publikacja grafików** - Kompletny system tworzenia grafików z kontrolą statusów
- ✅ **Zarządzanie zmianami** - Przypisywanie zmian pracownikom z automatyczną detekcją konfliktów
- ✅ **System ról** - 5 poziomów uprawnień (Administrator, Menadżer, Kierownik, Magister, Technik)
- ✅ **Nieobecności** - Zgłaszanie i zatwierdzanie urlopów i nieobecności
- ✅ **Preferencje** - Pracownicy mogą określić preferowane dni i typy zmian
- ✅ **Widok kalendarzowy** - Przejrzysty widok grafików z kolorowymi zmianami
- ✅ **Proces zatwierdzania** - Wielopoziomowy proces akceptacji grafików

### 👥 Role użytkowników

- **Administrator**: Pełna konfiguracja systemu i użytkowników
- **Menadżer**: Zarządzanie wieloma aptekami i zatwierdzanie grafików
- **Kierownik**: Układanie grafików dla swojej apteki
- **Magister**: Podgląd grafiku, zgłaszanie preferencji/nieobecności
- **Technik**: Podgląd grafiku, zgłaszanie preferencji/nieobecności

## Technologie

### Backend
- **Node.js** + **Express** - Framework webowy
- **PostgreSQL** - Baza danych
- **Prisma ORM** - Object-Relational Mapping
- **JWT** - Uwierzytelnienie
- **bcryptjs** - Hashowanie haseł
- **date-fns** - Operacje na datach

### Frontend
- **React 18** - Biblioteka UI
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **date-fns** - Formatowanie dat
- **CSS3** - Stylowanie

## Instalacja

### Wymagania
- Node.js v18+
- PostgreSQL v14+
- npm v9+

### Szybki start

```bash
# Klonowanie repozytorium
git clone https://github.com/krzysiekslusarczyk-ai/management.git
cd management

# Instalacja zależności
npm run install:all

# Konfiguracja środowiska
cd server
cp .env.example .env
# Edytuj .env - ustaw DATABASE_URL i JWT_SECRET

# Migracja bazy danych
npm run prisma:generate
npm run prisma:migrate

# Uruchomienie aplikacji (z głównego katalogu)
cd ..
npm run dev
```

Aplikacja będzie dostępna pod:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

Szczegółowa instrukcja instalacji: [docs/INSTALLATION.md](docs/INSTALLATION.md)

## Dokumentacja

- 📖 [Przewodnik użytkownika](docs/USER_GUIDE.md) - Instrukcja obsługi dla użytkowników końcowych
- 🔧 [Dokumentacja API](docs/API.md) - Szczegółowy opis endpointów API
- 💻 [Instrukcja instalacji](docs/INSTALLATION.md) - Przewodnik instalacji i konfiguracji

## Struktura projektu

```
management/
├── server/                 # Backend API
│   ├── prisma/            # Schemat bazy danych i migracje
│   │   └── schema.prisma  # Definicje modeli Prisma
│   ├── src/
│   │   ├── config/        # Konfiguracja (database)
│   │   ├── controllers/   # Kontrolery (logika biznesowa)
│   │   ├── middleware/    # Middleware (auth)
│   │   ├── routes/        # Routing API
│   │   └── index.js       # Entry point
│   ├── .env.example       # Przykładowa konfiguracja
│   └── package.json
│
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Komponenty React (Layout, PrivateRoute)
│   │   ├── contexts/      # Contexty React (AuthContext)
│   │   ├── pages/         # Strony aplikacji
│   │   ├── services/      # Serwisy API
│   │   ├── App.jsx        # Główny komponent
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docs/                  # Dokumentacja
│   ├── API.md
│   ├── INSTALLATION.md
│   └── USER_GUIDE.md
│
├── README.md
└── package.json           # Root package (skrypty helper)
```

## Rozwój

### Skrypty NPM

```bash
# Uruchomienie środowiska deweloperskiego (backend + frontend)
npm run dev

# Uruchomienie tylko backendu
npm run dev:server

# Uruchomienie tylko frontendu
npm run dev:client

# Instalacja wszystkich zależności
npm run install:all
```

### Backend (server/)

```bash
cd server

# Generowanie klienta Prisma po zmianach w schema.prisma
npm run prisma:generate

# Utworzenie i wykonanie migracji
npm run prisma:migrate

# Otwarcie Prisma Studio (GUI do bazy danych)
npm run prisma:studio

# Uruchomienie serwera development
npm run dev

# Uruchomienie serwera production
npm start
```

### Frontend (client/)

```bash
cd client

# Uruchomienie dev servera
npm run dev

# Build production
npm run build

# Podgląd buildu production
npm run preview
```

## Roadmap - Rozwój po MVP

### Planowane funkcjonalności

- 🤖 **Automatyczne układanie grafików** - AI-assisted scheduling
- 📧 **Powiadomienia** - Email/SMS/Push notifications
- 🔄 **Zamiany dyżurów** - Peer-to-peer shift swapping
- 💰 **Integracje kadrowo-płacowe** - Payroll system integration
- 📊 **Eksporty** - PDF/Excel reports
- 📱 **Aplikacja mobilna** - React Native app
- 📈 **Zaawansowane raporty** - Analytics dashboard
- 🌍 **Multi-language support** - Internationalization

## Licencja

MIT

## Autorzy

Projekt powstał jako MVP systemu do zarządzania grafikami pracy w aptekach.

## Wsparcie

W razie problemów lub pytań:
- Sprawdź [dokumentację](docs/)
- Otwórz issue na GitHubie
- Skontaktuj się z zespołem deweloperskim
