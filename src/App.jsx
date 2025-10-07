import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, TrendingUp, Map, Settings, Play, PauseCircle } from "lucide-react";

// ------------------------------
// MOCK DATA (Jaipur – 4 dark stores)
// ------------------------------
const stores = [
  { id: "JPR-CENT", name: "Central Jaipur", zone: "Central" },
  { id: "JPR-NORTH", name: "North Jaipur", zone: "North" },
  { id: "JPR-SOUTH", name: "South Jaipur", zone: "South" },
  { id: "JPR-WEST", name: "West Jaipur", zone: "West" },
];

// Orders per store today (sum ≈ 120)
const ordersToday = [
  { store: "Central Jaipur", orders: 34, onTime: 0.94, costPerOrder: 68 },
  { store: "North Jaipur", orders: 28, onTime: 0.9, costPerOrder: 72 },
  { store: "South Jaipur", orders: 31, onTime: 0.92, costPerOrder: 70 },
  { store: "West Jaipur", orders: 27, onTime: 0.91, costPerOrder: 71 },
];

// Cost per order trend (last 14 days – synthetic, trending slightly down)
const costTrend = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  cost: Math.round(74 - i * 0.4 + (Math.random() * 2 - 1)),
}));

// Forecast for tomorrow (P50/P90)
const forecast = [
  { store: "Central Jaipur", p50: 33, p90: 38 },
  { store: "North Jaipur", p50: 27, p90: 32 },
  { store: "South Jaipur", p50: 31, p90: 36 },
  { store: "West Jaipur", p50: 29, p90: 34 },
];

// At-risk orders (sample)
const riskOrders = [
  { id: "ORD-1012", zone: "South", reason: "Traffic spike", action: "Resequence: move stop #5 earlier" },
  { id: "ORD-1019", zone: "Central", reason: "Low-confidence address", action: "Call to verify landmark" },
  { id: "ORD-1033", zone: "North", reason: "Rider delay vs ETA", action: "Dispatch helper for last 3 stops" },
];

// Mocked runs (Dispatcher view)
const runs = [
  {
    rider: "R-07 (Central)",
    totalKm: 18.2,
    estTimeMin: 92,
    stops: [
      { n: 1, id: "ORD-1001", eta: "10:20" },
      { n: 2, id: "ORD-1019", eta: "10:37" },
      { n: 3, id: "ORD-1042", eta: "10:55" },
      { n: 4, id: "ORD-1057", eta: "11:18" },
    ],
  },
  {
    rider: "R-12 (South)",
    totalKm: 16.1,
    estTimeMin: 85,
    stops: [
      { n: 1, id: "ORD-1012", eta: "10:28" },
      { n: 2, id: "ORD-1027", eta: "10:45" },
      { n: 3, id: "ORD-1038", eta: "11:02" },
      { n: 4, id: "ORD-1060", eta: "11:20" },
    ],
  },
  {
    rider: "R-19 (North)",
    totalKm: 17.4,
    estTimeMin: 88,
    stops: [
      { n: 1, id: "ORD-1033", eta: "10:33" },
      { n: 2, id: "ORD-1049", eta: "10:52" },
      { n: 3, id: "ORD-1055", eta: "11:07" },
      { n: 4, id: "ORD-1066", eta: "11:25" },
    ],
  },
];

// Dynamic pricing recommendations (sample)
const pricing = [
  { lane: "Central: High density", suggestion: "+₹4 / order", note: "Keep SLA standard" },
  { lane: "North: Premium SLA", suggestion: "+₹6 / order", note: "Pilot for 7 days" },
  { lane: "West: Lane capture promo", suggestion: "-₹3 / order", note: "Evening window only" },
];

// Risk heatmap by zone (simple pie to show relative risk share)
const riskByZone = [
  { name: "Central", value: 3 },
  { name: "North", value: 4 },
  { name: "South", value: 5 },
  { name: "West", value: 2 },
];
const colors = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444"]; // Tailwind-esque

// ------------------------------
// HELPER INSIGHTS
// ------------------------------
const kpiFromOrders = () => {
  const totalOrders = ordersToday.reduce((a, b) => a + b.orders, 0);
  const avgOnTime = ordersToday.reduce((a, b) => a + b.onTime * b.orders, 0) / totalOrders;
  const avgCost = ordersToday.reduce((a, b) => a + b.costPerOrder * b.orders, 0) / totalOrders;
  return { totalOrders, onTime: avgOnTime, cost: avgCost };
};

