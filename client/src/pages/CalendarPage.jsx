import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, ChevronLeft, ChevronRight, Plus, Download, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { pregnancyService, heatService, calendarEventService } from "@/services/api";

export default function CalendarPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState("todos");
  const [editingEvent, setEditingEvent] = useState(null);
  const [customEvents, setCustomEvents] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, eventId: null });
  const [eventForm, setEventForm] = useState({
    title: "",
    event_date: "",
    event_type: "custom",
    description: "",
    notes: "",
    status: "pending",
    reminder_days: 0
  });
  
  // Cargar eventos desde el backend
  useEffect(() => {
    loadEvents();
  }, [selectedMonth, selectedYear]);

  const loadEvents = async () => {
    try {
      // Cargar eventos personalizados de la base de datos
      const customEventsData = await calendarEventService.getEventsByMonth(selectedYear, selectedMonth + 1);
      setCustomEvents(customEventsData);
      
      // Cargar gestaciones activas para calcular fechas de parto esperadas
      const pregnancies = await pregnancyService.getAllPregnancies({ status: 'en curso' });
      
      const calculatedEvents = [];
      
      // Agregar eventos personalizados
      customEventsData.forEach(event => {
        calculatedEvents.push({
          id: `custom-${event.id}`,
          title: event.title,
          date: new Date(event.event_date),
          type: 'custom',
          color: 'text-blue-600',
          data: event,
          isCustom: true
        });
      });
      
      // Agregar eventos de partos esperados
      pregnancies.forEach(pregnancy => {
        if (pregnancy.expected_farrowing_date) {
          const farrowingDate = new Date(pregnancy.expected_farrowing_date);
          calculatedEvents.push({
            id: `pregnancy-${pregnancy.id}`,
            title: `Parto Esperado - ${pregnancy.sow_ear_tag || 'Cerda ' + pregnancy.sow_id}`,
            date: farrowingDate,
            type: 'farrowing',
            color: 'text-red-600',
            data: pregnancy
          });
          
          // Agregar recordatorio 7 días antes
          const reminderDate = new Date(farrowingDate);
          reminderDate.setDate(reminderDate.getDate() - 7);
          calculatedEvents.push({
            id: `reminder-${pregnancy.id}`,
            title: `Recordatorio: Preparar parto (${pregnancy.sow_ear_tag || 'Cerda ' + pregnancy.sow_id})`,
            date: reminderDate,
            type: 'reminder',
            color: 'text-orange-600',
            data: pregnancy
          });
        }
      });
      
      // Cargar celos para calcular próximos celos
      const heats = await heatService.getAllHeats();
      
      // Calcular próximos celos esperados (ciclo de 21 días aproximadamente)
      heats.forEach(heat => {
        if (heat.status === 'finalizado' && !heat.service_performed) {
          const heatDate = new Date(heat.heat_date);
          const nextHeatDate = new Date(heatDate);
          nextHeatDate.setDate(nextHeatDate.getDate() + 21);
          
          // Solo agregar si es futuro
          if (nextHeatDate > new Date()) {
            calculatedEvents.push({
              id: `heat-${heat.id}`,
              title: `Celo Esperado - ${heat.sow_ear_tag || 'Cerda ' + heat.sow_id}`,
              date: nextHeatDate,
              type: 'heat',
              color: 'text-pink-600',
              data: heat
            });
          }
        }
      });
      
      setEvents(calculatedEvents);
    } catch (error) {
      console.error("Error cargando eventos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos del calendario",
        variant: "destructive"
      });
    }
  };

  // Obtener días del mes
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Obtener el primer día del mes (0 = domingo)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Cambiar mes
  const changeMonth = (direction) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setCurrentDate(new Date(newYear, newMonth, 1));
  };

  // Obtener eventos de un día específico
  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === selectedMonth &&
        eventDate.getFullYear() === selectedYear &&
        (filterType === 'todos' || event.type === filterType)
      );
    });
  };

  // Renderizar el calendario
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getMonth() === selectedMonth && today.getFullYear() === selectedYear;
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] p-2 border border-gray-100"></div>);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = isCurrentMonth && today.getDate() === day;
      
      days.push(
        <div
          key={day}
          className={cn(
            "min-h-[100px] p-2 border border-gray-200 hover:bg-gray-50 cursor-pointer relative",
            isToday && "bg-red-50 border-red-300"
          )}
          onClick={() => handleDayClick(day)}
        >
          <div className={cn(
            "inline-flex items-center justify-center w-7 h-7 rounded-full mb-1",
            isToday && "bg-red-500 text-white font-bold"
          )}>
            {day}
          </div>
          
              <div className="space-y-1">
            {dayEvents.map((event, idx) => (
              <div
                key={event.id}
                className={cn(
                  "text-xs px-2 py-1 rounded truncate flex items-center justify-between group",
                  event.color,
                  "bg-opacity-10 cursor-pointer hover:bg-opacity-20"
                )}
                title={event.title}
                onClick={(e) => {
                  e.stopPropagation();
                  if (event.isCustom) {
                    handleEditEvent(event);
                  }
                }}
              >
                <span className="truncate flex-1">{event.title}</span>
                {event.isCustom && (
                  <button
                    className="opacity-0 group-hover:opacity-100 ml-1 text-red-600 hover:text-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      const eventId = event.id.replace('custom-', '');
                      handleDeleteEvent(eventId);
                    }}
                    title="Eliminar evento"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const handleDayClick = (day) => {
    setSelectedDate(new Date(selectedYear, selectedMonth, day));
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      // Mostrar detalles de eventos
      toast({
        title: `Eventos del ${day}/${selectedMonth + 1}/${selectedYear}`,
        description: dayEvents.map(e => e.title).join('\n'),
      });
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      event_date: "",
      event_type: "custom",
      description: "",
      notes: "",
      status: "pending",
      reminder_days: 0
    });
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event.data);
    setEventForm({
      title: event.data.title,
      event_date: event.data.event_date?.split('T')[0] || "",
      event_type: event.data.event_type || "custom",
      description: event.data.description || "",
      notes: event.data.notes || "",
      status: event.data.status || "pending",
      reminder_days: event.data.reminder_days || 0
    });
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = async () => {
    try {
      if (!eventForm.title || !eventForm.event_date) {
        toast({
          title: "Error",
          description: "El título y la fecha son obligatorios",
          variant: "destructive"
        });
        return;
      }

      if (editingEvent) {
        // Actualizar evento existente
        await calendarEventService.updateEvent(editingEvent.id, eventForm);
        toast({
          title: "¡Éxito!",
          description: "Evento actualizado correctamente",
          className: "bg-green-50 border-green-200"
        });
      } else {
        // Crear nuevo evento
        await calendarEventService.createEvent(eventForm);
        toast({
          title: "¡Éxito!",
          description: "Evento creado correctamente",
          className: "bg-green-50 border-green-200"
        });
      }

      setIsEventDialogOpen(false);
      loadEvents();
    } catch (error) {
      console.error("Error al guardar evento:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo guardar el evento",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = (eventId) => {
    setDeleteDialog({ open: true, eventId });
  };

  const confirmDeleteEvent = async () => {
    try {
      await calendarEventService.deleteEvent(deleteDialog.eventId);
      toast({
        title: "¡Éxito!",
        description: "Evento eliminado correctamente",
        className: "bg-green-50 border-green-200"
      });
      setDeleteDialog({ open: false, eventId: null });
      loadEvents();
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo eliminar el evento",
        variant: "destructive"
      });
    }
  };

  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-[#6b7c45]" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendario de Eventos</h1>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona fechas importantes y recordatorios
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleCreateEvent}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo evento
          </Button>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeMonth(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  octubre
                </Button>
                
                <div className="text-center min-w-[200px]">
                  <h2 className="text-2xl font-bold text-red-600">
                    {monthNames[selectedMonth]} {selectedYear}
                  </h2>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeMonth(1)}
                >
                  diciembre
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar eventos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los eventos</SelectItem>
                    <SelectItem value="custom">Eventos personalizados</SelectItem>
                    <SelectItem value="farrowing">Partos esperados</SelectItem>
                    <SelectItem value="heat">Celos esperados</SelectItem>
                    <SelectItem value="reminder">Recordatorios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-6">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {weekDays.map(day => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-700 py-2 text-sm"
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-200">
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={loadEvents}
            className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2 mx-auto"
          >
            <Download className="h-4 w-4" />
            Actualizar eventos del sistema
          </button>
        </div>

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Leyenda de Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-600 rounded"></div>
                <span className="text-sm">Eventos personalizados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-600 rounded"></div>
                <span className="text-sm">Partos esperados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-100 border-2 border-orange-600 rounded"></div>
                <span className="text-sm">Recordatorios</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-100 border-2 border-pink-600 rounded"></div>
                <span className="text-sm">Celos esperados</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, eventId: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Calendar className="h-5 w-5" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false, eventId: null })}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteEvent}
              className="bg-red-600 hover:bg-red-700"
            >
              Sí, eliminar evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for new event */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Editar Evento" : "Agregar Evento Personalizado"}</DialogTitle>
            <DialogDescription>
              {editingEvent 
                ? "Modifica los detalles del evento personalizado" 
                : "Los eventos del sistema se generan automáticamente. Aquí puedes agregar eventos personalizados."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Título del Evento *</Label>
              <Input 
                id="event-title" 
                placeholder="Ej: Vacunación general" 
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-date">Fecha *</Label>
              <Input 
                id="event-date" 
                type="date" 
                value={eventForm.event_date}
                onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-type">Tipo de Evento</Label>
              <Select 
                value={eventForm.event_type} 
                onValueChange={(value) => setEventForm({...eventForm, event_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Personalizado</SelectItem>
                  <SelectItem value="vaccination">Vacunación</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="inspection">Inspección</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Descripción</Label>
              <Input 
                id="event-description" 
                placeholder="Descripción breve..." 
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-notes">Notas</Label>
              <Textarea 
                id="event-notes" 
                placeholder="Detalles adicionales..." 
                rows={3} 
                value={eventForm.notes}
                onChange={(e) => setEventForm({...eventForm, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleSaveEvent}>
              {editingEvent ? "Actualizar Evento" : "Guardar Evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

