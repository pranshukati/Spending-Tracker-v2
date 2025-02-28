
import { 
  Card, 
  CardBody, 
  Heading, 
  Flex, 
  Text, 
  Box, 
  Button, 
  Tag, 
  TagLabel,
  TagLeftIcon,
  useColorModeValue,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
  Center,
  SimpleGrid,
  Input  // Add this import
} from '@chakra-ui/react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  TimeIcon, 
  CalendarIcon,
  ArrowRightIcon
} from '@chakra-ui/icons'
import { format } from 'date-fns'
import { parseDate } from '../utils/dateUtils'
import { FaRupeeSign, FaTags } from 'react-icons/fa'

const TransactionList = ({ filteredData, currentPage, setCurrentPage }) => {
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const amountColor = useColorModeValue('blue.600', 'blue.300')
  const tagColor = useColorModeValue('teal.600', 'teal.200')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <Card 
      mb={8} 
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="sm"
    >
      <CardBody>
        <Heading 
          size="md" 
          mb={6} 
          display="flex" 
          alignItems="center" 
          gap={2}
          color={useColorModeValue('blue.600', 'blue.300')}
        >
          <FaTags />
          Transaction History
        </Heading>

        {filteredData.length === 0 ? (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            No transactions found for this period
          </Alert>
        ) : (
          <>
            <SimpleGrid columns={[1, 1, 2]} spacing={4} mb={6}>
              {filteredData
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map(payment => (
                  <Box
                    key={payment._id}
                    p={4}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="lg"
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                      bg: hoverBg
                    }}
                  >
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Flex align="center" gap={2} mb={2}>
                          <Tag 
                            colorScheme="teal" 
                            variant="subtle" 
                            size="sm"
                            borderRadius="full"
                          >
                            <TagLeftIcon as={FaRupeeSign} />
                            <TagLabel fontWeight="bold">
                              {payment.payment.toFixed(2)}
                            </TagLabel>
                          </Tag>
                          {payment.category && (
                            <Tag 
                              color={tagColor}
                              variant="outline"
                              size="sm"
                              borderRadius="full"
                            >
                              {payment.category}
                            </Tag>
                          )}
                        </Flex>
                        {payment.description && (
                          <Text fontSize="sm" color={textColor} mt={1}>
                            {payment.description}
                          </Text>
                        )}
                      </Box>
                      <Box textAlign="right">
                        <Tooltip label="Transaction date">
                          <Flex 
                            align="center" 
                            gap={1} 
                            color={textColor}
                            fontSize="sm"
                          >
                            <CalendarIcon mr={1} />
                            {format(parseDate(payment.dateandtime), 'EEE, d MMM')}
                          </Flex>
                        </Tooltip>
                        <Tooltip label="Transaction time">
                          <Text 
                            fontSize="xs" 
                            color={textColor}
                            mt={1}
                            display="flex"
                            alignItems="center"
                          >
                            <TimeIcon mr={1} />
                            {format(parseDate(payment.dateandtime), 'hh:mm a')}
                          </Text>
                        </Tooltip>
                      </Box>
                    </Flex>
                  </Box>
                ))}
            </SimpleGrid>

            <Flex justify="space-between" align="center" mt={6} flexWrap="wrap" gap={4}>
            <Flex align="center" gap={2}>
            <IconButton
              aria-label="Previous page"
              icon={<ChevronLeftIcon />}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            />
            
            <Flex gap={1}>
              {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => {
                // Calculate first visible page based on current position
                const startPage = Math.max(1, Math.min(
                  currentPage - 1,
                  totalPages - 2
                ))
                const page = startPage + i
                return page <= totalPages ? (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    colorScheme={currentPage === page ? 'blue' : 'gray'}
                    variant={currentPage === page ? 'solid' : 'outline'}
                    size="sm"
                    minW="40px"
                  >
                    {page}
                  </Button>
                ) : null
              })}
            </Flex>

              <IconButton
                aria-label="Next page"
                icon={<ChevronRightIcon />}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
              />
            </Flex>

            <Flex align="center" gap={2}>
              <Text fontSize="sm" color={textColor}>
                Page {currentPage} of {totalPages}
              </Text>
              <Flex as="form" onSubmit={(e) => {
                e.preventDefault()
                const page = parseInt(e.target.page.value)
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page)
                }
              }}>
                <Input
                  name="page"
                  type="number"
                  min={1}
                  max={totalPages}
                  defaultValue={currentPage}
                  w="80px"
                  size="sm"
                  borderRadius="md"
                  mr={2}
                />
                <IconButton
                  type="submit"
                  aria-label="Go to page"
                  icon={<ArrowRightIcon />}
                  size="sm"
                  colorScheme="blue"
                />
              </Flex>
            </Flex>
          </Flex>
          </>
        )}
      </CardBody>
    </Card>
  )
}

export default TransactionList