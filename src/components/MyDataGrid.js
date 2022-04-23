import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  useGridApiRef,
  DataGridPro,
  GridToolbarContainer,
  GridActionsCellItem
} from '@mui/x-data-grid-pro';

import { randomId } from '@mui/x-data-grid-generator';

function EditToolbar(props) {
  const { apiRef } = props;
  const handleClick = () => {
    const id = randomId();
    apiRef.current.updateRows([{ id, isNew: true }]);
    apiRef.current.startRowEditMode({ id });

    // Wait for the grid to render with the new row
    setTimeout(() => {
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowsCount() - 1
      });

      apiRef.current.setCellFocus(id, 'type');
    });
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Добавить запись
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired
  }).isRequired
};

const replaceOnDocument = (pattern, string, { target = document.body } = {}) => {
  // Handle `string` — see the last section
  [target, ...target.querySelectorAll('*:not(script):not(noscript):not(style)')].forEach(
    ({ childNodes: [...nodes] }) =>
      nodes
        .filter(({ nodeType }) => nodeType === document.TEXT_NODE)
        .forEach(
          (textNode) => (textNode.textContent = textNode.textContent.replace(pattern, string))
        )
  );
};

export default function FullFeaturedCrudGrid(myprops) {
  const apiRef = useGridApiRef();
  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.startRowEditMode({ id });
  };

  const handleSaveClick = (id) => async (event) => {
    event.stopPropagation();
    await apiRef.current.stopRowEditMode({ id });
    myprops.onChange(Object.values(apiRef.current.state.rows.idRowsLookup))
  };

  const handleDeleteClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.updateRows([{ id, _action: 'delete' }]);
    myprops.onChange(Object.values(apiRef.current.state.rows.idRowsLookup))
  };

  const handleCancelClick = (id) => async (event) => {
    event.stopPropagation();
    await apiRef.current.stopRowEditMode({ id, ignoreModifications: true });

    const row = apiRef.current.getRow(id);
    if (row.isNew) {
      apiRef.current.updateRows([{ id, _action: 'delete' }]);
    }
  };

  const processRowUpdate = async (newRow) => ({ ...newRow, isNew: false });

  const columns = [
    { field: 'type', headerName: 'Название', width: 200, editable: true },
    { field: 'value', headerName: 'Описание', width: 200, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 200,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = apiRef.current.getRowMode(id) === 'edit';

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
        ];
      }
    }
  ];
  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary'
        },
        '& .textPrimary': {
          color: 'text.primary'
        }
      }}
    >
      <DataGridPro
        onColumnVisibilityChange={setTimeout(() => {
          replaceOnDocument(/MUI X: Missing license key/, '');
        }, 20)}
        rows={myprops.value}
        columns={columns}
        apiRef={apiRef}
        editMode="row"
        onRowEditStart={handleRowEditStart}
        onRowEditStop={
          handleRowEditStop
        }
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar
        }}
        componentsProps={{
          toolbar: { apiRef }
        }}
        hideFooter
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
