import axiosClient from '../axios'

export const getAll  = ()          => axiosClient.get('/setting')
export const saveAll = (settings)  => axiosClient.post('/setting', { settings })