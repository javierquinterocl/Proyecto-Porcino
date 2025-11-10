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
import { Search, Eye, Edit2, Trash2, Plus, PiggyBank, Users as UsersIcon, Baby, Upload, X, Image as ImageIcon, FileText, FileSpreadsheet, Download, MoreVertical } from "lucide-react";
import { pigService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { 
  exportSowToPDF, 
  exportAllSowsToPDF, 
  exportSowToExcel, 
  exportAllSowsToExcel 
} from "@/utils/exportUtils";

export default function ReproductiveList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("cerdas");
  const [sows, setSows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Estados para modales
  const [viewDialog, setViewDialog] = useState({ open: false, sow: null });
  const [editDialog, setEditDialog] = useState({ open: false, sow: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, sow: null });
  
  // Estados para formulario de edición
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para imagen en edición
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);

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

  useEffect(() => {
    if (activeTab === "cerdas") {
      loadSows();
    }
  }, [activeTab, loadSows]);

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

  // Función para formatear fechas a YYYY-MM-DD para inputs
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  // Funciones para abrir modales
  const handleView = (sow) => {
    setViewDialog({ open: true, sow });
  };

  const handleEdit = (sow) => {
    setFormData({
      ear_tag: sow.ear_tag || "",
      id_type: sow.id_type || "arete",
      alias: sow.alias || "",
      breed: sow.breed || "",
      genetic_line: sow.genetic_line || "",
      generation: sow.generation || "",
      sire_tag: sow.sire_tag || "",
      dam_tag: sow.dam_tag || "",
      birth_date: formatDateForInput(sow.birth_date),
      entry_date: formatDateForInput(sow.entry_date),
      origin: sow.origin || "propia",
      status: sow.status || "activa",
      location: sow.location || "",
      farm_name: sow.farm_name || "",
      current_weight: sow.current_weight || "",
      min_service_weight: sow.min_service_weight || "",
      body_condition: sow.body_condition || "",
      last_weight_date: formatDateForInput(sow.last_weight_date),
      reproductive_status: sow.reproductive_status || "vacia",
      photo_url: sow.photo_url || ""
    });
    setFormErrors({});
    // Cargar la imagen actual si existe
    setEditImagePreview(sow.photo_url || null);
    setEditImageFile(null);
    setEditDialog({ open: true, sow });
  };

  const handleDelete = (sow) => {
    setDeleteDialog({ open: true, sow });
  };

  // Manejar selección de imagen en edición
  const handleEditImageSelect = async (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Formato no válido",
        description: "Solo se permiten archivos JPEG, JPG o PNG",
        variant: "destructive"
      });
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Archivo muy grande",
        description: "La imagen no debe superar los 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Guardar archivo y subir al servidor
    setEditImageFile(file);
    await uploadEditImageToServer(file);
  };

  // Subir imagen al servidor en edición
  const uploadEditImageToServer = async (file) => {
    try {
      setIsUploadingEditImage(true);
      const photoUrl = await pigService.uploadPhoto(file);
      setFormData(prev => ({ ...prev, photo_url: photoUrl }));
      toast({
        title: "Imagen subida",
        description: "La imagen se ha cargado correctamente"
      });
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive"
      });
    } finally {
      setIsUploadingEditImage(false);
    }
  };

  // Eliminar imagen en edición
  const handleRemoveEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview(null);
    setFormData(prev => ({ ...prev, photo_url: "" }));
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.breed) errors.breed = "La raza es obligatoria";
    if (!formData.birth_date) errors.birth_date = "La fecha de nacimiento es obligatoria";
    if (!formData.entry_date) errors.entry_date = "La fecha de entrada es obligatoria";
    if (!formData.current_weight) errors.current_weight = "El peso actual es obligatorio";
    if (!formData.body_condition) errors.body_condition = "La condición corporal es obligatoria";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar cambios de edición
  const handleEditSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedSow = await pigService.updateSow(editDialog.sow.id, formData);
      
      toast({
        title: "Cerda actualizada",
        description: "Los cambios se guardaron correctamente"
      });
      
      // Actualizar la lista de cerdas
      setSows(prevSows => 
        prevSows.map(sow => 
          sow.id === editDialog.sow.id ? updatedSow : sow
        )
      );
      
      // Si el diálogo de vista estaba abierto con esta cerda, actualizarlo también
      if (viewDialog.open && viewDialog.sow?.id === editDialog.sow.id) {
        setViewDialog({ open: true, sow: updatedSow });
      }
      
      setEditDialog({ open: false, sow: null });
      setEditImagePreview(null);
      setEditImageFile(null);
    } catch (error) {
      console.error("Error actualizando cerda:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo actualizar la cerda",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      await pigService.deleteSow(deleteDialog.sow.id);
      
      toast({
        title: "Cerda eliminada",
        description: "La cerda ha sido marcada como descartada"
      });
      
      setDeleteDialog({ open: false, sow: null });
      loadSows();
    } catch (error) {
      console.error("Error eliminando cerda:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo eliminar la cerda",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📋 Lista de Reproductoras
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
            <TabsTrigger value="verracos" className="flex items-center gap-2" disabled>
              <UsersIcon className="h-4 w-4" />
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
                                  onClick={() => handleView(sow)}
                                  title="Ver detalles"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(sow)}
                                  title="Editar"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(sow)}
                                  className="text-red-600 hover:text-red-700"
                                  title="Eliminar"
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

          {/* Tabs de Verracos y Lechones (deshabilitados) */}
          <TabsContent value="verracos">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Módulo en desarrollo</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lechones">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Módulo en desarrollo</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Ver Detalles */}
        <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, sow: null })}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Detalles de la Cerda</DialogTitle>
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
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">📋 Identificación</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Arete</Label>
                      <p className="font-semibold">{viewDialog.sow.ear_tag}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Tipo de ID</Label>
                      <p className="font-semibold capitalize">{viewDialog.sow.id_type}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Alias</Label>
                      <p className="font-semibold">{viewDialog.sow.alias || "Sin alias"}</p>
                    </div>
                  </div>
                </div>

                {/* Sección 2: Genética */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">🧬 Genética</h3>
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
                      <p className="font-semibold">{viewDialog.sow.sire_tag || "No registrado"}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Arete de la Madre</Label>
                      <p className="font-semibold">{viewDialog.sow.dam_tag || "No registrado"}</p>
                    </div>
                  </div>
                </div>

                {/* Sección 3: Fechas */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">📅 Fechas</h3>
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
                  </div>
                </div>

                {/* Sección 4: Ubicación */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">📍 Ubicación</h3>
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

                {/* Sección 5: Estado */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">🔄 Estado</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Estado General</Label>
                      <Badge variant={viewDialog.sow.status === 'activa' ? 'default' : 'secondary'}>
                        {viewDialog.sow.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-gray-600">Estado Reproductivo</Label>
                      <Badge variant="outline">{viewDialog.sow.reproductive_status || "vacia"}</Badge>
                    </div>
                  </div>
                </div>

                {/* Sección 6: Datos Físicos */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">⚖️ Datos Físicos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Peso Actual</Label>
                      <p className="font-semibold">{viewDialog.sow.current_weight} kg</p>
                    </div>
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
                  </div>
                </div>

                {/* Sección 7: Registro */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">📝 Registro</h3>
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
                    onClick={() => exportSowToPDF(viewDialog.sow)}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => exportSowToExcel(viewDialog.sow)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setViewDialog({ open: false, sow: null })}>
                  Cerrar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Editar - DISEÑO HORIZONTAL */}
        <Dialog 
          open={editDialog.open} 
          onOpenChange={(open) => {
            if (!open) {
              // Limpiar estados al cerrar
              setEditImagePreview(null);
              setEditImageFile(null);
              setFormData({});
              setFormErrors({});
            }
            setEditDialog({ open, sow: open ? editDialog.sow : null });
          }}
        >
          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Editar Cerda - {editDialog.sow?.ear_tag}</DialogTitle>
              <DialogDescription>
                Modifica los datos necesarios y guarda los cambios
              </DialogDescription>
            </DialogHeader>
            
            {/* Diseño en 2 columnas horizontales */}
            <div className="grid grid-cols-2 gap-8">
              
              {/* COLUMNA IZQUIERDA */}
              <div className="space-y-6">
                
                {/* Identificación */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-pink-300">
                    📋 Identificación
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600">Arete (No editable)</Label>
                        <div className="bg-white border border-gray-300 rounded-md px-3 py-2">
                          <p className="font-semibold">{editDialog.sow?.ear_tag}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600">Tipo de ID (No editable)</Label>
                        <div className="bg-white border border-gray-300 rounded-md px-3 py-2">
                          <p className="font-semibold capitalize">{editDialog.sow?.id_type}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-alias">Alias</Label>
                      <Input
                        id="edit-alias"
                        value={formData.alias || ""}
                        onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                        placeholder="Nombre o apodo de la cerda (opcional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Información Genética */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300">
                    🧬 Genética
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-breed">Raza *</Label>
                      <Select value={formData.breed} onValueChange={(value) => setFormData({ ...formData, breed: value })}>
                        <SelectTrigger className={formErrors.breed ? "border-red-500" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Large White">Large White</SelectItem>
                          <SelectItem value="Landrace">Landrace</SelectItem>
                          <SelectItem value="Duroc">Duroc</SelectItem>
                          <SelectItem value="Pietrain">Pietrain</SelectItem>
                          <SelectItem value="Hampshire">Hampshire</SelectItem>
                          <SelectItem value="Yorkshire">Yorkshire</SelectItem>
                          <SelectItem value="F1">F1</SelectItem>
                          <SelectItem value="F2">F2</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.breed && <p className="text-xs text-red-500 mt-1">{formErrors.breed}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-genetic-line">Línea Genética</Label>
                        <Input
                          id="edit-genetic-line"
                          value={formData.genetic_line || ""}
                          onChange={(e) => setFormData({ ...formData, genetic_line: e.target.value })}
                          placeholder="Opcional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-generation">Generación</Label>
                        <Input
                          id="edit-generation"
                          type="number"
                          value={formData.generation || ""}
                          onChange={(e) => setFormData({ ...formData, generation: e.target.value })}
                          placeholder="Ej: 1, 2, 3"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-sire">Arete del Padre</Label>
                        <Input
                          id="edit-sire"
                          value={formData.sire_tag || ""}
                          onChange={(e) => setFormData({ ...formData, sire_tag: e.target.value.toUpperCase() })}
                          placeholder="Opcional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-dam">Arete de la Madre</Label>
                        <Input
                          id="edit-dam"
                          value={formData.dam_tag || ""}
                          onChange={(e) => setFormData({ ...formData, dam_tag: e.target.value.toUpperCase() })}
                          placeholder="Opcional"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Datos Físicos */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-300">
                    ⚖️ Datos Físicos
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-weight">Peso Actual (kg) *</Label>
                        <Input
                          id="edit-weight"
                          type="number"
                          step="0.1"
                          value={formData.current_weight || ""}
                          onChange={(e) => setFormData({ ...formData, current_weight: e.target.value })}
                          className={formErrors.current_weight ? "border-red-500" : ""}
                        />
                        {formErrors.current_weight && <p className="text-xs text-red-500 mt-1">{formErrors.current_weight}</p>}
                      </div>
                      <div>
                        <Label htmlFor="edit-min-weight">Peso Mínimo Servicio (kg)</Label>
                        <Input
                          id="edit-min-weight"
                          type="number"
                          step="0.1"
                          value={formData.min_service_weight || ""}
                          onChange={(e) => setFormData({ ...formData, min_service_weight: e.target.value })}
                          placeholder="120"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-condition">Condición Corporal (1-5) *</Label>
                        <Input
                          id="edit-condition"
                          type="number"
                          min="1"
                          max="5"
                          step="0.5"
                          value={formData.body_condition || ""}
                          onChange={(e) => setFormData({ ...formData, body_condition: e.target.value })}
                          className={formErrors.body_condition ? "border-red-500" : ""}
                        />
                        {formErrors.body_condition && <p className="text-xs text-red-500 mt-1">{formErrors.body_condition}</p>}
                      </div>
                      <div>
                        <Label htmlFor="edit-weight-date">Fecha Último Pesaje</Label>
                        <Input
                          id="edit-weight-date"
                          type="date"
                          value={formData.last_weight_date || ""}
                          onChange={(e) => setFormData({ ...formData, last_weight_date: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Foto */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-300">
                    📸 Foto de la Cerda
                  </h3>
                  <div className="flex flex-col items-center space-y-4">
                    {/* Preview de la imagen */}
                    {editImagePreview ? (
                      <div className="relative w-full">
                        <img 
                          src={editImagePreview} 
                          alt="Preview" 
                          className="w-full h-64 object-cover rounded-lg border-4 border-purple-200 shadow-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveEditImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {editImageFile && (
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Nueva imagen cargada
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-64 border-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 text-center px-4">
                          No hay imagen
                        </p>
                      </div>
                    )}
                    
                    {/* Botón para seleccionar imagen */}
                    <div className="text-center">
                      <input
                        type="file"
                        id="edit-photo-upload"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleEditImageSelect}
                        className="hidden"
                      />
                      <Label htmlFor="edit-photo-upload">
                        <Button
                          type="button"
                          variant="outline"
                          className="cursor-pointer"
                          disabled={isUploadingEditImage}
                          asChild
                        >
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            {isUploadingEditImage ? "Subiendo..." : editImagePreview ? "Cambiar Imagen" : "Seleccionar Imagen"}
                          </span>
                        </Button>
                      </Label>
                      <p className="text-xs text-gray-500 mt-2">
                        JPEG, JPG, PNG (Máx. 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA */}
              <div className="space-y-6">
                
                {/* Fechas */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-orange-300">
                    📅 Fechas
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-birth-date">Fecha de Nacimiento *</Label>
                      <Input
                        id="edit-birth-date"
                        type="date"
                        value={formData.birth_date || ""}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                        className={formErrors.birth_date ? "border-red-500" : ""}
                      />
                      {formErrors.birth_date && <p className="text-xs text-red-500 mt-1">{formErrors.birth_date}</p>}
                      {formData.birth_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Fecha registrada: {formatDate(formData.birth_date)}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="edit-entry-date">Fecha de Entrada *</Label>
                      <Input
                        id="edit-entry-date"
                        type="date"
                        value={formData.entry_date || ""}
                        onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                        className={formErrors.entry_date ? "border-red-500" : ""}
                      />
                      {formErrors.entry_date && <p className="text-xs text-red-500 mt-1">{formErrors.entry_date}</p>}
                      {formData.entry_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Fecha registrada: {formatDate(formData.entry_date)}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="edit-origin">Origen *</Label>
                      <Select value={formData.origin} onValueChange={(value) => setFormData({ ...formData, origin: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="propia">Propia</SelectItem>
                          <SelectItem value="comprada">Comprada</SelectItem>
                          <SelectItem value="intercambio genetico">Intercambio Genético</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-300">
                    📍 Ubicación
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-farm">Nombre de la Granja</Label>
                      <Input
                        id="edit-farm"
                        value={formData.farm_name || ""}
                        onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
                        placeholder="Nombre de la granja"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-location">Ubicación/Galpón</Label>
                      <Input
                        id="edit-location"
                        value={formData.location || ""}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Ej: Galpón 3, Corral 5"
                      />
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-300">
                    🔄 Estado
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-status">Estado General *</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activa">Activa</SelectItem>
                          <SelectItem value="descartada">Descartada</SelectItem>
                          <SelectItem value="muerta">Muerta</SelectItem>
                          <SelectItem value="vendida">Vendida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="edit-reproductive-status">Estado Reproductivo</Label>
                      <Select 
                        value={formData.reproductive_status} 
                        onValueChange={(value) => setFormData({ ...formData, reproductive_status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacia">Vacía</SelectItem>
                          <SelectItem value="servida">Servida</SelectItem>
                          <SelectItem value="gestante">Gestante</SelectItem>
                          <SelectItem value="lactante">Lactante</SelectItem>
                          <SelectItem value="destetada">Destetada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Observaciones adicionales */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Información</h4>
                      <p className="text-sm text-blue-700">
                        Las fechas ya registradas se cargan automáticamente. Solo modifícalas si necesitas corregirlas.
                      </p>
                      <p className="text-sm text-blue-700 mt-2">
                        Los campos marcados con * son obligatorios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditImagePreview(null);
                  setEditImageFile(null);
                  setFormData({});
                  setFormErrors({});
                  setEditDialog({ open: false, sow: null });
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleEditSubmit}
                disabled={isSubmitting}
                className="bg-pink-600 hover:bg-pink-700"
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Eliminar */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, sow: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar la cerda <strong>{deleteDialog.sow?.ear_tag}</strong>?
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Esta acción marcará la cerda como "descartada". 
                Si la cerda tiene datos reproductivos asociados, no podrá ser eliminada permanentemente.
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialog({ open: false, sow: null })}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Eliminando..." : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
