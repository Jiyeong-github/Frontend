//함수가 바로 호출됨 , 전역변수를 피할려고 만듦 (() => {})(); 
//둘다 같은 놈 (function() {})(); 

//스크롤 구간에 따라서 애니메이션 속도가 달라짐
//scrollHeight란 스크롤 길이
(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이 값의 합
    let currentScene = 0; //현재 활성화된(눈 앞에 보고 있는) 씬(scroll-section)
    let enterNewScene = false; //새로운 씬이 시작되는 순간 true
    //sticky 애니메이션 구간
    //normal 보통 스크롤 영역
    const sceneInfo = [
        {//0
            type:'sticky',
            heightNum : 5, //브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-0'),
                //DOM 객체 잡기
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
            },
            values: { //투명도 주기 - 배열로 시작과 끝 값을 넣어 줌
                messageA_opacity_in: [0,1,  {start: 0.1, end : 0.2}], 
                messageB_opacity_in: [0,  1,{start: 0.3, end : 0.4}], 
                messageC_opacity_in: [0,  1,{start: 0.5, end : 0.6}], 
                messageD_opacity_in: [0,  1,{start: 0.7, end : 0.8}], 
                messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}],
                messageB_translateY_in: [20, 0, {start: 0.3, end: 0.4}],
                messageC_translateY_in: [20, 0, {start: 0.5, end: 0.6}],
                messageD_translateY_in: [20, 0, {start: 0.7, end: 0.8}],
                messageA_opacity_out: [1, 0,  {start: 0.25, end : 0.3}], 
                messageB_opacity_out: [0, -20, {start: 0.45, end : 0.5}],
                messageC_opacity_out: [0, -20, {start: 0.65, end : 0.7}],  
                messageD_opacity_out: [0, -20, {start: 0.85, end : 0.9}], 
                messageA_translateY_out: [0, -20, {start: 0.25, end: 0.3}],
                messageB_translateY_out: [0, -20, {start: 0.45, end: 0.5}],
                messageC_translateY_out: [0, -20, {start: 0.65, end: 0.7}],
                messageD_translateY_out: [0, -20, {start: 0.85, end: 0.9}],
            }
        },
        {//1
            type:'normal',
            //normal에서는 필요x heightNum : 5, 
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-1'),
                content: document.querySelector('#scroll-section-1 .description')
            }
        },
        {//2
            type:'sticky',
            heightNum : 5, //브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
            }
        },
        {//3
            type:'sticky',
            heightNum : 5, //브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];

    function setLayout(){
        //각 스크롤 섹션의 높이 세팅
        for(let i=0; i<sceneInfo.length; i++){
            if(sceneInfo[i].type === 'sticky'){
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if(sceneInfo[i].type === 'normal'){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for(let i=0; i< sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id',`show-scene-${currentScene}`);
    }

    function calcValues(values){
        let rv;
        //현재 씬(스크롤 섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / sceneInfo(currentScene).scrollHeight;
        
        //const는 상수

        if (values.length === 3) {
            //start~end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
                rv = (currentYOffset - partScrollStart)/ partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        }else{
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        
        return rv;
    }

    function playAnimation() {

        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        // yOffset(전체 문서에서의 현재 스크롤 값) / 현재 씬의 scrollHeight;
        switch (currentScene) {
            case 0:
                if(scrollRatio <= 0.22){
                    //in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
                } else{
                    //out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
                if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}

				break;
            case 1:
                break;
            case 2:
                if (scrollRatio <= 0.5) {
					// in
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
				} else {
					// out
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
				}

				if (scrollRatio <= 0.32) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.67) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}

				if (scrollRatio <= 0.93) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				}
                break;
            case 3:
                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        //스크롤할 때마다 값을 초기화해줘야지만 값이 누적되지 않음
        prevScrollHeight = 0;
        for (let i=0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0 ) return; //브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        if (enterNewScene) return; //이게 true라면 
        // document.body.setAttribute('id', `show-scene-${currentScene}`);
        playAnimation(); //찰나의 순간에 이걸 호출
    }

    
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop(); //스크롤 했을 때 실행됨
    });

    //돔 구조만 로딩하면 실행됨 window.addEventListener('DOMContentLoaded', setLayout); 
    window.addEventListener('load',setLayout); //웹 페이지의 리소스들을 싹 다 로드하고 실행
    window.addEventListener('resize', setLayout);
    //setLayout(); scrollHeight를 잡아주고, scrollSectionElement 높이를 잡아 줌

})(); 