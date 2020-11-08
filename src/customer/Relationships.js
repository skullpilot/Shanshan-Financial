import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import propTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  TextFieldRoot: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2, 5),
      width: 300,
    },
    textAlign: "center",
  },
  ButtonRoot: {
    "& .MuiButton-root": {
      margin: theme.spacing(2, 5),
      width: 300,
    },
  },
  SelectInput: {
    margin: theme.spacing(2, 5),
    width: 300,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

Relationships.propTypes = {
  relationships: propTypes.array,
  updateRelationships: propTypes.func,
  menuItems: propTypes.object,
};
function Relationships({ relationships, updateRelationships, menuItems }) {
  const classes = useStyles();

  const relationshipItems =
    relationships &&
    relationships.map((relationship, index) => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="delete"
            onClick={() => {
              relationships.splice(index, 1);
              updateRelationships(relationships);
            }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
          <TextField
            label="Relation Name"
            variant="outlined"
            value={relationship.name || ""}
            onChange={(event) => {
              relationships[index].name = event.target.value;
              updateRelationships(relationships);
            }}
          />
          <span>:</span>
          <Select
            value={relationship.value}
            className={classes.SelectInput}
            onChange={(event) => {
              relationships[index].value = event.target.value;
              updateRelationships(relationships);
            }}
          >
            {menuItems}
          </Select>
        </div>
      );
    });

  return (
    <div>
      {relationshipItems}
      <Button
        variant="contained"
        onClick={() => updateRelationships(relationships.concat([{ name: "", value: "" }]))}
      >
        Add Relationship
      </Button>
    </div>
  );
}

export default Relationships;
