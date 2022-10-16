import { useState, useEffect } from 'react'

export default function useResize(onMount: boolean = false) {
    const [ dimensions, setDimensions ] = useState({
      height: window.innerHeight,
      width: window.innerWidth,
    });

    useEffect(() => {
      window.addEventListener('resize', () => {
          const height = window.innerHeight;
          const width = window.innerWidth;
          setDimensions({
            height,
            width,
          })
      });
    }, [])


    return [ dimensions ];
}
