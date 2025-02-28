import { Card, CardBody, SimpleGrid, Heading, Text, Flex, Box } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

const RecentTransactions = ({ transactions }) => {
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const headingColor = useColorModeValue('blue.600', 'blue.200')
  const amountColor = useColorModeValue('blue.600', 'blue.300')
  const dateColor = useColorModeValue('gray.600', 'gray.400')
  const iconColor = useColorModeValue('gray.600', 'gray.200')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <Card 
      mb={8} 
      bg={useColorModeValue('blue.50', 'blue.900')}
      boxShadow="md"
      borderRadius="xl"
    >
      <CardBody>
        <Heading 
          size="md" 
          mb={6} 
          color={headingColor}
          letterSpacing="wide"
        >
          Recent Transactions
        </Heading>
        
        {transactions.length === 0 ? (
          <Text 
            textAlign="center" 
            color={dateColor}
            fontStyle="italic"
          >
            No recent transactions
          </Text>
        ) : (
          <SimpleGrid 
            columns={[1, 2]} 
            spacing={4}
            templateColumns="repeat(auto-fit, minmax(280px, 1fr))"
          >
            {transactions.map((payment, index) => (
              <Card 
                key={payment._id} 
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                transition="all 0.2s"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                  bg: hoverBg
                }}
              >
                <CardBody>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text 
                        fontWeight="bold" 
                        fontSize="xl" 
                        color={amountColor}
                        mb={1}
                      >
                        ₹{payment.payment}
                      </Text>
                      <Text 
                        fontSize="sm" 
                        color={dateColor}
                        fontFamily="mono"
                      >
                        {/* {new Date(payment.dateandtime).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })} */}
                        {payment.dateandtime}
                      </Text>
                    </Box>
                    <Text 
                      fontSize="3xl" 
                      mr={2} 
                      color={iconColor}
                      transition="transform 0.2s"
                      _hover={{ transform: 'scale(1.1)' }}
                    >
                      {['🛒', '💸', '🏠', '🍴'][index % 4]}
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </CardBody>
    </Card>
  )
}

export default RecentTransactions