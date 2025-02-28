import { 
  Card, 
  CardBody, 
  Heading, 
  Flex, 
  Box, 
  Text, 
  useColorModeValue 
} from '@chakra-ui/react'
import { Bar, Pie } from 'react-chartjs-2'
import { generateColorPalette } from '../utils/colorUtils'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

const ChartsSection = ({ weeklyData = {}, monthlyData = {} }) => {
  const chartPalette = generateColorPalette(12) // 12 months max

  // Dark mode colors
  const cardBg = useColorModeValue('white', 'gray.700')
  const chartBg = useColorModeValue('gray.50', 'gray.800')
  const headingColor = useColorModeValue('blue.600', 'blue.200')
  const textColor = useColorModeValue('gray.600', 'gray.200')
  const gridColor = useColorModeValue('gray.100', 'gray.600')
  const tooltipBg = useColorModeValue('rgba(0, 0, 0, 0.8)', 'rgba(255, 255, 255, 0.8)')
  const tooltipTextColor = useColorModeValue('white', 'gray.800')

  // Weekly bar chart data
  const weeklyChartData = {
    labels: Object.keys(weeklyData).map(week => `Week ${week}`),
    datasets: [{
      label: 'Weekly Spending',
      data: Object.values(weeklyData).map(week => 
        week.reduce((sum, item) => sum + item.payment, 0)
      ),
      backgroundColor: chartPalette,
      borderColor: useColorModeValue('white', 'gray.700'),
      borderWidth: 2,
      borderRadius: 5, // Rounded bars
    }]
  }

  // Monthly pie chart data
  const monthlyChartData = {
    labels: Object.keys(monthlyData),
    datasets: [{
      label: 'Monthly Spending',
      data: Object.values(monthlyData),
      backgroundColor: chartPalette,
      borderColor: useColorModeValue('white', 'gray.700'),
      borderWidth: 2,
      hoverOffset: 10, // Add hover effect
    }]
  }

  return (
    <Card 
      mb={8} 
      bg={cardBg} 
      boxShadow="lg" 
      borderRadius="xl"
    >
      <CardBody>
        <Flex direction={['column', 'row']} gap={8}>
          {/* Weekly Bar Chart */}
          <Box 
            flex={1} 
            p={4} 
            bg={chartBg} 
            borderRadius="lg"
          >
            <Heading 
              size="md" 
              mb={4} 
              textAlign="center" 
              color={headingColor}
            >
              Weekly Spending
            </Heading>
            <Box height="300px">
              <Bar 
                data={weeklyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: tooltipBg,
                      titleColor: tooltipTextColor,
                      bodyColor: tooltipTextColor,
                      titleFont: { size: 14 },
                      bodyFont: { size: 14 },
                      padding: 10,
                    }
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: textColor },
                    },
                    y: {
                      grid: { color: gridColor },
                      ticks: { color: textColor },
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Monthly Pie Chart */}
          <Box 
            flex={1} 
            p={4} 
            bg={chartBg} 
            borderRadius="lg"
          >
            <Heading 
              size="md" 
              mb={4} 
              textAlign="center" 
              color={headingColor}
            >
              Monthly Distribution
            </Heading>
            {Object.keys(monthlyData).length > 0 ? (
              <Box height="300px">
                <Pie 
                  data={monthlyChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                     legend: {
                        display: false, // This will turn off the legend
                      },
                      tooltip: {
                        backgroundColor: tooltipBg,
                        titleColor: tooltipTextColor,
                        bodyColor: tooltipTextColor,
                        titleFont: { size: 14 },
                        bodyFont: { size: 14 },
                        padding: 10,
                      }
                    }
                  }}
                />
              </Box>
            ) : (
              <Text 
                textAlign="center" 
                color={textColor} 
                mt={8}
              >
                No monthly data available
              </Text>
            )}
          </Box>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default ChartsSection