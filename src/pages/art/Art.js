import { useEffect, useState } from 'react';
// material
import { Button, Container, Stack, Typography } from '@mui/material';
// components
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import {
  ProductList,
} from '../../sections/@dashboard/products';
//
import PRODUCTS from '../../_mocks_/products';
import { storage } from '../../utils/localStorage';
import Iconify from '../../components/Iconify';
import { http } from '../../utils/http';
import { randomId } from '@mui/x-data-grid-generator';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const navigate = useNavigate();
  let [val, setVal] = useState([])

  useEffect(()=>{
    http.get("http://95.163.213.222/api/v1/pictures").then(value => {
      setVal(value.data)
    }).catch(() => {
      storage.del("jwt");
      navigate('/login', { replace: true });
    })
    const isLogin = storage.get("jwt");
    if (isLogin == null) {
      navigate('/login', { replace: true });
    }
  }, []) // <-- empty dependency array
  return (
    <Page title="Картины">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Картины
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/new_art"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Добавить картину
          </Button>
        </Stack>
        <ProductList products={val} url={"/dashboard/edit_art"}/>
      </Container>
    </Page>
  );
}
