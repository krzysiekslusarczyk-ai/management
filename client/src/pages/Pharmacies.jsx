import { useEffect, useState } from 'react'
import { pharmacyService } from '../services/api'

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phoneNumber: ''
  })

  useEffect(() => {
    loadPharmacies()
  }, [])

  const loadPharmacies = async () => {
    try {
      const response = await pharmacyService.getAll()
      setPharmacies(response.data.data)
    } catch (error) {
      console.error('Failed to load pharmacies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await pharmacyService.create(formData)
      setShowCreateForm(false)
      setFormData({ name: '', address: '', city: '', phoneNumber: '' })
      loadPharmacies()
    } catch (error) {
      alert('Błąd podczas tworzenia apteki')
    }
  }

  if (loading) {
    return <div className="loading">Ładowanie...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Apteki</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          {showCreateForm ? 'Anuluj' : 'Dodaj aptekę'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card">
          <h2>Nowa apteka</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nazwa</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Adres</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Miasto</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Telefon</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Dodaj aptekę</button>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Miasto</th>
              <th>Adres</th>
              <th>Telefon</th>
              <th>Pracownicy</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.map((pharmacy) => (
              <tr key={pharmacy.id}>
                <td><strong>{pharmacy.name}</strong></td>
                <td>{pharmacy.city}</td>
                <td>{pharmacy.address}</td>
                <td>{pharmacy.phoneNumber}</td>
                <td>{pharmacy._count?.users || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Pharmacies
