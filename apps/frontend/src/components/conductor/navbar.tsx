import { Truck, User, Menu, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "@tanstack/react-router";
import { authClient, useSession } from "@/lib/auth-client";

export function ConductorNavbar() {
  const { data: session } = useSession();
  const navigate = useNavigate();

  if (!session) return null;

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/" });
        },
        onError: ({ error }) => {
          alert("Error al cerrar sesión: " + error.message);
        },
      },
    });
  }

  const user = session.user;
  return (
    <header className="sticky top-0 z-50 max-w-7xl mx-auto bg-background transition-all duration-200">
      <div className="container max-w-7xl flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex h-16 items-center justify-between w-full">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2">
            <Truck className="h-6 w-6" />
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
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
                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </Button>
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
                  <div className="flex items-center justify-between py-4 border-b px-3">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 " />
                      <span className="font-bold ">Truckly</span>
                    </div>
                  </div>

                  <div className="py-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center">
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
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
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
