import { 
  Card, 
  CardBody, 
  Alert, 
  AlertIcon, 
  Text, 
  Heading, 
  Progress,
  Box,
  useColorModeValue,
  Flex,
  Button,
  CircularProgress,
  CircularProgressLabel,
  useBreakpointValue
} from '@chakra-ui/react'
import { FaWallet, FaExclamationTriangle, FaChartLine } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const MotionBox = motion(Box)

const DailySpendingAlert = ({ remainingBudget, dailySpendingLimit, daysLeft }) => {
  const [prevDaysLeft, setPrevDaysLeft] = useState(daysLeft)
  const isMobile = useBreakpointValue({ base: true, md: false })
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const alertBg = useColorModeValue('blue.50', 'blue.900')
  const errorBg = useColorModeValue('red.50', 'red.900')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const headingColor = useColorModeValue('blue.600', 'blue.300')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const progressColor = useColorModeValue('blue.400', 'blue.200')
  const daysProgressColor = useColorModeValue('purple.400', 'purple.200')

  const isOverBudget = remainingBudget <= 0
  const progressValue = Math.max(0, (1 - (remainingBudget / (remainingBudget + dailySpendingLimit * daysLeft))) * 100)
  const daysProgress = ((30 - daysLeft) / 30) * 100

  // Animation for days change
  useEffect(() => {
    if (daysLeft !== prevDaysLeft) {
      setPrevDaysLeft(daysLeft)
    }
  }, [daysLeft])

  return (
    <MotionBox
      mb={8}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        bg={cardBg}
        boxShadow="md"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
      >
        <CardBody>
          <Flex align="center" justify="space-between" mb={4}>
            <Heading 
              size="md" 
              color={headingColor}
              display="flex" 
              alignItems="center" 
              gap={2}
            >
              {isOverBudget ? (
                <MotionBox
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <FaExclamationTriangle />
                </MotionBox>
              ) : (
                <FaWallet />
              )}
              Daily Spending Limit
            </Heading>
            
            <CircularProgress
              value={daysProgress}
              color={daysProgressColor}
              size="48px"
              thickness="8px"
            >
              <CircularProgressLabel fontSize="sm">
                {daysLeft}d
              </CircularProgressLabel>
            </CircularProgress>
          </Flex>

          <Alert 
            status={isOverBudget ? 'error' : 'info'}
            borderRadius="lg"
            bg={isOverBudget ? errorBg : alertBg}
            border="1px solid"
            borderColor={isOverBudget ? 'red.200' : 'blue.200'}
            alignItems="flex-start"
            position="relative"
            overflow="hidden"
            py={4}
          >
            <MotionBox
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1 }}
            >
              <Progress 
                value={progressValue} 
                size="xs" 
                colorScheme={isOverBudget ? 'red' : 'blue'}
                opacity={0.2}
              />
            </MotionBox>

            <AlertIcon 
              boxSize="28px" 
              mt={1} 
              color={isOverBudget ? 'red.500' : 'blue.500'}
              as={isOverBudget ? FaExclamationTriangle : FaChartLine}
            />
            
            <Box pl={3} flex="1">
              <Text fontSize="lg" fontWeight="bold" mb={1}>
                {isOverBudget ? (
                  <>Exceeded by ₹{Math.abs(remainingBudget).toFixed(2)}</>
                ) : (
                  <>₹{dailySpendingLimit} available today</>
                )}
              </Text>
              
              <Flex align="center" gap={3} mt={2}>
                <Text fontSize="sm" color={textColor}>
                  {isOverBudget ? 
                    'Consider adjusting your budget' : 
                    `${daysLeft} days remaining this month`}
                </Text>
                
                {!isOverBudget && !isMobile && (
                  <Button
                    size="xs"
                    variant="outline"
                    colorScheme="blue"
                    rightIcon={<FaChartLine />}
                  >
                    Spending Trends
                  </Button>
                )}
              </Flex>
            </Box>
          </Alert>

          {isOverBudget && (
            <MotionBox
              mt={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button
                width="full"
                colorScheme="red"
                variant="solid"
                rightIcon={<FaExclamationTriangle />}
              >
                Review Overspending
              </Button>
            </MotionBox>
          )}
        </CardBody>
      </Card>
    </MotionBox>
  )
}

export default DailySpendingAlert