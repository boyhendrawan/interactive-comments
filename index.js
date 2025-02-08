function getTimeDifference(timestamp) {
  const currentTime = Date.now();
  const timeDifference = currentTime - timestamp;

  if (timeDifference < 1000 * 60) {
      // Less than a minute
      return `${Math.floor(timeDifference / 1000)} seconds ago`;
  } else if (timeDifference < 1000 * 60 * 60) {
      // Less than an hour
      return `${Math.floor(timeDifference / (1000 * 60))} minutes ago`;
  } else if (timeDifference < 1000 * 60 * 60 * 24) {
      // Less than a day
      return `${Math.floor(timeDifference / (1000 * 60 * 60))} hours ago`;
  } else {
      // More than a day
      return `${Math.floor(timeDifference / (1000 * 60 * 60 * 24))} days ago`;
  }
}

function commentHTML(img,name,status,vote,content,id,currentUsername,kind="comment"){
  if(typeof status == 'number')status=getTimeDifference(status);

  return `<div data-id="${id}" class="${kind}  duration-150 grid grid-cols-2 md:grid-cols-[8%_80%_0%] md:gap-x-5 md:relative bg-white rounded-md w-full p-4 justify-items-stretch content-baseline">
        <div class="order-1 md:order-0 ">
          <div class="flex flex-wrap md:flex-col md:w-full md:items-center md:h-28 justify-between items-baseline bg-light-gray p-2 rounded-lg w-9/12">
            <svg class="btn-up-vote size-icon plus-icon cursor-pointer w-4 inline h-3.5 hover:opacity-65 transition-all"></svg>
            <span class="font-bold text-moderate-blue">${vote}</span>
            <svg class="btn-down-vote size-icon self-end md:self-center cursor-pointer minus-icon w-4 inline h-3.5 fill-black hover:opacity-65" stroke="currentColor"></svg>
          </div>
        </div>
        <div class="order-0 col-span-2 md:col-span-2 md:order-1">
          <div class="flex gap-x-2 items-center flex-wrap">
            <div class="rounded-full w-10">
              <img src=${img} alt="portfolio" width="100%">
            </div>
            <h1 class="text-black font-semibold text-sm md:text-base">${name}</h1>
            ${(currentUsername==name)?"<span class='font-semibold py-1 px-2 text-xs  bg-moderate-blue text-white rounded-lg'>you</span>":""}
            <span class="text-slate-300 text-xs md:text-sm">${status}</span>
          </div>
          <p class="my-4 text-grayish-blue text-justify">${content}</p>
        </div>
         ${(currentUsername==name)
          ?
          `
          <div class="flex w-full text-sm align-bottom flex-wrap justify-between md:justify-end md:gap-x-4 md:w-4/12 md:absolute order-2 place-self-end self-center top-6 right-5 ">
          <button  class="transition-all hover:opacity-40 btnEdit duration-300  text-moderate-blue font-semibold "> <svg class="size-icon edit-icon w-4 inline h-3.5"></svg> Edit</button>
          <button class="transition-all hover:opacity-40 btnDelete duration-300  text-moderate-blue font-semibold "> <svg class="size-icon delete-icon w-4 inline h-3.5"></svg> delete</button>
          
          </div>
          `
          :
        '<button class="transition-all duration-300 btnReplay order-2 place-self-end self-center text-moderate-blue font-semibold md:absolute top-5 right-5"> <svg class="size-icon replay-icon w-4 inline h-3.5"></svg> Reply</button>'
         }
      </div>`
}

function replayCommentHTML(replayComments){
    /* `hold for replay HTML code  
     Args:
     replayComments > hold comment html code
    */ 
    let container=`
    <div class="grid grid-cols-[10%_90%]  w-full">
        <div class="w-0.5 place-self-center bg-gray-300 h-full dark:bg-gray-700 rounded-lg"></div>
    `
    let endDiv=`</div>`
    let wrapper=`<div class="flex flex-col flex-wrap w-full gap-y-4">
    `
    // construct html
    wrapper+=replayComments
    wrapper+=endDiv
    container+=wrapper
    container+=endDiv 

    return container
}

