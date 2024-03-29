// material
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Card,
  TableContainer, Table, TableBody, TableRow, TableCell, Checkbox, Avatar, TablePagination
} from '@mui/material';
// components
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import FullFeaturedCrudGrid from '../../components/MyDataGrid';
import ImagePicker from '../../components/ImagePicker';
import { storage } from '../../utils/localStorage';
import { http } from '../../utils/http';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { filter } from 'lodash';
import CalendarsDateRangePicker from '../../components/DatePicker';
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


export default function CreateExhibition() {
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
      if (start === "") {
        toast.error("Должны быть сроки выставки")
        action.setSubmitting(false)
        return
      }
      let info = val.map((data) => {
        return {type: data.type, value: data.value}
      })
      console.log(info)
      info.push({type: "Начало", value: start}, {type: "Конец", value: endD})
      console.log(info)

      http.post(`http://95.163.213.222/api/v1/exhibitions`, {
        name: values.name,
        description: values.description,
        info: info,
        content: selected.map((value) => {
          return {id: value}
        })
      }).then((value) => {
        toast.success("Выставка успешно создалась");
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

          http.post(`http://95.163.213.222/api/v1/exhibitions/${value.data.id}/images`, formData, true).then(() => {
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
    http.get("http://95.163.213.222/api/v1/pictures").then(value => {
      setArts(value.data.map((v) => {
        return {id: v.id, name: v.name, picture: v.picture}
      }))
      console.log(arts)
    })
  }, []) // <-- empty dependency array

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  let [val, setVal] = useState({...getFieldProps('spetification')}.value)

  const [images, setimages] = useState([]);
  const [start, setStart] = useState("");
  const [endD, setEndD] = useState("");
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



  return (
    <Page title="Новая выставка">
      <Container maxWidth="xl">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Card>
              <Box sx={{ p: 1 }}>
                <Stack spacing={2}>
                  <Typography variant="h4">Новая выставка</Typography>
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

                  <Typography variant="h4">Срок проведения выставки</Typography>
                  <CalendarsDateRangePicker start={start} end={endD} onChange={(newStart, newEnd)=> {
                    setStart(newStart)
                    setEndD(newEnd)
                  }
                  }
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

                  <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Сохранить
                  </LoadingButton>
                </Stack>
              </Box>
            </Card>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
