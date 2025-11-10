import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { pigService } from "@/services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Image as ImageIcon,
  PiggyBank,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ORIGIN_OPTIONS = [
  { value: "GRANJA_PROPIA", label: "Granja propia" },
  { value: "COMPRADA", label: "Comprada" },
  { value: "INTERCAMBIO", label: "Intercambio genético" },
  { value: "OTRO", label: "Otro" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Activa" },
  { value: "DESCARTADA", label: "Descartada" },
  { value: "MUERTA", label: "Muerta" },
  { value: "VENDIDA", label: "Vendida" },
];

const formatDate = (value) => {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  } catch (error) {
    return value;
  }
};

export default function SowBasicDataPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [sows, setSows] = useState([]);
  const [selectedSowId, setSelectedSowId] = useState("");
  const [selectedSow, setSelectedSow] = useState(null);
  const [loadingSows, setLoadingSows] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [savingIdentification, setSavingIdentification] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    pigId: "",
    name: "",
    breed: "",
    birthDate: "",
  });
  const [creatingSow, setCreatingSow] = useState(false);

  const [identificationForm, setIdentificationForm] = useState({
    pigId: "",
    name: "",
    alias: "",
    breed: "",
    birthDate: "",
    entryDate: "",
    origin: (ORIGIN_OPTIONS[0]?.value || "GRANJA_PROPIA"),
    status: (STATUS_OPTIONS[0]?.value || "ACTIVE"),
    location: "",
    fatherId: "",
    motherId: "",
    geneticLine: "",
    generation: "",
    notes: "",
  });

  const loadSows = useCallback(async () => {
    try {
      setLoadingSows(true);
      const response = await pigService.getAllPigs();
      const reproductoras = response.filter((pig) => pig.gender === "FEMALE" && pig.pigType === "REPRODUCTORA");
      setSows(reproductoras);

      if (!reproductoras.length) {
        setSelectedSow(null);
        setSelectedSowId("");
        return;
      }

      const exists = reproductoras.some((sow) => String(sow.id) === String(selectedSowId));
      if (!exists && reproductoras.length > 0) {
        setSelectedSowId(String(reproductoras[0].id));
      }
    } catch (error) {
      console.error("Error cargando cerdas:", error);
      toast({
        title: "Error",
        description: error?.message || "No fue posible cargar las cerdas.",
        variant: "destructive",
      });
      setSows([]);
    } finally {
      setLoadingSows(false);
    }
  }, [selectedSowId, toast]);

  const refreshSow = useCallback(
    async (id) => {
      if (!id) return;
      try {
        setLoadingDetails(true);
        const sow = await pigService.getPigById(id);
        setSelectedSow(sow);
        setSows((prev) => prev.map((item) => (String(item.id) === String(id) ? sow : item)));
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: error?.message || "No fue posible obtener la información de la cerda.",
          variant: "destructive",
        });
      } finally {
        setLoadingDetails(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    loadSows();
  }, [loadSows]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedSowId) {
        setSelectedSow(null);
        return;
      }
      await refreshSow(selectedSowId);
    };

    fetchDetails();
  }, [selectedSowId, refreshSow]);

  useEffect(() => {
    if (!selectedSow) {
      setIdentificationForm({
        pigId: "",
        name: "",
        alias: "",
        breed: "",
        birthDate: "",
        entryDate: "",
        origin: (ORIGIN_OPTIONS[0]?.value || "GRANJA_PROPIA"),
        status: (STATUS_OPTIONS[0]?.value || "ACTIVE"),
        location: "",
        fatherId: "",
        motherId: "",
        geneticLine: "",
        generation: "",
        notes: "",
      });
      return;
    }

    setIdentificationForm({
      pigId: selectedSow.pigId || "",
      name: selectedSow.name || "",
      alias: selectedSow.alias || selectedSow.name || "",
      breed: selectedSow.breed || "",
      birthDate: selectedSow.birthDate || "",
      entryDate: selectedSow.entryDate || "",
      origin: selectedSow.origin || (ORIGIN_OPTIONS[0]?.value || "GRANJA_PROPIA"),
      status: selectedSow.status || (STATUS_OPTIONS[0]?.value || "ACTIVE"),
      location: selectedSow.location || "",
      fatherId: selectedSow.fatherId || "",
      motherId: selectedSow.motherId || "",
      geneticLine: selectedSow.geneticLine || "",
      generation: selectedSow.generation || "",
      notes: selectedSow.notes || "",
    });
  }, [selectedSow]);

  const handleIdentificationChange = (field, value) => {
    setIdentificationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveIdentification = async () => {
    if (!selectedSow) return;

    if (!identificationForm.pigId || !identificationForm.name) {
      toast({
        title: "Campos obligatorios",
        description: "El ID de la cerda y el nombre son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingIdentification(true);
      await pigService.updatePig(selectedSow.id, {
        ...identificationForm,
        birthDate: identificationForm.birthDate,
        entryDate: identificationForm.entryDate,
      });

      toast({
        title: "Datos guardados",
        description: "La información básica de la cerda fue actualizada correctamente.",
      });

      await refreshSow(selectedSow.id);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error?.message || "No fue posible actualizar los datos.",
        variant: "destructive",
      });
    } finally {
      setSavingIdentification(false);
    }
  };

  const handleCreateSow = async () => {
    if (!createForm.pigId || !createForm.name || !createForm.breed) {
      toast({
        title: "Campos obligatorios",
        description: "Completa al menos ID, nombre y raza para registrar la cerda.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingSow(true);
      const response = await pigService.createPig({
        pigId: createForm.pigId,
        name: createForm.name,
        breed: createForm.breed,
        birthDate: createForm.birthDate,
        gender: "FEMALE",
        pigType: "REPRODUCTORA",
        origin: (ORIGIN_OPTIONS[0]?.value || "GRANJA_PROPIA"),
        status: "ACTIVE",
      });

      toast({
        title: "Cerda registrada",
        description: `Se creó la cerda ${response.name}.`,
      });

      setIsCreateDialogOpen(false);
      setCreateForm({ pigId: "", name: "", breed: "", birthDate: "" });
      await loadSows();
      setSelectedSowId(String(response.id));
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error?.message || "No fue posible registrar la cerda.",
        variant: "destructive",
      });
    } finally {
      setCreatingSow(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    if (!selectedSow) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setPhotoLoading(true);
        await pigService.addPhoto(selectedSow.id, {
          url: reader.result,
          label: file.name,
          capturedAt: new Date().toISOString().slice(0, 10),
        });
        toast({
          title: "Fotografía cargada",
          description: "La imagen fue asociada a la cerda.",
        });
        await refreshSow(selectedSow.id);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: error?.message || "No fue posible cargar la fotografía.",
          variant: "destructive",
        });
      } finally {
        setPhotoLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoDelete = async (photoId) => {
    if (!selectedSow) return;
    try {
      await pigService.removePhoto(selectedSow.id, photoId);
      toast({
        title: "Fotografía eliminada",
        description: "La imagen fue removida del registro.",
      });
      await refreshSow(selectedSow.id);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error?.message || "No fue posible eliminar la fotografía.",
        variant: "destructive",
      });
    }
  };

  const orderedSows = [...sows].sort((a, b) => a.pigId.localeCompare(b.pigId, "es"));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PiggyBank className="h-8 w-8 text-[#6b7c45]" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro Porcino</h1>
          <p className="text-sm text-gray-600 mt-1">
            Registra la identificación individual, datos genealógicos y fotografías de cada cerda reproductora.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshSow(selectedSowId)}
            disabled={!selectedSowId || loadingDetails}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", loadingDetails && "animate-spin")} />
            Actualizar
          </Button>
        </div>
        <Button onClick={() => navigate("/sows/register")}>
          <Plus className="mr-2 h-4 w-4" /> Registrar cerda
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Seleccionar cerda</CardTitle>
          <CardDescription>
            Elige una cerda reproductora para gestionar su información.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loadingSows ? (
            <p className="text-sm text-gray-500">Cargando cerdas registradas...</p>
          ) : orderedSows.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay cerdas registradas. Registra una nueva cerda para comenzar.
            </p>
          ) : (
            <div className="grid gap-4">
              <div>
                <Label htmlFor="sow-selector">Cerda</Label>
                <Select
                  value={selectedSowId ? String(selectedSowId) : ""}
                  onValueChange={setSelectedSowId}
                >
                  <SelectTrigger id="sow-selector">
                    <SelectValue placeholder="Selecciona una cerda" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderedSows.map((sow) => (
                      <SelectItem key={sow.id} value={String(sow.id)}>
                        {sow.pigId} - {sow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSow && (
        <>
          <Card>
            <CardHeader className="border-b border-gray-100">
              <CardTitle>Identificación del animal</CardTitle>
              <CardDescription>
                Completa los datos oficiales de identificación de la cerda.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="pigId">Número/ID de la cerda *</Label>
                  <Input
                    id="pigId"
                    value={identificationForm.pigId}
                    onChange={(e) => handleIdentificationChange("pigId", e.target.value)}
                    placeholder="Ej: CER-001, RFID-12345"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={identificationForm.name}
                    onChange={(e) => handleIdentificationChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="alias">Alias (opcional)</Label>
                  <Input
                    id="alias"
                    value={identificationForm.alias}
                    onChange={(e) => handleIdentificationChange("alias", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="breed">Raza *</Label>
                  <Input
                    id="breed"
                    placeholder="Large White, Landrace, Duroc, F1..."
                    value={identificationForm.breed}
                    onChange={(e) => handleIdentificationChange("breed", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={identificationForm.birthDate || ""}
                    onChange={(e) => handleIdentificationChange("birthDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="entryDate">Fecha de entrada a granja</Label>
                  <Input
                    id="entryDate"
                    type="date"
                    value={identificationForm.entryDate || ""}
                    onChange={(e) => handleIdentificationChange("entryDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="origin">Origen</Label>
                  <Select
                    value={identificationForm.origin}
                    onValueChange={(value) => handleIdentificationChange("origin", value)}
                  >
                    <SelectTrigger id="origin">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORIGIN_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Estado actual</Label>
                  <Select
                    value={identificationForm.status}
                    onValueChange={(value) => handleIdentificationChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <Label htmlFor="location">Ubicación física</Label>
                  <Input
                    id="location"
                    placeholder="Sala, corral, jaula específica (Ej: Maternidad - Sala 1 - Jaula 03)"
                    value={identificationForm.location}
                    onChange={(e) => handleIdentificationChange("location", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="fatherId">ID del padre (verraco)</Label>
                  <Input
                    id="fatherId"
                    value={identificationForm.fatherId}
                    onChange={(e) => handleIdentificationChange("fatherId", e.target.value)}
                    placeholder="Ej: VER-045"
                  />
                </div>
                <div>
                  <Label htmlFor="motherId">ID de la madre</Label>
                  <Input
                    id="motherId"
                    value={identificationForm.motherId}
                    onChange={(e) => handleIdentificationChange("motherId", e.target.value)}
                    placeholder="Ej: CER-015"
                  />
                </div>
                <div>
                  <Label htmlFor="geneticLine">Línea genética</Label>
                  <Input
                    id="geneticLine"
                    value={identificationForm.geneticLine}
                    onChange={(e) => handleIdentificationChange("geneticLine", e.target.value)}
                    placeholder="Ej: Línea Aurora, LW x LR"
                  />
                </div>
                <div>
                  <Label htmlFor="generation">Generación</Label>
                  <Input
                    id="generation"
                    value={identificationForm.generation}
                    onChange={(e) => handleIdentificationChange("generation", e.target.value)}
                    placeholder="Ej: F1, F2, F3"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <Label htmlFor="notes">Observaciones generales</Label>
                  <textarea
                    id="notes"
                    value={identificationForm.notes}
                    onChange={(e) => handleIdentificationChange("notes", e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b7c45]"
                    rows={3}
                    placeholder="Notas generales sobre la cerda"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveIdentification} disabled={savingIdentification}>
                  {savingIdentification ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-100">
              <CardTitle>Fotografías del animal</CardTitle>
              <CardDescription>
                Adjunta imágenes de referencia de la cerda en diferentes etapas.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Upload className={cn("h-4 w-4", photoLoading && "animate-pulse")} />
                    <span>{photoLoading ? "Procesando..." : "Subir fotografía"}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={photoLoading}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Formatos: JPG, PNG. Se almacenan localmente en el navegador.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedSow.photos?.length === 0 && (
                  <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 text-center text-sm text-gray-400">
                    <ImageIcon className="mb-2 h-6 w-6" />
                    Sin fotografías registradas.
                  </div>
                )}

                {selectedSow.photos?.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative overflow-hidden rounded-lg border shadow-sm"
                  >
                    {photo.url ? (
                      <img
                        src={photo.url}
                        alt={photo.label || "Fotografía"}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-gray-100 text-sm text-gray-500">
                        Sin imagen disponible
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t bg-white px-3 py-2 text-sm text-gray-600">
                      <div>
                        <p className="font-medium text-gray-800">{photo.label || "Sin título"}</p>
                        <p className="text-xs text-gray-500">{formatDate(photo.capturedAt)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handlePhotoDelete(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar nueva cerda</DialogTitle>
            <DialogDescription>
              Completa los datos básicos para crear una nueva cerda reproductora.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-pig-id">ID de la cerda *</Label>
              <Input
                id="new-pig-id"
                value={createForm.pigId}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, pigId: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-pig-name">Nombre *</Label>
              <Input
                id="new-pig-name"
                value={createForm.name}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-pig-breed">Raza *</Label>
              <Input
                id="new-pig-breed"
                value={createForm.breed}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, breed: e.target.value }))}
                placeholder="Large White, Landrace, Duroc..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-pig-birth">Fecha de nacimiento</Label>
              <Input
                id="new-pig-birth"
                type="date"
                value={createForm.birthDate}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, birthDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSow} disabled={creatingSow}>
              {creatingSow ? "Creando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

