import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, Eye, Edit2, Trash2, Plus, PiggyBank, Baby, Upload, X, Image as ImageIcon, FileText, FileSpreadsheet, Download, MoreVertical } from "lucide-react";
import { pigService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { 
  exportSowToPDF, 
  exportAllSowsToPDF, 
  exportSowToExcel, 
  exportAllSowsToExcel,
  exportBoarToPDF,
  exportAllBoarsToPDF,
  exportBoarToExcel,
  exportAllBoarsToExcel
} from "@/utils/exportUtils";

export default function ReproductiveList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("cerdas");
  const [sows, setSows] = useState([]);
  const [boars, setBoars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Estados para modales
  const [viewDialog, setViewDialog] = useState({ open: false, sow: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, sow: null });

  // Cargar cerdas
  const loadSows = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await pigService.getAllSows();
      setSows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando cerdas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cerdas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Cargar verracos
  const loadBoars = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await pigService.getAllBoars();
      setBoars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando verracos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los verracos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (activeTab === "cerdas") {
      loadSows();
    } else if (activeTab === "verracos") {
      loadBoars();
    }
  }, [activeTab, loadSows, loadBoars]);

  // Filtrar cerdas por búsqueda
  const filteredSows = sows.filter(sow => {
    const searchLower = search.toLowerCase();
    return (
      sow.ear_tag?.toLowerCase().includes(searchLower) ||
      sow.alias?.toLowerCase().includes(searchLower) ||
      sow.breed?.toLowerCase().includes(searchLower) ||
      sow.farm_name?.toLowerCase().includes(searchLower)
    );
  });

  // Filtrar verracos por búsqueda
  const filteredBoars = boars.filter(boar => {
    const searchLower = search.toLowerCase();
    return (
      boar.ear_tag?.toLowerCase().includes(searchLower) ||
      boar.name?.toLowerCase().includes(searchLower) ||
      boar.breed?.toLowerCase().includes(searchLower) ||
      boar.farm_name?.toLowerCase().includes(searchLower) ||
      boar.supplier_name?.toLowerCase().includes(searchLower)
    );
  });

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "No registrado";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return "Fecha inválida";
    }
  };

  // Funciones para abrir modales
  const handleViewSow = (sow) => {
    setViewDialog({ open: true, sow: sow, type: 'cerda' });
  };

  const handleViewBoar = (boar) => {
    setViewDialog({ open: true, sow: boar, type: 'verraco' });
  };

  const handleEditSow = (sow) => {
    // Validar que la cerda no esté descartada
    if (sow.status === 'descartada') {
      toast({
        title: "Operación no permitida",
        description: "No se puede editar una cerda descartada. El descarte es un estado final.",
        variant: "destructive"
      });
      return;
    }

    // Navegar a la página de edición
    navigate(`/sows/edit/${sow.id}`);
  };

  const handleEditBoar = (boar) => {
    // Validar que el verraco no esté descartado
    if (boar.status === 'descartado') {
      toast({
        title: "Operación no permitida",
        description: "No se puede editar un verraco descartado. El descarte es un estado final.",
        variant: "destructive"
      });
      return;
    }

    // Navegar a la página de edición
    navigate(`/boars/edit/${boar.id}`);
  };

  const handleDeleteSow = (sow) => {
    // Validar que la cerda no esté descartada
    if (sow.status === 'descartada') {
      toast({
        title: "Operación no permitida",
        description: "Esta cerda ya está descartada. No se puede volver a descartar.",
        variant: "destructive"
      });
      return;
    }
    setDeleteDialog({ open: true, sow: sow, type: 'cerda' });
  };

  const handleDeleteBoar = (boar) => {
    // Validar que el verraco no esté descartado
    if (boar.status === 'descartado') {
      toast({
        title: "Operación no permitida",
        description: "Este verraco ya está descartado. No se puede volver a descartar.",
        variant: "destructive"
      });
      return;
    }
    setDeleteDialog({ open: true, sow: boar, type: 'verraco' });
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    try {
      if (deleteDialog.type === 'cerda') {
        await pigService.deleteSow(deleteDialog.sow.id);
      } else {
        await pigService.deleteBoar(deleteDialog.sow.id);
      }
      
      toast({
        title: `${deleteDialog.type === 'cerda' ? 'Cerda' : 'Verraco'} eliminado`,
        description: `${deleteDialog.type === 'cerda' ? 'La cerda ha sido marcada como descartada' : 'El verraco ha sido marcado como descartado'}`
      });
      
      setDeleteDialog({ open: false, sow: null, type: null });
      
      // Recargar la lista correspondiente
      if (deleteDialog.type === 'cerda') {
        loadSows();
      } else {
        loadBoars();
      }
    } catch (error) {
      console.error(`Error eliminando ${deleteDialog.type === 'cerda' ? 'cerda' : 'verraco'}:`, error);
      toast({
        title: "Error",
        description: error.response?.data?.message || `No se pudo eliminar ${deleteDialog.type === 'cerda' ? 'la cerda' : 'el verraco'}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Lista de Reproductoras
          </h1>
          <p className="text-gray-600">
            Gestiona y consulta la información de cerdas, verracos y lechones
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="cerdas" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Cerdas
            </TabsTrigger>
            <TabsTrigger value="verracos" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Verracos
            </TabsTrigger>
            <TabsTrigger value="lechones" className="flex items-center gap-2" disabled>
              <Baby className="h-4 w-4" />
              Lechones
            </TabsTrigger>
          </TabsList>

          {/* Tab de Cerdas */}
          <TabsContent value="cerdas">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Listado de Cerdas</CardTitle>
                    <CardDescription>
                      {filteredSows.length} cerdas registradas
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {/* Botones de exportación */}
                    {filteredSows.length > 0 && (
                      <div className="flex gap-2 mr-2">
                        <Button 
                          onClick={() => exportAllSowsToPDF(filteredSows)} 
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Exportar PDF
                        </Button>
                        <Button 
                          onClick={() => exportAllSowsToExcel(filteredSows)} 
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Exportar Excel
                        </Button>
                      </div>
                    )}
                    <Button onClick={() => navigate("/sows/register")} className="bg-pink-600 hover:bg-pink-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Cerda
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Buscador */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por arete, alias, raza o granja..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Tabla */}
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Cargando...</p>
                  </div>
                ) : filteredSows.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron cerdas</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Arete</TableHead>
                          <TableHead>Alias</TableHead>
                          <TableHead>Raza</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Estado Reproductivo</TableHead>
                          <TableHead>Peso (kg)</TableHead>
                          <TableHead>Partos</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSows.map((sow) => (
                          <TableRow key={sow.id}>
                            <TableCell className="font-semibold">{sow.ear_tag}</TableCell>
                            <TableCell>{sow.alias || "-"}</TableCell>
                            <TableCell>{sow.breed}</TableCell>
                            <TableCell>
                              <Badge variant={sow.status === 'activa' ? 'default' : 'secondary'}>
                                {sow.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{sow.reproductive_status || "vacia"}</Badge>
                            </TableCell>
                            <TableCell>{sow.current_weight || "-"}</TableCell>
                            <TableCell>{sow.parity_count || 0}</TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewSow(sow)}
                                  title="Ver detalles"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditSow(sow)}
                                  title={sow.status === 'descartada' ? 'No se puede editar una cerda descartada' : 'Editar'}
                                  disabled={sow.status === 'descartada'}
                                  className={sow.status === 'descartada' ? 'opacity-50 cursor-not-allowed' : ''}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteSow(sow)}
                                  className={sow.status === 'descartada' ? 'opacity-50 cursor-not-allowed' : 'text-red-600 hover:text-red-700'}
                                  title={sow.status === 'descartada' ? 'Esta cerda ya está descartada' : 'Descartar'}
                                  disabled={sow.status === 'descartada'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                
                                {/* Menú de exportación */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      title="Exportar"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => exportSowToPDF(sow)}>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Exportar a PDF
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => exportSowToExcel(sow)}>
                                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                                      Exportar a Excel
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Verracos */}
          <TabsContent value="verracos">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Listado de Verracos</CardTitle>
                    <CardDescription>
                      {filteredBoars.length} verracos registrados
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {/* Botones de exportación */}
                    {filteredBoars.length > 0 && (
                      <div className="flex gap-2 mr-2">
                        <Button 
                          onClick={() => exportAllBoarsToPDF(filteredBoars)} 
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Exportar PDF
                        </Button>
                        <Button 
                          onClick={() => exportAllBoarsToExcel(filteredBoars)} 
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Exportar Excel
                        </Button>
                      </div>
                    )}
                    <Button onClick={() => navigate("/boars/register")} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Verraco
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Buscador */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por arete, nombre, raza, granja o proveedor..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Tabla */}
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Cargando...</p>
                  </div>
                ) : filteredBoars.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron verracos</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Arete</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Raza</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Peso (kg)</TableHead>
                          <TableHead>Servicios</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBoars.map((boar) => (
                          <TableRow key={boar.id}>
                            <TableCell className="font-semibold">{boar.ear_tag}</TableCell>
                            <TableCell>{boar.name || "-"}</TableCell>
                            <TableCell>{boar.breed}</TableCell>
                            <TableCell>
                              <Badge variant={boar.boar_type === 'fisico' ? 'default' : 'outline'}>
                                {boar.boar_type === 'fisico' ? 'Físico' : 'Semen'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={boar.status === 'activo' ? 'default' : 'secondary'}>
                                {boar.status || 'N/A'}
                              </Badge>
                            </TableCell>
                            <TableCell>{boar.current_weight || "-"}</TableCell>
                            <TableCell>{boar.total_services || 0}</TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewBoar(boar)}
                                  title="Ver detalles"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditBoar(boar)}
                                  title={boar.status === 'descartado' ? 'No se puede editar un verraco descartado' : 'Editar'}
                                  disabled={boar.status === 'descartado'}
                                  className={boar.status === 'descartado' ? 'opacity-50 cursor-not-allowed' : ''}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteBoar(boar)}
                                  className={boar.status === 'descartado' ? 'opacity-50 cursor-not-allowed' : 'text-red-600 hover:text-red-700'}
                                  title={boar.status === 'descartado' ? 'Este verraco ya está descartado' : 'Descartar'}
                                  disabled={boar.status === 'descartado'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                
                                {/* Menú de exportación */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      title="Exportar"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => exportBoarToPDF(boar)}>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Exportar a PDF
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => exportBoarToExcel(boar)}>
                                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                                      Exportar a Excel
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Lechones (deshabilitado) */}
          <TabsContent value="lechones">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Módulo en desarrollo</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Ver Detalles */}
        <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, sow: null, type: null })}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {viewDialog.type === 'verraco' ? 'Detalles del Verraco' : 'Detalles de la Cerda'}
              </DialogTitle>
              <DialogDescription>
                Información completa de {viewDialog.sow?.ear_tag}
              </DialogDescription>
            </DialogHeader>
            
            {viewDialog.sow && (
              <div className="space-y-6">
                {/* Imagen de la cerda */}
                <div className="flex justify-center">
                  {viewDialog.sow.photo_url ? (
                    <img 
                      src={viewDialog.sow.photo_url} 
                      alt={viewDialog.sow.ear_tag}
                      className="w-64 h-64 object-cover rounded-lg border-4 border-pink-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-64 h-64 border-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                      <ImageIcon className="h-16 w-16 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Sin imagen</p>
                    </div>
                  )}
                </div>

                {/* Sección 1: Identificación */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Identificación</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Arete</Label>
                      <p className="font-semibold">{viewDialog.sow.ear_tag}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Tipo de ID</Label>
                      <p className="font-semibold capitalize">{viewDialog.sow.id_type}</p>
                    </div>
                    {viewDialog.type === 'cerda' ? (
                      <div>
                        <Label className="text-gray-600">Alias</Label>
                        <p className="font-semibold">{viewDialog.sow.alias || "Sin alias"}</p>
                      </div>
                    ) : (
                      <div>
                        <Label className="text-gray-600">Nombre</Label>
                        <p className="font-semibold">{viewDialog.sow.name || "Sin nombre"}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sección 2: Genética */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Genética</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Raza</Label>
                      <p className="font-semibold">{viewDialog.sow.breed}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Línea Genética</Label>
                      <p className="font-semibold">{viewDialog.sow.genetic_line || "No especificada"}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Generación</Label>
                      <p className="font-semibold">{viewDialog.sow.generation || "No especificada"}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Arete del Padre</Label>
                      <p className="font-semibold">{viewDialog.sow.sire_tag || viewDialog.sow.sire_ear_tag || "No registrado"}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Arete de la Madre</Label>
                      <p className="font-semibold">{viewDialog.sow.dam_tag || viewDialog.sow.dam_ear_tag || "No registrado"}</p>
                    </div>
                  </div>
                </div>

                {/* Sección 3: Tipo de Verraco (solo para verracos) */}
                {viewDialog.type === 'verraco' && viewDialog.sow.boar_type && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Tipo de Verraco</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600">Tipo</Label>
                        <Badge variant="outline" className="capitalize">
                          {viewDialog.sow.boar_type}
                        </Badge>
                      </div>
                      {viewDialog.sow.boar_type === 'semen comprado' && (
                        <>
                          <div>
                            <Label className="text-gray-600">Proveedor</Label>
                            <p className="font-semibold">{viewDialog.sow.supplier_name || "No especificado"}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Código Proveedor</Label>
                            <p className="font-semibold">{viewDialog.sow.supplier_code || "No especificado"}</p>
                          </div>
                        </>
                      )}
                      {viewDialog.sow.boar_type === 'fisico' && (
                        <div>
                          <Label className="text-gray-600">Total Servicios</Label>
                          <p className="font-semibold">{viewDialog.sow.total_services || 0}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sección 4: Fechas */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Fechas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Fecha de Nacimiento</Label>
                      <p className="font-semibold">{formatDate(viewDialog.sow.birth_date)}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Fecha de Entrada</Label>
                      <p className="font-semibold">{formatDate(viewDialog.sow.entry_date)}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Origen</Label>
                      <p className="font-semibold capitalize">{viewDialog.sow.origin}</p>
                    </div>
                    {viewDialog.type === 'verraco' && viewDialog.sow.last_service_date && (
                      <div>
                        <Label className="text-gray-600">Último Servicio</Label>
                        <p className="font-semibold">{formatDate(viewDialog.sow.last_service_date)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sección 5: Ubicación (solo para físicos) */}
                {(!viewDialog.sow.boar_type || viewDialog.sow.boar_type === 'fisico' || viewDialog.type === 'cerda') && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Ubicación</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600">Granja</Label>
                        <p className="font-semibold">{viewDialog.sow.farm_name || "No especificada"}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Ubicación/Galpón</Label>
                        <p className="font-semibold">{viewDialog.sow.location || "No especificada"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sección 6: Estado */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Estado</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Estado General</Label>
                      <Badge variant={viewDialog.sow.status === 'activa' || viewDialog.sow.status === 'activo' ? 'default' : 'secondary'}>
                        {viewDialog.sow.status}
                      </Badge>
                    </div>
                    {viewDialog.type === 'cerda' && (
                      <div>
                        <Label className="text-gray-600">Estado Reproductivo</Label>
                        <Badge variant="outline">{viewDialog.sow.reproductive_status || "vacia"}</Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sección 7: Datos Físicos */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Datos Físicos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Peso Actual</Label>
                      <p className="font-semibold">{viewDialog.sow.current_weight ? `${viewDialog.sow.current_weight} kg` : "No registrado"}</p>
                    </div>
                    {viewDialog.type === 'cerda' && (
                      <>
                        <div>
                          <Label className="text-gray-600">Peso Mínimo Servicio</Label>
                          <p className="font-semibold">{viewDialog.sow.min_service_weight || "No especificado"} kg</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Condición Corporal</Label>
                          <p className="font-semibold">{viewDialog.sow.body_condition}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Fecha Último Pesaje</Label>
                          <p className="font-semibold">{formatDate(viewDialog.sow.last_weight_date)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Sección 8: Notas (solo para verracos) */}
                {viewDialog.type === 'verraco' && viewDialog.sow.notes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Notas</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{viewDialog.sow.notes}</p>
                  </div>
                )}

                {/* Sección 9: Registro */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Registro</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Fecha de Creación</Label>
                      <p className="font-semibold">{formatDate(viewDialog.sow.created_at)}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Última Actualización</Label>
                      <p className="font-semibold">{formatDate(viewDialog.sow.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <div className="flex justify-between w-full">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => viewDialog.type === 'verraco' ? exportBoarToPDF(viewDialog.sow) : exportSowToPDF(viewDialog.sow)}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => viewDialog.type === 'verraco' ? exportBoarToExcel(viewDialog.sow) : exportSowToExcel(viewDialog.sow)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setViewDialog({ open: false, sow: null, type: null })}>
                  Cerrar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Eliminar */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, sow: null, type: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar {deleteDialog.type === 'cerda' ? 'la cerda' : 'el verraco'} <strong>{deleteDialog.sow?.ear_tag}</strong>?
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Esta acción marcará {deleteDialog.type === 'cerda' ? 'la cerda' : 'el verraco'} como "descartado". 
                {deleteDialog.type === 'cerda' 
                  ? 'Si la cerda tiene datos reproductivos asociados, no podrá ser eliminada permanentemente.' 
                  : 'Si el verraco tiene servicios asociados, no podrá ser eliminado permanentemente.'}
              </p>
            </div>
            
            <DialogFooter className="flex flex-row justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialog({ open: false, sow: null, type: null })}
                className="min-w-[100px]"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleDeleteConfirm}
                className="min-w-[100px] bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
