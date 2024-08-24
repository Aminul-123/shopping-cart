
// this one is a custom hook
import { useState, useEffect } from "react";
 export function useLocalStorage (key) {
    const [watched, setWatched] = useState(function () {
        const storedValue = localStorage.getItem(key);
       // console.log(storedValue);
        return storedValue ? JSON.parse(storedValue) : [];
      });
    
      useEffect(function () {
        localStorage.setItem(key , JSON.stringify(watched))
      }, [watched]);

      return [watched, setWatched];
}