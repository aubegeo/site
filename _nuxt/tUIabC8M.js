import{_ as l}from"./BEHCVLmy.js";import{_ as c,c as o,a,F as u,r as p,o as n,b as _,w as i,d,t as f}from"./Dz61A1BN.js";const m={async asyncData({$content:t}){return{posts:await t("posts").fetch()}}};function g(t,s,x,k,y,B){const r=l;return n(),o("div",null,[s[0]||(s[0]=a("h1",null,"Mon Blog",-1)),a("ul",null,[(n(!0),o(u,null,p(t.posts,e=>(n(),o("li",{key:e.slug},[_(r,{to:"/posts/"+e.slug},{default:i(()=>[d(f(e.title),1)]),_:2},1032,["to"])]))),128))])])}const N=c(m,[["render",g]]);export{N as default};
