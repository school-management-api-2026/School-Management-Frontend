import { useState } from 'react'

export function useCrudState(initialData) {
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formData, setFormData] = useState({})
  const perPage = 10

  const openAdd = (defaults = {}) => {
    setSelected(null)
    setFormData(defaults)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setSelected(item)
    setFormData({ ...item })
    setModalOpen(true)
  }

  const openView = (item) => {
    setSelected(item)
    setViewModal(true)
  }

  const openDelete = (item) => {
    setSelected(item)
    setDeleteModal(true)
  }

  const closeModals = () => {
    setModalOpen(false)
    setViewModal(false)
    setDeleteModal(false)
    setSelected(null)
  }

  const handleSave = (newItem) => {
    if (selected) {
      setData(prev => prev.map(d => d.id === selected.id ? { ...d, ...newItem } : d))
    } else {
      const maxId = data.reduce((max, d) => Math.max(max, d.id), 0)
      setData(prev => [...prev, { ...newItem, id: maxId + 1 }])
    }
    closeModals()
  }

  const handleDelete = () => {
    if (selected) setData(prev => prev.filter(d => d.id !== selected.id))
    closeModals()
  }

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))

  const filtered = data.filter(item => {
    const matchesSearch = !search || Object.values(item).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
    const matchesFilter = !filter || Object.values(item).some(v =>
      String(v).toLowerCase() === filter.toLowerCase()
    )
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  return {
    data, setData, search, setSearch, filter, setFilter,
    currentPage, setCurrentPage, totalPages, paginated, filtered,
    modalOpen, viewModal, deleteModal, selected, formData,
    openAdd, openEdit, openView, openDelete, closeModals,
    handleSave, handleDelete, updateForm, perPage
  }
}
