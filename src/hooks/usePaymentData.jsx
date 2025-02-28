import { useState, useEffect } from 'react'
import { parseDate, getWeekNumber, getMonthStats, formatDate } from '../utils/dateUtils'

export const usePaymentData = (monthFilter) => {
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/payments')
        const data = await response.json()
        setPayments(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter and sort data
  const filteredData = payments.filter(payment => {
    const [day, month] = payment.dateandtime.split('/')
    return parseInt(month) === monthFilter
  })

  const sortedData = [...filteredData].sort((a, b) => 
    parseDate(b.dateandtime) - parseDate(a.dateandtime)
  )
  
  // Group data
  const weeklyData = filteredData.reduce((acc, payment) => {
    const date = parseDate(payment.dateandtime)
    const weekNumber = getWeekNumber(date)
    acc[weekNumber] = acc[weekNumber] || []
    acc[weekNumber].push(payment)
    return acc
  }, {})

  const monthlyData = payments.reduce((acc, payment) => {
    const date = parseDate(payment.dateandtime)
    const month = formatDate(date, 'MMMM') // Full month name (e.g., "January")
    acc[month] = (acc[month] || 0) + payment.payment
    return acc
  }, {})

  // Calculate totals
  const totalSpending = filteredData.reduce((sum, item) => sum + item.payment, 0)
  const yearlyTotal = payments.reduce((sum, item) => sum + item.payment, 0) // Yearly total
  const today = new Date()
  const { daysLeft } = getMonthStats(today)
  const avgDaily = totalSpending / today.getDate()

  return {
    isLoading,
    error,
    sortedData,
    filteredData,
    weeklyData,
    monthlyData,
    totalSpending,
    yearlyTotal, // Add yearly total to the returned object
    avgDaily,
    daysLeft,
    payments,
  }
}