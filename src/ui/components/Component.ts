/**
 * Times Tables Quest - Base Component
 * 
 * Abstract base class for UI components.
 */

export abstract class Component {
  protected element: HTMLElement;
  protected parent: HTMLElement | null = null;

  constructor(tagName: keyof HTMLElementTagNameMap = 'div') {
    this.element = document.createElement(tagName);
  }

  /**
   * Get the component's DOM element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Mount component to a parent element
   */
  mount(parent: HTMLElement): void {
    this.parent = parent;
    parent.appendChild(this.element);
    this.onMount();
  }

  /**
   * Remove component from DOM
   */
  unmount(): void {
    if (this.parent && this.element.parentNode === this.parent) {
      this.parent.removeChild(this.element);
    }
    this.onUnmount();
    this.parent = null;
  }

  /**
   * Update component (re-render)
   */
  abstract render(): void;

  /**
   * Called after mounting
   */
  protected onMount(): void {
    // Override in subclass if needed
  }

  /**
   * Called before unmounting
   */
  protected onUnmount(): void {
    // Override in subclass if needed
  }

  /**
   * Add CSS class
   */
  addClass(...classes: string[]): void {
    this.element.classList.add(...classes);
  }

  /**
   * Remove CSS class
   */
  removeClass(...classes: string[]): void {
    this.element.classList.remove(...classes);
  }

  /**
   * Set inline style
   */
  setStyle(styles: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.element.style, styles);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.unmount();
  }
}
