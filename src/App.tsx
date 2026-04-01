import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'
import './App.css'
import { fetchDummyProducts } from './api/dummyJsonApi'

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

type DataSource = 'local' | 'api'

function App() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [dataSource, setDataSource] = useState<DataSource>('local')

  useEffect(() => {
    const loadLocalData = async () => {
      const response = await fetch('/data/dashboardData.json')

      if (!response.ok) {
        throw new Error(`Failed to load local JSON: ${response.status}`)
      }

      const json: DashboardData = await response.json()
      return json
    }

    const loadApiData = async () => {
      const apiData = await fetchDummyProducts()

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

      const mappedData: DashboardData = {
        stats: [
          { title: 'Products', value: apiData.total, change: 9.3 },
          {
            title: 'Avg Price',
            value: Math.round(
              apiData.products.reduce((sum, item) => sum + item.price, 0) /
                apiData.products.length
            ),
            change: 4.8,
          },
          {
            title: 'Total Stock',
            value: apiData.products.reduce((sum, item) => sum + item.stock, 0),
            change: 6.1,
          },
          {
            title: 'Avg Rating',
            value:
              Math.round(
                (apiData.products.reduce((sum, item) => sum + item.rating, 0) /
                  apiData.products.length) *
                  10
              ) / 10,
            change: 2.4,
          },
        ],
        traffic: apiData.products.slice(0, 8).map((item, index) => ({
          month: months[index],
          visits: Math.round(item.price * 12 + item.stock),
        })),
        activities: apiData.products.map((item) => ({
          campaign: item.title,
          status:
            item.stock > 70 ? 'Active' : item.stock > 30 ? 'Paused' : 'Draft',
          clicks: item.stock * 11,
          conversions: Math.round(item.rating * 18),
        })),
      }

      return mappedData
    }

    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const loadedData =
          dataSource === 'local' ? await loadLocalData() : await loadApiData()

        setData(loadedData)
      } catch (err) {
        console.error(err)
        setError('Could not load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dataSource])

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

  const statusOptions = useMemo(() => {
    if (!data) return ['All']
    return ['All', ...new Set(data.activities.map((item) => item.status))]
  }, [data])

  if (loading) return <div className="page-message">Loading dashboard...</div>
  if (error) return <div className="page-message error">{error}</div>
  if (!data) return <div className="page-message">No data found.</div>

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>InsightX</h2>
        <nav>
          <p className="nav-active">Dashboard</p>
          <p>Reports</p>
          <p>Analytics</p>
          <p>Settings</p>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Interactive dashboard with local JSON and free API support</p>
          </div>

          <div className="data-source-toggle">
            <button
              className={dataSource === 'local' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setDataSource('local')}
            >
              Local JSON
            </button>
            <button
              className={dataSource === 'api' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setDataSource('api')}
            >
              Free API
            </button>
          </div>
        </header>

        <section className="stats-grid">
          {data.stats.map((stat) => (
            <div className="card stat-card" key={stat.title}>
              <h3>{stat.title}</h3>
              <p className="value">
                {stat.title === 'Revenue' || stat.title === 'Avg Price'
                  ? `$${Number(stat.value).toLocaleString()}`
                  : Number(stat.value).toLocaleString()}
                {stat.title === 'Bounce Rate' || stat.title === 'Avg Rating' ? '' : ''}
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
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <label>Search Campaign</label>
            <input
              type="text"
              placeholder="Type campaign name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="filter-summary">
              Showing <strong>{filteredActivities.length}</strong> result(s)
            </div>
          </div>
        </section>

        <section className="charts-grid second-row">
          <div className="card large-card">
            <h3>Trend Line</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.traffic}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3>Quick Notes</h3>
            <ul className="notes-list">
              <li>Switch between local JSON and API data.</li>
              <li>Search campaigns by keyword.</li>
              <li>Filter rows by status.</li>
              <li>Use this as a starter for a real analytics app.</li>
            </ul>
          </div>
        </section>

        <section className="card table-card">
          <div className="table-header">
            <h3>Recent Activity</h3>
            <span className="pill">{dataSource === 'local' ? 'Local Data' : 'API Data'}</span>
          </div>

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
                  <td>
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
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