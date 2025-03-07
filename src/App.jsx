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
  Icon,
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel,
  Tag,
  Text
} from '@chakra-ui/react'
import { FaSun, FaMoon, FaCalendar, FaWallet, FaChartLine, FaList, FaPiggyBank } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { usePaymentData } from './hooks/usePaymentData'
import RecentTransactions from './components/RecentTransactions'
import BudgetSection from './components/BudgetSection'
import DailySpendingAlert from './components/DailySpendingAlert'
import ChartsSection from './components/ChartsSection'
import SummaryStats from './components/SummaryStats'
import TransactionList from './components/TransactionList'

const MotionTab = motion(Tab)

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

  const textColor = useColorModeValue('gray.600', 'gray.300')
  const headingColor = useColorModeValue('blue.600', 'blue.200')

  if (error) {
    return (
      <Box p={4} maxW="1200px" mx="auto">
        <Alert status="error" borderRadius="md" variant="subtle">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Failed to load data</AlertTitle>
            <AlertDescription>
              <Text>{error}</Text>
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
    )
  }

  return (
    <Box maxW="1200px" mx="auto" px={4}>
      
      <Box
    position="sticky"
    top="0"
    zIndex="sticky"
    bg={useColorModeValue('whiteAlpha.800', 'rgba(26, 32, 44, 0.8)')}
    backdropFilter="blur(10px)"
    py={3}
    mb={6}
  >
    <Flex 
      justify="space-between" 
      align={{ base: 'flex-start', sm: 'center' }}
      direction={{ base: 'column', sm: 'row' }}
      gap={3}
    >
      <Flex align="center" gap={3} flexWrap="wrap">
        <Heading 
          size={{ base: 'lg', md: 'xl' }} 
          color={headingColor}
          display="flex"
          alignItems="center"
          flexWrap="wrap"
        >
          Spending Tracker
          <Tag 
            ml={{ base: 0, sm: 3 }} 
            mt={{ base: 2, sm: 0 }}
            colorScheme="blue" 
            variant="subtle" 
            size={{ base: 'md', sm: 'lg' }}
          >
            {monthNames[monthFilter - 1]}
          </Tag>
        </Heading>
      </Flex>

      <Flex 
        gap={3} 
        width={{ base: '100%', sm: 'auto' }}
        flexDirection={{ base: 'column', sm: 'row' }}
      >
        <Select
          value={monthFilter}
          onChange={(e) => setMonthFilter(parseInt(e.target.value))}
          width={{ base: '100%', sm: '150px' }}
          icon={<FaCalendar />}
          variant="filled"
          size="sm"
        >
          {monthNames.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </Select>
        <Button 
          onClick={toggleColorMode}
          colorScheme="blue"
          variant="outline"
          leftIcon={<Icon as={colorMode === 'light' ? FaMoon : FaSun} />}
          size="sm"
          width={{ base: '100%', sm: 'auto' }}
        >
          {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </Flex>
    </Flex>
  </Box>

      <Tabs variant="enclosed-colored" isFitted>
        <TabList mb={4} overflowX="auto" py={2}>
          {['Transactions', 'Budget', 'Analytics', 'Summary'].map((tab, index) => (
            <MotionTab 
              key={tab}
              _selected={{ color: 'white', bg: 'blue.500' }}
              whileHover={{ scale: 1.05 }}
              mx={2}
            >
              <Flex align="center" gap={2}>
                <Icon as={[FaList, FaWallet, FaChartLine, FaPiggyBank][index]} />
                <Text>{tab}</Text>
              </Flex>
            </MotionTab>
          ))}
        </TabList>

        <TabPanels>
          {/* Transactions Tab */}
          <TabPanel p={0}>
            <SimpleGrid columns={[1, 1, 2]} spacing={6}>
              <Skeleton isLoaded={!isLoading} borderRadius="lg">
                <RecentTransactions transactions={sortedData.slice(0, 4)} />
              </Skeleton>
              <Skeleton isLoaded={!isLoading} borderRadius="lg">
                <TransactionList 
                  filteredData={filteredData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </Skeleton>
            </SimpleGrid>
          </TabPanel>

          {/* Budget Tab */}
          <TabPanel p={0}>
            <SimpleGrid columns={[1, 1, 2]} spacing={6}>
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
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel p={0}>
            <Skeleton isLoaded={!isLoading} borderRadius="lg">
              <ChartsSection 
                weeklyData={weeklyData}
                monthlyData={monthlyData}
              />
            </Skeleton>
          </TabPanel>

          {/* Summary Tab */}
          <TabPanel p={0}>
            <SimpleGrid columns={[1, 1, 2]} spacing={6}>
              <Skeleton isLoaded={!isLoading} borderRadius="lg">
                <SummaryStats 
                  totalSpending={totalSpending}
                  avgDaily={avgDaily}
                  yearlyTotal={yearlyTotal}
                  budget={budget}
                />
              </Skeleton>
              <Skeleton isLoaded={!isLoading} borderRadius="lg">
                <Box 
                  p={6} 
                  bg={useColorModeValue('white', 'gray.800')}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <Heading size="md" mb={4}>
                    <Text>Monthly Overview</Text>
                  </Heading>
                  <Text color={textColor}>
                    Detailed financial summary and insights coming soon...
                  </Text>
                </Box>
              </Skeleton>
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default App
