# Dokumentacja API - System Grafików Aptek

## Uwierzytelnienie

Wszystkie endpointy (poza `/api/auth/login` i `/api/auth/register`) wymagają tokenu JWT w nagłówku:

```
Authorization: Bearer <token>
```

## Role użytkowników

- **ADMINISTRATOR** - pełny dostęp do systemu
- **MANAGER** - zarządzanie wieloma aptekami i zatwierdzanie grafików
- **KIEROWNIK** - układanie grafików dla swojej apteki
- **MAGISTER** - podgląd grafików, zgłaszanie nieobecności i preferencji
- **TECHNIK** - podgląd grafików, zgłaszanie nieobecności i preferencji

## Endpointy

### Uwierzytelnienie

#### POST `/api/auth/register`
Rejestracja nowego użytkownika.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "haslo123",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "role": "MAGISTER",
  "phoneNumber": "+48123456789"
}
```

#### POST `/api/auth/login`
Logowanie użytkownika.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "haslo123"
}
```

**Response:**
```json
{
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Jan",
      "lastName": "Kowalski",
      "role": "MAGISTER"
    }
  }
}
```

#### GET `/api/auth/me`
Pobierz informacje o zalogowanym użytkowniku.

**Wymagane uprawnienia:** Authenticated

---

### Użytkownicy

#### GET `/api/users`
Lista wszystkich użytkowników.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER

#### GET `/api/users/:id`
Szczegóły użytkownika.

**Wymagane uprawnienia:** Authenticated

#### PUT `/api/users/:id`
Aktualizacja użytkownika.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER

**Body:**
```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "phoneNumber": "+48123456789",
  "role": "KIEROWNIK",
  "isActive": true
}
```

#### DELETE `/api/users/:id`
Usunięcie użytkownika.

**Wymagane uprawnienia:** ADMINISTRATOR

---

### Apteki

#### GET `/api/pharmacies`
Lista wszystkich aktywnych aptek.

**Wymagane uprawnienia:** Authenticated

#### GET `/api/pharmacies/:id`
Szczegóły apteki wraz z przypisanymi pracownikami.

**Wymagane uprawnienia:** Authenticated

#### POST `/api/pharmacies`
Utworzenie nowej apteki.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER

**Body:**
```json
{
  "name": "Apteka Centrum",
  "address": "ul. Główna 1",
  "city": "Warszawa",
  "phoneNumber": "+48221234567"
}
```

#### PUT `/api/pharmacies/:id`
Aktualizacja apteki.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER

#### POST `/api/pharmacies/:pharmacyId/users`
Przypisanie użytkownika do apteki.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER

**Body:**
```json
{
  "userId": "user-uuid"
}
```

---

### Grafiki

#### GET `/api/schedules`
Lista grafików.

**Query params:**
- `pharmacyId` - filtrowanie po aptece
- `status` - filtrowanie po statusie (DRAFT, PENDING_APPROVAL, APPROVED, PUBLISHED)

**Wymagane uprawnienia:** Authenticated

#### GET `/api/schedules/:id`
Szczegóły grafiku wraz ze wszystkimi zmianami.

**Wymagane uprawnienia:** Authenticated

#### POST `/api/schedules`
Utworzenie nowego grafiku.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER, KIEROWNIK

**Body:**
```json
{
  "pharmacyId": "pharmacy-uuid",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "notes": "Grafik na styczeń"
}
```

#### PUT `/api/schedules/:id`
Aktualizacja grafiku.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER, KIEROWNIK

#### POST `/api/schedules/:id/approve`
Zatwierdzenie grafiku.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER

#### POST `/api/schedules/:id/publish`
Publikacja grafiku.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER, KIEROWNIK

---

### Zmiany

#### GET `/api/shifts/schedule/:scheduleId`
Lista zmian dla danego grafiku.

**Wymagane uprawnienia:** Authenticated

#### POST `/api/shifts`
Utworzenie nowej zmiany.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER, KIEROWNIK

**Body:**
```json
{
  "scheduleId": "schedule-uuid",
  "userId": "user-uuid",
  "date": "2024-01-15",
  "shiftType": "MORNING",
  "startTime": "08:00",
  "endTime": "16:00",
  "notes": "Zmiana poranna"
}
```

**Typy zmian:**
- `MORNING` - Poranna
- `AFTERNOON` - Popołudniowa
- `NIGHT` - Nocna
- `FULL_DAY` - Cały dzień

**Walidacja:**
- Sprawdzanie konfliktów (pracownik nie może mieć nakładających się zmian)
- Sprawdzanie zatwierdzonych nieobecności

#### PUT `/api/shifts/:id`
Aktualizacja zmiany.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER, KIEROWNIK

#### DELETE `/api/shifts/:id`
Usunięcie zmiany.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER, KIEROWNIK

---

### Nieobecności

#### GET `/api/absences`
Lista nieobecności.

**Query params:**
- `userId` - filtrowanie po użytkowniku
- `isApproved` - filtrowanie po statusie zatwierdzenia (true/false)

**Wymagane uprawnienia:** Authenticated

#### POST `/api/absences`
Zgłoszenie nieobecności.

**Wymagane uprawnienia:** Authenticated

**Body:**
```json
{
  "startDate": "2024-01-20",
  "endDate": "2024-01-25",
  "absenceType": "VACATION",
  "reason": "Urlop wypoczynkowy"
}
```

**Typy nieobecności:**
- `VACATION` - Urlop
- `SICK_LEAVE` - Zwolnienie lekarskie
- `PERSONAL` - Sprawy osobiste
- `OTHER` - Inne

#### PUT `/api/absences/:id`
Aktualizacja nieobecności.

**Wymagane uprawnienia:** Authenticated (tylko własne nieobecności)

#### POST `/api/absences/:id/approve`
Zatwierdzenie nieobecności.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER, KIEROWNIK

#### DELETE `/api/absences/:id`
Usunięcie nieobecności.

**Wymagane uprawnienia:** Authenticated (tylko własne nieobecności)

---

### Preferencje

#### GET `/api/preferences/me`
Pobierz moje preferencje.

**Wymagane uprawnienia:** Authenticated

#### GET `/api/preferences/user/:userId`
Pobierz preferencje użytkownika.

**Wymagane uprawnienia:** ADMINISTRATOR, MANAGER, KIEROWNIK

#### POST `/api/preferences`
Utworzenie lub aktualizacja preferencji.

**Wymagane uprawnienia:** Authenticated

**Body:**
```json
{
  "preferredDays": ["Monday", "Tuesday", "Wednesday"],
  "preferredShiftTypes": ["MORNING", "AFTERNOON"],
  "notes": "Preferuję pracę w dni powszednie"
}
```

#### DELETE `/api/preferences/:id`
Usunięcie preferencji.

**Wymagane uprawnienia:** Authenticated

---

## Statusy odpowiedzi

- `200` - Sukces
- `201` - Utworzono zasób
- `400` - Błędne dane wejściowe
- `401` - Brak autoryzacji
- `403` - Brak uprawnień
- `404` - Nie znaleziono zasobu
- `500` - Błąd serwera

## Format błędów

```json
{
  "error": {
    "message": "Opis błędu",
    "details": "Szczegóły (tylko w trybie development)"
  }
}
```
