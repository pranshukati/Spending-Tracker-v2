import { useState, useEffect } from 'react'
import { 
  Box, 
  Flex, 
  Button, 
  Heading,
  useColorMode,
  Text,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Progress,
  Card,
  CardBody,
  useColorModeValue,
  Alert,
  AlertIcon,
  Select
} from '@chakra-ui/react'
import { css } from '@emotion/react'
import { Bar, Pie } from 'react-chartjs-2'
import 'chart.js/auto'
import { format, getWeek, parse, getDaysInMonth, differenceInDays } from 'date-fns'



// Color palette generator for charts
const generateColorPalette = (count) => {
  const baseHue = Math.floor(Math.random() * 360)
  return Array.from({ length: count }, (_, i) => 
    `hsl(${(baseHue + (i * (360 / count))) % 360}, 70%, 50%)`
  )
}

const App = () => {
  const [payments, setPayments] = useState([])
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1)
  const [currentPage, setCurrentPage] = useState(1)
  const [budget, setBudget] = useState(() => {
    // Load budget from local storage
    const savedBudget = localStorage.getItem('monthlyBudget')
    return savedBudget ? parseFloat(savedBudget) : 0
  })
  const { colorMode, toggleColorMode } = useColorMode()
  const itemsPerPage = 10
  const chartPalette = generateColorPalette(5) // For up to 5 weeks

  // Save budget to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('monthlyBudget', budget)
  }, [budget])

  useEffect(() => {
    fetch('https://spending-tracker-api-v2.onrender.com/payments')
      .then(res => res.json())
      .then(data => setPayments(data))
  }, [])

  // Helper function to parse date
  const parseDate = (dateString) => {
    return parse(dateString, 'dd/MM/yyyy HH:mm', new Date())
  }

  // Data processing functions
  const filteredData = payments.filter(payment => {
    const [day, month] = payment.dateandtime.split('/')
    return parseInt(month) === monthFilter
  })

  // Sort by date (newest first)
  const sortedData = [...filteredData].sort((a, b) => {
    return parseDate(b.dateandtime) - parseDate(a.dateandtime)
  })

  // Get last 2 transactions
  const lastTwoTransactions = sortedData.slice(0, 2)

  // Group by week
  const weeklyData = filteredData.reduce((acc, payment) => {
    const date = parseDate(payment.dateandtime)
    const weekNumber = getWeek(date, { weekStartsOn: 1 })
    if (!acc[weekNumber]) {
      acc[weekNumber] = []
    }
    acc[weekNumber].push(payment)
    return acc
  }, {})

  // Calculate weekly totals
  const weeklyTotals = Object.keys(weeklyData).map(week => ({
    week: `Week ${week}`,
    total: weeklyData[week].reduce((sum, item) => sum + item.payment, 0)
  }))
  // Group spending by month
const monthlyData = payments.reduce((acc, payment) => {
  const date = parseDate(payment.dateandtime);
  const month = format(date, 'MMMM'); // Get month name (e.g., "January")

  if (!acc[month]) {
    acc[month] = 0;
  }
  acc[month] += payment.payment;
  return acc;
}, {});

// Prepare data for charts
const months = Object.keys(monthlyData);
const monthlyTotals = months.map(month => monthlyData[month]);

  // Total spending and average daily
  const totalSpending = filteredData.reduce((sum, item) => sum + item.payment, 0)
  const avgDaily = totalSpending / new Date().getDate()

  // Calculate days left in the month
  const today = new Date()
  const daysInMonth = getDaysInMonth(today)
  const daysLeft = Math.max(1, differenceInDays(new Date(today.getFullYear(), today.getMonth(), daysInMonth), today));

  // Calculate daily spending limit
