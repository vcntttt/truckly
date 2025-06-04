import {
  Truck,
  User,
  Menu,
  X,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";
import { user } from "@/lib/data/user";

export function ConductorNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled && "shadow-md backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2">
            <Truck className="h-6 w-6 " />
            <span className="text-xl font-bold ">Truckly</span>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3"
                >
                  <div className="w-8 h-8 rounded-full  flex items-center justify-center">
                    <User className="h-4 w-4 " />
                  </div>
                  <span className="text-sm font-medium ">{user.name}</span>
                  <ChevronDown className="h-4 w-4 " />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs ">Conductor</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-5 w-5 " />
                      <span className="font-bold ">Truckly</span>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  <div className="py-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                        <User className="h-5 w-5 " />
                      </div>
                      <div>
                        <p className="font-medium ">{user.name}</p>
                        <p className="text-sm ">Conductor</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 py-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-3 h-5 w-5" />
                      <span>Mi Perfil</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-3 h-5 w-5" />
                      <span>Configuración</span>
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start ">
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Cerrar Sesión</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
