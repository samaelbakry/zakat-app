# Zakat

Zakat is a cross-platform Expo application for learning about zakat and estimating zakat due on selected assets and liabilities. It provides account sign-in, a market-price dashboard, an informational guide, and a calculator that submits calculation inputs to the UmmahAPI Zakat service.

> **Note:** The calculator and guide are informational tools. The guide includes a disclaimer supplied by its API; users should consult a qualified scholar or adviser for personal religious or financial guidance.

## Overview

The app guides users from account creation or sign-in to a personal dashboard with current gold and silver prices and nisab values. From there, signed-in users can read zakat information or enter wealth details into a calculator. The app delegates zakat calculation and guide/pricing data retrieval to an external API.

## Features

- **Account access:** Create an account with a name, email, and password, sign in with email and password, and sign out. The full name is stored in Supabase user metadata and displayed on the dashboard.
- **Session persistence:** Supabase Auth sessions are persisted locally using AsyncStorage and restored when the app starts. The root navigator shows a loading indicator until the session check completes and restricts the welcome/auth and home screens according to sign-in state.
- **Market overview:** View gold and silver prices per gram, the price update time, notes about price sources or fallback values, and gold- and silver-based nisab values. The dashboard requests prices in EGP.
- **Zakat guide:** View API-provided information about zakat, including conditions, the lunar year (hawl), zakatable and non-zakatable assets, rates, eligible recipients, nisab, source, and disclaimer.
- **Zakat calculator:** Enter cash, gold, silver, stocks, business goods, other investments, and liabilities. Select EGP or USD, a gold karat (18K, 21K, 22K, or 24K), and a gold- or silver-based nisab standard.
- **Calculation breakdown:** See whether the submitted wealth is above nisab, the calculated zakat due, a wealth breakdown, the prices used, and whether fallback prices were used.
- **English and Arabic locale files:** Locale JSON files are present in the source tree, but the current screens use hard-coded English text and do not load these resources. Arabic localization is not currently integrated into the UI.

Calculation history, saved assets, and the additional money, gold, and Zakat Al-Fitr sections referenced by starter constants are not implemented as usable app flows.

## Tech Stack

| Language | TypeScript, with TSX for React Native screens |
| App framework | Expo SDK 58, React 19, React Native 0.88 |
| Navigation | Expo Router with file-based routes and a protected root stack |
| Authentication | Supabase Auth (`@supabase/supabase-js`) |
| Local auth storage | AsyncStorage |
| API communication | Fetch API and the UmmahAPI Zakat endpoints |
| Styling | `twrnc` utility classes with React Native components |
| Icons | `lucide-react-native` (referenced by home option constants) |
| Web support | React Native Web and Expo's static web output configuration |
| Type checking | TypeScript with strict mode |

The app does not currently contain direct database queries or an application-owned database schema. Supabase is used for authentication. The Zakat guide, prices, and calculation responses come from the external UmmahAPI service.