const remainingBudget = budget - totalSpending;
const dailySpendingLimit = remainingBudget > 0 ? (remainingBudget / daysLeft).toFixed(2) : 0;


  // Chart data
  const chartCommon = {
    labels: weeklyTotals.map(week => week.week),
    datasets: [{
      label: 'Weekly Spending',
      data: weeklyTotals.map(week => week.total),
      backgroundColor: chartPalette,
      borderColor: useColorModeValue('white', 'gray.800'),
      borderWidth: 2
    }]
  }
  const monthlyChartData = {
    labels: months,
    datasets: [{
      label: 'Monthly Spending',
      data: monthlyTotals,
      backgroundColor: chartPalette,
      borderColor: useColorModeValue('white', 'gray.800'),
      borderWidth: 2
    }]
  };
  

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <Flex justify="space-between" mb={8} align="center">
        <Heading size="xl" color={useColorModeValue('blue.600', 'blue.200')}>
          Spending Tracker
        </Heading>
        <Button 
          onClick={toggleColorMode}
          colorScheme="blue"
          variant="outline"
        >
          {colorMode === 'light' ? '🌙' : '☀️'} Mode
        </Button>
      </Flex>

      {/* Last 2 Transactions */}
      <Card mb={8} bg={useColorModeValue('blue.50', 'blue.900')}>
        <CardBody>
          <Heading size="md" mb={4}>Recent Transactions</Heading>
          <SimpleGrid columns={[1, 2]} spacing={4}>
            {lastTwoTransactions.map((payment, index) => (
              <Card key={payment._id} bg={useColorModeValue('white', 'gray.700')}>
                <CardBody>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold" fontSize="lg" color={useColorModeValue('blue.600', 'blue.200')}>
                        ₹{payment.payment}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {payment.dateandtime}
                      </Text>
                    </Box>
                    <Text fontSize="2xl" mr={2}>
                      {['🛒', '💸'][index % 2]}
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Budget Section */}
      <Card mb={8} bg={useColorModeValue('blue.50', 'blue.900')}>
        <CardBody>
          <FormControl>
            <Flex align="center" gap={4}>
              <Box flex="1">
                <FormLabel>Monthly Budget</FormLabel>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value))}
                  placeholder="Set your budget"
                  bg="white"
                  _dark={{ bg: 'gray.700' }}
                />
              </Box>
              <Box flex="1">
                <FormLabel>Progress</FormLabel>
                <Progress 
                  value={(totalSpending / budget) * 100 || 0} 
                  size="lg"
                  colorScheme={totalSpending > budget ? 'red' : 'green'}
                  borderRadius="md"
                />
                <Text mt={2} textAlign="center">
                  {((totalSpending / budget) * 100 || 0).toFixed(1)}% Spent
                </Text>
              </Box>
            </Flex>
          </FormControl>
        </CardBody>
      </Card>

      {/* Daily Spending Limit */}
      <Card mb={8} bg={useColorModeValue('blue.50', 'blue.900')}>
        <CardBody>
          <Heading size="md" mb={4}>Daily Spending Limit</Heading>
          <Alert 
            status={remainingBudget > 0 ? 'info' : 'error'}
            borderRadius="md"
          >
            <AlertIcon />
            <Text>
              You can spend ₹{dailySpendingLimit} today. ({daysLeft} days left in the month)
            </Text>
          </Alert>
        </CardBody>
      </Card>

      {/* Charts Section */}
      <Card mb={8} bg={useColorModeValue('blue.50', 'blue.900')}>
        <CardBody>
          <Flex direction={['column', 'row']} gap={8}>
            <Box flex={1}>
              <Heading size="md" mb={4} textAlign="center">Weekly Spending</Heading>
              <Bar 
                data={chartCommon}
                options={{
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </Box>
            <Box flex={1}>
              <Heading size="md" mb={4} textAlign="center">Spending Distribution</Heading>
              <Pie 
                data={monthlyChartData}
                options={{
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </Box>
          </Flex>
        </CardBody>
      </Card>

      {/* Summary Stats */}
      <SimpleGrid columns={[1, 2]} gap={8} mb={8}>
        <Card bg={useColorModeValue('blue.100', 'blue.800')}>
          <CardBody>
            <Heading size="md" mb={2}>Monthly Summary</Heading>
            <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('blue.600', 'blue.200')}>
              ₹{totalSpending}
            </Text>
            <Text>Total Spending</Text>
          </CardBody>
        </Card>
        <Card bg={useColorModeValue('green.100', 'green.800')}>
          <CardBody>
            <Heading size="md" mb={2}>Daily Average</Heading>
            <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('green.600', 'green.200')}>
              ₹{avgDaily.toFixed(2)}
            </Text>
            <Text>Per Day</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Payment List */}
      <Card mb={8} bg={useColorModeValue('blue.50', 'blue.900')}>
        <CardBody>
          <Heading size="md" mb={4}>All Transactions</Heading>
          {filteredData
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map(payment => (
              <Card key={payment._id} mb={4} bg={useColorModeValue('white', 'gray.700')}>
                <CardBody>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">₹{payment.payment}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {payment.dateandtime}
                      </Text>
                    </Box>
                    <Text fontSize="sm" color={useColorModeValue('blue.600', 'blue.200')}>
                      {format(parseDate(payment.dateandtime), 'EEE, d MMM')}
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            ))}
        </CardBody>
      </Card>

      {/* Pagination */}
      <Flex justify="center" gap={2} mb={8}>
        {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }).map((_, i) => (
          <Button 
            key={i} 
            onClick={() => setCurrentPage(i + 1)}
            colorScheme={currentPage === i + 1 ? 'blue' : 'gray'}
            variant={currentPage === i + 1 ? 'solid' : 'outline'}
            size="sm"
          >
            {i + 1}
          </Button>
        ))}
      </Flex>
    </Box>
  )
}

export default App