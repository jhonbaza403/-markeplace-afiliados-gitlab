"use client";


// ==========================================================
// ARCHIVO: src/context/RegionContext.tsx
// Credi Marketplace
//
// Global Region Context
//
// Next.js 16
// React 19
// Multi-country Commerce
// ==========================================================


import {
createContext,
useContext,
useEffect,
useMemo,
useState,
type ReactNode,
} from "react";



// ==========================================================
// TIPOS
// ==========================================================

export interface Region {


code:string;


name:string;


currency:string;


symbol:string;


locale:string;


}




interface RegionContextValue {


region:Region;


availableRegions:Region[];


currency:string;


setRegion(
region:Region
):void;


changeRegion(
code:string
):void;


formatCurrency(
value:number
):string;


}




// ==========================================================
// REGIONES
// ==========================================================

export const regions:Region[]=[


{
code:"VE",
name:"Venezuela",
currency:"VES",
symbol:"Bs.",
locale:"es-VE",
},


{
code:"US",
name:"United States",
currency:"USD",
symbol:"$",
locale:"en-US",
},


{
code:"CO",
name:"Colombia",
currency:"COP",
symbol:"$",
locale:"es-CO",
},


{
code:"MX",
name:"México",
currency:"MXN",
symbol:"$",
locale:"es-MX",
},


];





const REGION_STORAGE_KEY =
"credi-marketplace-region";





const defaultRegion =
regions.find(
item=>item.code==="VE"
) ?? regions[0];







const RegionContext =
createContext<
RegionContextValue | undefined
>(undefined);







export function RegionProvider({

children,

}:{

children:ReactNode;

}){


const [
region,
setRegionState
]=
useState<Region>(
defaultRegion
);







useEffect(()=>{


try{


const stored =
localStorage.getItem(
REGION_STORAGE_KEY
);



if(stored){


const found =
regions.find(
item=>item.code===stored
);



if(found){

setRegionState(found);

if(typeof document !== "undefined"){

document.documentElement.dataset.region =
found.code;

}

}

}


}

catch{


setRegionState(defaultRegion);

}



},[]);








function setRegion(
newRegion:Region
){



const exists =
regions.some(
item=>item.code===newRegion.code
);



if(!exists){

return;

}




setRegionState(newRegion);




try{


localStorage.setItem(

REGION_STORAGE_KEY,

newRegion.code

);



if(typeof document !== "undefined"){


document.documentElement.dataset.region =
newRegion.code;


}


}

catch{


}


}







function changeRegion(
code:string
){


const selected =
regions.find(
item=>item.code===code
);



if(selected){

setRegion(selected);

}


}







function formatCurrency(
value:number
){


return new Intl.NumberFormat(

region.locale,

{

style:"currency",

currency:
region.currency,

}

).format(value);


}








const value =
useMemo<RegionContextValue>(

()=>({


region,


availableRegions:
regions,


currency:
region.currency,


setRegion,


changeRegion,


formatCurrency,


}),

[region]

);







return (

<RegionContext.Provider
value={value}
>

{children}

</RegionContext.Provider>

);


}







export function useRegion(){


const context =
useContext(RegionContext);



if(!context){


throw new Error(

"useRegion debe utilizarse dentro de RegionProvider"

);


}



return context;


}
