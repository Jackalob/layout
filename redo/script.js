let index = 0;
let old = 0;
let total = 0;
let timerTime = 3000;
let type;
let timerActive; //用來放setTimeout的變數

const images = {
    img1: './images/banner.png',
    img2: './images/1.png',
    img3: './images/2.png',
};

let pics = {
    slider1: [
        {
            id: '1',
            url: images['img1'],
        },
        {
            id: '2',
            url: images['img2'],
        },
        {
            id: '3',
            url: images['img3'],
        },
    ],
};

headerInteraction();
init();
headerFix();

function headerInteraction() {
    $('.burger').on('click', function() {
        $('body').toggleClass('active');
    });
    $('.mask').on('click', function() {
        $('body').removeClass('active');
    });
    $(window).on('resize', function() {
        if ($(this).width() > 800) {
            $('body').removeClass('active');
        }
    });
}

//計時器
function timer() {
    timerActive = setInterval(() => {
        type = 'arrow';
        let target = index + 1;
        clickOff();
        setIndex(target);
    }, timerTime);
}

function init() {
    // $.ajax('http://localhost:3000/slider1').done(res => {
    total = pics['slider1'].length;
    pics['slider1'].forEach(el => {
        let img = $(`<div class='img'></div>`);
        let dot = `<div class='dot'><div class='dot-timer'></div></div>`;
        img.css({
            backgroundImage: `url(${el.url})`,
            opacity: '0'
        });
        $('.sliderList').append(img);
        $('.dots').append(dot);
    });
    // $('.img').css({ left: '100%' });
    setView(index);
    timer();
    sliderHover();
    changeTab();
    // });
}

//開啟按鈕功能
function setBtn() {
    $('.prev-bar,.next-bar').on('click', btnClick);
    $('.dot').each(function(dotIndex) {
        $(this).on('click', function() {
            dotClick(dotIndex);
        });
    });
}

//左右按鈕事件
function btnClick() {
    type = 'arrow';
    resetTimer();
    let target;
    if ($(this).hasClass('prev-bar')) {
        target = index - 1;
    } else if ($(this).hasClass('next-bar')) {
        target = index + 1;
    }
    if (typeof target === 'number') {
        setIndex(target);
    }
}

//dot按鈕事件
function dotClick(num) {
    type = 'dot';
    resetTimer();
    let target;
    target = num;
    setIndex(target);
}

//重設timer
function resetTimer() {
    clickOff();
    clearInterval(timerActive);
    timer();
}

//關閉按鈕功能功能
function clickOff() {
    $('.prev-bar,.next-bar').off('click');
    $('.dot').off('click');
}

//設定新index和取得舊的index
function setIndex(num) {
    old = index;
    index = (num + total) % total;
    setView(index);
}

//改變畫面
function setView(index) {
    let oldTo, indexFrom;
    //剛進來的時候不動
    if (index === old){
        oldTo = { opacity: '1' };
        indexFrom = { opacity: '1' };
    }
    else{   
        oldTo = { opacity: '0' };
        indexFrom = { opacity: '0' };
    }
    //畫面變動主要方式
    // $('.img').fadeOut(0).eq(index).fadeIn(500) //fadeIn & out
    $('.img')
        .stop(true, true)
        .eq(old)
        .css({ opacity: '1' })
        .animate(oldTo, 400, 'linear')
        .end()
        .eq(index)
        .css(indexFrom)
        .animate({ opacity: '1' }, 390, 'linear', setBtn);
    //dot時間條

    dotTimer();
}

//dot動畫開始
function dotTimer() {
    $('.dot')
        .stop(true, true)
        .css({ 'background-color': '#5d5d5d' })
        .eq(index)
        .css({ 'background-color': 'white' });
    $('.dot-timer')
        .stop(true, true)
        .css({ width: '0%' })
        .eq(index)
        .animate({ width: '100%' }, timerTime, 'linear');
}

//摸畫面清除timer
function sliderHover() {
    $('.sliderList').on('mouseenter', function() {
        clearInterval(timerActive);
        dotWidth0();
    });
    $('.sliderList').on('mouseleave', function() {
        dotTimer();
        timer();
    });
}

//dot width歸0
function dotWidth0() {
    $('.dot-timer')
        .stop()
        .animate({ width: '0' }, 100);
}

//監聽換頁
function changeTab() {
    document.onvisibilitychange = function() {
        if (document.visibilityState == 'visible') {
            clearInterval(timerActive);
            dotTimer();
            timer();
        } else {
            clearInterval(timerActive);
            dotWidth0();
        }
    };
}

function headerFix() {
    let header = document.querySelector('header');
    let xy = getPosition(header);
     window.addEventListener('scroll', function() {
        if (window.scrollY >= xy[1]) {
            document.body.classList.add('fix');
        } else {
            document.body.classList.remove('fix');
        }
    });
    window.addEventListener('resize', function() {
        xy = getPosition(header);
        if(window.innerWidth<=768){
            document.body.classList.add('fix');
        }
        else{
            document.body.classList.remove('fix');
        }
    });
}

function getPosition(element) {
    let x = 0;
    let y = 0;
    // 搭配上面的示意圖可比較輕鬆理解為何要這麼計算
    while (element) {
        x += element.offsetLeft - element.scrollLeft + element.clientLeft;
        y += element.offsetTop - element.scrollLeft + element.clientTop;
        element = element.offsetParent;
    }
    return [x, y];
}

function scroll() {}
