import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { heatService } from "@/services/api";
import { 
  Search, Filter, Eye, Edit2, Trash2, Plus, Thermometer, 
  TrendingUp, Calendar, AlertCircle, X, CheckCircle2 
} from "lucide-react";

export default function HeatsList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [heats, setHeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIntensity, setFilterIntensity] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estados para modales
  const [viewDialog, setViewDialog] = useState({ open: false, heat: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, heat: null });
  const [statusDialog, setStatusDialog] = useState({ open: false, heat: null, newStatus: "detectado", notes: "" });

  // Cargar datos
  useEffect(() => {
    loadHeats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHeats = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await heatService.getAllHeats();
      setHeats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando celos:", error);
      const errorMessage = error.response?.data?.message || error.message || "No se pudieron cargar los celos";
      setLoadError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar y paginar
  const filteredHeats = useMemo(() => {
    return heats.filter(heat => {
      const matchesSearch = 
        heat.sow_ear_tag?.toLowerCase().includes(search.toLowerCase()) ||
        heat.sow_alias?.toLowerCase().includes(search.toLowerCase()) ||
        heat.farm_name?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = !filterStatus || filterStatus === 'all' || heat.status === filterStatus;
      const matchesIntensity = !filterIntensity || filterIntensity === 'all' || heat.intensity === filterIntensity;
      const matchesType = !filterType || filterType === 'all' || heat.heat_type === filterType;

      return matchesSearch && matchesStatus && matchesIntensity && matchesType;
    });
  }, [heats, search, filterStatus, filterIntensity, filterType]);

  const paginatedHeats = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredHeats.slice(start, start + pageSize);
  }, [filteredHeats, page]);

  const totalPages = Math.ceil(filteredHeats.length / pageSize);

  // Funciones de acciones
  const handleView = (heat) => {
    setViewDialog({ open: true, heat });
  };

  const handleEdit = (heat) => {
    // Solo permitir edición si no está servido o cancelado
    if (heat.status === 'servido' || heat.status === 'cancelado') {
      toast({
        title: "No permitido",
        description: `Los celos con estado "${heat.status}" no se pueden editar`,
        variant: "destructive"
      });
      return;
    }
    navigate(`/heats/edit/${heat.id}`);
  };

  const handleDelete = (heat) => {
    if (heat.status === 'servido' || heat.status === 'cancelado') {
      toast({
        title: "No permitido",
        description: `Los celos con estado "${heat.status}" no se pueden eliminar`,
        variant: "destructive"
      });
      return;
    }
    setDeleteDialog({ open: true, heat });
  };

  const handleChangeStatus = (heat) => {
    if (heat.status === 'servido' || heat.status === 'cancelado') {
      toast({
        title: "No permitido",
        description: `El estado de un celo "${heat.status}" no se puede cambiar`,
        variant: "destructive"
      });
      return;
    }
    setStatusDialog({ open: true, heat, newStatus: heat.status || "detectado", notes: "" });
  };

  const confirmDelete = async () => {
    try {
      await heatService.deleteHeat(deleteDialog.heat.id);
      toast({
        title: "Éxito",
        description: "Celo eliminado correctamente",
        className: "bg-green-50 border-green-200"
      });
      setDeleteDialog({ open: false, heat: null });
      loadHeats();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo eliminar el celo",
        variant: "destructive"
      });
    }
  };

  const confirmStatusChange = async () => {
    try {
      await heatService.updateHeatStatus(
        statusDialog.heat.id,
        statusDialog.newStatus,
        statusDialog.notes || null
      );
      toast({
        title: "Éxito",
        description: "Estado actualizado correctamente",
        className: "bg-green-50 border-green-200"
      });
      setStatusDialog({ open: false, heat: null, newStatus: "", notes: "" });
      loadHeats();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo actualizar el estado",
        variant: "destructive"
      });
    }
  };

  // Utilidades
  const getStatusBadge = (status) => {
    const variants = {
      'detectado': 'default',
      'servido': 'secondary',
      'no servido': 'destructive',
      'cancelado': 'outline'
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status}
      </Badge>
    );
  };

  const getIntensityBadge = (intensity) => {
    const colors = {
      'fuerte': 'bg-red-100 text-red-800',
      'medio': 'bg-yellow-100 text-yellow-800',
      'debil': 'bg-blue-100 text-blue-800'
    };
    return (
      <Badge className={colors[intensity] || ''}>
        {intensity}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  return (
    <div>
      {/* Mensaje de error si no se puede cargar */}
      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar datos</h3>
              <p className="text-red-700 mb-3">{loadError}</p>
              <p className="text-sm text-red-600 mb-4">
                Es posible que la tabla 'heats' no exista en la base de datos. Por favor, ejecute el script DDL para crear las tablas necesarias.
              </p>
              <Button 
                onClick={loadHeats}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <Thermometer className="h-8 w-8 text-pink-600" />
          <div>
            <h1 className="text-3xl font-bold">Celos/Estros</h1>
            <p className="text-muted-foreground">Gestión de eventos de celo</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate("/heats/register")}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Registrar Celo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Celos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{heats.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Detectados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {heats.filter(h => h.status === 'detectado').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Servidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {heats.filter(h => h.status === 'servido').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {heats.filter(h => h.status === 'detectado').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cerda o granja..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="detectado">Detectado</SelectItem>
                  <SelectItem value="servido">Servido</SelectItem>
                  <SelectItem value="no servido">No Servido</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Intensidad</label>
              <Select value={filterIntensity} onValueChange={setFilterIntensity}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="debil">Débil</SelectItem>
                  <SelectItem value="medio">Media</SelectItem>
                  <SelectItem value="fuerte">Fuerte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="inducido">Inducido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cerda</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Intensidad</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Granja</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : paginatedHeats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No se encontraron celos
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedHeats.map((heat) => (
                    <TableRow key={heat.id}>
                      <TableCell className="font-medium">#{heat.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{heat.sow_ear_tag}</div>
                          {heat.sow_alias && (
                            <div className="text-sm text-muted-foreground">{heat.sow_alias}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(heat.heat_date)}</TableCell>
                      <TableCell>{formatTime(heat.detection_time)}</TableCell>
                      <TableCell>{getIntensityBadge(heat.intensity)}</TableCell>
                      <TableCell>
                        <Badge variant={heat.heat_type === 'natural' ? 'outline' : 'secondary'}>
                          {heat.heat_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(heat.status)}</TableCell>
                      <TableCell className="text-sm">{heat.detection_method}</TableCell>
                      <TableCell className="text-sm">{heat.farm_name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(heat)}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {heat.status !== 'servido' && heat.status !== 'cancelado' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(heat)}
                                title="Editar"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(heat)}
                                title="Eliminar"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleChangeStatus(heat)}
                                title="Cambiar estado"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {((page - 1) * pageSize) + 1} a {Math.min(page * pageSize, filteredHeats.length)} de {filteredHeats.length} resultados
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Ver Detalles */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => !open && setViewDialog({ open: false, heat: null })}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Celo</DialogTitle>
            <DialogDescription>Información completa del evento</DialogDescription>
          </DialogHeader>
          {viewDialog.heat && (
            <div className="space-y-4">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID</label>
                  <p className="text-sm">#{viewDialog.heat.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">{getStatusBadge(viewDialog.heat.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cerda</label>
                  <p className="text-sm">{viewDialog.heat.sow_ear_tag} {viewDialog.heat.sow_alias && `- ${viewDialog.heat.sow_alias}`}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Granja</label>
                  <p className="text-sm">{viewDialog.heat.farm_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha del Celo</label>
                  <p className="text-sm">{formatDate(viewDialog.heat.heat_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hora de Detección</label>
                  <p className="text-sm">{formatTime(viewDialog.heat.detection_time)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Fin</label>
                  <p className="text-sm">{formatDate(viewDialog.heat.heat_end_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Intensidad</label>
                  <div className="mt-1">{getIntensityBadge(viewDialog.heat.intensity)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duración</label>
                  <p className="text-sm">{viewDialog.heat.duration_hours ? `${viewDialog.heat.duration_hours} horas` : '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <p className="text-sm">{viewDialog.heat.heat_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Método de Detección</label>
                  <p className="text-sm">{viewDialog.heat.detection_method}</p>
                </div>
              </div>

              {/* Celo franco */}
              {(viewDialog.heat.peak_estrus_date || viewDialog.heat.peak_estrus_time) && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Celo Franco</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fecha</label>
                      <p className="text-sm">{formatDate(viewDialog.heat.peak_estrus_date)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Hora</label>
                      <p className="text-sm">{formatTime(viewDialog.heat.peak_estrus_time)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Signos clínicos */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Signos Clínicos Observados</h3>
                <div className="grid grid-cols-3 gap-2">
                  {viewDialog.heat.standing_reflex && <Badge variant="outline">Reflejo Inmovilidad</Badge>}
                  {viewDialog.heat.vulva_swelling && <Badge variant="outline">Hinchazón Vulvar</Badge>}
                  {viewDialog.heat.vulva_discharge && <Badge variant="outline">Descarga Vaginal</Badge>}
                  {viewDialog.heat.mounting_behavior && <Badge variant="outline">Monta a Otras</Badge>}
                  {viewDialog.heat.restlessness && <Badge variant="outline">Inquietud</Badge>}
                  {viewDialog.heat.loss_of_appetite && <Badge variant="outline">Pérdida Apetito</Badge>}
                  {viewDialog.heat.vocalization && <Badge variant="outline">Vocalización</Badge>}
                  {viewDialog.heat.ear_erection && <Badge variant="outline">Orejas Erectas</Badge>}
                  {viewDialog.heat.tail_deviation && <Badge variant="outline">Cola Desviada</Badge>}
                  {viewDialog.heat.frequent_urination && <Badge variant="outline">Micción Frecuente</Badge>}
                  {viewDialog.heat.sniffing_genital && <Badge variant="outline">Olfateo Genital</Badge>}
                  {viewDialog.heat.back_arching && <Badge variant="outline">Arqueamiento</Badge>}
                </div>
              </div>

              {/* Notas */}
              {viewDialog.heat.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Observaciones</label>
                  <p className="text-sm mt-1">{viewDialog.heat.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Eliminar */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, heat: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar este celo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {deleteDialog.heat && (
            <div className="py-4">
              <p className="text-sm">
                <strong>Cerda:</strong> {deleteDialog.heat.sow_ear_tag}<br />
                <strong>Fecha:</strong> {formatDate(deleteDialog.heat.heat_date)}
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false, heat: null })}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Cambiar Estado */}
      <Dialog open={statusDialog.open} onOpenChange={(open) => !open && setStatusDialog({ open: false, heat: null, newStatus: "detectado", notes: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Estado del Celo</DialogTitle>
            <DialogDescription>
              Actualice el estado según el progreso del evento
            </DialogDescription>
          </DialogHeader>
          {statusDialog.heat && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nuevo Estado</label>
                <Select 
                  value={statusDialog.newStatus || "detectado"} 
                  onValueChange={(value) => setStatusDialog(prev => ({ ...prev, newStatus: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detectado">Detectado</SelectItem>
                    <SelectItem value="servido">Servido</SelectItem>
                    <SelectItem value="no servido">No Servido</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Notas (opcional)</label>
                <Input
                  className="mt-1"
                  placeholder="Observaciones sobre el cambio de estado..."
                  value={statusDialog.notes}
                  onChange={(e) => setStatusDialog(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setStatusDialog({ open: false, heat: null, newStatus: "detectado", notes: "" })}
            >
              Cancelar
            </Button>
            <Button onClick={confirmStatusChange}>
              Actualizar Estado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
