import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export { default as Item } from './Item.vue';
export { default as ItemActions } from './ItemActions.vue';
export { default as ItemContent } from './ItemContent.vue';
export { default as ItemDescription } from './ItemDescription.vue';
export { default as ItemFooter } from './ItemFooter.vue';
export { default as ItemGroup } from './ItemGroup.vue';
export { default as ItemHeader } from './ItemHeader.vue';
export { default as ItemMedia } from './ItemMedia.vue';
export { default as ItemSeparator } from './ItemSeparator.vue';
export { default as ItemTitle } from './ItemTitle.vue';

export const itemVariants = cva(
  'group/item flex items-center text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-border',
        muted: 'bg-muted/50',
      },
      size: {
        default: 'p-4 gap-4 ',
        sm: 'h-[70px] py-3 px-4 gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const itemMediaVariants = cva(
  'flex shrink-0 items-center justify-center gap-2 [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "size-9 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-5",
        image:
          'size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type ItemVariants = VariantProps<typeof itemVariants>;
export type ItemMediaVariants = VariantProps<typeof itemMediaVariants>;
