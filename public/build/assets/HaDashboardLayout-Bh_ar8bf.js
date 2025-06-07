import{r as t,j as e,b as d}from"./app-BBNs4zuK.js";const g=!1;function f({children:a}){const[c,i]=t.useState(null),[b,n]=t.useState(!1),[h,s]=t.useState(null),[u,l]=t.useState(!0),o=async()=>{try{n(!1);const r=await d.get("/api/random-photo-from-dashboard-album");r.status===200&&(i(r.data.url),n(!1),s(null))}catch(r){console.error("Failed to fetch photo:",r),n(!0),s(r instanceof Error?r.message:"Unknown error")}finally{l(!1)}};return t.useEffect(()=>{o();const r=setInterval(o,1e3*60*10);return()=>clearInterval(r)},[]),u?e.jsx("div",{children:"Loading..."}):e.jsx("div",{children:e.jsx("div",{className:"min-h-screen bg-gray-900",style:{backgroundImage:`url(${c})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",transition:"background-image 1s ease-in-out"},children:e.jsx(m,{children:a})})})}function m({children:a}){return e.jsx("div",{className:"",style:{background:`
        linear-gradient(to bottom,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0) 20%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, .2) 50%
        )
    `},children:a})}function p({children:a}){return e.jsx(e.Fragment,{children:e.jsx(f,{children:e.jsx("div",{className:"relative",children:e.jsx("main",{children:a})})})})}export{p as H};
//# sourceMappingURL=HaDashboardLayout-Bh_ar8bf.js.map
