export type CursorEffectResult = {
    destroy(): void;
}

type DefaultOptions = {
    readonly element?: HTMLElement;
}

export type BubbleCursorOptions = {
} & DefaultOptions;

export type CharacterCursorOptions = {
    readonly characters?: readonly string[];
    readonly colors?: readonly string[];
    readonly cursorOffset?: { readonly x: number; readonly y: number };
    readonly font?: string;
    readonly characterLifeSpanFunction?: () => number;
    readonly initialCharacterVelocityFunction?: () => { readonly x: number; readonly y: number };
    readonly characterScalingFunction?: () => number;
    readonly characterNewRotationDegreesFunction?: (age: number, lifeSpan: number) => number;
} & DefaultOptions;

export type ClockCursorOptions = {
    readonly dateColor?: string;
    readonly faceColor?: string;
    readonly secondsColor?: string;
    readonly minutesColor?: string;
    readonly hoursColor?: string;
    readonly theDays?: string[];
    readonly theMonths?: string[];
} & DefaultOptions;

export type EmojiCursorOptions = {
    readonly emoji?: readonly string[];
} & DefaultOptions;

export type FairyDustCursorOptions = {
    colors?: readonly string[];
} & DefaultOptions;

export type FollowingDotCursorOptions = {
    readonly color?: string;
} & DefaultOptions;

export type GhostCursorOptions = {
    readonly randomDelay?: boolean;
    readonly minDelay?: number;
    readonly maxDelay?: number;
    readonly image?: string;
} & DefaultOptions;

export type RainbowCursorOptions = {
    length?: number;
    colors?: readonly string[];
    size?: number;
} & DefaultOptions;

export type SnowflakeCursorOptions = {
} & DefaultOptions;

export type SpringyEmojiCursorOptions = {
    readonly emoji?: string;
} & DefaultOptions;

export type TextFlagOptions = {
    readonly text?: string;
    readonly color?: string;
    readonly size?: number;
    readonly font?: string;
    readonly textSize?: number;
    readonly gap?: number;
} & DefaultOptions;

export type TrailingCursorOptions = {
    readonly particles?: number;
    readonly rate?: number;
    readonly baseImageSrc?: number | string;
} & DefaultOptions;

export function bubbleCursor(options?: BubbleCursorOptions): CursorEffectResult;
export function characterCursor(options?: CharacterCursorOptions): CursorEffectResult;
export function clockCursor(options?: ClockCursorOptions): CursorEffectResult;
export function emojiCursor(options?: EmojiCursorOptions): CursorEffectResult;
export function fairyDustCursor(options?: FairyDustCursorOptions): CursorEffectResult;
export function followingDotCursor(options?: FollowingDotCursorOptions): CursorEffectResult;
export function ghostCursor(options?: GhostCursorOptions): CursorEffectResult;
export function rainbowCursor(options?: RainbowCursorOptions): CursorEffectResult;
export function snowflakeCursor(options?: SnowflakeCursorOptions): CursorEffectResult;
export function springyEmojiCursor(options?: SpringyEmojiCursorOptions): CursorEffectResult;
export function textFlag(options?: TextFlagOptions): CursorEffectResult;
export function trailingCursor(options?: TrailingCursorOptions): CursorEffectResult;
