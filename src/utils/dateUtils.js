import { 
  format,  // Make sure this is imported
  getWeek, 
  parse, 
  getDaysInMonth, 
  differenceInDays 
} from 'date-fns'

// Existing functions
export const parseDate = (dateString) => {
  return parse(dateString, 'dd/MM/yyyy HH:mm', new Date())
}

export const getWeekNumber = (date) => getWeek(date, { weekStartsOn: 1 })

export const getMonthStats = (today) => {
  const daysInMonth = getDaysInMonth(today)
  const daysLeft = Math.max(1, differenceInDays(
    new Date(today.getFullYear(), today.getMonth(), daysInMonth),
    today
  ))
  return { daysInMonth, daysLeft }
}

// Add this export
export const formatDate = (date, formatString) => format(date, formatString)