const insights = () => {
  const { onTime, cost } = kpiFromOrders();
  const trendStart = costTrend[0].cost;
  const trendEnd = costTrend[costTrend.length - 1].cost;
  const costDelta = Math.round((trendStart - trendEnd) * 10) / 10;
  const tomorrowP50 = forecast.reduce((a, b) => a + b.p50, 0);
  const highRiskZone = riskByZone.reduce((max, z) => (z.value > max.value ? z : max), riskByZone[0]);
  return [
    {
      title: "SLA Reliability",
      msg: `On-time today ~ ${(onTime * 100).toFixed(1)}% (target 94–95%)`,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      title: "Cost Curve",
      msg: `Cost/order trending down by ~₹${costDelta} over 2 weeks`,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      title: "Tomorrow Forecast",
      msg: `Expected volume (P50): ${tomorrowP50} orders — adjust roster accordingly`,
      icon: <Settings className="w-4 h-4" />,
    },
    {
      title: "Risk Hotspot",
      msg: `${highRiskZone.name} shows higher risk — prep call/assists`,
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  ];
};

// ------------------------------
// UI COMPONENTS
// ------------------------------
const KpiCard = ({ label, value, sub }) => (
  <Card className="rounded-2xl shadow-sm">
    <CardContent className="p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </CardContent>
  </Card>
);

const Section = ({ title, children, right }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      {right}
    </div>
    <div className="grid grid-cols-12 gap-4">{children}</div>
  </div>
);

export default function App() {
  const { totalOrders, onTime, cost } = kpiFromOrders();
  const cards = useMemo(() => insights(), []);
  const [tab, setTab] = useState("analytics");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">QwikDel – Logistics AI Demo</h1>
          <Tabs value={tab} onValueChange={setTab} className="">
            <TabsList>
              <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
              <TabsTrigger value="ops">Dispatch Console</TabsTrigger>
              <TabsTrigger value="pricing">Pricing Optimizer</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="text-sm text-gray-500 mt-1">Jaipur Pilot · 4 dark stores · ~120 orders/day</p>
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsContent value="analytics" className="mt-2">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <KpiCard label="Orders Today" value={totalOrders} sub="Across 4 stores" />
            <KpiCard label="On-time %" value={(onTime * 100).toFixed(1) + "%"} sub="Target 94–95%" />
            <KpiCard label="Avg Cost/Order" value={`₹${cost.toFixed(0)}`} sub="Last 24h" />
            <KpiCard label="Forecast (P50)" value={forecast.reduce((a, b) => a + b.p50, 0)} sub="Tomorrow" />
          </div>

          {/* Insights */}
          <Section title="AI Insights" right={<div className="text-xs text-gray-400">Auto-updated hourly</div>}>
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {cards.map((c, i) => (
                <Card key={i} className="rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm font-medium"><span>{c.icon}</span>{c.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{c.msg}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          {/* Charts */}
          <Section title="Cost per Order (14-day)">
            <div className="col-span-12 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={costTrend}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="cost" stroke="#2563eb" fill="url(#g)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Orders by Store (Today)">
            <div className="col-span-12 md:col-span-8 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersToday}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="store" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-12 md:col-span-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskByZone} innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                    {riskByZone.map((entry, index) => (
                      <Cell key={`c-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="At-Risk Orders (Live)">
            <div className="col-span-12">
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3">Order ID</th>
                      <th className="text-left p-3">Zone</th>
                      <th className="text-left p-3">Reason</th>
                      <th className="text-left p-3">Suggested Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskOrders.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="p-3 font-medium">{r.id}</td>
                        <td className="p-3">{r.zone}</td>
                        <td className="p-3">{r.reason}</td>
                        <td className="p-3">{r.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="ops" className="mt-2">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 xl:col-span-8">
              <Card className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold flex items-center gap-2"><Map className="w-4 h-4"/> Dispatcher Board</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary"><Play className="w-4 h-4 mr-1"/>Auto-batch</Button>
                      <Button size="sm" variant="secondary"><PauseCircle className="w-4 h-4 mr-1"/>Hold waves</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {runs.map((run) => (
                      <div key={run.rider} className="rounded-xl border p-3">
                        <div className="font-medium mb-1">{run.rider}</div>
                        <div className="text-xs text-gray-500 mb-2">{run.totalKm} km · {run.estTimeMin} mins</div>
                        <ol className="text-sm space-y-1">
                          {run.stops.map((s) => (
                            <li key={s.n} className="flex items-center justify-between">
                              <span>#{s.n} · {s.id}</span>
                              <span className="text-gray-500">ETA {s.eta}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-12 xl:col-span-4">
              <Card className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="text-sm font-semibold flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4"/> Live Risks</div>
                  <ul className="text-sm space-y-2">
                    {riskOrders.map((r) => (
                      <li key={r.id} className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{r.id} · {r.zone}</div>
                          <div className="text-gray-500">{r.reason}</div>
                        </div>
                        <Button size="sm" variant="outline">{r.action.split(" ")[0]}</Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="mt-2">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="text-sm font-semibold mb-3">Dynamic Pricing Suggestions</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {pricing.map((p, i) => (
                  <div key={i} className="rounded-xl border p-3">
                    <div className="font-medium">{p.lane}</div>
                    <div className="text-sm text-gray-600">Recommendation: <span className="font-semibold">{p.suggestion}</span></div>
                    <div className="text-xs text-gray-500 mt-1">Note: {p.note}</div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="secondary">Apply</Button>
                      <Button size="sm" variant="outline">A/B Test</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-6" />
      <footer className="text-xs text-gray-500">
        <div>ROI markers: Pipeline ≈ 5% • Routing –10–12% cost • Reliability +6–8 pp on-time • Forecasting idle/surge ↓ • Pricing +₹/order</div>
        <div>Demo data is synthetic and aligned to Jaipur pilot assumptions (~120 orders/day across 4 dark stores).</div>
      </footer>
    </div>
  );
}
