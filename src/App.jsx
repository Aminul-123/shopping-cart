import { useEffect, useRef, useState } from "react"
import { shoppingData } from "./data"
import { Link, Route, Routes } from "react-router-dom";
import { useLocalStorage } from "./assets/useLocalStorage";


export default function App () {

  const [watched , setWatched] = useLocalStorage('listWatch')
  function handleWatchedList (item) {
    setWatched((prev) => [...prev, item ]);
  }
  function handleRemove (idToDelete) {
    setWatched((item) => item.filter((element) => element.id !== idToDelete))
  }

  return (
    <>
    <Routes>
      <Route path="/" element={<>
           <Navbar />
          <Shopping watched= {watched} setWatched={setWatched} handleWatchedList={handleWatchedList} />
      </>} />
      <Route path="/watchList" element={<>

      {
        watched.length === 0 ? (
          <> 
          <NoWatchList />
          </>
        ) : (
          <> 
            <WatchList watched={watched} handleRemove={handleRemove} />
            <Statistics />
          </>
        )
      }
      </>} />
    </Routes>
    </>
  )
}
function Navbar () {
  const searchEl = useRef(null);

  useEffect(function () {
    function callback () {
      if (e.code === 'Enter') {
        if (document.activeElement === searchEl.current) return;
        searchEl.current.focus();

      }
    }
    document.addEventListener('keydown', callback);

    return function () {
      document.addEventListener('keydown', callback)
    }
  }, [searchEl])


  return (
    <>
      <div className="navbar">
        <div className="logo">
          <h2>Shopping Cart</h2>
        </div>
        <div className="search">
          <input type="text"
           placeholder="search"
           ref={searchEl}
            />
        </div>
        <div className="totalResult">
      <span> Total number of Item : {shoppingData.length} </span>
        </div>
      </div>
    </>
  )
}
function Shopping ({watched, setWatched, handleWatchedList}) {
  return (
    <>
    <div className="shoppingContainer">
      {
        shoppingData.map((data) => {
          return (
            <Item data ={data} key={data.id} 
             watched={watched}
              setWatched={setWatched}
               handleWatchedList={handleWatchedList} />
          )
        })
      }
    </div>
    </>
  )
}
function Item ({data, watched, handleWatchedList}) {
  const [isWatched , setIsWatched] = useState(false);

    const isIncludes = watched.map((item) => item.id).includes(data.id);
    function handleAddToWatched (itemId) {
      const newWatched = {
        title : data.title,
        img : data.img,
        price : data.price,
        id : itemId
      }
      //console.log(newWatched)
      handleWatchedList(newWatched);
      setIsWatched(true);
    }
  return (
    <>
    <div className="singleItem">
      <div className="dataCont">
         <img src={data.img} alt={data.title} />
         <h4>{data.title}</h4>
      </div>  
      <div className="priceCont">
        <p> price (Rupees) :{data.price} </p>
            <div>
               {
              // isWatched && isIncludes ? <div className="watchedOrNot">
              //   <p> <i>
              //   Item added
              //     </i> </p>
              //   <Link to={'/watchList'}>
              //       <button className="watched">Go to WatchList</button>
              //   </Link>
              // </div> 
              // : (
              //   <button className="watched"
              //   onClick={ () => handleAddToWatched(data.id)}
              //   >Add to WatchList</button>
             // )
             isWatched === true ? (
              <>
              <div className="watchedOrNot">

              <p>item added</p>
               <div>
                  <Link to={'/watchList'}>
                     <button className="watched">WatchList</button>
                  </Link>
                </div>
              </div>
              </>
             ) : (
              <>

              {
                isIncludes ? <Link to={'/watchList'} >
                     <button className="watched">WatchList</button>
                </Link>   :  (

                  <button className="watched"
                        onClick={ () => handleAddToWatched(data.id)}
                    >Add to WatchList</button>
                )
              }
              </>
             )
            }
        
        </div>
        </div> 
    </div>
    </>
  )
}
function WatchList ({watched, handleRemove}) {
  return (
    <>
    <div className="watchList">
      {
        watched.map((item) => {
          return (
            <WatchedItem item={item} key={item.id} handleRemove={handleRemove} />
          )
        })
      }
    </div>
    </>
  )
}
function WatchedItem ({item, handleRemove}) {
  const [quantity, setQuantity] = useState(1);
 // console.log(quantity);
  const calculatedAmount = quantity * (item.price);
  return (
    <>
      <div className="watchItem">
        <div className="imgCont">
          <img src={item.img} alt={item.title} />
          <h4> {item.title} </h4>
        </div>
      <div className="quantity">
          <p>Quantity :</p>
             <select value={quantity} onChange={(e) => setQuantity(e.target.value)} >
                 {Array.from({length : 10} , (_ , idx) => (
                  <option value={idx + 1} key={idx}>  {idx + 1} </option>
                 ))}
             </select>
        </div>
        <div className="price"> 
          <p> <span>&#8377;</span> {  calculatedAmount} </p>
           </div>
           <div className="removeBtn">
            <button className="watched" 
            onClick={() => handleRemove(item.id)}
            >Remove</button>
           </div>
      </div>
    </>
  )
}

function Statistics () {
  return (
    <>
    <div className="stats">
      <p> <i>TOTAL ITEM : <span>8</span> </i></p>
      <p><i>TOTAL PRICE : &#8377; <span>33980</span></i></p>
    </div>
    </>
  )
}
function NoWatchList () {
  return (
    <>
    <div className="stats">
      <p>Your watchList is empty || please add some item</p>
      <Link to={'/'}>
        <button className="watched">Home</button>
      </Link>
    </div>
    </>
  )
}