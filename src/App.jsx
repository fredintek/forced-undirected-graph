import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faClose } from '@fortawesome/free-solid-svg-icons'
import './App.css';
import { useRef, useState } from 'react';
import axios from 'axios';
import VisGraph from 'react-vis-graph-wrapper';

function App() {

  // states and ref for app
  const [ nodeData, setNodeData ] = useState(null);
  const [ linkData, setLinkData ] = useState(null);
  const [propertiesFile, setPropertiesFile] = useState(null);
  const [adjFile, setAdjFile] = useState(null);
  const adjFileRef = useRef();
  const propertiesFileRef = useRef();
  const [showGraph, setShowGraph] = useState(false);
  const [fileOverProp, setFileOverProp] = useState(false);
  const [fileOverAdj, setFileOverAdj] = useState(false);

  // Function handlers
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append('properties', propertiesFile);
    formData.append('adjmatrix', adjFile);

    const res = await axios({
      method: 'post',
      url: 'http://localhost:4000/undirected-graph',
      data: formData,
    })

    setNodeData(res.data.nodes);
    setLinkData(res.data.edges);
    console.log(res.data)

    removeUploadedFile("prop")
    removeUploadedFile("adj")

    setShowGraph(true)
  }

  const handleDragOver = (e, type) => {
    e.preventDefault();
    
    if (type === "prop"){
      setFileOverProp(true)
      
    }else if (type === "adj"){
      setFileOverAdj(true)

    }
  }

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    
    if (type === "prop"){
      setFileOverProp(false)
      
    }else if (type === "adj"){
      setFileOverAdj(false)

    }
  }

  const handleDragDrop = (e, type) => {
    e.preventDefault();
    
    if (type === "prop"){
      setPropertiesFile(e.dataTransfer.files[0])
      
    }else if (type === "adj"){
      setAdjFile(e.dataTransfer.files[0])

    }
  }

  function removeUploadedFile(type) {
    if (type === "prop"){
      propertiesFileRef.current.value = "";
      setPropertiesFile(null);
      setFileOverProp(false)
    }else if (type === "adj"){
      adjFileRef.current.value = "";
      setAdjFile(null)
      setFileOverAdj(false)
    }
  }

  // forced undirected graph configurations
  const graph = {
    nodes: nodeData,
    edges: linkData,
  };
  
  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    height: '1500px',
  };

  const events = {
    select: (event) => {
      const { nodes, edges } = event;
      console.log(nodes, edges);
    },
  };

  return (
    <div className="app">
      <header className="header">
        <p>Undirected Graph</p>
      </header>
      <div className="app__body">
        {
          showGraph ? (<></>) : (
          <form className="graph__form" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form__group">
              <label className={`${fileOverProp || propertiesFile ? "fileover": ""}`} htmlFor="properties" onDragOver={(e) => handleDragOver(e, "prop")} onDragLeave={(e) => handleDragLeave(e, "prop")} onDrop={(e) => handleDragDrop(e, "prop")}>
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
                <input ref={propertiesFileRef}  onChange={(e) => setPropertiesFile(e.target.files[0])} type="file" name="properties" id="properties" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
              </label>
            </div>
            <div className="form__group">
              <label htmlFor="adjmatrix" className={`${fileOverAdj || adjFile ? "fileover": ""}`} onDragOver={(e) => handleDragOver(e, "adj")} onDragLeave={(e) => handleDragLeave(e, "adj")} onDrop={(e) => handleDragDrop(e, "adj")}>
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
          )
        }
      
      {
        showGraph && (
        <VisGraph
          graph={graph}
          options={options}
          events={events}
    />


        )
      }

      </div>
    </div>
  );
}

export default App;
