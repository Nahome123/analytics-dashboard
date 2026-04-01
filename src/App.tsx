import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import './App.css'

type Stat = {
  title: string
  value: number
  change: number
}

type TrafficItem = {
  month: string
  visits: number
}

type Activity = {
  campaign: string
  status: string
  clicks: number
  conversions: number
}

type DashboardData = {
  stats: Stat[]
  traffic: TrafficItem[]
  activities: Activity[]
}

function App() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/dashboardData.json')
        if (!response.ok) {
          throw new Error('Failed to load dashboard data')
        }

        const json = await response.json()
        setData(json)
      } catch (err) {
        setError('Could not load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredActivities = useMemo(() => {
    if (!data) return []

    return data.activities.filter((item) => {
      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter

      const matchesSearch = item.campaign
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [data, statusFilter, searchTerm])

  if (loading) return <div className="page-message">Loading dashboard...</div>
  if (error) return <div className="page-message error">{error}</div>
  if (!data) return <div className="page-message">No data found.</div>

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>InsightX</h2>
        <nav>
          <p>Dashboard</p>
          <p>Reports</p>
          <p>Analytics</p>
          <p>Settings</p>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Interactive dashboard using dummy JSON data</p>
          </div>
        </header>

        <section className="stats-grid">
          {data.stats.map((stat) => (
            <div className="card" key={stat.title}>
              <h3>{stat.title}</h3>
              <p className="value">
                {stat.title === 'Revenue' ? `$${stat.value.toLocaleString()}` : stat.value.toLocaleString()}
                {stat.title === 'Bounce Rate' ? '%' : ''}
              </p>
              <span className={stat.change >= 0 ? 'change positive' : 'change negative'}>
                {stat.change >= 0 ? '+' : ''}
                {stat.change}%
              </span>
            </div>
          ))}
        </section>

        <section className="charts-grid">
          <div className="card large-card">
            <h3>Traffic Overview</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.traffic}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card filter-card">
            <h3>Filters</h3>

            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Draft">Draft</option>
            </select>

            <label>Search Campaign</label>
            <input
              type="text"
              placeholder="Type campaign name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        <section className="card table-card">
          <h3>Recent Activity</h3>
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Clicks</th>
                <th>Conversions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((item) => (
                <tr key={item.campaign}>
                  <td>{item.campaign}</td>
                  <td>{item.status}</td>
                  <td>{item.clicks}</td>
                  <td>{item.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredActivities.length === 0 && (
            <p className="empty-state">No campaigns match your filter.</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default App