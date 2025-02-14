import { Browser } from '@playwright/test';

declare global {
    let __BROWSER_GLOBAL__: Browser | undefined
}

export {}