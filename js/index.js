/*
相关设置分离到settings.js
*/
//未中奖人员名单
var remainPerson = allPerson.toString().split(";");
//中奖人员名单
var luckyMan = [];
var timer;//定时器
var times = 1;//抽奖次数,如果不是第一次，不加粗显示领导姓名


$(function () {
    iconAnimation();
    //开始抽奖
    $("#btnStart").text("開始"+"　（共"+remainPerson.length+"人）");//设置按钮文本为开始
    $("#btnStart").on("click", function () {
        //判断是开始还是结束
        if ($("#btnStart").text().substring(0,2) === "開始") {
            if (!$("#txtNum").val()) {
                showDialog("輸入抽獎數");
                return false;
            }
            if ($("#txtNum").val() > 49) {
                showDialog("請輸入1");
                return false;
            }
            if ($("#txtNum").val() > remainPerson.length) {
                showDialog("抽數大於題數<br>目前抽獎數：<b>" + $("#txtNum").val() + "</b>題,題目數：<b>" + remainPerson.length + "</b>人");
                return false;
            }
            $("#result").fadeOut("fast");
            //显示动画框，隐藏中奖框
            $("#luckyDrawing").show().next().addClass("hide");
            move();
            $("#btnStart").text("停止");
            $("#bgLuckyDrawEnd").removeClass("bg");
        }
        else {
            //PillarsZhang：剩余人数我加的，这边用了全角空格
            var luckyDrawNum = $("#txtNum").val();
            startLuckDraw();//抽奖开始

            $("#luckyDrawing").fadeOut();
            clearInterval(timer);//停止输入框动画展示
            $("#luckyDrawing").val(luckyMan[luckyMan.length - 1]);//输入框显示最后一个中奖名字
            $("#result").fadeIn().find("div").removeClass().addClass("p" + luckyDrawNum);//隐藏输入框，显示中奖框
            $("#bgLuckyDrawEnd").addClass("bg");//添加中奖背景光辉
            $("#txtNum").attr("placeholder", "題數(" + remainPerson.length + ")");
            $("#btnStart").text("開始"+"　（剩下"+remainPerson.length+"人）");//设置按钮文本为开始
    }
    });

    $("#btnReset").on("click", function () {
        //确认重置对话框
        var confirmReset = false;
        showConfirm("reset?", function () {
            //熏置未中奖人员名单
            remainPerson = allPerson.toString().split(";");
            //中奖人数框置空
            $("#txtNum").val("2");
            $("#showName").val("");
            //隐藏中奖名单,然后显示抽奖框
            $("#result").fadeOut("normal",function(){
                $("#result").html("<div><font size=\"10\">完成</font></div>");
                $("#result").fadeIn();
                });//动画效果过渡成准备就绪（PillarsZhang）
            $("#bgLuckyDrawEnd").removeClass("bg");//移除背景光辉
            $("#btnStart").text("開始"+"　（共"+remainPerson.length+"人）");//设置按钮文本为开始
            times++;
            console.log(times);

        });
    });
});

//抽奖主程序
function startLuckDraw() {
    //抽奖人数
    var luckyDrawNum = $("#txtNum").val();
    if (luckyDrawNum > remainPerson.length) {
        alert("抽數大於題數。或重置下一輪");
        return false;
    }
    //随机中奖人
    var randomPerson = getRandomArrayElements(remainPerson, luckyDrawNum);
    var tempHtml = "";
    $.each(randomPerson, function (i, person) {
        if (leaderArr.indexOf(person) > -1 && times == 1) {
            tempHtml += "<span><b>" + person + "</b></span>";
        }
        else {
            tempHtml += "<span>" + person + "</span>";
        }
    });
    $("#result>div").html(tempHtml);
    //剩余人数剔除已中奖名单
    remainPerson = remainPerson.delete(randomPerson);
    //中奖人员
    luckyMan = luckyMan.concat(randomPerson);
    //设置抽奖人数框数字为空

    if (setEmptyPerson) { $("#txtNum").val("");};
    /*
    PillarsZhang补充：有时候不需要每次都把人数框清空
    根据需求来吧，在settings.js里改
    */

}

//参考这篇文章：http://www.html-js.com/article/JS-rookie-rookie-learned-to-fly-in-a-moving-frame-beating-figures
//跳动的数字
function move() {
    var $showName = $("#showName"); //显示内容的input的ID
    var interTime = 30;//设置间隔时间
    timer = setInterval(function () {
        var i = GetRandomNum(0, remainPerson.length);
        $showName.val(remainPerson[i]);//输入框赋值
    }, interTime);
}

//顶上的小图标，随机动画
function iconAnimation() {
    var interTime = 200;//设置间隔时间
    var $icon = $("#iconDiv>span");
    var arrAnimatoin = ["bounce", "flash", "pulse", "rubberBand", "shake", "swing", "wobble", "tada"];
    var timer2 = setInterval(function () {
        var i = GetRandomNum(0, $icon.length);
        var j = GetRandomNum(0, arrAnimatoin.length);
        //console.log("i:" + i + ",j:" + j);
        $($icon[i]).removeClass().stop().addClass("animated " + arrAnimatoin[j]);//输入框赋值
    }, interTime);

}
