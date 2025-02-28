import { useState } from 'react'
import { 
  Box, 
  Flex, 
  Button, 
  Heading,
  useColorMode,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Select,
  SimpleGrid,
  Icon
} from '@chakra-ui/react'
import { FaSun, FaMoon, FaCalendar } from 'react-icons/fa'
import { usePaymentData } from './hooks/usePaymentData'
import RecentTransactions from './components/RecentTransactions'
import BudgetSection from './components/BudgetSection'
import DailySpendingAlert from './components/DailySpendingAlert'
import ChartsSection from './components/ChartsSection'
import SummaryStats from './components/SummaryStats'
import TransactionList from './components/TransactionList'

const App = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1)
  const [currentPage, setCurrentPage] = useState(1)
  const [budget, setBudget] = useState(() => {
    const savedBudget = localStorage.getItem('monthlyBudget')
    return savedBudget ? parseFloat(savedBudget) : 0
  })

  const {
    sortedData,
    filteredData,
    weeklyData,
    monthlyData,
    totalSpending,
    avgDaily,
    daysLeft,
    yearlyTotal,
    isLoading,
    error,
    payments,
  } = usePaymentData(monthFilter)

  const remainingBudget = budget - totalSpending
  const dailySpendingLimit = remainingBudget > 0 ? (remainingBudget / daysLeft).toFixed(2) : 0

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  if (error) {
    return (
      <Box p={4} maxW="1200px" mx="auto">
        <Alert status="error" borderRadius="md" variant="subtle">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Failed to load data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      </Box>
    )
  }

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <Flex justify="space-between" mb={8} align="center" wrap="wrap" gap={4}>
        <Flex align="center" gap={4}>
          <Heading size="xl" color={useColorModeValue('blue.600', 'blue.200')}>
            Spending Tracker
          </Heading>
          <Select
            value={monthFilter}
            onChange={(e) => setMonthFilter(parseInt(e.target.value))}
            width="200px"
            icon={<FaCalendar />}
            variant="filled"
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </Select>
        </Flex>
        
        <Button 
          onClick={toggleColorMode}
          colorScheme="blue"
          variant="outline"
          leftIcon={<Icon as={colorMode === 'light' ? FaMoon : FaSun} />}
        >
          {colorMode === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
      </Flex>

      <Skeleton isLoaded={!isLoading} borderRadius="lg" mb={8}>
        <RecentTransactions transactions={sortedData.slice(0, 2)} />
      </Skeleton>

      <SimpleGrid columns={[1, 1, 2]} spacing={6} mb={8}>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <BudgetSection 
            budget={budget}
            setBudget={setBudget}
            totalSpending={totalSpending}
          />
        </Skeleton>

        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <DailySpendingAlert 
            remainingBudget={remainingBudget}
            dailySpendingLimit={dailySpendingLimit}
            daysLeft={daysLeft}
          />
        </Skeleton>
      </SimpleGrid>

      <Skeleton isLoaded={!isLoading} borderRadius="lg" mb={8}>
        <ChartsSection 
          weeklyData={weeklyData}
          monthlyData={monthlyData}
        />
      </Skeleton>

      <Skeleton isLoaded={!isLoading} borderRadius="lg" mb={8}>
        <SummaryStats 
          totalSpending={totalSpending}
          avgDaily={avgDaily}
          yearlyTotal={yearlyTotal}
        />
      </Skeleton>

      <Skeleton isLoaded={!isLoading} borderRadius="lg">
        <TransactionList 
          filteredData={payments}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Skeleton>
    </Box>
  )
}

export default App