import React from "react";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const App = () => {
  const [todo, settodo] = useState();
  const [input, setinput] = useState([]);
  useEffect(() => {
    let todostring = localStorage.getItem("todo");
    if (todostring) {
      let inputt = JSON.parse(localStorage.getItem("todo"));
      setinput(inputt);
    }
  }, []);

  const saveToLS = (params) => {
    localStorage.setItem(input, JSON.stringify(input));
  };

                   // edit feild

  const handleedit = (e, id) => {
    let t = input.filter((i) => i.id === id);
    settodo(t[0].todo);
    let newtodo = input.filter((item) => {
      return item.id !== id;
    });
    setinput(newtodo);
    saveToLS();
  };

      // delete field
  const handledelete = (e, id) => {
    let newtodo = input.filter((item) => {
      return item.id !== id;
    });
    setinput(newtodo);
    saveToLS();
  };  

        //  todo add field

  const handleadd = () => {
    const newTodos = [...input, { id: uuidv4(), todo, iscompleted: false }];
   
    setinput(newTodos);
    setTimeout(() => {
      localStorage.setItem("todo", JSON.stringify(newTodos));
    }, 2000);
    settodo("");
    saveToLS();
  };
   
  // change field
  const handlechange = (e) => {
    settodo(e.target.value);
  };

          // UI


  return (
   
      <div className="bg-blue-400 w-full h-screen md:py-7 py-12">
        
      <div className=" main bg-slate-200 hover:shadow-2xl hover:-translate-y-2 duration-300 mx-auto md:w-[40%] w-[80%] px-2 py-2  rounded-xl md:min-h-[90vh] min-h-[70vh] ">
        <div className="text-center font-semibold text-3xl pt-5 text-gray-700  " >
         Manage yours all todo in one place 
       </div>
        <div className="todo font-semibold text-black text-2xl mt-5 mx-2 ">Add a todo</div>
       <div className="flex-col flex" >
        {/* input field */}
        <div className="text-center" >
           <input placeholder="Add your todo here" onChange={handlechange} value={todo} type="text"
          //  styling
          className="w-[98%] h-10 border-2 items-center  outline-none rounded-lg text-2xl "
        />
        </div>
        <div className="text-center mt-1 items-center flex justify-center" >
          <button
          onClick={handleadd}
          className="text-white bg-blue-800 hover:bg-blue-950 w-[98%] mt-2 h-9 text-2xl  rounded-lg items-center flex justify-center  "
        >
         Save  
        </button>
        </div>
       </div>
        <h1 className="text-black font-semibold text-2xl px-3 pt-3 ">Yours todo</h1>
        <div className="todo justify-between px-4 ">
          {input.length===0 && (
            <div className="my-7 mx-3 font-semibold text-2xl text-left text-red-700 hover:underline">
              No todos to display now
            </div>
          )}
          {input.map((item) => {
            return (
              <div
                key={item.id}
                className="todo flex  justify-between bg-blue-800  border border-gray-500 h-auto rounded-sm mt-3 px-3   "
              >
                <div className="w-full flex items-center justify-between  "  >
                  <div className="items-center mb-1.5 text-2xl  text-white overflow-hidden  " >{item.todo}</div>
                  <div className="flex     ">
                   <div className="px-2 pt-1.5" >
                     <button
                    onClick={(e) => handleedit(e, item.id)}
                    className="bg-blue-800 hover:bg-blue-950 w-10 h-9  text-white px-0.5   rounded-lg "
                  >
                  <div className="text-center items-center px-1.5 ">
                     <MdEdit className="text-2xl" />
                  </div>
                  </button>
                   </div>
              <div className=" pt-1.5" >
                    <button
                    onClick={(e) => {
                      handledelete(e, item.id);
                    }}
                    className="bg-blue-800 hover:bg-blue-950 w-10 text-white p-0.5 h-9  rounded-lg"
                  >
                    <div className="text-center items-center px-1.5  " ><MdDelete className="text-2xl " /></div>
                  </button>
              </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>

  );
};

export default App;
