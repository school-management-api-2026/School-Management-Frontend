import { useState, useEffect, useCallback } from 'react'

/**
 * useApiCrud — replaces useCrudState for pages backed by a real API.
 *
 * @param {object} service - An object with getAll / create / update / remove functions.
 *
 * Exposes the same surface as useCrudState so page components need minimal changes:
 *   data, search, setSearch, filter, setFilter,
 *   currentPage, setCurrentPage, totalPages, paginated,
 *   modalOpen, viewModal, deleteModal, selected, formData,
 *   openAdd, openEdit, openView, openDelete, closeModals,
 *   handleSave, handleDelete, updateForm,
 *   loading, error, refresh
 */
export function useApiCrud(service) {
  const [data, setData]               = useState([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)

  const [search, setSearch]           = useState('')
  const [filter, setFilter]           = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  const [modalOpen, setModalOpen]     = useState(false)
  const [viewModal, setViewModal]     = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected]       = useState(null)
  const [formData, setFormData]       = useState({})

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await service.getAll()
      // Support both { data: [...] } and plain array responses
      const list = res.data?.data ?? res.data ?? []
      setData(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }, [service])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!cancelled) await refresh()
    }
    load()
    return () => { cancelled = true }
  }, [refresh])

  // ─── Modal helpers ───────────────────────────────────────────────────
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

  const updateForm = (key, value) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  // ─── CRUD operations ─────────────────────────────────────────────────
  const handleSave = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      if (selected) {
        await service.update(selected.id, payload)
      } else {
        await service.create(payload)
      }
      closeModals()
      await refresh()
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.')
      throw err // let caller show toast
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      await service.remove(selected.id)
      closeModals()
      await refresh()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ─── Client-side search / filter / pagination ─────────────────────────
  const filtered = data.filter(item => {
    const matchesSearch = !search || Object.values(item).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
    const matchesFilter = !filter || Object.values(item).some(v =>
      String(v).toLowerCase() === filter.toLowerCase()
    )
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated  = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  return {
    data, loading, error, refresh,
    search, setSearch, filter, setFilter,
    currentPage, setCurrentPage, totalPages, paginated, filtered,
    modalOpen, viewModal, deleteModal, selected, formData,
    openAdd, openEdit, openView, openDelete, closeModals,
    handleSave, handleDelete, updateForm, perPage,
  }
}
