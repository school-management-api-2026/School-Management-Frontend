import axiosClient from '../axios'

export const getSummary = () => axiosClient.get('/dashboard/summary')
