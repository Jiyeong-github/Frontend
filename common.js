   var loginID=document.getElementById("id");
   var loginPW=document.getElementById("pw");



   function goToBack(){
    history.back();
}


function loginControl(){
 
    if(loginID.value==''||loginPW.value==''){
        alert("로그인을 할 수 없습니다.");
    }else if(loginID.value!=''&&loginPW.value!=''){
        location.href="main.html";
    }
}

    

function joinControl(){
    var joinId=document.getElementById("Id").value;
    var joinPw=document.getElementById("Pw").value;
    var joinPw2=document.getElementById("Pw2").value;

    if(joinPw!=joinPw2){
        alert("비밀번호를 확인해주세요");
    }else if(joinId==''||joinPw==''||joinPw2==''){
        alert("회원가입을 할 수 없습니다.");
    }else{location.href="login.html";}
}

