import { useState } from 'react';
import { NavLink } from 'react-router';
import { Button } from './button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Menu } from 'lucide-react';

export function BurgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu
            className={`h-5 w-5 transition-transform ${
              open ? 'rotate-90' : 'rotate-0'
            }`}
          />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Меню</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8 ml-2">
          <NavLink
            to="/home"
            end
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Главная
          </NavLink>
          <NavLink
            to="/reservations"
            end
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Мои бронирования
          </NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
