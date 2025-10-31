import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { userService, supplierService, productService, pigService, reproductiveDataService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSuppliers: 0,
    totalPigs: 0,
    totalProducts: 0
  });
  const [reproductiveParams, setReproductiveParams] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Cargar todas las estadísticas en paralelo
        const [users, suppliers, pigs, products] = await Promise.all([
          userService.getAllUsers().catch((err) => {
            console.log('Error loading users:', err);
            return [];
          }),
          supplierService.getAllSuppliers().catch((err) => {
            console.log('Error loading suppliers:', err);
            return [];
          }),
          pigService.getAllPigs().catch((err) => {
            console.log('Error loading pigs:', err);
            return [];
          }),
          productService.getAllProducts().catch((err) => {
            console.log('Error loading products:', err);
            return [];
          })
        ]);

        console.log('Dashboard data:', {
          users,
          suppliers,
          pigs,
          products
        });

        const newStats = {
          totalUsers: users?.length || 0,
          totalSuppliers: suppliers?.length || 0,
          totalPigs: pigs?.length || 0,
          totalProducts: products?.length || 0
        };

        console.log('Setting stats to:', newStats);
        setStats(newStats);

        // Cargar parámetros reproductivos
        try {
          const params = await reproductiveDataService.getReproductiveParameters();
          setReproductiveParams(params);
        } catch (err) {
          console.log('Error loading reproductive parameters:', err);
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las estadísticas del dashboard"
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1a2e02] mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenido al sistema de gestión Granme, {user?.firstName || 'Usuario'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Empleados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1a2e02]">
              {loading ? '...' : stats.totalUsers}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total registrados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Proveedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1a2e02]">
              {loading ? '...' : stats.totalSuppliers}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Proveedores activos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Registro Porcino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1a2e02]">
              {loading ? '...' : stats.totalPigs}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cerdos registrados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1a2e02]">
              {loading ? '...' : stats.totalProducts}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              En inventario actual
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Nueva venta registrada</p>
                  <p className="text-sm text-gray-500">Hace 3 horas</p>
                </div>
                <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded-full">
                  Venta
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Ingreso de inventario</p>
                  <p className="text-sm text-gray-500">Hace 5 horas</p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                  Inventario
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Nuevo usuario registrado</p>
                  <p className="text-sm text-gray-500">Hace 1 día</p>
                </div>
                <span className="text-sm bg-purple-100 text-purple-800 py-1 px-2 rounded-full">
                  Usuario
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recordatorios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Vacunación programada</p>
                  <p className="text-sm text-gray-500">Mañana, 9:00 AM</p>
                </div>
                <span className="text-sm bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">
                  Urgente
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Pago a proveedor</p>
                  <p className="text-sm text-gray-500">En 3 días</p>
                </div>
                <span className="text-sm bg-orange-100 text-orange-800 py-1 px-2 rounded-full">
                  Pendiente
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Mantenimiento de equipos</p>
                  <p className="text-sm text-gray-500">En 7 días</p>
                </div>
                <span className="text-sm bg-gray-100 text-gray-800 py-1 px-2 rounded-full">
                  Programado
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas de ejemplo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Parámetros Reproductivos - Granja</CardTitle>
            <CardDescription>Indicadores clave de producción reproductiva</CardDescription>
          </CardHeader>
          <CardContent>
            {reproductiveParams ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tasa de Fertilidad</span>
                    <div className="flex items-center gap-2">
                      {reproductiveParams.farm.fertilityRate >= 87 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-bold">{reproductiveParams.farm.fertilityRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${reproductiveParams.farm.fertilityRate >= 87 ? 'bg-green-600' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(reproductiveParams.farm.fertilityRate, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Objetivo: 87-95%</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tasa de Repeticiones</span>
                    <div className="flex items-center gap-2">
                      {reproductiveParams.farm.repeatRate <= 15 ? (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-bold">{reproductiveParams.farm.repeatRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${reproductiveParams.farm.repeatRate <= 15 ? 'bg-green-600' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(reproductiveParams.farm.repeatRate * 2, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Objetivo: &lt;15%</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tasa de Abortos</span>
                    <div className="flex items-center gap-2">
                      {reproductiveParams.farm.abortionRate <= 3 ? (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-bold">{reproductiveParams.farm.abortionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${reproductiveParams.farm.abortionRate <= 3 ? 'bg-green-600' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(reproductiveParams.farm.abortionRate * 10, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Objetivo: &lt;2-4%</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Cargando parámetros...</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Producción Mensual - Lechones</CardTitle>
            <CardDescription>Evolución de nacimientos y destetes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Gráfica simple de barras */}
              <div className="space-y-2">
                <div className="flex items-end justify-between h-48 gap-2">
                  {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((month, index) => {
                    const height = [85, 92, 78, 95, 88, 100][index];
                    const height2 = [75, 82, 70, 85, 78, 90][index];
                    return (
                      <div key={month} className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-full relative h-full flex items-end justify-center gap-1">
                          <div
                            className="w-full bg-[#6b7c45] rounded-t"
                            style={{ height: `${height}%` }}
                            title={`Nacidos: ${height}`}
                          />
                          <div
                            className="w-full bg-[#8fa063] rounded-t"
                            style={{ height: `${height2}%` }}
                            title={`Destetados: ${height2}`}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 justify-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#6b7c45] rounded" />
                    <span className="text-xs text-gray-600">Nacidos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#8fa063] rounded" />
                    <span className="text-xs text-gray-600">Destetados</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de distribución por raza */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Distribución de Cerdas por Raza</CardTitle>
          <CardDescription>Composición genética del lote reproductor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Large White', value: 45, color: 'bg-blue-500' },
              { name: 'Landrace', value: 30, color: 'bg-green-500' },
              { name: 'Duroc', value: 20, color: 'bg-yellow-500' },
              { name: 'Otras', value: 5, color: 'bg-gray-500' },
            ].map((breed) => (
              <div key={breed.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{breed.name}</span>
                  <span className="text-sm font-bold">{breed.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${breed.color} h-3 rounded-full`}
                    style={{ width: `${breed.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}