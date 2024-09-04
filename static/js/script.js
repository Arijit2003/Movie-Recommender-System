const resultBox= document.querySelector(".result-box");
const inputBox= document.getElementById("input-box");
const btnDiv=document.querySelector(".btn-div");
const recommendBtn=document.querySelector(".recommend-btn");
const recommendedPosters=document.querySelector(".recommended-posters");

recommendBtn.addEventListener("click",recommendAndFetchPoster);

inputBox.onkeyup=function(){
    let result=[];
    let input=inputBox.value;
    if(input.length){
        result=my_movies.filter(item=>{
            let title=Object.values(item)[0];
            return title.toLowerCase().includes(input.toLowerCase());
        });
        display(result);
        if(result.length==0){
            resultBox.innerHTML="";
            btnDiv.hidden=false;
        }
    }
    else{
        resultBox.innerHTML="";
        btnDiv.hidden=true;
    }
}
function display(result){
    const content=result.map(item=>{
        return '<li onclick=selectInput(this)>'+Object.values(item)[0]+'</li>';
    });
    resultBox.innerHTML='<ul>'+content.join("")+'</ul>';
}
function selectInput(list){
    inputBox.value=list.innerHTML;
    resultBox.innerHTML="";
    btnDiv.hidden=false;
}
function recommendAndFetchPoster(){
    recommendedPosters.innerHTML="";
    const movie_name=inputBox.value;
    fetch(recommendURL,{
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',  
        },
        body: movie_name,
    }).then(response=>{
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    }).then(data=>{
        if (Array.isArray(data)) {
            data.forEach(item=>{
                Object.entries(item).forEach(([key,value])=>{
                    const newDiv=document.createElement("div");
                    const paragraph=document.createElement("p");
                    const image=document.createElement("img");
                    image.src=value;
                    image.alt="Placeholder Image";
                    image.style.borderRadius="5px";
                    paragraph.textContent=key;
                    newDiv.appendChild(image);
                    newDiv.appendChild(paragraph);
                    recommendedPosters.append(newDiv);
                })
            })
        }
    }).catch(error=>{
        console.log('Error:',error);
    })
}
