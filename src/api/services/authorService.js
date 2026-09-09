import axiosClient from '../axios'

const BASE = '/author'

export const getAll  = ()          => axiosClient.get(BASE)
export const getOne  = (id)        => axiosClient.get(`${BASE}/${id}`)
export const create  = (data)      => axiosClient.post(BASE, data)
export const update  = (id, data)  => axiosClient.put(`${BASE}/${id}`, data)
export const remove  = (id)        => axiosClient.delete(`${BASE}/${id}`)