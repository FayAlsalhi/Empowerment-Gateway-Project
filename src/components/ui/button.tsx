import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90 shadow-sm',
        destructive: 'bg-destructive text-destructive-foreground hover:-translate-y-0.5 hover:bg-destructive/90',
        outline: 'border border-[#D9DDEB] bg-white text-primary hover:-translate-y-0.5 hover:bg-secondary/60',
        secondary: 'bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/80',
        accent: 'bg-accent text-accent-foreground hover:-translate-y-0.5 hover:bg-accent/90 shadow-sm',
        ghost: 'text-foreground hover:bg-secondary hover:text-secondary-foreground',
        link: 'text-primary font-semibold underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-[45px] px-[17px] py-[9px] text-sm',
        sm: 'min-h-[38px] rounded-md px-3 py-1.5 text-xs',
        lg: 'min-h-[50px] px-5 py-[11px] text-base',
        icon: 'h-11 w-11 shrink-0 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
