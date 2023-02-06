import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faClose } from '@fortawesome/free-solid-svg-icons'
import './App.css';
import { useRef, useState } from 'react';
import axios from 'axios';

function App() {

  const [propertiesFile, setPropertiesFile] = useState("");
  const [adjFile, setAdjFile] = useState("");
  const adjFileRef = useRef();
  const propertiesFileRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(propertiesFile);
    // console.log(adjFile);

    const formData = new FormData();
    formData.append('properties', propertiesFile);
    formData.append('adjmatrix', adjFile);

    // for (const val of formData.entries()){
    //   console.log(val);
    // }

    const res = await axios({
      method: 'post',
      url: 'http://localhost:4000/undirected-graph',
      data: formData,
      // headers: {
      //   'Content-Type':'multipart/form-data'
      // }
    })

    console.log(res.data);

    removeUploadedFile("prop")
    removeUploadedFile("adj")
  }

  function removeUploadedFile(type) {
    if (type === "prop"){
      propertiesFileRef.current.value = "";
      setPropertiesFile("");
    }else if (type === "adj"){
      adjFileRef.current.value = "";
      setAdjFile("")
    }
  }

  return (
    <div className="app">
      <header className="header">
        <p>Undirected Graph</p>
      </header>
      <div className="app__body">
      <form className="graph__form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form__group">
          <label htmlFor="properties">
            <div>
            <FontAwesomeIcon icon={faUpload} />
            <p>Properties File</p>
            </div>
            {
                propertiesFile && (<div className="uploaded-text">
                <span className="uploaded">{propertiesFile.name}</span>
                <FontAwesomeIcon onClick={() => removeUploadedFile("prop")} className='uploaded-icon' icon={faClose}/>
                </div>
                )
              }
            <input ref={propertiesFileRef} onChange={(e) => setPropertiesFile(e.target.files[0])} type="file" name="properties" id="properties" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
          </label>
        </div>
        <div className="form__group">
          <label htmlFor="adjmatrix">
            <div>
              <FontAwesomeIcon icon={faUpload} />
              <p>Adjacency Matrix</p>
            </div>
            {
                adjFile && (<div className="uploaded-text">
                <span className="uploaded">{adjFile.name}</span>
                <FontAwesomeIcon onClick={() => removeUploadedFile("adj")} className='uploaded-icon' icon={faClose}/>
                </div>
                )
              }
            <input ref={adjFileRef} onChange={(e) => setAdjFile(e.target.files[0])} type="file" name="adjmatrix" id="adjmatrix" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
          </label>
        </div>

        <button type="submit">Create</button>
      </form>
      </div>
    </div>
  );
}

export default App;
