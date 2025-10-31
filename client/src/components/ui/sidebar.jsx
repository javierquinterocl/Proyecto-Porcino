
import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import {
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  Package,
  ShoppingCart,
  Truck,
  ChevronDown,
  ChevronRight,
  UserCog,
  LogOut,
  Menu,
  Users,
  PiggyBank,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

function NavItem({ icon, label, href, isActive, collapsed }) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start text-white hover:bg-[#2a4a04] hover:text-white",
        isActive && "bg-[#2a4a04]",
        collapsed && "px-2",
      )}
      asChild
    >
      <Link to={href}>
        {icon}
        {!collapsed && <span className="ml-2">{label}</span>}
      </Link>
    </Button>
  )
}

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [openMenus, setOpenMenus] = useState({
    inventory: false,
    reports: false,
    sows: false,
    reproductive: false,
  });
  const [collapsed, setCollapsed] = useState(false)

  // Determinar qué menú debe estar abierto basado en la ruta actual
  useEffect(() => {
    if (pathname?.includes("/inventory")) {
      setOpenMenus((prev) => ({ ...prev, inventory: true }))
    }
    if (pathname?.includes("/reportes")) {
      setOpenMenus((prev) => ({ ...prev, reports: true }))
    }
    if (pathname?.includes("/sows")) {
      setOpenMenus((prev) => ({ ...prev, sows: true }))
    }
    if (pathname?.includes("/critical-periods") || pathname?.includes("/reproductive-parameters")) {
      setOpenMenus((prev) => ({ ...prev, reproductive: true }))
    }
  }, [pathname])

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <aside
      className={cn(
        "bg-[#1a2e02] text-white flex-shrink-0 hidden md:flex md:flex-col transition-all duration-300 h-full",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 flex-1 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          {!collapsed && <h2 className="text-xl font-bold">Granme</h2>}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#2a4a04] hover:text-white"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto">
          <NavItem
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            href="/"
            isActive={pathname === "/"}
            collapsed={collapsed}
          />

          <NavItem
            icon={<Users className="h-5 w-5" />}
            label="Usuarios"
            href="/users"
            isActive={pathname === "/users"}
            collapsed={collapsed}
          />

          {collapsed ? (
            <NavItem
              icon={<ClipboardList className="h-5 w-5" />}
              label="Hoja de Vida"
              href="/sows"
              isActive={pathname?.includes("/sows")}
              collapsed={collapsed}
            />
          ) : (
            <Collapsible open={openMenus.sows} onOpenChange={() => toggleMenu("sows")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-[#2a4a04] hover:text-white",
                    openMenus.sows && "bg-[#2a4a04]",
                  )}
                >
                  <ClipboardList className="mr-2 h-5 w-5" />
                  <span>Hoja de Vida</span>
                  {openMenus.sows ? (
                    <ChevronDown className="ml-auto h-5 w-5" />
                  ) : (
                    <ChevronRight className="ml-auto h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                <NavItem
                  icon={<PiggyBank className="h-5 w-5" />}
                  label="Registro Porcino"
                  href="/sows/basic-data"
                  isActive={pathname === "/sows/basic-data"}
                  collapsed={collapsed}
                />
                <NavItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="Historial Reproductivo"
                  href="/sows/reproductive-history"
                  isActive={pathname === "/sows/reproductive-history"}
                  collapsed={collapsed}
                />
                <NavItem
                  icon={<Users className="h-5 w-5" />}
                  label="Crías y Descendencia"
                  href="/sows/piglets"
                  isActive={pathname === "/sows/piglets"}
                  collapsed={collapsed}
                />
              </CollapsibleContent>
            </Collapsible>
          )}

          {collapsed ? (
            <NavItem
              icon={<Activity className="h-5 w-5" />}
              label="Datos Reproductivos"
              href="/critical-periods"
              isActive={pathname?.includes("/critical-periods") || pathname?.includes("/reproductive-parameters")}
              collapsed={collapsed}
            />
          ) : (
            <Collapsible open={openMenus.reproductive} onOpenChange={() => toggleMenu("reproductive")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-[#2a4a04] hover:text-white",
                    openMenus.reproductive && "bg-[#2a4a04]",
                  )}
                >
                  <Activity className="mr-2 h-5 w-5" />
                  <span>Datos Reproductivos</span>
                  {openMenus.reproductive ? (
                    <ChevronDown className="ml-auto h-5 w-5" />
                  ) : (
                    <ChevronRight className="ml-auto h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                <NavItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="Períodos Críticos"
                  href="/critical-periods"
                  isActive={pathname === "/critical-periods"}
                  collapsed={collapsed}
                />
                <NavItem
                  icon={<BarChart3 className="h-5 w-5" />}
                  label="Parámetros"
                  href="/reproductive-parameters"
                  isActive={pathname === "/reproductive-parameters"}
                  collapsed={collapsed}
                />
              </CollapsibleContent>
            </Collapsible>
          )}

          <NavItem
            icon={<Truck className="h-5 w-5" />}
            label="Proveedores"
            href="/suppliers"
            isActive={pathname === "/suppliers"}
            collapsed={collapsed}
          />

          {collapsed ? (
            <NavItem
              icon={<Package className="h-5 w-5" />}
              label="Inventario"
              href="/inventory"
              isActive={pathname === "/inventory"}
              collapsed={collapsed}
            />
          ) : (
            <Collapsible open={openMenus.inventory} onOpenChange={() => toggleMenu("inventory")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-[#2a4a04] hover:text-white",
                    openMenus.inventory && "bg-[#2a4a04]",
                  )}
                >
                  <Package className="mr-2 h-5 w-5" />
                  <span>Inventario</span>
                  {openMenus.inventory ? (
                    <ChevronDown className="ml-auto h-5 w-5" />
                  ) : (
                    <ChevronRight className="ml-auto h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                <NavItem
                  icon={<ShoppingCart className="h-5 w-5" />}
                  label="Productos"
                  href="/products"
                  isActive={pathname === "/products"}
                  collapsed={collapsed}
                />
                <NavItem
                  icon={<Package className="h-5 w-5" />}
                  label="Salida de Productos"
                  href="/product-outputs"
                  isActive={pathname === "/product-outputs"}
                  collapsed={collapsed}
                />
              </CollapsibleContent>
            </Collapsible>
          )}

          {collapsed ? (
            <NavItem
              icon={<BarChart3 className="h-5 w-5" />}
              label="Reportes"
              href="/reportes"
              isActive={pathname === "/reportes"}
              collapsed={collapsed}
            />
          ) : (
            <Collapsible open={openMenus.reports} onOpenChange={() => toggleMenu("reports")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-[#2a4a04] hover:text-white",
                    openMenus.reports && "bg-[#2a4a04]",
                  )}
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  <span>Reportes</span>
                  {openMenus.reports ? (
                    <ChevronDown className="ml-auto h-5 w-5" />
                  ) : (
                    <ChevronRight className="ml-auto h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                <NavItem
                  icon={<FileText className="h-5 w-5" />}
                  label="Estadísticas"
                  href="/reportes?tab=statistics"
                  isActive={
                    pathname === "/reportes" && new URLSearchParams(window.location.search).get("tab") === "statistics"
                  }
                  collapsed={collapsed}
                />
                <NavItem
                  icon={<FileText className="h-5 w-5" />}
                  label="Gráficas"
                  href="/reportes?tab=charts"
                  isActive={
                    pathname === "/reportes" && new URLSearchParams(window.location.search).get("tab") === "charts"
                  }
                  collapsed={collapsed}
                />
              </CollapsibleContent>
            </Collapsible>
          )}
        </nav>

        <div className="mt-auto pt-4 border-t border-[#2a4a04] flex-shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-[#2a4a04] hover:text-white"
            asChild
          >
            <Link to="/login">
              <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
              {!collapsed && <span>Cerrar Sesión</span>}
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}

