import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon,
  Download,
  Calendar,
  Activity,
  Baby,
  Heart,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { 
  sowService, 
  boarService, 
  pregnancyService, 
  birthService,
  heatService,
  serviceService,
  abortionService
} from "@/services/api";

export default function ReportsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [stats, setStats] = useState({
    sows: {
      total: 0,
      active: 0,
      pregnant: 0,
      empty: 0,
      lactating: 0,
      discarded: 0
    },
    boars: {
      total: 0,
      active: 0
    },
    reproduction: {
      heats: 0,
      services: 0,
      pregnancies: 0,
      births: 0,
      abortions: 0,
      totalBorn: 0,
      bornAlive: 0,
      bornDead: 0
    },
    productivity: {
      fertilityRate: 0,
      abortionRate: 0,
      avgBornAlive: 0,
      avgWeaned: 0,
      mortalityRate: 0
    }
  });

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Calcular rango de fechas
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(selectedPeriod));

      // Cargar datos en paralelo
      const [sows, boars, heats, services, pregnancies, births, abortions] = await Promise.all([
        sowService.getAllSows(),
        boarService.getAllBoars(),
        heatService.getAllHeats(),
        serviceService.getAllServices(),
        pregnancyService.getAllPregnancies(),
        birthService.getAllBirths(),
        abortionService.getAllAbortions()
      ]);

      // Filtrar por período
      const filterByDate = (items, dateField) => {
        return items.filter(item => {
          const itemDate = new Date(item[dateField]);
          return itemDate >= startDate && itemDate <= endDate;
        });
      };

      const periodHeats = filterByDate(heats, 'heat_date');
      const periodServices = filterByDate(services, 'service_date');
      const periodPregnancies = filterByDate(pregnancies, 'confirmed_date');
      const periodBirths = filterByDate(births, 'birth_date');
      const periodAbortions = filterByDate(abortions, 'abortion_date');

      // Calcular estadísticas de cerdas
      const sowStats = {
        total: sows.length,
        active: sows.filter(s => s.status === 'activa').length,
        pregnant: sows.filter(s => s.reproductive_status === 'gestante').length,
        empty: sows.filter(s => s.reproductive_status === 'vacia').length,
        lactating: sows.filter(s => s.reproductive_status === 'lactante').length,
        discarded: sows.filter(s => s.status === 'descartada').length
      };

      // Calcular estadísticas de verracos
      const boarStats = {
        total: boars.length,
        active: boars.filter(b => b.status === 'activo').length
      };

      // Calcular estadísticas reproductivas
      const totalBorn = periodBirths.reduce((sum, b) => sum + (b.total_born || 0), 0);
      const bornAlive = periodBirths.reduce((sum, b) => sum + (b.born_alive || 0), 0);
      const bornDead = periodBirths.reduce((sum, b) => sum + (b.born_dead || 0), 0);

      const reproductionStats = {
        heats: periodHeats.length,
        services: periodServices.length,
        pregnancies: periodPregnancies.length,
        births: periodBirths.length,
        abortions: periodAbortions.length,
        totalBorn,
        bornAlive,
        bornDead
      };

      // Calcular indicadores de productividad con validaciones
      const fertilityRate = periodServices.length > 0 
        ? (periodPregnancies.length / periodServices.length) * 100 
        : 0;
      
      const abortionRate = periodPregnancies.length > 0
        ? (periodAbortions.length / periodPregnancies.length) * 100
        : 0;

      const avgBornAlive = periodBirths.length > 0
        ? bornAlive / periodBirths.length
        : 0;

      const mortalityRate = totalBorn > 0
        ? (bornDead / totalBorn) * 100
        : 0;

      // Función helper para evitar NaN
      const safeNumber = (value, decimals = 1) => {
        if (isNaN(value) || !isFinite(value)) return "0.0";
        return Number(value).toFixed(decimals);
      };

      setStats({
        sows: sowStats,
        boars: boarStats,
        reproduction: reproductionStats,
        productivity: {
          fertilityRate: safeNumber(fertilityRate),
          abortionRate: safeNumber(abortionRate),
          avgBornAlive: safeNumber(avgBornAlive),
          mortalityRate: safeNumber(mortalityRate)
        }
      });
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      red: "from-red-500 to-red-600",
      pink: "from-pink-500 to-pink-600"
    };

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className={`bg-gradient-to-r ${colorClasses[color]} p-4 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{title}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
                {trend && (
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    {trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{trendValue}</span>
                  </div>
                )}
              </div>
              <Icon className="h-12 w-12 opacity-80" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProgressBar = ({ label, value, max, color = "bg-blue-600" }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="text-gray-600">{value} / {max}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${color} transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  const PieChart = ({ data, size = 200 }) => {
    const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    
    // Si no hay datos, mostrar mensaje
    if (total === 0) {
      return (
        <div className="flex items-center justify-center" style={{ width: size, height: size }}>
          <p className="text-gray-400 text-sm text-center">Sin datos<br/>para mostrar</p>
        </div>
      );
    }

    let currentAngle = -90;

    return (
      <div className="flex items-center gap-8">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
          />
          {data.map((item, index) => {
            const itemValue = Number(item.value) || 0;
            const percentage = (itemValue / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const radius = size / 2 - 10;
            const centerX = size / 2;
            const centerY = size / 2;

            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);

            const largeArc = angle > 180 ? 1 : 0;

            if (itemValue === 0) return null;

            return (
              <path
                key={index}
                d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color}
                opacity="0.9"
              />
            );
          })}
          <circle cx={size / 2} cy={size / 2} r={size / 3} fill="white" />
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold"
            fill="#374151"
          >
            {total}
          </text>
        </svg>

        <div className="space-y-2">
          {data.map((item, index) => {
            const itemValue = Number(item.value) || 0;
            const percentage = total > 0 ? ((itemValue / total) * 100) : 0;
            return (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">
                  {item.label}: <span className="font-bold">{itemValue}</span>
                  {" "}({percentage.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const BarChart = ({ data, height = 300 }) => {
    const maxValue = Math.max(...data.map(d => Number(d.value) || 0), 1);
    const barWidth = 60;
    const spacing = 40;
    const width = data.length * (barWidth + spacing);

    return (
      <div className="overflow-x-auto">
        <svg width={Math.max(width, 600)} height={height + 60}>
          {/* Líneas de referencia */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const refValue = (maxValue * percent) / 100;
            return (
              <g key={percent}>
                <line
                  x1="0"
                  y1={height - (height * percent) / 100}
                  x2={width}
                  y2={height - (height * percent) / 100}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x="-5"
                  y={height - (height * percent) / 100 + 5}
                  textAnchor="end"
                  className="text-xs"
                  fill="#9ca3af"
                >
                  {isNaN(refValue) ? 0 : Math.round(refValue)}
                </text>
              </g>
            );
          })}

          {/* Barras */}
          {data.map((item, index) => {
            const itemValue = Number(item.value) || 0;
            const barHeight = maxValue > 0 ? (itemValue / maxValue) * height : 0;
            const x = index * (barWidth + spacing) + spacing / 2;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={height - barHeight}
                  width={barWidth}
                  height={Math.max(barHeight, 0)}
                  fill={item.color}
                  rx="4"
                  className="transition-all duration-500"
                />
                <text
                  x={x + barWidth / 2}
                  y={Math.max(height - barHeight - 10, 15)}
                  textAnchor="middle"
                  className="text-sm font-bold"
                  fill={item.color}
                >
                  {itemValue}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={height + 20}
                  textAnchor="middle"
                  className="text-xs"
                  fill="#374151"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const LineChart = ({ data, height = 250, width = 600 }) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => Number(d.value) || 0), 1);
    const minValue = Math.min(...data.map(d => Number(d.value) || 0), 0);
    const range = maxValue - minValue || 1;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data.map((item, index) => {
      const x = padding + (chartWidth / (data.length - 1 || 1)) * index;
      const y = padding + chartHeight - ((item.value - minValue) / range) * chartHeight;
      return { x, y, ...item };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <svg width={width} height={height}>
        {/* Grid */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <line
            key={percent}
            x1={padding}
            y1={padding + (chartHeight * (100 - percent)) / 100}
            x2={width - padding}
            y2={padding + (chartHeight * (100 - percent)) / 100}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Área bajo la línea */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#gradient)"
          opacity="0.3"
        />

        {/* Línea */}
        <path
          d={pathData}
          fill="none"
          stroke="#6b7c45"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Puntos */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="white"
              stroke="#6b7c45"
              strokeWidth="3"
            />
            <text
              x={point.x}
              y={height - padding + 20}
              textAnchor="middle"
              className="text-xs"
              fill="#374151"
            >
              {point.label}
            </text>
          </g>
        ))}

        {/* Gradiente */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6b7c45" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6b7c45" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-[#6b7c45]" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
              <p className="text-sm text-gray-600 mt-1">
                Análisis completo de la producción y rendimiento de la granja
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
                <SelectItem value="180">Últimos 6 meses</SelectItem>
                <SelectItem value="365">Último año</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="reproduction">Reproducción</TabsTrigger>
            <TabsTrigger value="productivity">Productividad</TabsTrigger>
          </TabsList>

          {/* Tab: Resumen General */}
          <TabsContent value="overview" className="space-y-6">
            {/* Tarjetas de estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Cerdas"
                value={stats.sows.total}
                icon={Activity}
                color="pink"
              />
              <StatCard
                title="Cerdas Activas"
                value={stats.sows.active}
                icon={CheckCircle2}
                color="green"
              />
              <StatCard
                title="En Gestación"
                value={stats.sows.pregnant}
                icon={Heart}
                color="purple"
              />
              <StatCard
                title="Partos Período"
                value={stats.reproduction.births}
                icon={Baby}
                color="blue"
              />
            </div>

            {/* Estado de cerdas - Con Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estado Reproductivo de Cerdas</CardTitle>
                  <CardDescription>Distribución del inventario activo</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                  <PieChart
                    data={[
                      { label: "Gestantes", value: stats.sows.pregnant, color: "#9333ea" },
                      { label: "Lactantes", value: stats.sows.lactating, color: "#3b82f6" },
                      { label: "Vacías", value: stats.sows.empty, color: "#f97316" }
                    ]}
                    size={220}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado General del Inventario</CardTitle>
                  <CardDescription>Cerdas activas vs descartadas</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                  <PieChart
                    data={[
                      { label: "Activas", value: stats.sows.active, color: "#22c55e" },
                      { label: "Descartadas", value: stats.sows.discarded, color: "#6b7280" }
                    ]}
                    size={220}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Verracos */}
            <Card>
              <CardHeader>
                <CardTitle>Verracos</CardTitle>
                <CardDescription>Estado del inventario de verracos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{stats.boars.total}</p>
                    <p className="text-sm text-gray-600 mt-1">Total</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{stats.boars.active}</p>
                    <p className="text-sm text-gray-600 mt-1">Activos</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">
                      {stats.reproduction.services}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Servicios</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-3xl font-bold text-orange-600">
                      {stats.boars.active > 0 
                        ? (stats.reproduction.services / stats.boars.active).toFixed(1) 
                        : "0.0"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Servicios/Verraco</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Reproducción */}
          <TabsContent value="reproduction" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Celos Detectados"
                value={stats.reproduction.heats}
                icon={Heart}
                color="pink"
              />
              <StatCard
                title="Servicios"
                value={stats.reproduction.services}
                icon={Activity}
                color="purple"
              />
              <StatCard
                title="Gestaciones"
                value={stats.reproduction.pregnancies}
                icon={Heart}
                color="blue"
              />
              <StatCard
                title="Abortos"
                value={stats.reproduction.abortions}
                icon={AlertCircle}
                color="red"
              />
            </div>

            {/* Gráfica de barras del proceso reproductivo */}
            <Card>
              <CardHeader>
                <CardTitle>Flujo del Proceso Reproductivo</CardTitle>
                <CardDescription>Desde la detección de celo hasta el parto</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { label: "Celos", value: stats.reproduction.heats, color: "#ec4899" },
                    { label: "Servicios", value: stats.reproduction.services, color: "#a855f7" },
                    { label: "Gestaciones", value: stats.reproduction.pregnancies, color: "#3b82f6" },
                    { label: "Partos", value: stats.reproduction.births, color: "#22c55e" },
                    { label: "Abortos", value: stats.reproduction.abortions, color: "#ef4444" }
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resultados de Partos</CardTitle>
                  <CardDescription>Análisis de camadas en el período</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-4xl font-bold text-blue-600">{stats.reproduction.births}</p>
                      <p className="text-sm text-gray-600 mt-1">Total Partos</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-4xl font-bold text-green-600">{stats.reproduction.bornAlive}</p>
                      <p className="text-sm text-gray-600 mt-1">Nacidos Vivos</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-4xl font-bold text-red-600">{stats.reproduction.bornDead}</p>
                      <p className="text-sm text-gray-600 mt-1">Nacidos Muertos</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-4xl font-bold text-purple-600">{stats.reproduction.totalBorn}</p>
                      <p className="text-sm text-gray-600 mt-1">Total Nacidos</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-center mb-2">Eficiencia Reproductiva</h3>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Promedio Nacidos Vivos</span>
                        <span className="font-bold">{stats.productivity.avgBornAlive}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tasa de Mortalidad</span>
                        <span className="font-bold text-red-600">{stats.productivity.mortalityRate}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Nacimientos</CardTitle>
                  <CardDescription>Nacidos vivos vs nacidos muertos</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                  <PieChart
                    data={[
                      { label: "Nacidos Vivos", value: stats.reproduction.bornAlive, color: "#22c55e" },
                      { label: "Nacidos Muertos", value: stats.reproduction.bornDead, color: "#ef4444" }
                    ]}
                    size={240}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Productividad */}
          <TabsContent value="productivity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className={`border-2 ${
                parseFloat(stats.productivity.fertilityRate) >= 85 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-orange-500 bg-orange-50'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tasa de Fertilidad</p>
                      <p className="text-3xl font-bold mt-1">{stats.productivity.fertilityRate}%</p>
                      <p className="text-xs text-gray-500 mt-1">Objetivo: ≥85%</p>
                    </div>
                    {parseFloat(stats.productivity.fertilityRate) >= 85 ? (
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    ) : (
                      <TrendingDown className="h-10 w-10 text-orange-600" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-2 ${
                parseFloat(stats.productivity.abortionRate) <= 3 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tasa de Abortos</p>
                      <p className="text-3xl font-bold mt-1">{stats.productivity.abortionRate}%</p>
                      <p className="text-xs text-gray-500 mt-1">Objetivo: ≤3%</p>
                    </div>
                    {parseFloat(stats.productivity.abortionRate) <= 3 ? (
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    ) : (
                      <AlertCircle className="h-10 w-10 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-2 ${
                parseFloat(stats.productivity.avgBornAlive) >= 11 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-orange-500 bg-orange-50'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Promedio Nacidos Vivos</p>
                      <p className="text-3xl font-bold mt-1">{stats.productivity.avgBornAlive}</p>
                      <p className="text-xs text-gray-500 mt-1">Objetivo: ≥11</p>
                    </div>
                    {parseFloat(stats.productivity.avgBornAlive) >= 11 ? (
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    ) : (
                      <TrendingDown className="h-10 w-10 text-orange-600" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-2 ${
                parseFloat(stats.productivity.mortalityRate) <= 10 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Mortalidad al Nacer</p>
                      <p className="text-3xl font-bold mt-1">{stats.productivity.mortalityRate}%</p>
                      <p className="text-xs text-gray-500 mt-1">Objetivo: ≤10%</p>
                    </div>
                    {parseFloat(stats.productivity.mortalityRate) <= 10 ? (
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    ) : (
                      <AlertCircle className="h-10 w-10 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficas de KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Indicadores vs Objetivos</CardTitle>
                  <CardDescription>Comparación visual de KPIs con metas establecidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={[
                      { 
                        label: `Fertilidad\n(${stats.productivity.fertilityRate}%)`, 
                        value: parseFloat(stats.productivity.fertilityRate), 
                        color: parseFloat(stats.productivity.fertilityRate) >= 85 ? "#22c55e" : "#f97316" 
                      },
                      { 
                        label: `Nacidos Vivos\n(${stats.productivity.avgBornAlive})`, 
                        value: parseFloat(stats.productivity.avgBornAlive), 
                        color: parseFloat(stats.productivity.avgBornAlive) >= 11 ? "#22c55e" : "#f97316" 
                      },
                      { 
                        label: `Abortos\n(${stats.productivity.abortionRate}%)`, 
                        value: parseFloat(stats.productivity.abortionRate), 
                        color: parseFloat(stats.productivity.abortionRate) <= 3 ? "#22c55e" : "#ef4444" 
                      },
                      { 
                        label: `Mortalidad\n(${stats.productivity.mortalityRate}%)`, 
                        value: parseFloat(stats.productivity.mortalityRate), 
                        color: parseFloat(stats.productivity.mortalityRate) <= 10 ? "#22c55e" : "#ef4444" 
                      }
                    ]}
                    height={280}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cumplimiento de Objetivos</CardTitle>
                  <CardDescription>Porcentaje de KPIs que cumplen con los objetivos</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                  <PieChart
                    data={[
                      { 
                        label: "KPIs Cumplidos", 
                        value: [
                          parseFloat(stats.productivity.fertilityRate) >= 85,
                          parseFloat(stats.productivity.avgBornAlive) >= 11,
                          parseFloat(stats.productivity.abortionRate) <= 3,
                          parseFloat(stats.productivity.mortalityRate) <= 10
                        ].filter(Boolean).length,
                        color: "#22c55e" 
                      },
                      { 
                        label: "KPIs Pendientes", 
                        value: 4 - [
                          parseFloat(stats.productivity.fertilityRate) >= 85,
                          parseFloat(stats.productivity.avgBornAlive) >= 11,
                          parseFloat(stats.productivity.abortionRate) <= 3,
                          parseFloat(stats.productivity.mortalityRate) <= 10
                        ].filter(Boolean).length,
                        color: "#ef4444" 
                      }
                    ]}
                    size={240}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detalle de Indicadores Clave (KPIs)</CardTitle>
                <CardDescription>
                  Análisis detallado de cada indicador con sus objetivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Tasa de Fertilidad</span>
                      <span className="text-sm text-gray-600">
                        {stats.productivity.fertilityRate}% (Objetivo: 85-95%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          parseFloat(stats.productivity.fertilityRate) >= 85
                            ? 'bg-green-600'
                            : 'bg-orange-600'
                        }`}
                        style={{ width: `${Math.min(parseFloat(stats.productivity.fertilityRate), 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Promedio Nacidos Vivos por Camada</span>
                      <span className="text-sm text-gray-600">
                        {stats.productivity.avgBornAlive} (Objetivo: ≥11)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          parseFloat(stats.productivity.avgBornAlive) >= 11
                            ? 'bg-green-600'
                            : 'bg-orange-600'
                        }`}
                        style={{ width: `${(parseFloat(stats.productivity.avgBornAlive) / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Control de Abortos</span>
                      <span className="text-sm text-gray-600">
                        {stats.productivity.abortionRate}% (Objetivo: ≤3%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          parseFloat(stats.productivity.abortionRate) <= 3
                            ? 'bg-green-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(parseFloat(stats.productivity.abortionRate) * 10, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Control de Mortalidad al Nacer</span>
                      <span className="text-sm text-gray-600">
                        {stats.productivity.mortalityRate}% (Objetivo: ≤10%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          parseFloat(stats.productivity.mortalityRate) <= 10
                            ? 'bg-green-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(parseFloat(stats.productivity.mortalityRate) * 5, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

