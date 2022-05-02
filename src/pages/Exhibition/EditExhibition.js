// material
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  Switch,
  FormControlLabel, TableContainer, Table, TableBody, TableRow, TableCell, Checkbox, Avatar, TablePagination, Button
} from '@mui/material';
// components
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import {
  randomId
} from '@mui/x-data-grid-generator';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import FullFeaturedCrudGrid from '../../components/MyDataGrid';
import ImagePicker from '../../components/ImagePicker';
import DragableList from '../../components/DragableList';
import { storage } from '../../utils/localStorage';
import { http } from '../../utils/http';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user';
import Scrollbar from '../../components/Scrollbar';
import USERLIST from '../../_mocks_/user';
import Label from '../../components/Label';
import { sentenceCase } from 'change-case';
import SearchNotFound from '../../components/SearchNotFound';
import { filter } from 'lodash';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'img', label: 'Изображение', alignRight: false },
  { id: 'name', label: 'Название', alignRight: false },
];
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function EditExhibition() {
  let [arts, setArts] = useState([])
  const schema = Yup.object().shape({
    name: Yup.string().required('"Название выставки" должно быть не пустым'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      publish: false,
      spetification: [],
    },
    validationSchema: schema,
    onSubmit: (values, action) => {
      http.post(`http://95.163.213.222/api/v1/exhibitions/${values.id}`, {
        name: values.name,
        description: values.description,
        show: show === true ? 1 : -1,
        info: val.map((data) => {
          return {type: data.type, value: data.value}
        }),
        content: selected.map((value) => {
          return {id: value}
        })
      }).then((value) => {
        toast.success("Выставка успешно обновлена");
        if (imageDidChange) {
          const formData = new FormData();

          toast.info("Идёт загрузка фото");
          images.forEach((i) => {
            if (i.file === undefined) {
              return
            }
            formData.append(
              "image",
              i.file,
              i.file.name
            );
          })

          http.post(`http://95.163.213.222/api/v1/exhibitions/${value.data.id}/images`, formData, true).then(()=>{
            toast.success("Фотографии загружены");
            action.setSubmitting(false)
            navigate('/dashboard/exhibition', { replace: true })
          }).catch(()=>{
            toast.error("Ошибка при загрузки фотографий");
          })
        } else  {
          action.setSubmitting(false)
          navigate('/dashboard/exhibition', { replace: true })
        }
      }).catch(()=> {
        toast.error("Произошла ошибка");
        action.setSubmitting(false)
      })
    }
  });

  const navigate = useNavigate();
  useEffect(()=>{
    const isLogin = storage.get("jwt");
    if (isLogin == null) {
      navigate('/login', { replace: true });
    }
    http.get(`http://95.163.213.222/api/v1/exhibitions/${location.pathname.split('/')[location.pathname.split('/').length - 1]}`).then(value => {

      formik.setFieldValue("name", value.data.name, false)
      formik.setFieldValue("id", value.data.id, false)
      formik.setFieldValue("description", value.data.description, false)
      setShow(value.data.show === 1)
      if( value.data.info !== undefined ){
        setVal(value.data.info.map((v) => {
          return { id: randomId(), type: v.type, value: v.value }
        }))
      }
      let index = -1
      if(value.data.picture !== undefined ) {
        setimages(value.data.picture.split(",").map((val) => {
          index += 1
          return { url: val, index: index }
        }))
      }
      if (value.data.content !== undefined) {
        setSelected(value.data.content.map((value) => {
          return value.id
        }))
        console.log("S", selected)
      }
      http.get("http://95.163.213.222/api/v1/pictures").then(value => {
        setArts(value.data.map((v) => {
          return {id: v.id, name: v.name, picture: v.picture}
        }))
        console.log("A", arts)
      })

    }).catch(() => {
      storage.del("jwt");
      navigate('/login', { replace: true });
    })

  }, []) // <-- empty dependency array


  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  let [val, setVal] = useState({...getFieldProps('spetification')}.value)
  let [show, setShow] = useState(false)

  const [images, setimages] = useState([]);
  const [imageDidChange, setimageDidChange] = useState(false);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = arts.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    console.log(selectedIndex)
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    console.log(2, newSelected)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arts.length) : 0;

  const filteredUsers = applySortFilter(arts, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0 && arts.length !== 0;

  const deleteHandler = (() => {
    http.delete(`http://95.163.213.222/api/v1/exhibitions/${values.id}`).then(()=> {
      navigate('/dashboard/exhibition', { replace: true })
    })
  })

  return (
    <Page title="Редактировать выставку">
      <Container maxWidth="xl">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Card>
              <Box sx={{ p: 1 }}>
                <Stack spacing={2}>
                  <Typography variant="h4">Редактировать выставку</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Название выставки*"
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Stack>

                  <TextField
                    label="Описание выставки"
                    multiline
                    rows={10}
                    variant="outlined"
                    {...getFieldProps('description')}
                  />
                  <FullFeaturedCrudGrid value={val} onChange={(value)=> {
                      setVal(value)
                    }
                  }/>
                  <Card>
                    <UserListToolbar
                      numSelected={selected.length}
                      filterName={filterName}
                      onFilterName={handleFilterByName}
                    />

                    <Scrollbar>
                      <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                          <UserListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={arts.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                          />
                          <TableBody>
                            {filteredUsers
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((row) => {
                                const { id, name, picture } = row;
                                const isItemSelected = selected.indexOf(id) !== -1;
                                return (
                                  <TableRow
                                    hover
                                    key={id}
                                    tabIndex={-1}
                                    role="checkbox"
                                    selected={isItemSelected}
                                    aria-checked={isItemSelected}
                                  >
                                    <TableCell padding="checkbox">
                                      <Checkbox
                                        checked={isItemSelected}
                                        onChange={(event) => handleClick(event, id)}
                                      />
                                    </TableCell>
                                    <TableCell component="th" scope="row" padding="none">
                                      <Avatar alt={name} src={picture} />
                                    </TableCell>
                                    <TableCell align="left">{name}</TableCell>
                                  </TableRow>
                                );
                              })}
                            {emptyRows > 0 && (<></>
                            )}
                          </TableBody>
                          {isUserNotFound && (
                            <TableBody>
                              <TableRow>
                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                  <SearchNotFound searchQuery={filterName} />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          )}
                        </Table>
                      </TableContainer>
                    </Scrollbar>

                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      labelRowsPerPage={"Картин на странице:"}
                      count={arts.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Card>
                  <ImagePicker images={images} onChange={(value)=> {
                    setimages(value)
                    setimageDidChange(true)
                  }}/>

                  <FormControlLabel control={<Switch checked={show} onChange={(e) => {
                    http.post(`http://95.163.213.222/api/v1/exhibitions/${values.id}/public`, {}).then(() => {
                      if (e.target.checked === true) {
                        toast.success("Выставка доступа зрителям");
                      } else  {
                        toast.success("Выставка стала недоступной для зрителей");
                      }
                    }).catch(()=> {
                      toast.error("Неизвестная ошибка");
                    })
                    setShow(e.target.checked)
                  }}/>} label="Доступна для зрителей" />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <LoadingButton
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Сохранить
                    </LoadingButton>
                    <Button
                      size="large"
                      color={"error"}
                      variant="contained"
                      onClick={deleteHandler}
                    >
                      Удалить
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Card>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
