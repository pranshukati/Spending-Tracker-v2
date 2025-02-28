import { 
  Card, 
  CardBody, 
  FormControl, 
  FormLabel, 
  Input, 
  Progress, 
  Text, 
  Flex, 
  Box, 
  useColorModeValue,
  Icon,
  Tooltip,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  FormErrorMessage,
  useMergeRefs
} from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { FaInfoCircle, FaRupeeSign, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const BudgetSection = ({ budget, setBudget, totalSpending }) => {
  const [localBudget, setLocalBudget] = useState(budget)
  const inputRef = useRef(null)

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const inputBg = useColorModeValue('white', 'gray.700')
  const progressBg = useColorModeValue('gray.100', 'gray.600')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const headingColor = useColorModeValue('blue.600', 'blue.300')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const errorColor = useColorModeValue('red.600', 'red.300')

  // Progress bar value
  const progressValue = (totalSpending / budget) * 100 || 0
  const isOverBudget = totalSpending > budget
  const isInvalid = localBudget < 0

  // Debounce budget update
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isInvalid) setBudget(localBudget)
    }, 500)
    return () => clearTimeout(timeout)
  }, [localBudget, setBudget, isInvalid])

  // Clear input handler
  const handleClear = () => {
    setLocalBudget(0)
    inputRef.current?.focus()
  }

  return (
    <Card 
      mb={8} 
      bg={cardBg}
      boxShadow="sm"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      transition="all 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      <CardBody>
        <FormControl isInvalid={isInvalid}>
          <Flex direction={['column', 'row']} gap={6} align="center">
            {/* Budget Input */}
            <Box flex={1} width="100%">
              <FormLabel 
                fontSize={{ base: 'sm', md: 'md' }}
                color={textColor}
                display="flex" 
                alignItems="center" 
                gap={2}
              >
                Monthly Budget
                <Tooltip 
                  label="Set your total monthly spending limit" 
                  placement="top"
                  hasArrow
                >
                  <span>
                    <Icon as={FaInfoCircle} color="gray.400" />
                  </span>
                </Tooltip>
              </FormLabel>
              
              <InputGroup>
                <InputLeftElement pointerEvents="none" color={textColor}>
                  <Icon as={FaRupeeSign} />
                </InputLeftElement>
                <Input
                  ref={inputRef}
                  type="number"
                  value={localBudget}
                  onChange={(e) => setLocalBudget(parseFloat(e.target.value))}
                  placeholder="Set your budget"
                  bg={inputBg}
                  size="lg"
                  focusBorderColor={headingColor}
                  _hover={{ borderColor: headingColor }}
                  pr="4.5rem"
                  min={0}
                />
                {localBudget > 0 && (
                  <InputRightElement width="4.5rem">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      onClick={handleClear}
                      variant="ghost"
                      color={textColor}
                    >
                      <Icon as={FaTimes} />
                    </Button>
                  </InputRightElement>
                )}
              </InputGroup>
              <FormErrorMessage>
                <Icon as={FaExclamationTriangle} mr={2} />
                Budget cannot be negative
              </FormErrorMessage>
            </Box>

            {/* Progress Section */}
            <Box flex={1} width="100%">
              <FormLabel 
                fontSize={{ base: 'sm', md: 'md' }}
                color={textColor}
                display="flex" 
                alignItems="center" 
                gap={2}
              >
                Spending Progress
                <Tooltip 
                  label="Track how much of your budget you've spent" 
                  placement="top"
                  hasArrow
                >
                  <span>
                    <Icon as={FaInfoCircle} color="gray.400" />
                  </span>
                </Tooltip>
              </FormLabel>
              
              <MotionBox 
                position="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition="0.3s ease"
              >
                <Progress 
                  value={progressValue} 
                  size="lg"
                  colorScheme={isOverBudget ? 'red' : 'green'}
                  borderRadius="md"
                  bg={progressBg}
                  transition="all 0.3s ease"
                />
                <Text 
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  fontSize="sm"
                  fontWeight="bold"
                  color={isOverBudget ? errorColor : 'green.600'}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  {isOverBudget && <Icon as={FaExclamationTriangle} />}
                  {progressValue.toFixed(1)}%
                </Text>
              </MotionBox>
              
              <Text 
                mt={2} 
                textAlign="center" 
                fontSize={{ base: 'sm', md: 'md' }}
                // color={textColor}
                fontWeight={isOverBudget ? 'bold' : 'normal'}
                color={isOverBudget ? errorColor : textColor}
              >
                <Icon as={FaRupeeSign} mr={1} />
                {totalSpending.toFixed(2)} spent of{' '}
                <Icon as={FaRupeeSign} mx={1} />
                {budget.toFixed(2)}
              </Text>
            </Box>
          </Flex>
        </FormControl>
      </CardBody>
    </Card>
  )
}

export default BudgetSection