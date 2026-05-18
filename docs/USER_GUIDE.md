# Przewodnik użytkownika - System Grafików Aptek

## Spis treści

1. [Logowanie do systemu](#logowanie-do-systemu)
2. [Role użytkowników](#role-użytkowników)
3. [Dashboard](#dashboard)
4. [Grafiki](#grafiki)
5. [Zmiany](#zmiany)
6. [Nieobecności](#nieobecności)
7. [Preferencje](#preferencje)
8. [Zarządzanie użytkownikami](#zarządzanie-użytkownikami)
9. [Zarządzanie aptekami](#zarządzanie-aptekami)

---

## Logowanie do systemu

1. Otwórz aplikację w przeglądarce
2. Wprowadź swój adres email i hasło
3. Kliknij "Zaloguj się"

Po zalogowaniu zostaniesz przekierowany do Dashboard.

---

## Role użytkowników

System obsługuje 5 ról użytkowników:

### Administrator
- Pełny dostęp do wszystkich funkcji systemu
- Zarządzanie użytkownikami (tworzenie, edycja, usuwanie)
- Zarządzanie aptekami
- Tworzenie i zatwierdzanie grafików
- Zarządzanie wszystkimi nieobecnościami

### Menadżer
- Zarządzanie wieloma aptekami
- Tworzenie i zatwierdzanie grafików
- Zatwierdzanie nieobecności
- Zarządzanie użytkownikami (ograniczone)

### Kierownik
- Układanie grafików dla swojej apteki
- Przypisywanie zmian pracownikom
- Zatwierdzanie nieobecności w swojej aptece
- Publikowanie grafików

### Magister
- Podgląd grafików
- Zgłaszanie własnych nieobecności
- Ustawianie preferencji grafików

### Technik
- Podgląd grafików
- Zgłaszanie własnych nieobecności
- Ustawianie preferencji grafików

---

## Dashboard

Dashboard to strona główna po zalogowaniu. Zawiera:

### Ostatnie Grafiki
- Lista 5 ostatnio opublikowanych grafików
- Możliwość szybkiego przejścia do szczegółów grafiku

### Moje Nieobecności
- Lista twoich zgłoszonych nieobecności
- Status: zatwierdzona / oczekująca

### Szybkie Akcje (dla uprawnionych ról)
- Utwórz nowy grafik
- Zarządzaj użytkownikami
- Zarządzaj aptekami

---

## Grafiki

### Przeglądanie grafików

1. Kliknij "Grafiki" w menu nawigacji
2. Zobaczysz listę wszystkich grafików z:
   - Nazwą apteki
   - Okresem obowiązywania
   - Statusem
   - Autorem

### Tworzenie nowego grafiku (Kierownik/Menadżer/Administrator)

1. Kliknij "Utwórz nowy grafik"
2. Wypełnij formularz:
   - **Apteka** - wybierz aptekę z listy
   - **Data rozpoczęcia** - pierwszy dzień grafiku
   - **Data zakończenia** - ostatni dzień grafiku
   - **Notatki** - opcjonalne uwagi
3. Kliknij "Utwórz grafik"

### Statusy grafiku

- **Wersja robocza** - grafik w trakcie tworzenia
- **Oczekuje na zatwierdzenie** - grafik gotowy do zatwierdzenia
- **Zatwierdzony** - grafik zatwierdzony przez menadżera
- **Opublikowany** - grafik widoczny dla wszystkich pracowników

---

## Zmiany

### Przeglądanie zmian w grafiku

1. Kliknij na wybrany grafik z listy
2. Zobaczysz widok kalendarzowy ze wszystkimi zmianami
3. Każdy dzień pokazuje:
   - Nazwę dnia tygodnia
   - Datę
   - Przypisane zmiany z pracownikami i godzinami

### Dodawanie zmiany (Kierownik/Menadżer/Administrator)

1. Otwórz szczegóły grafiku
2. Kliknij "Dodaj zmianę"
3. Wypełnij formularz:
   - **Pracownik** - wybierz z listy
   - **Data** - wybierz dzień
   - **Typ zmiany**:
     - Poranna (domyślnie 8:00-16:00)
     - Popołudniowa (domyślnie 14:00-22:00)
     - Nocna (domyślnie 22:00-6:00)
     - Cały dzień (domyślnie 8:00-20:00)
   - **Godzina rozpoczęcia** - czas rozpoczęcia zmiany
   - **Godzina zakończenia** - czas zakończenia zmiany
4. Kliknij "Dodaj"

### Wykrywanie konfliktów

System automatycznie sprawdza:
- Czy pracownik nie ma już przypisanej zmiany w tym samym czasie
- Czy pracownik nie ma zatwierdzonej nieobecności w tym dniu

Jeśli konflikt zostanie wykryty, zobaczysz komunikat błędu.

### Kolory zmian

- **Żółty** - Zmiana poranna
- **Niebieski** - Zmiana popołudniowa
- **Zielony** - Zmiana nocna
- **Szary** - Cały dzień

---

## Nieobecności

### Zgłaszanie nieobecności

1. Kliknij "Nieobecności" w menu
2. Kliknij "Zgłoś nieobecność"
3. Wypełnij formularz:
   - **Typ nieobecności**:
     - Urlop
     - Zwolnienie lekarskie
     - Sprawy osobiste
     - Inne
   - **Data rozpoczęcia**
   - **Data zakończenia**
   - **Powód** - opcjonalny opis
4. Kliknij "Zgłoś"

### Statusy nieobecności

- **Oczekuje** - nieobecność czeka na zatwierdzenie
- **Zatwierdzona** - nieobecność została zatwierdzona

### Zatwierdzanie nieobecności (Kierownik/Menadżer/Administrator)

1. Przejdź do listy nieobecności
2. Znajdź nieobecność oczekującą na zatwierdzenie
3. Kliknij "Zatwierdź"

⚠️ **Uwaga:** Zatwierdzone nieobecności blokują możliwość przypisania pracownika do zmiany w danym okresie.

---

## Preferencje

### Ustawianie preferencji

1. Kliknij "Preferencje" w menu
2. Jeśli to pierwsze ustawienie, zobaczysz formularz
3. Wybierz:
   - **Preferowane dni tygodnia** - zaznacz dni, w które wolisz pracować
   - **Preferowane typy zmian** - zaznacz preferowane zmiany
   - **Dodatkowe uwagi** - wpisz dodatkowe informacje
4. Kliknij "Zapisz"

### Edycja preferencji

1. Otwórz "Preferencje"
2. Kliknij "Edytuj"
3. Zmień wybrane opcje
4. Kliknij "Zapisz" lub "Anuluj"

ℹ️ **Informacja:** Preferencje są pomocne dla kierowników przy układaniu grafików, ale nie są wiążące.

---

## Zarządzanie użytkownikami

*Dostępne dla: Administrator, Menadżer*

### Przeglądanie użytkowników

1. Kliknij "Użytkownicy" w menu
2. Zobaczysz listę wszystkich użytkowników z:
   - Imieniem i nazwiskiem
   - Adresem email
   - Rolą
   - Numerem telefonu
   - Statusem (aktywny/nieaktywny)

### Dezaktywacja użytkownika (Administrator)

1. Znajdź użytkownika na liście
2. Kliknij "Dezaktywuj"
3. Użytkownik nie będzie mógł się zalogować

### Ponowna aktywacja

1. Znajdź nieaktywnego użytkownika
2. Kliknij "Aktywuj"

---

## Zarządzanie aptekami

*Dostępne dla: Administrator, Menadżer*

### Przeglądanie aptek

1. Kliknij "Apteki" w menu
2. Zobaczysz listę wszystkich aptek z:
   - Nazwą
   - Miastem
   - Adresem
   - Numerem telefonu
   - Liczbą przypisanych pracowników

### Dodawanie nowej apteki

1. Kliknij "Dodaj aptekę"
2. Wypełnij formularz:
   - **Nazwa** - nazwa apteki
   - **Adres** - ulica i numer
   - **Miasto** - miasto
   - **Telefon** - numer kontaktowy
3. Kliknij "Dodaj aptekę"

---

## Najlepsze praktyki

### Dla Kierowników

1. **Twórz grafiki z wyprzedzeniem** - przynajmniej 2 tygodnie przed rozpoczęciem okresu
2. **Sprawdzaj preferencje pracowników** - ułatwi to układanie grafiku
3. **Kontroluj nieobecności** - przed przypisaniem zmiany sprawdź czy pracownik jest dostępny
4. **Publikuj po zatwierdzeniu** - dopiero po zatwierdzeniu grafik jest widoczny dla pracowników

### Dla Pracowników (Magister/Technik)

1. **Zgłaszaj nieobecności wcześniej** - im wcześniej, tym łatwiej ułożyć grafik
2. **Aktualizuj preferencje** - pomaga kierownikom w planowaniu
3. **Sprawdzaj grafik regularnie** - aby być na bieżąco ze zmianami

### Dla Menadżerów

1. **Zatwierdzaj grafiki przed publikacją** - kontrola jakości
2. **Monitoruj nieobecności** - zapewnienie odpowiedniego pokrycia zmianami
3. **Sprawdzaj konflikty** - upewnij się, że nie ma nakładających się zmian

---

## FAQ

**Q: Nie mogę przypisać pracownika do zmiany, pojawia się błąd konfliktu**
A: Sprawdź czy:
- Pracownik nie ma już zmiany w tym samym czasie
- Pracownik nie ma zatwierdzonej nieobecności w tym dniu

**Q: Jak usunąć zmianę z grafiku?**
A: Obecnie usunięcie zmiany jest możliwe tylko przez API. Ta funkcja zostanie dodana w przyszłej wersji.

**Q: Czy mogę edytować opublikowany grafik?**
A: Tak, grafik można edytować nawet po publikacji. Wszystkie zmiany są widoczne od razu.

**Q: Jak zmienić swoje hasło?**
A: Funkcja zmiany hasła zostanie dodana w przyszłej wersji. Obecnie skontaktuj się z administratorem.

**Q: Grafik nie wyświetla się poprawnie**
A: Spróbuj odświeżyć stronę (F5). Jeśli problem nadal występuje, skontaktuj się z administratorem.

---

## Wsparcie techniczne

W razie problemów skontaktuj się z administratorem systemu lub sprawdź [dokumentację techniczną](./API.md).