function writeCommentHTML(data,currentId,kind="send",repNameC="",currentReply=-1){

    return `<div data-curRep="${currentReply}" id="comment" data-curUs-id="${currentId}" data-name="${data.username}" class="grid grid-cols-2 lg:grid-cols-[5%_70%_15%] gap-y-6 lg:gap-y-0 content-start justify-between bg-white rounded-md w-full p-4 justify-items-stretch ">
        <div class="order-1 lg:order-0 ">
          <div class="rounded-full w-10">
            <img src='./assets/${data.image.png}' alt="img-portfolio" width="100%">
          </div>
        </div>
          <div class="order-0 col-span-2 lg:col-span-1 lg:order-1">
            <textarea class="block p-2.5 w-full h-28 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Add ${kind} Here..." name="">${repNameC}</textarea>
          </div>
          <button class="writeComment uppercase order-2 lg:place-self-start self-start place-self-end bg-moderate-blue/90 px-4 py-2 rounded-lg  text-white text-sm hover:bg-moderate-blue">${kind}</button>
        </div>`
}

async function requestData(path) {
  /* request the data */
  try{
    const request=await fetch(path);
    return request.json();
  }catch(e){
    console.error(e);
  }
}
function bubbleSort(data){
  /* Sorting data with algorithm buble sort */
  for(let i=0; i<data.length;i++){
    
    for (let j=i; j<data.length-1;j++){
      // swapping if  data i  grather than J
      if(data[i].score<data[j+1].score) [data[i],data[j+1]] =[data[j+1],data[i]]
    }
  }
  return data
}
function loadCommentHTML(allData,currentUser){
  /*load all commend from data and*/
  let result="";
  let currentId=0;
  allData.forEach(data => {
      result+=commentHTML(`./assets/${data.user.image.png}`,data.user.username,data.createdAt,data.score,data.content,data.id,currentUser.username)

      // check replay
      const dataRep=data.replies;
      let tmpReplay="";
      if(dataRep.length >0){
        dataRep.forEach(replay=>{
          tmpReplay+=commentHTML(`./assets/${replay.user.image.png}`,replay.user.username,replay.createdAt,replay.score,replay.content,replay.id,currentUser.username,"replay",)
          // check current id 
          if (currentId < replay.id) currentId=replay.id
        })
        result+=replayCommentHTML(tmpReplay)
      }
        // check current id 
        if (currentId < data.id) currentId=data.id
  });
  return [result,currentId];
}
async function loadData(pathData="./data.json"){
  /* Load data json */
 try{
  const data=await requestData(pathData);
  // get all data
  const commentData=data.comments;
  const currentUser=data.currentUser;
  localStorage.setItem("user",JSON.stringify(currentUser))
  localStorage.setItem("currentData",JSON.stringify(commentData))
 }catch(e){console.error(e)}
}

