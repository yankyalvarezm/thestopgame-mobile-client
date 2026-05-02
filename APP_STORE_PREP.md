# App Store Prep

## Current Build Setup

- Expo account: `yankyalvarezm`
- EAS project: `thestopgame-mobile-client`
- EAS project id: `110a36e6-c475-4461-8bd3-0ef83ae91f41`
- iOS bundle id: `com.thestopgame.app`
- Backend API: `https://thestopgame-mobile-server-production.up.railway.app`
- Initial target: iPhone only
- Encryption: standard/exempt, `ITSAppUsesNonExemptEncryption=false`

## Suggested Store Metadata

App name:
`the STOP Game`

Subtitle:
`Fast categories. Real pressure.`

Promotional text:
`Play the classic STOP-style word game with timed rounds, real scoring, and curated categories.`

Description:
`the STOP Game is a fast word challenge inspired by the classic categories game. Pick a setlist, tune the round, get a random letter, and race the timer to answer each category before time runs out. Your score builds across rounds, and the final result depends on reaching the target for your difficulty and timer.`

Keywords draft:
`word game,categories,stop game,trivia,vocabulary,party game,dominican,letters`

Category:
`Games`

Secondary category:
`Word`

Age rating expectation:
`4+`

Support URL:
`https://thestopgame.com/support`

Privacy Policy URL:
`https://thestopgame.com/privacy`

Terms URL:
`https://thestopgame.com/terms`

## Required Before Submission

- Apple Developer membership must change from `Pending` to active.
- Create App Store Connect app record for bundle id `com.thestopgame.app`.
- Confirm final support/privacy/terms URLs exist.
- Confirm Google OAuth production setup.
- Create iPhone screenshots for App Store listing.
- Run an EAS preview build and test on device.
- Run a production build and submit to TestFlight.

## Build Commands

Preview build:

```bash
eas build --platform ios --profile preview
```

Production build:

```bash
eas build --platform ios --profile production
```

Submit production build:

```bash
eas submit --platform ios --profile production
```
