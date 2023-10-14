import axios from "axios";
import { useState } from "react";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

const CreateTable = () => {
  const [colums, setColums] = useState([]);
  const [tableName, setTableName] = useState("");
  const [tmpColumn, setTmpColumn] = useState({
    field_name: "",
    field_type: "int",
  });
  console.log(colums)
  const addNewColumnHandler = () => {
    if (!tmpColumn.field_name) {
      alert("Field name required!");
    } else {
      const check = colums.find(
        (col) => col.field_name === tmpColumn.field_name
      );
      if (check) alert(`"${check.field_name}": Duplicate Field Name found!`);
      else setColums([...colums, tmpColumn]);
    }
  };

  const deleteColumnHandler = (idx) => {
    if (colums.indexOf(idx) === 0) {
      setColums([]);
    } else {
      const newColumnList = colums.filter((_, _id) => idx !== _id);
      setColums(newColumnList);
    }
  };

  const newDataInputHandler = (e) => {
    e.preventDefault();
    const tmp = {};
    tmp[e.target.name] = e.target.value;
    setTmpColumn({ ...tmpColumn, ...tmp });
  };

  const tableNameHandler = (e) => {
    const ch = e.target.value;
    if (
      (ch[ch.length - 1] >= "a" && ch[ch.length - 1] <= "z") ||
      (ch[ch.length - 1] >= "A" && ch[ch.length - 1] <= "Z") ||
      (ch[ch.length - 1] >= "0" && ch[ch.length - 1] <= "9") ||
      ch[ch.length - 1] === " " ||
      ch[ch.length - 1] === "_" ||
      ch === ""
    ) {
      const finalSt = ch.split(" ").join("_");
      setTableName(finalSt);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:5000/createtable/${tableName}`, colums)
      .then((_) => {
        if (_?.data?.protocol41) {
          toast.success(
            (t) => (
              <p onClick={() => toast.dismiss(t.id)}>
                Table successfully created!
              </p>
            ),
            {
              position: "bottom-center",
              duration: Infinity,
            }
          );
        } else {
          toast.error(
            (t) => (
              <p onClick={() => toast.dismiss(t.id)}>{_?.data?.sqlMessage}</p>
            ),
            {
              position: "bottom-center",
              duration: Infinity,
            }
          );
        }
      });
  };

  return (
    <>
      <h1 className="text-center text-3xl mt-10 mb-5 font-bold uppercase">
        Table creation
      </h1>
      <div className="sm:w-[500px] w-11/12 overflow-hidden bg-gradient-to-r from-green-50 to-blue-50  rounded-3xl shadow-2xl p-10 mx-auto">
        <form onSubmit={submitHandler}>
          <div className="flex flex-col gap-3">
            <div>
              <label className="input-group input-group-vertical">
                <span className="py-1 font-semibold">Table name</span>
                <input
                  type="text"
                  placeholder="Table name"
                  required
                  onChange={tableNameHandler}
                  value={tableName}
                  className="input input-bordered"
                />
              </label>
            </div>
            {colums.map((item, idx) => (
              <div key={idx} className="join">
                <div>
                  <div>
                    <input
                      className="input input-bordered join-item"
                      placeholder="Field name"
                      disabled
                      value={item?.field_name}
                    />
                  </div>
                </div>
                <input
                  disabled
                  className="select select-bordered join-item w-[50%] "
                  data-tip={item?.field_type}
                  value={item?.field_type}
                />
                <div className="indicator">
                  <button
                    onClick={() => deleteColumnHandler(idx)}
                    className="btn btn-block join-item font-extrabold text-white bg-red-600 hover:bg-red-400  text-2xl"
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            ))}
            <div className="join">
              <div>
                <div>
                  <input
                    className="input input-bordered join-item"
                    placeholder="Field name"
                    name="field_name"
                    value={tmpColumn["field_name"]}
                    onChange={newDataInputHandler}
                  />
                </div>
              </div>
              <select
                onChange={newDataInputHandler}
                className="select select-bordered join-item w-[50%]"
                name="field_type"
                value={tmpColumn["field_type"]}
              >
                <option disabled>Data Type</option>
                {
                  colums.length > 0 ?
                    <>
                      <option>int</option>
                      <option>char</option>
                      <option>varchar(200)</option>
                    </> : <>
                      <option>int primary key</option>
                      <option>int primary key auto_increment</option>
                      <option>char primary key</option>
                      <option>varchar(200) primary key</option>
                    </>
                }

              </select>
              <div className="indicator">
                <button
                  type="button"
                  onClick={addNewColumnHandler}
                  className="btn btn-block btn-info join-item font-extrabold text-2xl"
                >
                  <AiOutlinePlusCircle />
                </button>
              </div>
            </div>
            <button className="btn btn-outline btn-primary">Create</button>
            <Toaster />
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateTable;
