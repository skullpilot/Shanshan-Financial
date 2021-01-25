import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

function Relationships({ relationships, updateRelationships, menuItems }) {
  const relationshipItems =
    relationships &&
    relationships.map((relationship, index) => {
      return (
        <div className="flex flex-row mb-6 justify-center items-center" key={relationship.name}>
          <IconButton
            aria-label="delete"
            onClick={() => {
              relationships.splice(index, 1);
              updateRelationships(relationships);
            }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
          <input
            className="border p-2 rounded w-48"
            placeholder="Relationship"
            value={relationship.name || ""}
            onChange={(event) => {
              relationships[index].name = event.target.value;
              updateRelationships(relationships);
            }}
          />
          <span className="mx-6">is</span>
          <select
            value={relationship.value}
            className="border p-2 rounded w-48"
            onChange={(event) => {
              relationships[index].value = event.target.value;
              updateRelationships(relationships);
            }}
          >
            {menuItems}
          </select>
        </div>
      );
    });

  return (
    <div className="flex flex-col">
      <h5 className="my-8 text-xl mx-auto">Relationships</h5>
      {relationshipItems}
      <button
        className="mx-auto bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        onClick={() =>
          updateRelationships(relationships.concat([{ name: "", value: "" }]))
        }
      >
        Add Relationship
      </button>
    </div>
  );
}

export default Relationships;
