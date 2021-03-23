function goToBack() {
    history.back();
}

function chkJoin() {
    var txtIdElem = document.getElementById('txtId');
    var txtPwElem = document.getElementById('txtPw');
    var txtRePwElem = document.getElementById('txtRePw');

    if(txtIdElem.value === '' || txtPwElem.value === '') {
        alert('로그인을 할 수 없습니다.');
    } else if(txtPwElem.value !== txtRePwElem.value) {
        alert('비밀번호를 확인해 주세요.');
    } else {
        location.href = 'login.html';
    }
}

function chkLogin() {
    //console.log('id값: ' + txtId.value);

    var txtIdElem = document.getElementById('txtId');
    var txtPwElem = document.getElementById('txtPw');
    if(txtIdElem.value === '' || txtPwElem.value === '') {
        alert('로그인을 할 수 없습니다.')
    } else {
        location.href = 'main.html'; 
    }
}