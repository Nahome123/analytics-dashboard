import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Bell,
  Search,
  Moon,
  Sun,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Filter,
  Menu,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12000, users: 220 },
  { month: "Feb", revenue: 14800, users: 260 },
  { month: "Mar", revenue: 16500, users: 310 },
  { month: "Apr", revenue: 18200, users: 350 },
  { month: "May", revenue: 20100, users: 390 },
  { month: "Jun", revenue: 22500, users: 460 },
  { month: "Jul", revenue: 24400, users: 510 },
  { month: "Aug", revenue: 26900, users: 590 },
];

const trafficData = [
  { name: "Organic", value: 42 },
  { name: "Referral", value: 21 },
  { name: "Paid Ads", value: 19 },
  { name: "Direct", value: 18 },
];

const clientData = [
  { id: 1, client: "Acme Corp", category: "Finance", status: "Active", revenue: 12500, region: "North America" },
  { id: 2, client: "Bright Path", category: "Healthcare", status: "Pending", revenue: 8400, region: "Europe" },
  { id: 3, client: "Cloud Nine", category: "Technology", status: "Active", revenue: 15600, region: "North America" },
  { id: 4, client: "Delta Group", category: "Retail", status: "Inactive", revenue: 6200, region: "Africa" },
  { id: 5, client: "Evergreen", category: "Finance", status: "Active", revenue: 9800, region: "Europe" },
  { id: 6, client: "Frontline Labs", category: "Technology", status: "Pending", revenue: 17300, region: "Asia" },
  { id: 7, client: "Golden Leaf", category: "Retail", status: "Active", revenue: 11100, region: "North America" },
  { id: 8, client: "Halo Health", category: "Healthcare", status: "Inactive", revenue: 7600, region: "Europe" },
];

const activityFeed = [
  { title: "Revenue target exceeded", time: "2 min ago", tone: "positive" },
  { title: "3 new enterprise clients onboarded", time: "18 min ago", tone: "positive" },
  { title: "Pending invoice review needed", time: "34 min ago", tone: "warning" },
  { title: "Weekly report generated", time: "1 hour ago", tone: "neutral" },
];

