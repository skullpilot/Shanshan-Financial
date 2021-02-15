import React, { useLayoutEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

function descendingComparator(a, b, orderBy) {
  const valueA = a[orderBy] || "";
  const valueB = b[orderBy] || "";

  if (valueB < valueA) {
    return -1;
  }
  if (valueB > valueA) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function EnhancedTableHead({ classes, order, orderBy, onRequestSort, headCells }) {
  const handleClick = (cellID) => {
    onRequestSort(cellID);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={() => handleClick(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "30px",
  },
  paper: {
    marginBottom: theme.spacing(2),
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable({
  pagePath,
  rows,
  headCells,
  handleItemClick,
  handleCreateItem,
  createItemText,
  defaultOrderBy,
}) {
  const classes = useStyles();
  const query = useQuery();
  const history = useHistory();

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState(defaultOrderBy);
  const [dense, setDense] = React.useState(true);

  useLayoutEffect(() => {
    const sortOrder = query.get("sortOrder") ? query.get("sortOrder") : order;
    const sortType = query.get("sortType") ? query.get("sortType") : orderBy;
    setOrder(sortOrder);
    setOrderBy(sortType);
  }, []);

  const names = Object.values(headCells).map((cell) => cell.id);

  const handleRequestSort = (cellID) => {
    const updatedOrder = order === "asc" && orderBy === cellID ? "desc" : "asc";
    query.set("sortOrder", updatedOrder);
    query.set("sortType", cellID);
    history.push({
      pathname: pagePath,
      search: query.toString(),
    });
    setOrder(updatedOrder);
    setOrderBy(cellID);
  };

  const handleClick = (event, id) => {
    handleItemClick(id);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  return (
    <div className={classes.root}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense Padding"
        />
        <Button variant="contained" color="primary" onClick={() => handleCreateItem()}>
          {createItemText}
        </Button>
      </div>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table size={dense ? "small" : "medium"} aria-label="enhanced table">
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map((row) => {
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                  >
                    {names.map((name, index) => (
                      <TableCell key={index}>{row[name]}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
