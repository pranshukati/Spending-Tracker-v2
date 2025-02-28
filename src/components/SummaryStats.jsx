import { SimpleGrid, Card, CardBody, Heading, Text, Flex, Box, Progress, useColorModeValue } from '@chakra-ui/react'
import { FaCalendarAlt, FaWallet, FaChartLine } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionCard = motion(Card)

const SummaryStats = ({ totalSpending, avgDaily, yearlyTotal, budget }) => {
  // Colors for dark/light mode
  const cardBg = useColorModeValue('white', 'gray.800')
  const headingColor = useColorModeValue('blue.600', 'blue.300')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const iconBg = useColorModeValue('blue.100', 'blue.900')
  const iconColor = useColorModeValue('blue.600', 'blue.200')
  const progressValue = (totalSpending / budget) * 100 || 0

  return (
    <SimpleGrid columns={[1, 2, 3]} gap={6} mb={8}>
      <MotionCard
        bg={cardBg}
        boxShadow="md"
        borderRadius="xl"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <CardBody>
          <Flex direction="column" gap={4}>
            <Box
              w="max-content"
              p={3}
              bg={iconBg}
              borderRadius="xl"
              color={iconColor}
            >
              <FaCalendarAlt size="1.5em" />
            </Box>
            <Box>
              <Text fontSize="sm" color={textColor} mb={1}>Yearly Total</Text>
              <Heading size="xl" mb={2} color={headingColor}>
                ₹{yearlyTotal.toLocaleString()}
              </Heading>
              <Progress 
                value={100} 
                size="xs" 
                colorScheme="blue" 
                borderRadius="full"
                bg={useColorModeValue('gray.100', 'gray.700')}
              />
            </Box>
          </Flex>
        </CardBody>
      </MotionCard>

      <MotionCard
        bg={cardBg}
        boxShadow="md"
        borderRadius="xl"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <CardBody>
          <Flex direction="column" gap={4}>
            <Box
              w="max-content"
              p={3}
              bg={iconBg}
              borderRadius="xl"
              color={iconColor}
            >
              <FaWallet size="1.5em" />
            </Box>
            <Box>
              <Text fontSize="sm" color={textColor} mb={1}>Monthly Spending</Text>
              <Heading size="xl" mb={2} color={headingColor}>
                ₹{totalSpending.toLocaleString()}
              </Heading>
              <Progress 
                value={progressValue} 
                size="xs" 
                colorScheme={progressValue > 100 ? 'red' : 'blue'}
                borderRadius="full"
                bg={useColorModeValue('gray.100', 'gray.700')}
              />
              <Text fontSize="sm" color={textColor} mt={1}>
                {progressValue.toFixed(1)}% of ₹{budget.toLocaleString()} budget
              </Text>
            </Box>
          </Flex>
        </CardBody>
      </MotionCard>

      <MotionCard
        bg={cardBg}
        boxShadow="md"
        borderRadius="xl"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <CardBody>
          <Flex direction="column" gap={4}>
            <Box
              w="max-content"
              p={3}
              bg={iconBg}
              borderRadius="xl"
              color={iconColor}
            >
              <FaChartLine size="1.5em" />
            </Box>
            <Box>
              <Text fontSize="sm" color={textColor} mb={1}>Daily Average</Text>
              <Heading size="xl" mb={2} color={headingColor}>
                ₹{avgDaily.toFixed(2)}
              </Heading>
              <Flex align="center" gap={2}>
                <Box
                  w="full"
                  h="4px"
                  bg={useColorModeValue('blue.100', 'blue.900')}
                  borderRadius="full"
                >
                  <Box
                    w={`${Math.min(avgDaily / 5000 * 100, 100)}%`}
                    h="100%"
                    bg={useColorModeValue('blue.500', 'blue.200')}
                    borderRadius="full"
                    transition="width 0.3s ease"
                  />
                </Box>
                <Text fontSize="xs" color={textColor}>vs ₹5k target</Text>
              </Flex>
            </Box>
          </Flex>
        </CardBody>
      </MotionCard>
    </SimpleGrid>
  )
}

export default SummaryStats