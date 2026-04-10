# MasterTemplate

Angular + Crestron CH5 UI template intended for Crestron touch panels, with signal-driven navigation and source selection that can be controlled by either:

- a SIMPL# / C# backend
- a SIMPL Windows program

The app uses `@crestron/ch5-crcomlib` joins for control-system integration and builds to a CH5 archive (`.ch5z`) for deployment.

## Stack

- Angular 18
- Crestron CH5 libraries:
  - `@crestron/ch5-crcomlib`
  - `@crestron/ch5-theme`
  - `@crestron/ch5-utilities`
- SCSS styling
- Signal-driven component state (`CrComLib.subscribeState`)

## Project Structure

- `src/app/app.component.*`: root shell (`title-bar`, router outlet, system message popup)
- `src/app/app-routing.module.ts`: route table + CrComLib subscriptions for page navigation joins
- `src/app/media-page/*`: media/source host page (currently used as the main page)
- `src/app/components/title-bar/*`: page title text + power/home/menu actions
- `src/app/components/source-list/*`: dynamic source list driven by joins
- `src/app/popups/power-confirm/*`: power confirmation popup with timeout and source clear
- `src/app/helpers/CrComLibHelpers.ts`: helper extensions (`pulseDigital`, `setDigital`, etc.)
- `src/config/Master.cse2j`: primary CH5 contract source file
- `src/config/contract.cse2j`: generated/used CH5 contract

## Prerequisites

- Node.js and npm
- Angular CLI (optional globally, available via `npm run ng`)
- Crestron CH5 CLI (`ch5-cli`) available in your shell for `archive` and `deploy` scripts

## Install

```bash
npm install
```

## Run Locally

```bash
npm start
```

App runs on `http://localhost:4200`.

## Build + Archive + Deploy

```bash
npm run build
npm run archive
npm run deploy
```

Notes:

- `npm run archive` uses:
  - contract: `src/config/Master.cse2j`
  - project name: `MasterTemplate`
  - output bundle: `dist/MasterTemplate.ch5z`
- `npm run deploy` currently targets `192.168.4.188`; update `package.json` for your processor/panel IP.

## Control System Integration

### Route/navigation joins

Defined in `app-routing.module.ts`:

- `HeaderBar.HomePageVisibilityJoin`
- `HeaderBar.MainPageVisibilityJoin`
- `HeaderBar.SecurityPageVisibilityJoin`
- `HeaderBar.LightingPageVisibilityJoin`
- `HeaderBar.ShadesPageVisibilityJoin`
- `HeaderBar.CamerasPageVisibilityJoin`

When these booleans pulse true, Angular navigates to the corresponding route.

### Source list joins

Defined in `source-list.component.ts` and `media-page.component.ts`:

- Source title serials: `MainPage.SourceList.Source{N}Text`
- Source selected feedback booleans: `MainPage.SourceList.Source{N}FB`
- Source button press booleans: `MainPage.SourceList.Source{N}Press`
- No-source feedback: `MainPage.SourceList.NoneSelectedFB`

### Power popup joins

Defined in `power-confirm.component.ts`:

- Visibility feedback: `MainPage.PowerOffPopUpVisibility`
- Yes press: `PowerPopUp.YesButtonPress`
- No press: `PowerPopUp.NoButtonPress`
- All off press: `PowerPopUp.WholehouseOffPress`

## Customization Guide

### 1. Add/rename sources

Update:

- `Source` enum in `src/app/media-page/media-page.component.ts`
- `readonly Sources` count in same file
- `getCurrentSourceText()` labels
- corresponding joins/signals in your SIMPL#/SIMPL program

### 2. Change weather city

Edit in `src/app/components/weather/weather.component.ts`:

- `location` (lat/lon)
- `city`
- API key handling (recommended to move key out of source code)

### 3. Page visibility / title behavior

Update:

- route/subscription logic in `src/app/app-routing.module.ts`
- title text join `HeaderBar.PageNameText` in `title-bar.component.ts`
- `TitleService` usage if page visibility flags change

### 4. Base href for panel hosting

`src/index.html` is set to:

```html
<base href="./" />
```

This is generally correct for CH5 hosted panel content.

## Current Notes

- `media-page` is currently acting as the main page route target (`main-page` route points to `MediaPageComponent`).
- `src/app/components/power/power.component.ts` and `.html` are currently empty placeholders.
- `main-page.component.ts` still exists but is not the primary routed implementation.

## Test

```bash
npm test
```

## Troubleshooting

- Blank page after deploy:
  - verify `base href` is `./`
  - confirm contract and joins match processor program
  - check browser/panel console for failed signal subscriptions
- `ch5-cli` command not found:
  - install Crestron CH5 CLI and ensure it is on your shell `PATH`
- Routing does not react to control system:
  - verify boolean joins are pulsed true from SIMPL#/SIMPL
  - confirm join names exactly match code