const pieColors = ["#8b5cf6", "#22c55e", "#f59e0b", "#06b6d4"];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Analytics", icon: BarChart3 },
  { label: "Clients", icon: Users },
  { label: "Alerts", icon: Bell },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function StatCard({
  title,
  value,
  delta,
  positive,
  icon,
}: {
  title: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card stat-card"
    >
      <div className="stat-card-top">
        <div>
          <p className="muted">{title}</p>
          <h3 className="stat-value">{value}</h3>
        </div>
        <div className="icon-badge">{icon}</div>
      </div>

      <div className={cn("delta-pill", positive ? "delta-positive" : "delta-negative")}>
        {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {delta}
      </div>
    </motion.div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "status-active",
    Pending: "status-pending",
    Inactive: "status-inactive",
  };

  return <span className={cn("status-pill", styles[status])}>{status}</span>;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredClients = useMemo(() => {
    return clientData.filter((client) => {
      const matchesStatus = status === "All" ? true : client.status === status;
      const q = search.toLowerCase();

      const matchesSearch =
        client.client.toLowerCase().includes(q) ||
        client.category.toLowerCase().includes(q) ||
        client.region.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [search, status]);

  const totalRevenue = filteredClients.reduce((sum, item) => sum + item.revenue, 0);
  const activeClients = filteredClients.filter((c) => c.status === "Active").length;
  const pendingClients = filteredClients.filter((c) => c.status === "Pending").length;

  return (
    <div className={cn(darkMode ? "theme-dark" : "theme-light", "app-shell")}>
      <div className="app-background">
        <aside className={cn("sidebar", mobileOpen ? "sidebar-open" : "")}>
          <div className="sidebar-header">
            <div>
              <p className="eyebrow">Portfolio App</p>
              <h1>Analytics OS</h1>
            </div>

            <button onClick={() => setMobileOpen(false)} className="close-btn mobile-only">
              Close
            </button>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = index === 0;

              return (
                <button key={item.label} className={cn("nav-item", active && "nav-item-active")}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="deploy-card">
            <p className="deploy-label">Deployment Ready</p>
            <h3>GitHub Pages Friendly</h3>
            <p>
              This version uses mock data, so you can host it as a free static website.
            </p>
          </div>
        </aside>

        <div className="main-area">
          <header className="topbar">
            <div className="topbar-left">
              <button onClick={() => setMobileOpen(true)} className="menu-btn mobile-only">
                <Menu size={18} />
              </button>

              <div>
                <h2>Interactive Analytics Dashboard</h2>
                <p>A polished portfolio dashboard built for free static hosting.</p>
              </div>
            </div>

            <div className="topbar-right">
              <button onClick={() => setDarkMode((v) => !v)} className="theme-btn">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="last-updated desktop-only">Last updated: 2 mins ago</div>

              <div className="avatar">N</div>
            </div>
          </header>

          <main className="content">
            <section className="stats-grid">
              <StatCard
                title="Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                delta="+12.4% this month"
                positive
                icon={<DollarSign size={22} />}
              />
              <StatCard
                title="Active Clients"
                value={String(activeClients)}
                delta="+8.1% this week"
                positive
                icon={<Users size={22} />}
              />
              <StatCard
                title="Pending Reviews"
                value={String(pendingClients)}
                delta="-2.3% today"
                positive={false}
                icon={<Bell size={22} />}
              />
              <StatCard
                title="Engagement"
                value="74.8%"
                delta="+4.7% this month"
                positive
                icon={<Activity size={22} />}
              />
            </section>

            <section className="charts-grid">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="card chart-card chart-wide"
              >
                <div className="card-head">
                  <div>
                    <h3>Revenue Trend</h3>
                    <p>Interactive monthly growth snapshot</p>
                  </div>
                  <div className="tag">8 months</div>
                </div>

                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.04} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" />
                      <YAxis stroke="rgba(255,255,255,0.45)" />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 16,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fill="url(#revenueFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="card chart-card"
              >
                <div className="card-head">
                  <div>
                    <h3>Traffic Sources</h3>
                    <p>Where user sessions are coming from</p>
                  </div>
                </div>

                <div className="chart-wrap chart-short">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={trafficData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
                        {trafficData.map((_, index) => (
                          <Cell key={index} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 16,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="legend-list">
                  {trafficData.map((item, index) => (
                    <div key={item.name} className="legend-row">
                      <div className="legend-left">
                        <span className="legend-dot" style={{ backgroundColor: pieColors[index] }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="legend-value">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            <section className="bottom-grid">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card table-card"
              >
                <div className="table-head">
                  <div>
                    <h3>Client Performance</h3>
                    <p>Search, filter, and review portfolio client data</p>
                  </div>

                  <div className="filters">
                    <div className="search-box">
                      <Search size={16} />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search client, category, region"
                      />
                    </div>

                    <div className="select-box">
                      <Filter size={16} />
                      <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option>All</option>
                        <option>Active</option>
                        <option>Pending</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Category</th>
                        <th>Region</th>
                        <th>Status</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr key={client.id}>
                          <td className="strong">{client.client}</td>
                          <td>{client.category}</td>
                          <td>{client.region}</td>
                          <td>
                            <StatusPill status={client.status} />
                          </td>
                          <td>${client.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredClients.length === 0 && (
                    <div className="empty-state">No clients matched your filters.</div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="side-stack"
              >
                <div className="card chart-card">
                  <div className="card-head">
                    <div>
                      <h3>User Growth</h3>
                      <p>Monthly acquisition trend</p>
                    </div>
                  </div>

                  <div className="chart-wrap chart-short">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" />
                        <YAxis stroke="rgba(255,255,255,0.45)" />
                        <Tooltip
                          contentStyle={{
                            background: "#0f172a",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 16,
                          }}
                        />
                        <Bar dataKey="users" radius={[8, 8, 0, 0]} fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card activity-card">
                  <div className="card-head">
                    <div>
                      <h3>Recent Activity</h3>
                      <p>Live dashboard-style updates</p>
                    </div>
                  </div>

                  <div className="activity-list">
                    {activityFeed.map((item) => (
                      <div key={item.title} className="activity-item">
                        <div className="activity-top">
                          <p>{item.title}</p>
                          <span
                            className={cn(
                              "activity-dot",
                              item.tone === "positive"
                                ? "dot-positive"
                                : item.tone === "warning"
                                ? "dot-warning"
                                : "dot-neutral"
                            )}
                          />
                        </div>
                        <p className="activity-time">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}