function readData(){
  /* Read data from json file and sorting  base on vote */
  const currentUser=JSON.parse(localStorage.getItem("user"));
  const commentData=bubbleSort(JSON.parse(localStorage.getItem("currentData")));
  let [dataCommentHTML,currentId]=loadCommentHTML(commentData,currentUser);
  localStorage.setItem("currentId",currentId)
  dataCommentHTML+=writeCommentHTML(currentUser,currentId);
  // put all comment at section
  document.getElementsByTagName("section")[0].innerHTML=dataCommentHTML;
}
function addCommFRep(e,currentUser){
  /* Added replay form  */
  const currentId=localStorage.getItem('currentId');
  if(e.target.classList.contains("btnReplay")){
    e.preventDefault();
    // get personal data for comemnt
    const currentElement=e.target.parentElement;
    const replyStatus=currentElement.classList.contains("replay");
    const parent=(replyStatus) ? currentElement.parentElement.parentElement.previousElementSibling :e.target.parentElement;
    const nameReplyC=currentElement.getElementsByTagName('h1')[0].innerText
    // load elements
    currentElement.insertAdjacentHTML("afterend",writeCommentHTML(currentUser,currentId,"reply",`@${nameReplyC}, `,parent.getAttribute('data-id')))
    e.target.setAttribute("disabled","true");
    e.target.classList.toggle("opacity-50");
  }

}
function addEventFRepNSen(e,currentUser){
  /*handle event for replay and added comment */
  let btnSrR=e.target.classList.contains("writeComment");
  if(btnSrR){
    const parentComm=e.target.parentElement;
    const valComment=parentComm.getElementsByTagName('textarea')[0].value;
    const currentReply=Number(parentComm.getAttribute('data-currep'));
    const currentDate=new Date().getTime();
    
    const structCom={
      "id": Number(parentComm.getAttribute("data-curus-id"))+1,
      "content": valComment,
      "createdAt": currentDate,
      "score": 0,
      "user":currentUser,
      }
    
    if(currentReply>0){
      const dataReplied=findDataById(currentReply);
      structCom["replyingTo"]= dataReplied.user.username;
      insertData(structCom,currentReply)
    }else{
      structCom['replies']=[];
      insertData(structCom)
    }
  }
}
function findDataById(dataId){
  // `function can find current data we've and find by id
  // Args:
  // Id (int): id data
  // `
  let result;
  const currentData=JSON.parse(localStorage.getItem("currentData"));
  currentData.forEach(e=>{
    const replay=e.replies;
    if(e.id==dataId) return result=e;
    if(replay.length >0) replay.forEach(j=>(j.id==dataId)?result=j:"")
  })
  return result
}
function insertData(data,id=-1) {
  // "insert new data"
  let currentData=JSON.parse(localStorage.getItem("currentData"))
  if(id>=0){
    currentData.forEach(e=> (e.id==id)? e.replies.unshift(data) : "")
  }else currentData.unshift(data)
  // renew Data
  localStorage.setItem('currentData',JSON.stringify(currentData));
  readData();
}

async function addBTNDelete(e){
  /* Handle delete  comment button */
  e.preventDefault();
  if(e.target.classList.contains("btnDelete")){
    const idElement=e.target.parentElement.parentElement.getAttribute('data-id');
    let result= await customConfirm();
    (result) ? deleteData(idElement) :"";
  }
}
function deleteData(id){
  // `delete data from current data base on id`
  const currentData=JSON.parse(localStorage.getItem("currentData"))
  currentData.forEach((e,i)=>{
     if(e.id == id) currentData.splice(i,1)
      if(e.replies.length > 0){
        e.replies.forEach((j,k)=>(j.id == id) ? newData=currentData[i].replies.splice(k,1):"")
    }
  });
  // update local items data
  updateCurrentData(currentData);
 
}
function updateCurrentData(data){
  // update local data 
  localStorage.setItem("currentData",JSON.stringify(data))
  readData(); 
}

