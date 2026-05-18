# Uwagi dotyczące bezpieczeństwa produkcyjnego

## ⚠️ Ważne dla wdrożenia produkcyjnego

Ten system MVP nie zawiera wszystkich zabezpieczeń wymaganych w środowisku produkcyjnym. Przed wdrożeniem należy zaimplementować następujące funkcje:

### 1. Rate Limiting

System obecnie nie posiada mechanizmów ograniczania liczby zapytań (rate limiting). **Należy to zaimplementować przed wdrożeniem produkcyjnym.**

#### Zalecane rozwiązanie: express-rate-limit

```bash
cd server
npm install express-rate-limit
```

Przykładowa konfiguracja w `server/src/index.js`:

```javascript
const rateLimit = require('express-rate-limit');

// Ogólny limit dla wszystkich zapytań
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100, // max 100 zapytań na IP
  message: 'Zbyt wiele zapytań z tego adresu IP, spróbuj ponownie później.'
});

// Bardziej restrykcyjny limit dla logowania
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // max 5 prób logowania
  message: 'Zbyt wiele prób logowania, spróbuj ponownie za 15 minut.',
  skipSuccessfulRequests: true
});

// Aplikuj limity
app.use('/api/', generalLimiter);
app.use('/api/auth/login', loginLimiter);
```

### 2. HTTPS

W produkcji **zawsze** używaj HTTPS. Nigdy nie przesyłaj tokenów JWT przez niezabezpieczone połączenie HTTP.

### 3. Zmienne środowiskowe

**Nigdy** nie commituj pliku `.env` do repozytorium. Wartości w `.env.example` to tylko przykłady.

Koniecznie zmień:
- `JWT_SECRET` - użyj silnego, losowego ciągu minimum 32 znaki
- Hasła do bazy danych
- W produkcji ustaw `NODE_ENV=production`

#### Generowanie bezpiecznego JWT_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Walidacja danych wejściowych

Dodaj express-validator do wszystkich endpointów akceptujących dane od użytkownika:

```bash
npm install express-validator
```

Przykład:

```javascript
const { body, validationResult } = require('express-validator');

router.post('/schedules',
  authenticate,
  authorize('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK'),
  [
    body('pharmacyId').isUUID(),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('notes').optional().trim().escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... reszta logiki
  }
);
```

### 5. CORS

Skonfiguruj CORS odpowiednio dla swojego środowiska. W `server/src/index.js`:

```javascript
const cors = require('cors');

// Produkcja - tylko zaufane domeny
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://twoja-domena.pl',
  credentials: true
}));
```

Dodaj do `.env`:
```
ALLOWED_ORIGINS=https://twoja-domena.pl,https://www.twoja-domena.pl
```

### 6. Logowanie i monitoring

Zaimplementuj właściwe logowanie błędów i monitoring:

```bash
npm install winston
```

### 7. Helmet

Dodaj dodatkowe nagłówki bezpieczeństwa:

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 8. SQL Injection

Prisma ORM automatycznie chroni przed SQL Injection, ale:
- Unikaj używania `$queryRaw` bez parametryzacji
- Zawsze waliduj dane wejściowe

### 9. Rotacja tokenów

Rozważ implementację:
- Refresh tokens
- Blacklist dla unieważnionych tokenów
- Ograniczony czas życia tokenów (obecnie 7 dni - może być za długo dla produkcji)

### 10. Backup bazy danych

Skonfiguruj automatyczne backupy bazy PostgreSQL:

```bash
# Przykład cron job dla daily backup
0 2 * * * pg_dump pharmacy_schedule > /backup/pharmacy_$(date +\%Y\%m\%d).sql
```

### 11. Audit log

Rozważ dodanie logu audytu dla krytycznych operacji:
- Tworzenie/modyfikacja grafików
- Zatwierdzanie nieobecności
- Zmiany uprawnień użytkowników

### 12. CSP (Content Security Policy)

Dodaj Content Security Policy headers dla frontendu.

### 13. Aktualizacje bezpieczeństwa

Regularnie sprawdzaj i aktualizuj zależności:

```bash
npm audit
npm audit fix
```

### 14. Environment-specific configs

Stwórz osobne konfiguracje dla development, staging i production.

## Checklist przed wdrożeniem produkcyjnym

- [ ] Zaimplementowano rate limiting
- [ ] Skonfigurowano HTTPS
- [ ] Zmieniono wszystkie domyślne hasła i sekrety
- [ ] Dodano walidację danych wejściowych
- [ ] Skonfigurowano właściwy CORS
- [ ] Zaimplementowano logowanie i monitoring
- [ ] Dodano Helmet dla dodatkowych zabezpieczeń
- [ ] Skonfigurowano backup bazy danych
- [ ] Zaimplementowano audit log
- [ ] Zaktualizowano wszystkie zależności
- [ ] Przetestowano aplikację pod kątem bezpieczeństwa
- [ ] Skonfigurowano firewall
- [ ] Ograniczono dostęp do bazy danych
- [ ] Przygotowano plan disaster recovery

## Dodatkowe zasoby

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
