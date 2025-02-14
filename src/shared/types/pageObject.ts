/* eslint-disable @typescript-eslint/no-explicit-any */
// @TODO: Fix lint issue
import { type Locator as PWLocator } from "@playwright/test";

type Locator = (...args: readonly any[]) => PWLocator;
type Mutator = (...args: any[]) => Promise<void>;
type Validator = (...args: any[]) => Promise<void>;

type Locators = Record<string, Locator | Record<string, Locator>>
type Mutators = Record<string, Mutator | Record<string, Mutator>>
type Validators = Record<string, Validator | Record<string, Validator>>

type ObjectModel = {
    readonly mutate: Mutators;
    readonly validate: Validators;
}

export type { Locators, ObjectModel };
