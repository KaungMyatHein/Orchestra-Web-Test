import type { Meta, StoryObj } from '@storybook/react-vite';

import { FigmaButton, type FigmaButtonProps } from '../components/FigmaButton';

const meta = {
  title: 'Figma/Button',
  component: FigmaButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
  args: {
    label: 'Button CTA',
  },
} satisfies Meta<typeof FigmaButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

export const WithoutLeadingIcon: Story = {
  args: {
    leadingIcon: null,
  } satisfies FigmaButtonProps,
};

export const WithoutTrailingIcon: Story = {
  args: {
    trailingIcon: null,
  } satisfies FigmaButtonProps,
};

