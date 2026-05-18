# Pharmacy Schedule Management System

System do zarządzania grafikami pracy w aptekach.

## Funkcjonalności MVP

### Role użytkowników
- **Administrator**: Pełna konfiguracja systemu i użytkowników
- **Menadżer**: Zarządzanie wieloma aptekami i zatwierdzanie grafików
- **Kierownik**: Układanie grafików dla swojej apteki
- **Magister**: Podgląd grafiku, zgłaszanie preferencji/nieobecności
- **Technik**: Podgląd grafiku, zgłaszanie preferencji/nieobecności

### Kluczowe funkcje
- Tworzenie i publikacja grafików pracy
- Zarządzanie użytkownikami i rolami
- Przypisywanie zmian z kontrolą konfliktów
- Zgłaszanie nieobecności i preferencji
- Widok kalendarzowy (miesięczny/tygodniowy)
- Proces akceptacji grafików
- Historia zmian i podstawowe raporty

## Struktura projektu

```
├── server/          # Backend API (Node.js + Express + Prisma)
├── client/          # Frontend (React + Vite)
└── README.md
```

## Instalacja

```bash
# Instalacja wszystkich zależności
npm run install:all

# Uruchomienie środowiska deweloperskiego
npm run dev
```

## Backend (server/)

- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT authentication
- RESTful API

## Frontend (client/)

- React + Vite
- React Router
- Axios
- Tailwind CSS
- Calendar component

## Rozwój po MVP

- Automatyczne układanie grafików
- Powiadomienia (email/SMS/push)
- Zamiany dyżurów między pracownikami
- Integracje kadrowo-płacowe
- Eksporty do PDF/Excel
