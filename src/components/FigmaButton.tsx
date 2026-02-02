import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './FigmaButton.css';

export type FigmaButtonProps = {
  /** Button label text, defaults to the Figma text “Button CTA”. */
  label?: string;
  /** Optional leading icon node. If omitted, a circular outline icon is rendered. */
  leadingIcon?: ReactNode;
  /** Optional trailing icon node. If omitted, a circular outline icon is rendered. */
  trailingIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function FigmaButton({
  label = 'Button CTA',
  leadingIcon,
  trailingIcon,
  className,
  ...buttonProps
}: FigmaButtonProps) {
  return (
    <button
      type="button"
      className={['figma-button', className].filter(Boolean).join(' ')}
      {...buttonProps}
    >
      {leadingIcon ?? <span className="figma-button__icon" aria-hidden="true" />}
      <span className="figma-button__label">{label}</span>
      {trailingIcon ?? <span className="figma-button__icon" aria-hidden="true" />}
    </button>
  );
}

