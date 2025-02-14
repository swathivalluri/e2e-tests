 
import { Page } from '@playwright/test'
import { createLogger } from '@/utils/logger/logger';
import { Logger } from 'winston';

/** BasePage enforces validate() and mutate() */
export abstract class BasePage {
  protected page: Page;
  protected logger: Logger

  constructor(page: Page, pageName: string) {
    this.page = page
    this.logger = createLogger(pageName)
  }

  /** Every page must implement validation */
  abstract validate(): Promise<void>;

  /** Every page must implement mutations (actions) */
  abstract mutate(...args: unknown[]): Promise<void>;
}
