import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import propTypes from "prop-types";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  textField: {
    [theme.breakpoints.down("xs")]: {

      "& .MuiTextField": {
        backgroundColor: "red",
        flexGrow: 4
      },
    },
    [theme.breakpoints.up("sm")]: {
      "& .MuiTextField-root": {
        backgroundColor: "green",
        flexGrow: 6
      }

    },
    [theme.breakpoints.up("md")]: {
      backgroundColor: "blue",
      flexGrow: 10

    },
  },
  note: {
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

Notes.propTypes = {
  notes: propTypes.object,
  updateNotes: propTypes.func,
};
function Notes({ notes, updateNotes }) {
  let notesArray = [];
  let classes = useStyles();

  for (let [key, val] of Object.entries(notes)) {
    notesArray.push([key, val]);
  }
  notesArray.sort((a, b) => a[0] - b[0]);

  const noteItems = notesArray.map((note, index) => {
    return (
      <div
        className={classes.note}
      >
        <div styles={{ flexGrow: 1 }}>{note[0] || ""}</div>
        <div styles={{ flexGrow: 10 }}>
          <TextField
            label="Note Detail"
            variant="outlined"
            rows={3}
            multiline
            value={note[1] || ""}
            onChange={(event) => {
              let notesCopy = {};
              for (let [key, val] of Object.entries(notes)) {
                if (key === note[0]) {
                  notesCopy[key] = event.target.value;
                } else {
                  notesCopy[key] = val;
                }
              }
              updateNotes(notesCopy);
            }}
          />
        </div>
      </div>
    );
  });

  return (
    <div >
      <h5>Notes</h5>
      {noteItems}
      <Button
        variant="contained"
        onClick={() => {
          let date = moment().format("YYYYMMDD-HH:mm:ss");
          notes[date] = "";
          updateNotes(notes);
        }}
      >
        Add Note
      </Button>
    </div>
  );
}

export default Notes;
