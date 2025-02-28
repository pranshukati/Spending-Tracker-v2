import { SimpleGrid, Card, CardBody, Heading, Text, Flex, Box } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

const SummaryStats = ({ totalSpending, avgDaily, yearlyTotal }) => {
  // Colors for dark/light mode
  const cardBg = useColorModeValue('white', 'gray.700')
  const headingColor = useColorModeValue('blue.600', 'blue.200')
  const textColor = useColorModeValue('gray.600', 'gray.200')
  const iconBg = useColorModeValue('blue.50', 'blue.900')
  const iconColor = useColorModeValue('blue.600', 'blue.200')

  return (
    <SimpleGrid columns={[1, 2, 3]} gap={6} mb={8}>
      {/* Yearly Spending Card */}
      <Card 
        bg={cardBg} 
        boxShadow="md" 
        borderRadius="lg"
        _hover={{ transform: 'translateY(-4px)', transition: 'transform 0.2s' }}
      >
        <CardBody>
          <Flex align="center" gap={4}>
            <Box 
              p={3} 
              bg={iconBg} 
              borderRadius="full"
            >
              <Text fontSize="2xl" color={iconColor}>📅</Text>
            </Box>
            <Box>
              <Heading size="md" mb={2} color={headingColor}>
                Yearly Spending
              </Heading>
              <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                ₹{yearlyTotal}
              </Text>
              <Text fontSize="sm" color={textColor}>
                Total spending this year
              </Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>

      {/* Monthly Summary Card */}
      <Card 
        bg={cardBg} 
        boxShadow="md" 
        borderRadius="lg"
        _hover={{ transform: 'translateY(-4px)', transition: 'transform 0.2s' }}
      >
        <CardBody>
          <Flex align="center" gap={4}>
            <Box 
              p={3} 
              bg={iconBg} 
              borderRadius="full"
            >
              <Text fontSize="2xl" color={iconColor}>💰</Text>
            </Box>
            <Box>
              <Heading size="md" mb={2} color={headingColor}>
                Monthly Summary
              </Heading>
              <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                ₹{totalSpending}
              </Text>
              <Text fontSize="sm" color={textColor}>
                Total spending this month
              </Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>

      {/* Daily Average Card */}
      <Card 
        bg={cardBg} 
        boxShadow="md" 
        borderRadius="lg"
        _hover={{ transform: 'translateY(-4px)', transition: 'transform 0.2s' }}
      >
        <CardBody>
          <Flex align="center" gap={4}>
            <Box 
              p={3} 
              bg={iconBg} 
              borderRadius="full"
            >
              <Text fontSize="2xl" color={iconColor}>📊</Text>
            </Box>
            <Box>
              <Heading size="md" mb={2} color={headingColor}>
                Daily Average
              </Heading>
              <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                ₹{avgDaily.toFixed(2)}
              </Text>
              <Text fontSize="sm" color={textColor}>
                Average spending per day
              </Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </SimpleGrid>
  )
}

export default SummaryStats