function addEventBUV(e){
//  handle button vote
  if(e.target.classList.contains("btn-up-vote")){
    const id=e.target.parentElement.parentElement.parentElement.getAttribute('data-id')
    const voteNumber=Number(e.target.parentElement.getElementsByTagName("span")[0].innerText);
    updateData(id,voteNumber+1,'BV')
  }
  else if(e.target.classList.contains("btn-down-vote")){
    const id=e.target.parentElement.parentElement.parentElement.getAttribute('data-id')
    const voteNumber=Number(e.target.parentElement.getElementsByTagName("span")[0].innerText);
    updateData(id,voteNumber-1,'BV');
  }
}
function updateData(id,data,kind="content"){
  // get current data
  const currentData=JSON.parse(localStorage.getItem("currentData"))
  currentData.forEach(e=>{
    const replay=e.replies;
    if(e.id==id){
      return (kind=="content") ? e.content=data :e.score=data;
    }
    if(replay.length >0) replay.forEach(j=>{
      if(j.id==id) return (kind=="content") ? j.content=data :j.score=data;
    })
  })
  updateCurrentData(currentData)

}
function customConfirm(message="Are you sure to delete this comment ?"){
  // made new modal confirm
  return new Promise((resolve)=>{
    const continueBtn=document.getElementById("continue");
    const closeBtn=document.getElementById("close");
    const getMessage=document.getElementById("messageModal");
    const containerModal=document.getElementById("containerNotification");
    containerModal.classList.remove("hidden")
    getMessage.innerText=message;
    
    closeBtn.addEventListener("click",e=>{
      e.preventDefault();
      handleAnimateContianerM(e.target,containerModal);
      resolve(false);
    })
    continueBtn.addEventListener("click",e=>{
      e.preventDefault();
      handleAnimateContianerM(e.target,containerModal);
      resolve(true)
    })
  })
}
function handleAnimateContianerM(target,containerModal){
  
  const contianerFrame=target.parentElement.parentElement.parentElement;
  contianerFrame.classList.add('animate-ease-out')
  setTimeout(() => {
    containerModal.classList.add("hidden")
    setTimeout(() => {
      contianerFrame.classList.add('animate-ease-in')
      contianerFrame.classList.remove('animate-ease-out')
    }, 100);
  },400);
}

function addBTNEdit(e){
// handle btn edit 
  if(e.target.classList.contains("btnEdit")){
    // add deactive button edit and delete
    addDisableBTN(e.target,true)
    addDisableBTN(e.target.nextElementSibling,true)
    const comContainer=e.target.parentElement.parentElement;
    const id=comContainer.getAttribute("data-id");
    // remove ptag
    const pTag=comContainer.getElementsByTagName("p")[0]
    pTag.classList.add("animate-ease-out");
    setTimeout(()=>{
      pTag.classList.add("hidden")
    },200)

    editHTML(pTag)
  }
  if(e.target.classList.contains("btnUpdate")){
    const comContainer=e.target.parentElement.parentElement.parentElement;
    const id=comContainer.getAttribute("data-id");
    const data=e.target.previousElementSibling.value;
    updateData(id,data)
  }
}
function editHTML(nextElement){
  
  const textarea = document.createElement("textarea");
  const container = document.createElement("div");
  container.setAttribute("class","mt-2 mb-4 flex w-full justify-end flex-wrap animate-ease-in")
  textarea.placeholder = "Type here...";
  textarea.innerText=nextElement.textContent;

  textarea.setAttribute("class",' block p-2.5 w-full h-28 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500')
  
  // Create button element
  const button = document.createElement("button");
  button.textContent = "Update";
  button.setAttribute("class", "btnUpdate uppercase mt-2 order-2 lg:place-self-start self-start place-self-end bg-moderate-blue/90 px-4 py-2 rounded-lg  text-white text-sm hover:bg-moderate-blue"); //
  container.appendChild(textarea)
  container.appendChild(button)

  nextElement.parentElement.insertBefore(container,nextElement)
}
function addDisableBTN(element,status=true){
  (status) ? element.setAttribute("disabled",true)
  :element.disabled=false;
  element.classList.toggle("opacity-40");
 
}

document.addEventListener("DOMContentLoaded", function() {
  (async function runFunction(){
    try{
      if(localStorage.getItem('user') ==null)await loadData();
      readData();
      const currentUser=JSON.parse(localStorage.getItem("user"));
      document.body.addEventListener("click",e=>{
        e.preventDefault()
        // added comment for each Replay button 
        addCommFRep(e,currentUser)
        // add event for replay and comment  button  
        addEventFRepNSen(e,currentUser)
        // add event for btn up vote
        addEventBUV(e);
        addBTNDelete(e);
        addBTNEdit(e);
  
      })
    }
    catch(e){
      console.error(e)
    }})()
});











