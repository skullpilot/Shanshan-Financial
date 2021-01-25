import React from "react";
import moment from "moment";

function Notes({ notes, updateNotes }) {
  let notesArray = [];

  for (let [key, val] of Object.entries(notes)) {
    notesArray.push([key, val]);
  }
  notesArray.sort((a, b) => a[0] - b[0]);

  const noteItems = notesArray.map((note, index) => {
    const time = moment(note[0], "YYYYMMDD-HH:mm:ss").format(
      "MMM Do YYYY, HH:mm:ss"
    );
    return (
      <div className="flex flex-row justify-center mb-6" key={note[0]}>
        <div className="flex flex-col mr-6 justify-center items-center">
          <div>{time}</div>
          <button
            className="text-white bg-red-500 hover:bg-red-600 mt-8 w-24 rounded"
            onClick={() => {
              delete notes[note[0]]
              updateNotes({ ...notes });
            }}
          >
            Delete
          </button>
        </div>

        <textarea
          rows="5"
          className="border p-2 rounded w-96"
          placeholder="请输入信息..."
          value={note[1] || ""}
          onChange={(event) => {
            updateNotes({ ...notes, [note[0]]: event.target.value });
          }}
        />
      </div>
    );
  });

  return (
    <div className="flex flex-col">
      <h5 className="my-8 text-xl mx-auto">Notes</h5>
      <div className="flex flex-col">{noteItems}</div>

      <button
        className="mx-auto bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        onClick={() => {
          const date = moment().format("YYYYMMDD-HH:mm:ss");
          notes[date] = "";
          updateNotes(notes);
        }}
      >
        Add Note
      </button>
    </div>
  );
}

export default Notes;
