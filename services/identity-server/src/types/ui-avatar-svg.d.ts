declare module 'ui-avatar-svg' {
  interface UIAvatarSvgOptions {
    text?: string;
    size?: number;
    bgColor?: string;
    textColor?: string;
  }

  class UIAvatarSvg {
    constructor(options?: UIAvatarSvgOptions);
    text(value: string): this;
    size(value: number): this;
    bgColor(value: string): this;
    textColor(value: string): this;
    generate(): string;
  }

  export default UIAvatarSvg;
}
