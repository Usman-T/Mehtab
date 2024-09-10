import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  const { pathname } = useLocation();
  const viewportRef = React.useRef();

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: 0,
        behavior: 'smooth', 
      });
    }
  }, [pathname]);

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport ref={viewportRef} className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
