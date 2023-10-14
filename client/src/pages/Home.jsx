import axios from "axios";
import { GrAddCircle } from "react-icons/gr";
import { TiEdit, TiDelete } from "react-icons/ti";
import { TbDatabaseOff, TbRefresh } from "react-icons/tb";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import '../App.css';

const Home = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [newRowData, setNewRowData] = useState({});

  const showTables = (t_name) => {
    setSelectedTable(t_name);
    axios.get(`http://localhost:5000/table/${t_name}`).then((data) => {
      setColumns(data?.data?.columns);
      setData(data?.data?.data);
      const tmpRowData = {};
      data?.data?.columns?.map((item) => {
        if (item?.Extra === "auto_increment") {
          tmpRowData[item?.Field] = "default";
        } else {
          tmpRowData[item?.Field] = "";
        }
      });
      setNewRowData(tmpRowData);
    });
  };

  const loadTables = () => {
    axios.get("http://localhost:5000/alltables").then((data) => {
      setTables(() => data?.data instanceof Array ? data?.data : []);
    });
  };

  const onChangeDataHandler = (e) => {
    const tmpData = { ...newRowData };
    tmpData[e.target.name] = e.target.value;
    setNewRowData(tmpData);
  };

  const insertNewData = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:5000/table/insert/${selectedTable}`, newRowData)
      .then((_) => {
        if (_?.data?.protocol41) {
          toast.success(
            (t) => (
              <p onClick={() => toast.dismiss(t.id)}>Successfully inserted!</p>
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

  const deleteTable = (id, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure want to delete the table: '${id}'`)) {
      axios.delete(`http://localhost:5000/table/delete/${id}`).then((_) => {
      }).catch(er => { }).finally(() => loadTables())
    }
  }
  const deleteDataFromTable = (id, e) => {
    e.stopPropagation();
    console.log(e)
    if (window.confirm(`Are you sure want to delete the table: '${id}'`)) {
      axios.delete(`http://localhost:5000/table-data/delete/${id}`).then((_) => {
      }).catch(er => { }).finally(() => showTables())
    }
  }

  useEffect(() => {
    return () => loadTables();
  }, []);

  return (
    <div className="w-[700px] mx-auto py-10 px-2 mb-12 bg-white shadow-2xl shadow-red-600 mt-16 rounded-3xl">
      <div className="flex gap-3 justify-center mb-10">
        <Link to="/newtable" className="btn btn-success">
          Create New Table
        </Link>
        <button onClick={loadTables} className="btn btn-primary">
          Refresh tables
        </button>
      </div>
      <div className="h-56 overflow-x-auto w-10/12 mx-auto">
        <div className="flex flex-col text-sm p-4 rounded-md bg-base-200">
          {tables?.map((t, idx) => (
            <div
              key={idx}
              onClick={() => showTables(t)}
              className={`flex flex-row justify-start btn relative ${selectedTable === t
                ? "bg-gray-300 no-animation cursor-default"
                : ""
                }`}
            >
              <div className={`absolute right-2 top-1/2 -translate-y-1/2 ${selectedTable === t
                ? "" : "child_row"}`}>
                <div className="flex gap-1">
                  <i className="text-xl cursor-pointer btn btn-sm btn-accent"
                    onClick={() => showTables(t)}
                  ><TbRefresh /></i>
                  <i className="text-xl cursor-pointer btn btn-sm btn-accent"><TiEdit /></i>
                  <i className="text-xl cursor-pointer btn btn-sm btn-accent"
                    onClick={(e) => deleteDataFromTable(t, e)}
                  ><TbDatabaseOff /></i>
                  <i className="text-xl cursor-pointer btn btn-sm btn-accent"
                    onClick={(e) => deleteTable(t, e)}
                  ><TiDelete /></i>
                </div>
              </div>
              <dir className="flex justify-center items-center gap-3">
                <p>{t}</p>
                {selectedTable === t && (
                  <button
                    className=" bg-zinc-400 p-2 rounded-full hover:p-3 transition-all"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <GrAddCircle />
                  </button>
                )}
              </dir>
            </div>
          ))}
        </div>
      </div>

      {/* Show table details */}
      {(data?.length > 0 && columns?.length > 0) ? <div className="overflow-x-auto w-10/12 mx-auto">
        <table className="table">
          <thead className="bg-cyan-300">
            <tr>
              {columns?.map((col, idx) => (
                <th key={idx}>{col?.Field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((item, idx) => (
              <tr key={idx} className="parent_row hover relative">
                {columns?.map((col, _idx) => (
                  <td key={_idx}>{item[col?.Field]}</td>
                ))}
                <div className="child_row absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="flex gap-1">
                    <i className="text-xl cursor-pointer btn btn-sm btn-accent"><TiEdit /></i>
                    <i className="text-xl cursor-pointer btn btn-sm btn-accent"><TiDelete /></i>
                  </div>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      </div> : null}
      {/* END table details */}


      {/* Insert new row Using Modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add new row</h3>
          <form className="py-4" onSubmit={insertNewData}>
            {columns?.map((col, idx) => (
              <div key={idx}>
                <label className="label">
                  <span className="label-text">Enter {col?.Field}</span>
                </label>
                <input
                  type={col?.Type?.includes("int") ? "number" : "text"}
                  placeholder={`Enter ${col?.Field}`}
                  name={col?.Field}
                  value={newRowData?.[col?.Field]}
                  onChange={onChangeDataHandler}
                  disabled={col?.Extra === "auto_increment"}
                  required={col?.Null === "NO"}
                  className="input input-bordered w-full max-w-xs input-sm"
                />
              </div>
            ))}
            <button className="btn btn-success btn-sm mt-5">ADD</button>
            <Toaster />
          </form>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn"
                onClick={() => {
                  setNewRowData({});
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* END Modal */}

    </div>
  );
};

export default Home;
