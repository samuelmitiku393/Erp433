import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  TablePagination,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalance as WithdrawalIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { deleteTransaction } from '../../store/slices/transactionSlice';
import useTelegram from '../../hooks/useTelegram';
import { format } from 'date-fns';

const TransactionList = ({ transactions, pagination, onEdit, onPageChange }) => {
  const dispatch = useDispatch();
  const { hapticFeedback, showConfirm } = useTelegram();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'income': return <IncomeIcon sx={{ color: 'success.main' }} />;
      case 'expense': return <ExpenseIcon sx={{ color: 'error.main' }} />;
      case 'withdrawal': return <WithdrawalIcon sx={{ color: 'warning.main' }} />;
      default: return null;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'income': return 'success';
      case 'expense': return 'error';
      case 'withdrawal': return 'warning';
      default: return 'default';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'cash': return 'default';
      case 'card': return 'primary';
      case 'bank_transfer': return 'secondary';
      case 'crypto': return 'warning';
      default: return 'default';
    }
  };

  const handleDelete = async (id) => {
    hapticFeedback?.impactOccurred('medium');
    
    showConfirm?.('Are you sure you want to delete this transaction?', async (confirmed) => {
      if (confirmed) {
        try {
          await dispatch(deleteTransaction(id)).unwrap();
          hapticFeedback?.notificationOccurred('success');
        } catch (error) {
          console.error('Failed to delete transaction:', error);
          hapticFeedback?.notificationOccurred('error');
        }
      }
    });
  };

  const handleEdit = (transaction) => {
    hapticFeedback?.impactOccurred('light');
    onEdit?.(transaction);
  };

  const handleChangePage = (event, newPage) => {
    hapticFeedback?.impactOccurred('light');
    onPageChange?.(newPage + 1);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No transactions found. Add your first transaction!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction._id}
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTypeIcon(transaction.type)}
                    <Chip
                      label={transaction.type}
                      size="small"
                      color={getTypeColor(transaction.type)}
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight="bold"
                    color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                  >
                    ${parseFloat(transaction.amount).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {transaction.description}
                  </Typography>
                  {transaction.tags && transaction.tags.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                      {transaction.tags.slice(0, 2).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {transaction.tags.length > 2 && (
                        <Chip
                          label={`+${transaction.tags.length - 2}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.category}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.paymentMethod}
                    size="small"
                    color={getPaymentMethodColor(transaction.paymentMethod)}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(transaction)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(transaction._id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit}
          rowsPerPageOptions={[]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count}`
          }
        />
      )}
    </Paper>
  );
};

export default TransactionList;