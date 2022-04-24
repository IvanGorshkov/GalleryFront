import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
//
import USERLIST from '../_mocks_/user';
import { storage } from '../utils/localStorage';
import { http } from '../utils/http';
import { randomId } from '@mui/x-data-grid-generator';
import { ProductList } from '../sections/@dashboard/products';

export default function Exhibition() {
  const navigate = useNavigate();
  useEffect(()=>{
    http.get("http://95.163.213.222/api/v1/exhibitions").then(value => {
      console.log(value.data )
      setVal(value.data)
    })

    const isLogin = storage.get("jwt");
    if (isLogin == null) {
      navigate('/login', { replace: true });
    }
  }, []) // <-- empty dependency array

  let [val, setVal] = useState([])

  return (
    <Page title="Выставки">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Выставки
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/new_exhibition"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Добавить выставку
          </Button>
        </Stack>

        <ProductList products={val} />
      </Container>
    </Page>
  );
}
