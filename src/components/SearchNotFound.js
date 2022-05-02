import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Ничего не найдено
      </Typography>
      <Typography variant="body2" align="center">
        Не найдено результатов для &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Попробуйте проверить на опечатки или использовать полные слова.
      </Typography>
    </Paper>
  );
}
